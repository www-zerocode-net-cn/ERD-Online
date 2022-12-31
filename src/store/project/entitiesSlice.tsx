import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import {message} from "antd";
import useShortcutStore, {PANEL} from "@/store/shortcut/useShortcutStore";
import * as cache from "@/utils/cache";

export type IEntitiesSlice = {
  currentEntity?: string;
  currentEntityIndex?: number;
}

export interface IEntitiesDispatchSlice {
  addEntity: (payload: any) => void;
  renameEntity: (payload: any) => void;
  removeEntity: () => void;
  removeIndex: (index: number) => void;
  updateEntity: (payload: any) => void;
  copyEntity: (payload: any) => void;
  cutEntity: (payload: any) => void;
  pastEntity: () => void;
  updateEntityFields: (payload: any) => void;
  updateEntityIndex: (payload: any) => void;
  moveField: (payload: any, startRow: number, endRow: number) => void;
  setCurrentEntity: (payload: any) => void,
  setCurrentModuleAndEntity: (module: any, entity: any) => void,
};

const ERD_ENTITY_CLIPBOARD = 'erd_entity_clipboard';

const validateTable = (data: any) => {
  let flag = false;
  if (data && data.title && typeof data.title === 'string') {
    if (data.fields && Array.isArray(data.fields)) {
      flag = true;
    }
  }
  return flag;
};

const shortcutState = useShortcutStore.getState();

const EntitiesSlice = (set: SetState<ProjectState>) => ({
  currentEntity: '',
  currentEntityIndex: -1,
  addEntity: (payload: any) => set(produce(state => {
    const {currentModuleIndex} = state;
    console.log('state.currentModuleIndex', currentModuleIndex, 15, 'payload', payload);
    console.log('addEntity', 16, state.project.projectJSON.modules[currentModuleIndex].entities)
    const entityIndex = state.project.projectJSON.modules[currentModuleIndex].entities?.findIndex((e: any) => e.title === payload.title);
    if (entityIndex === -1) {
      if (payload) {
        state.project.projectJSON.modules[currentModuleIndex].entities.push(payload);
        console.log('addEntity', 17, state.project.projectJSON.modules[currentModuleIndex].entities)
        message.success('提交成功');
      } else {
        message.error('保存出错，不能保存null')
      }
    } else {
      message.warning(`${payload.title}已经存在`);
    }
  })),
  renameEntity: (payload: any) => set(produce(state => {
    const {currentEntityIndex} = state;
    console.log(35, state.currentModuleIndex, currentEntityIndex, payload)
    state.project.projectJSON.modules[state.currentModuleIndex].entities[currentEntityIndex].title = payload.title;
    state.project.projectJSON.modules[state.currentModuleIndex].entities[currentEntityIndex].chnname = payload.chnname;
    message.success('修改成功');
  })),
  removeIndex: (index: number) => set(produce(state => {
    const {currentModuleIndex, currentEntityIndex} = state;
    console.log(49, state.currentModuleIndex, currentEntityIndex, index)
    state.project.projectJSON.modules[currentModuleIndex].entities[currentEntityIndex].indexs =
      state.project.projectJSON.modules[currentModuleIndex]?.entities[currentEntityIndex].indexs.filter((e: any, i: number) => i !== index) || [];
    message.success('删除成功');
  })),
  removeEntity: () => set(produce(state => {
    const {currentModuleIndex} = state;
    state.project.projectJSON.modules[currentModuleIndex].entities =
      state.project.projectJSON.modules[currentModuleIndex]?.entities?.filter((e: any, index: number) => index !== state.currentEntityIndex) || [];
  })),
  updateEntity: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  copyEntity: (payload: any) => set(produce(state => {
    const entityTitle = payload.title;
    const currentEntity = state.project.projectJSON?.modules[state.currentModuleIndex]?.entities.find((m: any) => m.title === entityTitle);
    debugger
    if (currentEntity) {
      cache.setItem(ERD_ENTITY_CLIPBOARD, currentEntity);
      message.success("复制成功")
    } else {
      message.success("复制失败")
    }
  })),
  cutEntity: (payload: any) => set(produce(state => {
    const entityTitle = payload.title;
    const currentEntity = state.project.projectJSON?.modules[state.currentModuleIndex]?.entities.find((m: any) => m.title === entityTitle);
    console.log(85, currentEntity)
    if (currentEntity) {
      cache.setItem(ERD_ENTITY_CLIPBOARD, currentEntity);
      state.project.projectJSON.modules[state.currentModuleIndex].entities =
        state.project.projectJSON.modules[state.currentModuleIndex].entities.filter((m: any, index: number) => m.title !== entityTitle) || [];
      message.success("剪切成功")
    } else {
      message.success("剪切失败")
    }
  })),
  pastEntity: () => set(state => {
    const currentModuleIndex = state.currentModuleIndex;
    let data = [];
    try {
      data = cache.getItem2object(ERD_ENTITY_CLIPBOARD) || {};
      let entityTitle = data.title;
      if (currentModuleIndex && validateTable(data)) {
        let title = entityTitle;
        while (state.project?.projectJSON?.modules[currentModuleIndex].entities.some((m: any) => m.title === entityTitle)) {
          title = `${entityTitle}-副本`;
          entityTitle = title;
        }
        console.log(122, title,);
        state.project?.projectJSON?.modules[currentModuleIndex].entities.push({
          ...data,
          title,
        });
        message.success('粘贴成功');
      } else {
        message.success('粘贴失败');
      }
    } catch (err) {
      console.log('数据格式错误，无法粘贴', err);
      message.error('数据格式错误，无法粘贴');

    }
  }),
  updateEntityFields: (payload: any) => set(produce(state => {
    console.log(70, '表发生变化', state.currentModuleIndex, state.currentEntityIndex, payload);
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  updateEntityIndex: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].indexs = payload;
  })),
  moveField: (payload: any, startRow: number, endRow: number) => set(produce(state => {
    if (startRow < endRow) {
      // eslint-disable-next-line no-param-reassign
      endRow -= 1;
    }
    payload.splice(endRow, 0, payload.splice(startRow, 1)[0]);
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  setCurrentEntity: (payload: any) => set(produce(state => {
    const {currentModuleIndex} = state;
    console.log(47, currentModuleIndex, payload);
    state.currentEntity = payload
    state.currentEntityIndex = state.project.projectJSON.modules[currentModuleIndex]?.entities.findIndex((m: any) => m.title === payload);
    shortcutState.dispatch.setPanel(PANEL.DEFAULT);
  })),
  setCurrentModuleAndEntity: (module: any, entity: any) => set(produce(state => {
    console.log(54, module, entity);
    state.currentModule = module;
    const currentModuleIndex = state.project.projectJSON.modules?.findIndex((m: any) => m.name === module);
    state.currentModuleIndex = currentModuleIndex;
    state.currentEntity = entity;
    state.currentEntityIndex = state.project.projectJSON.modules[currentModuleIndex]?.entities.findIndex((m: any) => m.title === entity);
    shortcutState.dispatch.setPanel(PANEL.DEFAULT);
  })),
});


export default EntitiesSlice;
