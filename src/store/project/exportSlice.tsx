import {GetState, SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import {message, Modal} from "antd";
import {saveImage} from "@/utils/relation2file";
import {generateMD} from "@/utils/markdown";
import * as File from "@/utils/file";
import * as cache from "@/utils/cache";
import request from "@/utils/request";
import _ from 'lodash';
import {generateHtml} from "@/utils/generatehtml";
import {getAllDataSQLByFilter} from "@/utils/json2code";
import produce from "immer";
import moment from "moment";
import {CONSTANT} from "@/utils/constant";

export type IExportSlice = {
  exportSliceState?: any;
}

export interface IExportDispatchSlice {
  setExportSliceState: (exportSlice: any) => void;
  exportFile: (type: string) => void;
  showExportMessage: () => void;
  onDBChange: (defaultDb: string) => void;
  onCustomTypeChange: (customType: any) => void;
  onExportTypeChange: (exportType: string) => void;
  initAllKeys: () => any;
  onSelectTableChange: (selectTable: []) => any;
  setExportData: () => any;
  getExportData: () => any;
  exportSQL: () => any;
}


const ExportSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
  setExportSliceState: (exportSlice: any) => set(produce(state => {
    state.exportSliceState = exportSlice;
  })),
  exportFile: (type: string) => {
    const {projectJSON, projectName: project} = get().project;
    const dataSource = JSON.parse(JSON.stringify(projectJSON));
    const columnOrder = [
      {code: 'chnname', value: '字段名', com: 'Input', relationNoShow: false},
      {code: 'name', value: '逻辑名(英文名)', com: 'Input', relationNoShow: false},
      {code: 'type', value: '类型', com: 'Select', relationNoShow: false},
      {code: 'dataType', value: '数据库类型', com: 'Text', relationNoShow: true},
      {code: 'remark', value: '说明', com: 'Input', relationNoShow: true},
      {code: 'pk', value: '主键', com: 'Checkbox', relationNoShow: false},
      {code: 'notNull', value: '非空', com: 'Checkbox', relationNoShow: true},
      {code: 'autoIncrement', value: '自增', com: 'Checkbox', relationNoShow: true},
      {code: 'defaultValue', value: '默认值', com: 'Input', relationNoShow: true},
      {code: 'relationNoShow', value: '关系图', com: 'Icon', relationNoShow: true},
      {code: 'uiHint', value: 'UI建议', com: 'Select', relationNoShow: true},
    ];
    if (type === 'Markdown') {
      get().dispatch.showExportMessage();
      saveImage(dataSource, columnOrder, (images: any) => {
        generateMD(dataSource, images, project, (data: any) => {
          // 将数据保存到文件
          File.save(data, `${project}.md`);
        });
      }, (err: any) => {
        message.error(`${type}导出失败!请重试！出错原因：${err.message}`);
      });
    } else if (type === 'Word' || type === 'PDF') {
      //Message.warning({title: '该功能正在开发中，敬请期待！'})
      const postfix = type === 'Word' ? '.doc' : '.pdf';
      // 保存图片
      get().dispatch.showExportMessage();
      saveImage(dataSource, columnOrder, (images: any) => {
        const tempImages = Object.keys(images).reduce((a, b) => {
          a[b] = images[b].replace('data:image/png;base64,', '');
          return a;
        }, {});
        const projectId = cache.getItem(CONSTANT.PROJECT_ID);
        const defaultDatabase = get().dispatch.getCurrentDBData();
        console.log(59, defaultDatabase);
        request.post('/ncnb/doc/gendocx', {
          method: 'POST',
          responseType: 'blob',
          data: {
            imgs: tempImages,
            projectId,
            type,
            doctpl: _.get(dataSource, 'profile.wordTemplateConfig', ""),
            dbKey: defaultDatabase?.key || ''
          }
        }).then((res) => {
          if (res) {
            File.saveByBlob(res, `${project}${postfix}`);
          }
        }).catch((err: any) => {
          message.error(`生成文档出错！出错原因：${err.message}！`);
        }).finally(() => {
          // this.setState({
          //   downloading: false
          // });
        });
      }, (err: any) => {
        message.error(`${type}导出失败!请重试！出错原因：${err.message}`);
      });
    } else if (type === 'Html') {
      get().dispatch.showExportMessage();
      saveImage(dataSource, columnOrder, (images: any) => {
        generateHtml(dataSource, images, project, (data: any) => {
          File.save(data, `${project}.html`);
        });
      }, (err: any) => {
        message.error(`${type}导出失败!请重试！出错原因：${err.message}`);
      });
    } else if (type === 'JSON') {
      let tempDataSource = {...dataSource};
      // 去除数据库信息
      tempDataSource = {
        ...tempDataSource,
        profile: {
          ...(tempDataSource.profile || {}),
          dbs: _.get(tempDataSource, 'profile.dbs', []).map((d: any) => {
            return {
              ...d,
              properties: {
                url: '******',
                username: '******',
                password: '******',
              },
            }
          }),
        },
      };
      const originERDJson = JSON.stringify(tempDataSource, null, 2);
      const secret = get().dispatch.encrypt("AES", originERDJson);
      File.save(secret, `${project}.erd.json`);
    }
    // else if (type === 'SQL') {
    //   const database = _.get(dataSource, 'dataTypeDomains.database', []);
    //   const defaultDb = (database.filter((db: any) => db.defaultDatabase)[0] || {}).code;
    //   let modal = null;
    //   const onOk = () => {
    //     const exportConfig = modal.com.getValue();
    //     const value = exportConfig.value;
    //     if (value.length === 0) {
    //       Modal.error({title: '导出失败', message: '请选择导出的内容'})
    //     } else {
    //       const data = modal.com.getData();
    //       File.save(data, `${moment().format('YYYY-MM-D-h-mm-ss')}.sql`);
    //       modal && modal.close();
    //     }
    //   };
    //   const onCancel = () => {
    //     modal && modal.close();
    //   };
    //   modal = openModal(<ExportSQL
    //     defaultDb={defaultDb}
    //     database={database}
    //     dataSource={dataSource}
    //     exportSQL={onOk}
    //     configJSON={this.props.configJSON}
    //     updateConfig={this.props.updateConfig}
    //   />, {
    //     title: 'SQL导出配置',
    //     footer: [
    //       //<Button key="ok" onClick={onOk} type="primary" style={{marginTop: 10}}>保存</Button>,
    //       <Button key="cancel" onClick={onCancel} style={{marginLeft: 10, marginTop: 10}}>关闭</Button>
    //     ],
    //   });
    // }
  },
  showExportMessage: () => {
    const {projectJSON: dataSource} = get().project;
    const allTable = (dataSource?.modules || []).reduce((a: any, b: any) => {
      return a.concat((b.entities || []).map((entity: any) => entity.title));
    }, []);
    if (allTable.length > 50) {
      Modal.warning({
        title: '导出提示',
        content: `当前导出的数据表较多， 共【${allTable.length}】张表，请耐心等待！导出完毕之前请勿关闭此窗口！`,
        okText: null,
        cancelText: null,
      });
    }else {
      Modal.warning({
        title: '导出提示',
        content: `正在导出， 共【${allTable.length}】张表，请耐心等待！导出完毕之前请勿关闭此窗口！`,
        okText: null,
        cancelText: null,
      });
    }
  },
  onDBChange: (defaultDb: string) => {
    get().dispatch.setExportSliceState({
      ...get().exportSliceState,
      defaultDb: defaultDb
    });
  },
  onExportTypeChange: (exportType: string) => {
    const allType = ['deleteTable', 'createTable', 'createIndex', 'updateComment'];
    let customType = get().exportSliceState?.customType;
    console.log(186, customType);
    // 如果是自定义的，之前选中过，按之前的算；没选中过，给个空的
    if (exportType === 'customer') {
      customType = [];
    } else {
      customType = allType;
    }
    console.log(196, customType);

    get().dispatch.setExportSliceState({
      ...get().exportSliceState,
      exportType: exportType,
      customType: customType
    });
    get().dispatch.setExportData();
  },
  onCustomTypeChange: (customType: string) => {
    get().dispatch.setExportSliceState({
      ...get().exportSliceState,
      customType: customType
    });
    get().dispatch.setExportData();

  },
  initAllKeys: () => {
    const modules = get().project?.projectJSON?.modules;
    return (modules || []).map((m: any, i: number) => {
      return {
        title: `${m.name}-${m.chnname || ''}`,
        value: i,
        children: m.entities.map((e: any, j: number) => {
          return {
            title: `${e.title}`,
            value: `${i}-${j}`,
          }
        })
      }
    });
    // return (modules || []).reduce((a: any, b: any) => {
    //   return (a.concat(b.entities.map((c: any) => ({...c, key: `${b.name}/${c.title}`}))));
    // }, (modules || []).map((d: any) => ({key: d.name}))).map((k: any) => k.key);
  },
  onSelectTableChange: (selectTable: []) => {
    get().dispatch.setExportSliceState({
      ...get().exportSliceState,
      selectTable: selectTable
    });
    get().dispatch.setExportData();
  },
  setExportData: () => {
    const {projectJSON: dataSource} = get().project;
    const {defaultDb, selectTable, customType} = get()?.exportSliceState || {};
    let tempDataSource = {...dataSource};
    console.log(212, selectTable);
    if (selectTable) {
      tempDataSource = {
        ...tempDataSource,
        modules: (tempDataSource.modules || []).map((m: any) => {
          return {
            ...m,
            entities: (m.entities || []).filter((e: any) => selectTable.includes(e.title)),
          };
        }),
      };
    }
    // @ts-ignore
    const data = getAllDataSQLByFilter(tempDataSource,
      defaultDb || get()?.dispatch.getCurrentDBName(),
      customType || ['deleteTable', 'createTable', 'createIndex', 'updateComment']);
    console.log(213, data);
    get().dispatch.setExportSliceState({
      ...get().exportSliceState,
      data: data
    });
    console.log(214, get());

  },
  getExportData: () => {
    return get().exportSliceState?.data || '';
  },
  exportSQL: () => {
    const data = get().exportSliceState?.data;
    if (data) {
      File.save(data, `${moment().format('YYYY-MM-D-h-mm-ss')}.sql`);
      message.success('导出成功');
    }else {
      message.warning('暂时无法导出');
    }
  }

});


export default ExportSlice;
