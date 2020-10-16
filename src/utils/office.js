// import fs from 'fs';
// import officegen from 'officegen';
import { execJar } from './execjar';

/*const moduleList = '模块清单';
const relation = '关联关系';
const tableList = '表清单';
const tableColumnList = '表列清单';

const name = '名称';
const code = '代码';
const dataType = '数据类型';
const main = '主键';
const remark = '备注';

const generateHeader = (dataSource, pObj) => {

};

const generateIndex = (dataSource, pObj) => {

};

const generateModuleBody = (dataSource, pObj) => {

};

export const generateWord = (dataSource, images, projectName, dir, callBack) => {
  const out = fs.createWriteStream(`${dir}/${projectName}.docx`);
  const docx = officegen({
    type: 'docx',
    subject: 'PDMan自动生成文档',
    keywords: 'PDMan自动生成文档',
    description: 'PDMan自动生成文档',
    author: 'PDMan',
  });
  const pObj = docx.createListOfNumbers();
  pObj.addText('Option 1');
  generateHeader(pObj);
  docx.generate(out, {
    finalize: () => {
      console.log('生成成功');
    },
    error: (err) => {
      console.log(err);
    },
  });
  callBack && callBack();
};*/

export const generateByJar = (dataSource, params, cb, cmd) => {
  execJar(dataSource, params, cb, cmd);
};
