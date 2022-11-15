// @ts-nocheck
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
let projectState = useProjectStore.getState();


export default function access(initialState: and) {
  let {permission} = initialState?.access || [];
  console.log(6, 'permission',projectState?.project?.type, permission);
  if (!permission) {
    permission = false;
  }
  console.log(11,'erd_project_permission_group', permission && permission.includes('erd_project_permission_group'));
  return {
    initialized: permission && permission.includes('initialized'),//标记是否初始化了权限
    canErdProjectGroupEdit: permission && permission.includes('erd_project_group_edit'),//团队基础设置 -修改
    canErdProjectGroupDel: permission && permission.includes('erd_project_group_del'),//团队基础设置 -删除
    canErdProjectPermissionGroup: permission && permission.includes('erd_project_permission_group'),//团队权限组 -查看页面
    canErdProjectRolesPage: permission && permission.includes('erd_project_roles_page'),//团队权限组 -用户组成员
    canErdProjectRolesSearch: permission && permission.includes('erd_project_roles_search'),//团队权限组 -搜索
    canErdProjectUsersAdd: permission && permission.includes('erd_project_users_add'),//团队权限组 -新增用户
    canErdProjectRoleUsersDel: permission && permission.includes('erd_project_role_users_del'),//团队权限组 -移除用户
    canErdProjectRolePermission: permission && permission.includes('erd_project_role_permission'),//团队权限组 -权限配置
    canErdProjectRolePermissionEdit: permission && permission.includes('erd_project_role_permission_edit'),//团队权限组 -修改权限
    canErdProjectSave: permission && permission.includes('erd_project_save'),//模型设计 -修改模型
    canErdHisprojectLoad: permission && permission.includes('erd_hisProject_load'),//版本管理 -查看页面
    canErdHisprojectAll: permission && permission.includes('erd_hisProject_all'),//版本管理 -全部版本
    canErdConnectorDbversion: permission && permission.includes('erd_connector_dbversion'),//版本管理 -获取数据源版本
    canErdHisprojectAdd: permission && permission.includes('erd_hisProject_add'),//版本管理 -新增
    canErdHisprojectConfig: permission && permission.includes('erd_hisProject_config'),//版本管理 -同步配置
    canErdHisprojectInit: permission && permission.includes('erd_hisProject_init'),//版本管理 -初始化基线
    canErdHisprojectRebuild: permission && permission.includes('erd_hisProject_rebuild'),//版本管理 -重建基线
    canErdHisprojectEdit: permission && permission.includes('erd_hisProject_edit'),//版本管理 -编辑
    canErdHisprojectDel: permission && permission.includes('erd_hisProject_del'),//版本管理 -删除
    canErdConnectorDbsync: permission && permission.includes('erd_connector_dbsync'),//版本管理 -同步数据源
    canErdTableImport: permission && permission.includes('erd_table_import'),//导入 -查看页面
    canErdConnectorDbreverseparse: permission && permission.includes('erd_connector_dbReverseParse'),//导入 -逆向解析
    canErdTableImportPdman: permission && permission.includes('erd_table_import_pdman'),//导入 -PDMan
    canErdTableImportErd: permission && permission.includes('erd_table_import_erd'),//导入 -ERD
    canErdTableExport: permission && permission.includes('erd_table_export'),//导出 -查看页面
    canErdTableExportCommon: permission && permission.includes('erd_table_export_common'),//导出 -普通导出
    canErdTableExportMore: permission && permission.includes('erd_table_export_more'),//导出 -高级导出
    canErdTableSetting: permission && permission.includes('erd_table_setting'),//设置 -查看页面
    canErdTableSettingDb: permission && permission.includes('erd_table_setting_db'),//设置 -数据源
    canErdTableSettingDefaultfield: permission && permission.includes('erd_table_setting_defaultField'),//设置 -默认字段
    canErdTableSettingDefault: permission && permission.includes('erd_table_setting_default'),//设置 -系统默认项
    canErdDocDownloadwordtemplate: permission && permission.includes('erd_doc_downloadWordTemplate'),//设置 -下载Word模板
    canErdDocUploadwordtemplate: permission && permission.includes('erd_doc_uploadWordTemplate'),//设置 -上传Word模板
  };
}


