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
import {Divider} from "@mui/material";
import {Button, Intent, MenuItem, NonIdealState} from "@blueprintjs/core";
import {ItemRenderer, Select} from "@blueprintjs/select";
import shallow from "zustand/shallow";
import useVersionStore from "@/store/version/useVersionStore";
import {Top} from 'react-spaces';
import './index.less';

export type VersionProps = {
};

export type IDatabase = {
  title: string;
  year: number;
};

const DatabaseSelect = Select.ofType<IDatabase>();

const Version: React.FC<VersionProps> = (props) => {
  const {versions, fetch} = useVersionStore(state => ({
    versions: state.versions,
    fetch: state.fetch
  }), shallow);
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

  const [items] = React.useState<IDatabase[]>([]);
  const [film] = React.useState<IDatabase>();
  return (<div>
      <div className="model-template-tool">
        <h5 className="bp3-heading head">历史版本</h5>
        <Button className="bp3-minimal" icon="warning-sign" intent={Intent.WARNING} title="当前内容与上一版本内容无变化"/>
        <Button className="bp3-minimal" icon="notifications-updated" intent={Intent.SUCCESS}
                title="当前内容与上一版本内容无变化"/>
      </div>
      <Divider/>
      <DatabaseSelect
        onItemSelect={handleItemSelect}
        items={items}
        filterable={false}
        itemRenderer={renderFilm}
        fill={true}
        noResults={<MenuItem disabled={true} text="未配置数据库"/>}
      >
        <Button
          icon="database"
          rightIcon="caret-down"
          fill={true}
          text={film ? `${film.title} (${film.year})` : "(请选择数据库)"}
        />
      </DatabaseSelect>
      <div className="version-list" >
        <Top size="100%" scrollable={true}>
          <Timeline position="left">
            {versions && versions.length > 0 ?
              versions.map((v: any) => {
                return <TimelineItem>
                  <TimelineOppositeContent color="text.primary">
                    {v.VERSION}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="warning"/>
                    <TimelineConnector/>
                  </TimelineSeparator>
                  <TimelineContent>Eat</TimelineContent>
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
