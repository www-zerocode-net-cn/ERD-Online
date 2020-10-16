const _http = require('http');
const os = require('os');

const version = {
  version: '2.2.0',
  date: '2020.9',
};

const defaultUrl = `http://www.pdman.cn/launch/${os.platform()}/${version.version}`;
//const defaultUrl = 'http://127.0.0.1/latest-version.json';

export const getCurrentVersion = () => {
  return version;
};


export const getVersion = (callback) => {
  _http.get(defaultUrl, (req) => {
    let result = '';
    req.setEncoding('utf8'); //设置编码格式
    req.on('data', (data) => {
      result += data;
    });
    req.on('end', () => {
      let json = {};
      //console.log(result);
      try {
        json = JSON.parse(result) || {};
      } catch (e) {
        json = {};
      }
      callback && callback(json);
    });
    req.on('error', () => {
      callback && callback({});
    });
  });
};
