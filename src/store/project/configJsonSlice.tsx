import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import _ from 'lodash';
import {message} from "antd";

export type IConfigJsonSlice = {}

export interface IConfigJsonDispatchSlice {
  setConfigJson: (value: any) => void;
  setUpgradeType: (value: any) => void;
};

const ConfigJsonSlice = (set: SetState<ProjectState>) => ({
  setConfigJson: (value: any) => set(produce(state => {
    state.project.configJSON = value
  })),
  setUpgradeType: (value: any) => set(produce(state => {
    _.set(state.project, 'configJSON.synchronous.upgradeType', value.upgradeType);
    message.success("设置成功");
  })),
});


export default ConfigJsonSlice;
