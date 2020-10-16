import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 判断文件是否存在
function fileExist(filePath) {
  return false;
}

// 仅删除目录下的文件
function deleteJsonFile(filePath) {
}

// 删除目录下所有文件
function deleteDirectoryFile(filePath) {
}

function ensureDirectoryExistence(dirPath) {
}

// 同步读取json文件
function readFileSync(filePath) {
}
// 异步读取json文件返回Promise
function readFilePromise(filePath) {
}
// 异步读取json文件通过回调
function readFileCall(filePath, callBack) {
}


// 同步保存json文件
function saveFileSync(jsonObj, filePath) {
}
// 异步保存json文件返回Promise
function saveFilePromise(jsonObj, filePath) {
}
// 异步保存json文件通过回调
function saveFileCall(jsonObj, filePath, callBack) {
}

// 异步获取某个目录下的所有文件
function getFilesByDirPromise(dirPath) {
}

// 同步获取某个目录下的所有文件
function getFilesByDirSync(dirPath) {
}

function fileExistPromise(filePath, isCreate, obj, file = '.json') {
}

function checkFileExistPromise(filePath) {
}

function deleteDirPromise(dir) {
}

function getDirListPromise(dir, baseName) {
}

function getDirNamePromise(filePath) {
}

function readFile(file) {
}

function writeFile(file, dataBuffer) {
}

function copyFileSync(from, to) {
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
