import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, IconName, OverflowList} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";
import {ProjectSortMenu} from "@/components/Menu";
import {notification, Pagination} from 'antd';
import {Fixed} from "react-spaces";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from '@mui/material';
import request from "@/utils/request";
import * as cache from "@/utils/cache";

export type ProjectListProps = {
  page?: number;
  limit?: number;
  total?: number;
  projects?: any;
};


const ProjectList: React.FC<ProjectListProps> = (props) => {
  const [state, setState] = useState<ProjectListProps>({
    page: 1,
    limit: 8,
    total: 0,
    projects: []
  });

  useEffect(() => {
    request.get('/ncnb/project/page', {
        params: {
          page: state.page,
          limit: state.limit
        }
      }
    ).then(res => {
      if (res) {
        if (res.data) {
          console.log(44, 'projects', res);
          setState({
              ...state,
              total: res.data.total,
              projects: res.data.records
            }
          );
        } else {
          notification.error({
            message: '获取项目信息失败',
          });
        }
      }
    });
  }, [state.page]);

  const renderButton = (type: string, text: string, iconName: IconName) => {
    const vertical = false
    const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
    return (
      <Popover2 content={<ProjectSortMenu/>}
                placement={vertical ? "right-start" : "bottom-start"}>
        <Button rightIcon={rightIconName} icon={iconName} text={text}/>
      </Popover2>
    );
  }
  const visibleItemRenderer = ({id, projectName, description, ...restProps}: any) => {
    // customize rendering of last breadcrumb
    return <Card sx={{maxWidth: 345}} onClick={() => {
      cache.setItem("projectId", id);
      window.location.href = '/design/table';
    }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/erd/img_7.png"
          alt="green iguana"
        />
        <CardContent className="cardContent">
          <Typography gutterBottom variant="h6" component="div">
            {projectName || ' '}
          </Typography>
          <Typography variant="inherit">
            {description || ' '}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>;
  };
  return (<>
      <div className="body-header-tool">
        <div>
          <Button icon={"plus"} text={'新增'}/>

        </div>
        <div>
          <div>
            <ButtonGroup style={{minWidth: 120}}>
              {renderButton('sort', "排序", "sort")}
            </ButtonGroup>
          </div>
        </div>
      </div>
      < Fixed width={"100%"} height={"100%"}>

        <OverflowList
          tagName="div"
          className="projectList"
          items={state.projects}
          visibleItemRenderer={visibleItemRenderer}
        />
        <Pagination
          className="pagination"
          total={state.total}
          defaultPageSize={state.limit}
          defaultCurrent={state.page}
          showSizeChanger={false}
          onShowSizeChange={(current: number, size: number) => {
            setState({
              ...state,
              page: current,
              limit: size
            })
          }}
        />
      </Fixed>

    </>
  )
};

export default React.memo(ProjectList);
