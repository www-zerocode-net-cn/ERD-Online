import {Button, message, notification} from 'antd';
import {useIntl} from 'umi';
import defaultSettings from '../config/defaultSettings';

const {pwa} = defaultSettings;
const isHttps = document.location.protocol === 'https:';

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({id: 'app.pwa.offline'}));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({type: 'skip-waiting'}, [channel.port2]);
      });
      // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
      window.location.reload(true);
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({id: 'app.pwa.serviceworker.updated.ok'})}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({id: 'app.pwa.serviceworker.updated'}),
      description: useIntl().formatMessage({id: 'app.pwa.serviceworker.updated.hint'}),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const {serviceWorker} = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  // remove all caches
  if (window.caches && window.caches.keys()) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
  }
}

/**
 * 根据模板渲染字符串
 * @param template
 * @param context
 * @returns {*}
 */
function render(template: any, context: any) {
  const tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

  return template.replace(tokenReg, function (word: any, slash1: any, token: any, slash2: any) {
    if (slash1 || slash2) {
      return word.replace('\\', '');
    }

    const variables = token.replace(/\s/g, '').split('.');
    let currentObject = context;
    let i, length, variable;

    for (i = 0, length = variables.length, variable = variables[i]; i < length; ++i) {
      currentObject = currentObject[variable];
      if (currentObject === undefined || currentObject === null) return '';
    }

    return currentObject;
  })
}

// @ts-ignore
String.prototype.render = function (context: any) {
  return render(this, context);
};
