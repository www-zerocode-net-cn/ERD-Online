import {SortOrder} from "antd/lib/table/interface";
import request from "@/utils/request";

export async function PAGE(url: string, params: any, sorter: Record<string, SortOrder>) {
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

export async function ADD(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function DEL(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function EDIT(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function POST(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}


export async function GET(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function TREE(url: string, params: any) {
  return request<COMMON.R>(url, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}


