(function () {
  const listeners = [];
  let status = "Cloud sync: local-only mode.";
  let firestoreDoc = null;
  let unsubscribe = null;

  function emitStatus(nextStatus) {
    status = nextStatus;
    listeners.forEach((listener) => listener(status));
  }

  function getDocumentRef(db, path) {
    const segments = String(path || "").split("/").filter(Boolean);
    if (segments.length % 2 !== 0 || segments.length < 2) {
      throw new Error("documentPath must point to a Firestore document.");
    }
    let ref = db.collection(segments[0]).doc(segments[1]);
    for (let index = 2; index < segments.length; index += 2) {
      ref = ref.collection(segments[index]).doc(segments[index + 1]);
    }
    return ref;
  }

  async function initialize() {
    const config = window.FUN_CALENDAR_CLOUD_CONFIG;
    if (!config || !config.enabled || config.provider !== "firebase") {
      emitStatus("Cloud sync: local-only mode.");
      return;
    }

    if (!window.firebase) {
      emitStatus("Cloud sync: Firebase SDK not loaded.");
      return;
    }

    const firebaseConfig = config.firebaseConfig || {};
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
      emitStatus("Cloud sync: Firebase config is incomplete.");
      return;
    }

    try {
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
      const db = app.firestore();
      firestoreDoc = getDocumentRef(db, config.documentPath || "funCalendar/sharedState/main");

      if (unsubscribe) {
        unsubscribe();
      }

      unsubscribe = firestoreDoc.onSnapshot(
        () => {
          emitStatus("Cloud sync: connected.");
        },
        (error) => {
          emitStatus(`Cloud sync: ${error.message}`);
        }
      );
    } catch (error) {
      emitStatus(`Cloud sync: ${error.message}`);
    }
  }

  async function loadState() {
    if (!firestoreDoc) {
      return null;
    }

    try {
      const snapshot = await firestoreDoc.get();
      if (!snapshot.exists) {
        emitStatus("Cloud sync: ready, no remote data yet.");
        return null;
      }
      const payload = snapshot.data();
      emitStatus("Cloud sync: remote data loaded.");
      return payload && payload.state ? payload.state : null;
    } catch (error) {
      emitStatus(`Cloud sync: ${error.message}`);
      return null;
    }
  }

  async function saveState(state) {
    if (!firestoreDoc) {
      return;
    }

    try {
      await firestoreDoc.set(
        {
          state,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      emitStatus("Cloud sync: saved online.");
    } catch (error) {
      emitStatus(`Cloud sync: ${error.message}`);
    }
  }

  window.FunCalendarCloud = {
    initialize,
    loadState,
    saveState,
    getStatus() {
      return status;
    },
    onStatusChange(listener) {
      listeners.push(listener);
      listener(status);
      return () => {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      };
    }
  };
})();
