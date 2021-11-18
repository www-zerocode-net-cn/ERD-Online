import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab';
import React, {useEffect} from 'react';
import {Divider, Typography} from "@mui/material";
import {Button, MenuItem, NonIdealState} from "@blueprintjs/core";
import {ItemRenderer, Select} from "@blueprintjs/select";
import shallow from "zustand/shallow";
import useVersionStore from "@/store/version/useVersionStore";
import {Top} from 'react-spaces';
import './index.less';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import SyncIcon from '@mui/icons-material/Sync';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {compareStringVersion} from "@/utils/string";
import {Popover2} from "@blueprintjs/popover2";
import {VersionHandle} from "@/components/Menu";


export type VersionProps = {};

export type IDatabase = {
  title: string;
  year: number;
};

const DatabaseSelect = Select.ofType<IDatabase>();

const Version: React.FC<VersionProps> = (props) => {
  const {dbs, synchronous, dbVersion, changes, versions, fetch, versionDispatch} = useVersionStore(state => ({
    dbs: state.dbs,
    synchronous: state.synchronous,
    dbVersion: state.dbVersion,
    changes: state.changes,
    versions: state.versions,
    fetch: state.fetch,
    versionDispatch: state.dispatch,
  }), shallow);
  console.log('dbs', 37, dbs);
  console.log('versions', 38, versions);
  // fetch();
  useEffect(() => {
    fetch();
  }, []);

  const handleItemSelect = React.useCallback((db: IDatabase) => {
    console.log(db);
  }, []);
  // NOTE: not using Films.itemRenderer here so we can set icons.
  const renderFilm: ItemRenderer<IDatabase> = (film, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={"tick"}
        label={film?.year?.toString()}
        onClick={handleClick}
        text={film?.title}
        shouldDismissPopover={false}
      />
    );
  };

  const currentDB = versionDispatch.getCurrentDB();
  return (<div>
      <div className="model-template-tool">
        <h5 className="bp3-heading head">历史版本</h5>
        {changes.length > 0 ?
          <WarningAmberIcon titleAccess="当前内容与上一版本的内容有变化，但未保存版本！"/>
          :
          <SyncIcon titleAccess="当前内容与上一版本内容无变化"/>
        }
      </div>
      <Divider/>
      <DatabaseSelect
        onItemSelect={handleItemSelect}
        items={dbs}
        filterable={false}
        itemRenderer={renderFilm}
        fill={true}
        noResults={<MenuItem disabled={true} text="未配置数据库"/>}
      >
        <Button
          icon="database"
          rightIcon="caret-down"
          fill={true}
          text={currentDB !== '' ? currentDB : "(请选择数据库)"}
        />
      </DatabaseSelect>
      <div className="version-list">
        <Top size="100%" scrollable={true}>
          <Timeline position="left">
            {versions && versions.length > 0 ?
              versions.map((v: any, index: number) => {
                return <TimelineItem key={v.version}>
                  <TimelineOppositeContent sx={{m: 'auto 0'}}
                                           variant="body2">
                    {v.versionDate}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector/>
                    {
                      // eslint-disable-next-line no-nested-ternary
                      compareStringVersion(v.version, dbVersion) <= 0 ?
                        <TimelineDot color="info"><SyncIcon titleAccess="已同步"/></TimelineDot>
                        :
                        synchronous[v.version] ?
                          <TimelineDot color="secondary"><SyncAltIcon titleAccess="正在同步"/></TimelineDot> :
                          <TimelineDot color="error"><SyncDisabledIcon titleAccess="未同步"/></TimelineDot>

                    }
                    <TimelineConnector/>
                  </TimelineSeparator>
                  <TimelineContent sx={{py: '12px', px: 2}}>
                    <Typography variant="h6" component="span">
                      <Popover2
                        autoFocus={false}
                        enforceFocus={false}
                        hasBackdrop={true}
                        content={<VersionHandle/>}
                        placement={"bottom-start"}
                      >
                        <a onMouseOver={() => {
                          versionDispatch.setCurrentVersion(v,index)
                        }}>
                          {v.version}
                          {
                            compareStringVersion(v.version, dbVersion) === 0 ?
                              <BookmarkBorderIcon titleAccess="当前数据库版本"/> : ''
                          }
                        </a>
                      </Popover2>
                    </Typography>
                    <Typography variant="body2">{v.versionDesc}</Typography>
                  </TimelineContent>
                </TimelineItem>
              }) :
              <NonIdealState
                icon={"info-sign"}
                title={"提示："}
                description={'未创建版本'}
              />

            }
          </Timeline>
        </Top>
      </div>
    </div>
  );
}

export default React.memo(Version)
