import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 判断文件是否存在
function fileExist(filePath) {
}

// 仅删除目录下的文件
function deleteJsonFile(filePath) {
  if (fileExist(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// 删除目录下所有文件
function deleteDirectoryFile(filePath) {
  if (fileExist(filePath)) {
    fs.readdirSync(filePath).forEach((file) => {
      const curPath = `${filePath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectoryFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(filePath);
  }
}

function ensureDirectoryExistence(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      const parentDir = path.dirname(dirPath);
      ensureDirectoryExistence(parentDir);
      fs.mkdirSync(dirPath);
    }
  } catch (err) {
    throw err;
  }
}

// 同步读取json文件
function readFileSync(filePath) {
  try {
    const data = fs.readFileSync(filePath).toString();
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`文件读取失败:${err}filePath: ${filePath}`);
  }
}
// 异步读取json文件返回Promise
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data.toString()));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
// 异步读取json文件通过回调
function readFileCall(filePath, callBack) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callBack(err);
    } else {
      callBack(null, JSON.parse(data.toString()));
    }
  });
}


// 同步保存json文件
function saveFileSync(jsonObj, filePath) {
  try {
    const data = JSON.stringify(jsonObj, null, 2);
    ensureDirectoryExistence(path.dirname(filePath));
    fs.writeFileSync(filePath, data);
  } catch (err) {
    throw err;
  }
}
// 异步保存json文件返回Promise
function saveFilePromise(jsonObj, filePath) {
  return new Promise((resolve, reject) => {
    const hashSave = crypto.createHash('md5');
    const saveString = typeof jsonObj !== 'string' ? JSON.stringify(jsonObj, null, 2) : jsonObj;
    hashSave.update(saveString);
    const hashSaveData = hashSave.digest('hex');
    if (saveString) {
    } else {
      reject(new Error('保存失败'));
    }
  });
}
// 异步保存json文件通过回调
function saveFileCall(jsonObj, filePath, callBack) {
  fs.writeFile(filePath, JSON.stringify(jsonObj, null, 2), (err) => {
    if (err) {
      callBack(err);
    } else {
      callBack(err, filePath);
    }
  });
}

// 异步获取某个目录下的所有文件
function getFilesByDirPromise(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// 同步获取某个目录下的所有文件
function getFilesByDirSync(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch (err) {
    throw err;
  }
}

function fileExistPromise(filePath, isCreate, obj, file = '.json') {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, (status) => {
      if (!status) {
        if (isCreate) {
          const parent = path.dirname(filePath);
          fileExistPromise(parent, isCreate).then(() => {
            if (filePath.endsWith(file)) {
              saveFilePromise(obj, filePath).then(resolve).catch(reject);
            } else {
              fs.mkdir(filePath, (parentErr) => {
                if (parentErr) {
                  reject(parentErr);
                }
                resolve(filePath);
              });
            }
          }).catch(() => {
            fs.mkdir(parent, (parentErr) => {
              if (parentErr) {
                reject(parentErr);
              }
              resolve(filePath);
            });
          });
        } else {
          reject(status);
        }
      } else if(filePath.endsWith(file)){
        saveFilePromise(obj, filePath).then(resolve).catch((err) => {
          reject(err);
        });
      } else {
        resolve(filePath);
      }
    });
  });
}

function checkFileExistPromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, (status) => {
      if (status) {
        resolve(filePath);
      } else {
        reject(new Error(`${filePath}不存在`));
      }
    });
  });
}

function deleteDirPromise(dir) {
  return new Promise((resolve, reject) => {
    checkFileExistPromise(dir).then(() => {
      fs.readdir(dir, (errs, files) => {
        if (errs) {
          reject(errs);
        } else {
          Promise.all(files.map((file) => {
            return new Promise((res, rej) => {
              const curPath = `${dir}/${file}`;
              fs.stat(curPath, (err, stat) => {
                if (err) {
                  rej(err);
                } else if (stat.isDirectory()) {
                  deleteDirPromise(curPath).then(() => {
                    res(curPath);
                  }).catch((dirErr) => {
                    rej(dirErr);
                  });
                } else {
                  fs.unlink(curPath, (fileErr) => {
                    if (fileErr) {
                      rej(fileErr);
                    } else {
                      res(curPath);
                    }
                  });
                }
              });
            });
          })).then(() => {
            fs.rmdir(dir, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(dir);
              }
            });
          }).catch((err) => {
            reject(err);
          });
        }
      });
    }).catch(err => reject(err));
  });
}

function getDirListPromise(dir, baseName) {
  return new Promise((resolve, reject) => {
    checkFileExistPromise(dir).then(() => {
      fs.readdir(dir, (errs, files) => {
        if (errs) {
          reject(errs);
        } else {
          resolve(files.map((file) => {
            if (baseName) {
              return path.basename(file);
            }
            return file;
          }));
        }
      });
    }).catch(err => reject(err));
  });
}

function getDirNamePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, (status) => {
      if (status) {
        resolve(path.dirname(filePath));
      } else {
        reject(new Error(`${filePath}不存在`));
      }
    });
  });
}

function readFile(file) {
  return new Promise((res, rej) => {
    fs.readFile(file, (err, data) => {
      if(err){
        rej(err);
      }else{
        res(data);
      }
    });
  });
}

function writeFile(file, dataBuffer) {
  return new Promise((res, rej) => {
    fs.writeFile(file, dataBuffer, (err) => {
      if(err){
        rej(err);
      }else{
        res(file);
      }
    });
  });
}

function copyFileSync(from, to) {
  return fs.writeFileSync(to, fs.readFileSync(from));
}

export {
  fileExist,
  ensureDirectoryExistence,
  readFileSync,
  readFilePromise,
  readFileCall,
  saveFileSync,
  saveFilePromise,
  saveFileCall,
  deleteDirectoryFile,
  deleteJsonFile,
  getFilesByDirPromise,
  getFilesByDirSync,
  fileExistPromise,
  checkFileExistPromise,
  deleteDirPromise,
  getDirListPromise,
  getDirNamePromise,
  writeFile,
  readFile,
  copyFileSync,
};
