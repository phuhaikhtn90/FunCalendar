(function () {
  const listeners = [];
  let status = "Cloud sync: local-only mode.";
  let config = null;

  function emitStatus(nextStatus) {
    status = nextStatus;
    listeners.forEach((listener) => listener(status));
  }

  async function initialize() {
    config = window.FUN_CALENDAR_SYNC_CONFIG || null;
    if (!config || !config.enabled || config.provider !== "google-apps-script") {
      emitStatus("Cloud sync: local-only mode.");
      return;
    }

    if (!config.endpointUrl || !config.accessKey) {
      emitStatus("Cloud sync: endpoint or access key is missing.");
      return;
    }

    emitStatus("Cloud sync: ready.");
  }

  async function loadState() {
    if (!config || !config.enabled || !config.endpointUrl || !config.accessKey) {
      return null;
    }

    emitStatus("Cloud sync: loading...");

    try {
      const response = await fetch(
        `${config.endpointUrl}?accessKey=${encodeURIComponent(config.accessKey)}`,
        {
          method: "GET"
        }
      );
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to load cloud data.");
      }

      emitStatus("Cloud sync: cloud data loaded.");
      return payload.state || null;
    } catch (error) {
      emitStatus(`Cloud sync: ${error.message}`);
      return null;
    }
  }

  async function saveState(state) {
    if (!config || !config.enabled || !config.endpointUrl || !config.accessKey) {
      return false;
    }

    emitStatus("Cloud sync: syncing...");

    try {
      const response = await fetch(config.endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessKey: config.accessKey,
          state
        })
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to sync cloud data.");
      }

      emitStatus("Cloud sync: synced.");
      return true;
    } catch (error) {
      emitStatus(`Cloud sync: ${error.message}`);
      return false;
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
