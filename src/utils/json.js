import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {axios} from "./request";

// 判断文件是否存在
function fileExist(filePath) {
  axios.post('/app/file-exist', {
    file: 'asd'
  }).then(res => {
    console.log(res)
  })
  return false;
}

function fileExistPromise(filePath, isCreate, obj, file = '.json') {
}

function checkFileExistPromise(filePath) {
}

function copyFileSync(from, to) {
}

// 仅删除目录下的文件
function deleteJsonFile(filePath) {
}

// 删除目录下所有文件
function deleteDirectoryFile(filePath) {
}

function ensureDirectoryExistence(dirPath) {
}

function readFile(file) {
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

function writeFile(file, dataBuffer) {
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

function deleteDirPromise(dir) {
}

function getDirListPromise(dir, baseName) {
}

function getDirNamePromise(filePath) {
}

export {
  fileExist,
  fileExistPromise,
  checkFileExistPromise,
  copyFileSync,
  deleteJsonFile,
  deleteDirectoryFile,
  ensureDirectoryExistence,
  readFile,
  readFileSync,
  readFilePromise,
  readFileCall,
  writeFile,
  saveFileSync,
  saveFilePromise,
  saveFileCall,
  getFilesByDirPromise,
  getFilesByDirSync,
  deleteDirPromise,
  getDirListPromise,
  getDirNamePromise,
};
