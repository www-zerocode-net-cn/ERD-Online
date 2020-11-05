import defaultConfig from '../../config/config';
import * as cache from './cache';

const customerFetch = (window.parent && window.parent.fetch) || fetch;

export const composeUrl = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${defaultConfig.request}/${url}`;
};

const checkStatus = (response, isStream) => { // eslint-disable-line
  if (response.status >= 200 && response.status < 300) {
    if (isStream) {
      return response.blob();
    }
    return response.json();
  }
  return new Promise((res, rej) => {
    response.json().then((json) => {
      rej(json);
    });
  });
};

export const post = (url, data, header, customerData, isStream) => {
  const defaultHeader = {
    'Authorization': cache.getItem('Authorization') || '', // eslint-disable-line
  };
  const customerHeader = header || {
    'Content-Type': 'application/json',
  };
  return customerFetch(composeUrl(url), {
    method: 'post',
    credentials: 'include',
    headers: {
      ...defaultHeader,
      ...customerHeader,
    },
    body: customerData || JSON.stringify(data),
  }).then(res => checkStatus(res, isStream));
};
export const get = (url, isStream) => {
  return customerFetch(composeUrl(url), {
    credentials: 'include',
    method: 'get',
    headers: {
      'Authorization': cache.getItem('Authorization') || '', // eslint-disable-line
    },
  })
    .then(res => checkStatus(res, isStream));
};
