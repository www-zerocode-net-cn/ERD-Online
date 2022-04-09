import * as cache from './cache';

import request from "../utils/request";

const updateFieldName = (data) => {
  // 将带下划线的属性转化为驼峰
  return Object.keys(data).reduce((a, b) => {
    const tempA = {...a};
    const tempB = b.replace(/_([\w+])/g, (all, letter) => {
      return letter.toUpperCase();
    });
    tempA[tempB] = data[b];
    return tempA;
  }, {});
};

// 新增项目
export const addProject = (data) => {
  return request.post('/ncnb/project/add', {data: data});
};

// 保存项目
export const saveProject = (data) => {
  const id = cache.getItem('projectId');
  return request.post('/ncnb/project/save', {
    data: {
      ...data,
      id
    }
  });
};

// 连接数据库

export const ping = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/ping', {data: {...updateFieldName(data), projectId}});
};

export const sqlexec = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/sqlexec', {data: {...updateFieldName(data), projectId}});
};


export const dbsync = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/dbsync', {data: {...updateFieldName(data), projectId}});
};

export const dbReverseParse = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/dbReverseParse', {
    data: {
      ...updateFieldName(data),
      projectId,
    }
  });
};

export const updateVersion = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/updateVersion', {
    data: {
      ...updateFieldName(data),
      projectId,
    }
  });
};

export const dbversion = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/dbversion', {
    data: {
      ...updateFieldName(data),
      projectId,
    }
  });
};


export const checkdbversion = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/checkdbversion', {
    data: {
      dbKey: data,
      projectId,
    }
  });
};

export const rebaseline = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/connector/rebaseline', {
    data: {
      ...updateFieldName(data),
      projectId,
    }
  });
};

// 生成文档

export const gendocx = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/doc/gendocx',
    {
      responseType: 'blob',
      data: {
        ...data,
        projectId,
        imgdir: 'imgdir',
        imgext: '.png'
      },
    },
  );
};

// json 版本管理接口

export const hisProjectSave = (data) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/hisProject/save', {
    data: {
      ...data,
      projectId,
    }
  });
};

export const hisProjectLoad = (data) => {
  console.log(121, data);
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/hisProject/load', {
    data: {
      dbKey: data?.key,
      projectId,
    }
  });
};


export const getAllOnlineUser = (id) => {
  const projectId = cache.getItem('projectId');
  return request.get(`/ncnb/ws/project/erd/getAllOnlineUser/${projectId}`);
};

export const hisProjectDelete = (id) => {
  return request.post(`/ncnb/hisProject/delete/${id}`);
};

export const hisProjectDeleteAll = (dbKey) => {
  const projectId = cache.getItem('projectId');
  return request.post('/ncnb/hisProject/deleteAll', {
    data: {
      dbKey,
      projectId,
    }
  });
};

