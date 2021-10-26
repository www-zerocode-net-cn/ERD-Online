import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab';
import React from 'react';
import {Divider} from "@mui/material";
import {Button, Intent, MenuItem} from "@blueprintjs/core";
import {ItemRenderer, Select} from "@blueprintjs/select";

export type VersionProps = {};

export type IDatabase = {
  title: string;
  year: number;
};

const DatabaseSelect = Select.ofType<IDatabase>();

const Version: React.FC<VersionProps> = (props) => {
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
  return (<>
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
        noResults={<MenuItem disabled={true} text="No results."/>}
      >
        <Button
          icon="database"
          rightIcon="caret-down"
          fill={true}
          text={film ? `${film.title} (${film.year})` : "(请选择数据库)"}
        />
      </DatabaseSelect>
      <Timeline position="left" sx={{overflow: "auto", height: "700px"}}>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            09:30 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="warning"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            10:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            12:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="text.primary">
            9:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="success"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>Repeat1</TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  );
}

export default React.memo(Version)
