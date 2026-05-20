const ACCESS_KEY_PROPERTY = 'FUN_CALENDAR_ACCESS_KEY';
const STATE_PROPERTY = 'FUN_CALENDAR_STATE';

function doGet(e) {
  return handleRequest_(e, 'GET');
}

function doPost(e) {
  return handleRequest_(e, 'POST');
}

function handleRequest_(e, method) {
  try {
    const configuredAccessKey = PropertiesService.getScriptProperties().getProperty(ACCESS_KEY_PROPERTY);
    if (!configuredAccessKey) {
      return jsonOutput_({
        ok: false,
        error: 'Server access key is not configured.'
      });
    }

    let requestData = {};
    if (method === 'GET') {
      requestData.accessKey = e && e.parameter ? e.parameter.accessKey : '';
    } else {
      requestData = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    }

    if (requestData.accessKey !== configuredAccessKey) {
      return jsonOutput_({
        ok: false,
        error: 'Invalid access key.'
      });
    }

    const props = PropertiesService.getScriptProperties();

    if (method === 'GET') {
      const rawState = props.getProperty(STATE_PROPERTY);
      return jsonOutput_({
        ok: true,
        state: rawState ? JSON.parse(rawState) : null
      });
    }

    props.setProperty(STATE_PROPERTY, JSON.stringify(requestData.state || {}));
    return jsonOutput_({
      ok: true
    });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      error: error.message
    });
  }
}

function jsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
