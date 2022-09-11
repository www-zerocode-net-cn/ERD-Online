import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, IconName, Menu, MenuItem, OverflowList} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";
import {Empty, message, Pagination} from 'antd';
import {Fixed} from "react-spaces";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from '@mui/material';
import * as cache from "@/utils/cache";
import AddProject from "@/components/dialog/project/AddProject";
import {pageProject} from "@/utils/save";

export type ProjectListProps = {
  page?: number;
  limit?: number;
  total?: number;
  projects?: any;
  order?: any;
};


const ProjectList: React.FC<ProjectListProps> = (props) => {
    const [state, setState] = useState<ProjectListProps>({
      page: 1,
      limit: 6,
      total: 0,
      projects: [],
      order: "createTime"
    });

    const fetchProjects = (params: any) => {
      pageProject(params || state).then(res => {
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
            message.error('获取项目信息失败');
          }
        }
      });

    }

    useEffect(() => {
      fetchProjects(state);
    }, [state.page, state.order]);

    const orderByCreateTime = () => {
      setState({
        ...state,
        order: 'createTime'
      })
    }
    const orderByUpdateTime = () => {
      setState({
        ...state,
        order: 'updateTime'
      })
    }

    const renderButton = (type: string, text: string, iconName: IconName) => {
      const vertical = false
      const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
      const projectSortMenu = (
        <Menu>
          <MenuItem text="创建时间" icon="time" onClick={() => orderByCreateTime()}/>
          <MenuItem text="最近修改" icon="updated" onClick={() => orderByUpdateTime()}/>
        </Menu>
      );
      return (
        <Popover2 content={projectSortMenu}
                  placement={vertical ? "right-start" : "bottom-start"}>
          <Button minimal={true} rightIcon={rightIconName} icon={iconName} text={text}/>
        </Popover2>
      );
    }
    const visibleItemRenderer = ({id, projectName, description, ...restProps}: any) => {
      // customize rendering of last breadcrumb
      return <Card sx={{maxWidth: 345}} onClick={() => {
        cache.setItem("projectId", id);
        window.location.href = '/design/table/model';
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
            <AddProject fetchProjects={() => fetchProjects(null)} trigger="bp"/>
          </div>
          <div>
            <div>
              <ButtonGroup style={{minWidth: 120}}>
                {renderButton('sort', "排序", "sort")}
              </ButtonGroup>
            </div>
          </div>
        </div>
        <Fixed width={"100%"} height={"100%"} scrollable={true}>
          {state.projects.length > 0 ?
            <>

              <OverflowList
                tagName="div"
                className="projectList"
                items={state.projects}
                visibleItemRenderer={visibleItemRenderer}
              />
              <Pagination
                className="pagination"
                total={state.total}
                current={state.page}
                pageSize={state.limit}
                showSizeChanger={false}
                onChange={(page: number, pageSize: number) => {
                  setState({
                    ...state,
                    page: page,
                    limit: pageSize
                  });
                }}
              />
            </>
            :
            <Empty
              image="/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={
                <span>暂无项目</span>
              }
            >
              <AddProject fetchProjects={() => fetchProjects(null)} trigger="ant"/>
            </Empty>
          }

        </Fixed>

      </>
    )
  }
;

export default React.memo(ProjectList);
