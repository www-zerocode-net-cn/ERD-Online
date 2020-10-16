import _object from 'lodash/object';


const { execFile } = require('child_process');

const getJavaConfig = (dataSource) => {
  const dataSourceConfig = _object.get(dataSource, 'profile.javaConfig', {});
  if (!dataSourceConfig.JAVA_HOME) {
    dataSourceConfig.JAVA_HOME = process.env.JAVA_HOME || process.env.JER_HOME || '';
  }
  return dataSourceConfig;
};

const getParam = (params) => {
  const paramArray = [];
  Object.keys(params).forEach((pro) => {
    if (pro !== 'customer_driver') {
      const param = params[pro] || '';
      const value = param.includes(' ') ? `"${param}"` : param;
      paramArray.push(`${pro}=${value}`);
    }
  });
  return paramArray;
};

export const execJar = (dataSource, params = {}, cb, cmd) => {
  const configData =  getJavaConfig(dataSource);
  const value = configData.JAVA_HOME;
  const split = process.platform === 'win32' ? '\\' : '/';
  const defaultPath = '';
  const jar = configData.DB_CONNECTOR || defaultPath;
  const tempValue = value ? `${value}${split}bin${split}java` : 'java';
  const customerDriver = _object.get(params, 'customer_driver', '');
  const commend = [
    '-Dfile.encoding=utf-8',
    '-Xms1024m',
    '-Xmx1024m',
    '-jar', jar, cmd,
    ...getParam(params),
  ];
  if (customerDriver) {
    commend.unshift(`-Xbootclasspath/a:${customerDriver}`);
  }
  execFile(tempValue, commend,
    {
      maxBuffer: 100 * 1024 * 1024, // 100M
    },
    (error, stdout, stderr) => {
      cb && cb(error, stdout, stderr);
    });
};
