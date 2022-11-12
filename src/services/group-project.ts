import * as cache from '@/utils/cache';

import request from "@/utils/request";
import {CONSTANT} from "@/utils/constant";


// 新增项目
export const addGroupProject = (data: any) => {
  return request.post('/ncnb/project/group/add', {data: data});
};

// 修改项目
export const updateGroupProject = (data: any) => {
  return request.post('/ncnb/project/group/update', {data: data});
};

// 删除项目
export const deleteGroupProject = (data: any) => {
  return request.post('/ncnb/project/group/delete', {data: data});
};

// 查询项目
export const pageGroupProject = (params: any) => {
  return request.get('/ncnb/project/group/page', {
    params: {
      page: params.page,
      limit: params.limit,
      projectName: params.projectName,
      order: params.order
    }
  });
};

// 保存项目
export const saveGroupProject = (data: any) => {
  const id = cache.getItem(CONSTANT.PROJECT_ID);
  return request.post('/ncnb/project/group/save', {
    data: {
      ...data,
      id
    }
  });
};


