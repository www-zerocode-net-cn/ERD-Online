// @ts-nocheck
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
let projectState = useProjectStore.getState();


export default function access(initialState: and) {
  let {permission, person} = initialState?.access || [];
  console.log(6, 'permission', person, permission);
  if (!permission) {
    permission = false;
  }

  return {
    person: person,//是否是个人项目
    enterprise: !person,//是否是企业项目
    initialized: person || (permission && permission.includes('initialized')),//标记是否初始化了权限
    canErdProjectGroupEdit: person || (permission && permission.includes('erd_project_group_edit')),//团队基础设置 -修改
    canErdProjectGroupDel: person || (permission && permission.includes('erd_project_group_del')),//团队基础设置 -删除
    canErdProjectPermissionGroup: person || (permission && permission.includes('erd_project_permission_group')),//团队权限组 -查看页面
    canErdProjectRolesPage: person || (permission && permission.includes('erd_project_roles_page')),//团队权限组 -用户组成员
    canErdProjectRolesSearch: person || (permission && permission.includes('erd_project_roles_search')),//团队权限组 -搜索
    canErdProjectUsersAdd: person || (permission && permission.includes('erd_project_users_add')),//团队权限组 -新增用户
    canErdProjectRoleUsersDel: person || (permission && permission.includes('erd_project_role_users_del')),//团队权限组 -移除用户
    canErdProjectRolePermission: person || (permission && permission.includes('erd_project_role_permission')),//团队权限组 -权限配置
    canErdProjectRolePermissionEdit: person || (permission && permission.includes('erd_project_role_permission_edit')),//团队权限组 -修改权限
    canErdProjectSave: person || (permission && permission.includes('erd_project_save')),//模型设计 -修改模型
    canErdHisprojectLoad: person || (permission && permission.includes('erd_hisProject_load')),//版本管理 -查看页面
    canErdHisprojectAll: person || (permission && permission.includes('erd_hisProject_all')),//版本管理 -全部版本
    canErdConnectorDbversion: person || (permission && permission.includes('erd_connector_dbversion')),//版本管理 -获取数据源版本
    canErdHisprojectAdd: person || (permission && permission.includes('erd_hisProject_add')),//版本管理 -新增
    canErdHisprojectConfig: person || (permission && permission.includes('erd_hisProject_config')),//版本管理 -同步配置
    canErdHisprojectInit: person || (permission && permission.includes('erd_hisProject_init')),//版本管理 -初始化基线
    canErdHisprojectRebuild: person || (permission && permission.includes('erd_hisProject_rebuild')),//版本管理 -重建基线
    canErdHisprojectEdit: person || (permission && permission.includes('erd_hisProject_edit')),//版本管理 -编辑
    canErdHisprojectDel: person || (permission && permission.includes('erd_hisProject_del')),//版本管理 -删除
    canErdConnectorDbsync: person || (permission && permission.includes('erd_connector_dbsync')),//版本管理 -同步数据源
    canErdTableImport: person || (permission && permission.includes('erd_table_import')),//导入 -查看页面
    canErdConnectorDbreverseparse: person || (permission && permission.includes('erd_connector_dbReverseParse')),//导入 -逆向解析
    canErdTableImportPdman: person || (permission && permission.includes('erd_table_import_pdman')),//导入 -PDMan
    canErdTableImportErd: person || (permission && permission.includes('erd_table_import_erd')),//导入 -ERD
    canErdTableExport: person || (permission && permission.includes('erd_table_export')),//导出 -查看页面
    canErdTableExportCommon: person || (permission && permission.includes('erd_table_export_common')),//导出 -普通导出
    canErdTableExportMore: person || (permission && permission.includes('erd_table_export_more')),//导出 -高级导出
    canErdTableSetting: person || (permission && permission.includes('erd_table_setting')),//设置 -查看页面
    canErdTableSettingDb: person || (permission && permission.includes('erd_table_setting_db')),//设置 -数据源
    canErdTableSettingDefaultfield: person || (permission && permission.includes('erd_table_setting_defaultField')),//设置 -默认字段
    canErdTableSettingDefault: person || (permission && permission.includes('erd_table_setting_default')),//设置 -系统默认项
    canErdDocDownloadwordtemplate: person || (permission && permission.includes('erd_doc_downloadWordTemplate')),//设置 -下载Word模板
    canErdDocUploadwordtemplate: person || (permission && permission.includes('erd_doc_uploadWordTemplate')),//设置 -上传Word模板
  };
}


