import {ProList} from "@ant-design/pro-components";
import React from "react";
import {POST_ERD} from "@/services/crud";
import {List} from "antd";
import {renderActivities} from "@/pages/project/home";

export type NoticeProps = {};
const Index: React.FC<NoticeProps> = (props) => {
  return (<>
    <ProList<any>
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
      }}
      renderItem={(item) => renderActivities(item)}
      metas={{
        title: {},
        createTime: {},
        type: {},
        avatar: {},
        content: {},
        actions: {},
      }}
      headerTitle="公告"
      request={
        async (params) => {
          const result = await POST_ERD('/syst/sysAnnouncement', {
            ...params,
            size: params.pageSize,
            orders: [
              {
                column: "createTime",
                asc: false
              }
            ]
          });
          return {
            data: result?.data?.records,
            total: result?.data?.total,
            success: result.code === 200
          }
        }}
    />
  </>);
};

export default React.memo(Index)
