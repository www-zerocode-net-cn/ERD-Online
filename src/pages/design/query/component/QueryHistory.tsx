import {ProColumns, ProTable} from "@ant-design/pro-components";
import React, {useEffect} from "react";
import {GET} from "@/services/crud";
import {useSearchParams} from "@@/exports";
import * as cache from "@/utils/cache";
import {CONSTANT} from "@/utils/constant";

export type QueryHistoryProps = {
  queryId: string | number;
  key: string;
};

type QueryHistoryItem = {
  id: number | string;
  title: string;
  sqlInfo: string;
  dbName: string;
  createTime: string;
  creator: string;
  duration: number;
};


const QueryHistory: React.FC<QueryHistoryProps> = (props) => {
  useEffect(() => {
  }, [props.key])

  const columns: ProColumns<QueryHistoryItem>[] = [
    {
      title: 'SQL',
      dataIndex: 'sqlInfo',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '执行数据库',
      dataIndex: 'dbName',
    },
    {
      title: '耗时',
      dataIndex: 'duration',
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
    },
    {
      title: '执行人',
      dataIndex: 'creator',
    },
  ]


  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }


  return (<>
    <ProTable
      size={'small'}
      scroll={{x: 1300}}
      rowKey="id"
      request={
        async (params) => {
          const result = await GET('/ncnb/queryHistory', {
            ...params,
            size: params.pageSize,
            queryId: props.queryId,
          });
          return {
            data: result?.data?.records,
            total: result?.data?.total,
            success: result.code === 200
          }
        }
      }
      pagination={{
        pageSize: 6,
      }}
      columns={columns}
      search={false}
      options={false}
      dateFormatter="string"
    />
  </>);
};

export default React.memo(QueryHistory)
