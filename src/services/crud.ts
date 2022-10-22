import {SortOrder} from "antd/lib/table/interface";
import request from "@/utils/request";

export async function page(url: string, params: any, sorter: Record<string, SortOrder>) {
  if (!sorter) {
    sorter = {}
  }
  let isSort = JSON.stringify(sorter) === '{}';
  let orders: any = [];
  if (!isSort) {
    Object.keys(sorter).map((v, i) => {
      let value = sorter[v];
      console.log(value);
      if (value === 'ascend') {
        orders.push({'column': v, 'asc': true});
      }
      if (value === 'descend') {
        orders.push({'column': v, 'asc': false});
      }
    })
  }
  return request<COMMON.R>(url, {
    method: 'GET',
    params: {
      "size": params.pageSize,
      orders,
      ...params,
    },
  });
}

export async function add(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function del(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function edit(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function post(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}


export async function get(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}


