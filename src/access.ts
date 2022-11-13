// @ts-nocheck
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: and) {
  const {permission} = initialState?.access || [];
  console.log(6, 'permission', permission);
  return {
    canErdProjectGroupPage: permission?.indexOf('erd_project_group_page ') > -1,//团队基础设置 -查看页面
    canErdProjectGroupEdit: permission?.indexOf('erd_project_group_edit ') > -1,//团队基础设置 -修改
    canErdProjectGroupDel: permission?.indexOf('erd_project_group_del ') > -1,//团队基础设置 -删除
    canErdProjectPermissionGroup: permission?.indexOf('erd_project_permission_group ') > -1,//团队权限组 -查看页面
    canErdProjectRolesPage: permission?.indexOf('erd_project_roles_page ') > -1,//团队权限组 -用户组成员
    canErdProjectRolesSearch: permission?.indexOf('erd_project_roles_search ') > -1,//团队权限组 -搜索
    canErdProjectUsersAdd: permission?.indexOf('erd_project_users_add ') > -1,//团队权限组 -新增用户
    canErdProjectRoleUsers: permission?.indexOf('erd_project_role_users ') > -1,//团队权限组 -移除用户
    canErdProjectRolePermission: permission?.indexOf('erd_project_role_permission ') > -1,//团队权限组 -权限配置
    canErdProjectRolePermissionEdit: permission?.indexOf('erd_project_role_permission_edit ') > -1,//团队权限组 -修改权限
    canErdProjectInfo: permission?.indexOf('erd_project_info ') > -1,//模型设计 -查看页面
    canErdProjectSave: permission?.indexOf('erd_project_save ') > -1,//模型设计 -修改模型
    canErdHisprojectLoad: permission?.indexOf('erd_hisProject_load ') > -1,//版本管理 -查看页面
    canErdHisprojectAll: permission?.indexOf('erd_hisProject_all ') > -1,//版本管理 -全部版本
    canErdConnectorDbversion: permission?.indexOf('erd_connector_dbversion ') > -1,//版本管理 -获取数据源版本
    canErdHisprojectAdd: permission?.indexOf('erd_hisProject_add ') > -1,//版本管理 -新增
    canErdHisprojectConfig: permission?.indexOf('erd_hisProject_config ') > -1,//版本管理 -同步配置
    canErdHisprojectInit: permission?.indexOf('erd_hisProject_init ') > -1,//版本管理 -初始化基线
    canErdHisprojectRebuild: permission?.indexOf('erd_hisProject_rebuild ') > -1,//版本管理 -重建基线
    canErdHisprojectEdit: permission?.indexOf('erd_hisProject_edit ') > -1,//版本管理 -编辑
    canErdHisprojectDel: permission?.indexOf('erd_hisProject_del ') > -1,//版本管理 -删除
    canErdConnectorDbsync: permission?.indexOf('erd_connector_dbsync ') > -1,//版本管理 -同步数据源
    canErdTableImport: permission?.indexOf('erd_table_import ') > -1,//导入 -查看页面
    canErdConnectorDbreverseparse: permission?.indexOf('erd_connector_dbReverseParse ') > -1,//导入 -逆向解析
    canErdTableImportPdman: permission?.indexOf('erd_table_import_pdman ') > -1,//导入 -PDMan
    canErdTableImportErd: permission?.indexOf('erd_table_import_erd ') > -1,//导入 -ERD
    canErdTableExport: permission?.indexOf('erd_table_export ') > -1,//导出 -查看页面
    canErdTableExportCommon: permission?.indexOf('erd_table_export_common ') > -1,//导出 -普通导出
    canErdTableExportMore: permission?.indexOf('erd_table_export_more ') > -1,//导出 -高级导出
    canErdTableSetting: permission?.indexOf('erd_table_setting ') > -1,//设置 -查看页面
    canErdTableSettingDb: permission?.indexOf('erd_table_setting_db ') > -1,//设置 -数据源
    canErdTableSettingDefaultfield: permission?.indexOf('erd_table_setting_defaultField ') > -1,//设置 -默认字段
    canErdTableSettingDefault: permission?.indexOf('erd_table_setting_default ') > -1,//设置 -系统默认项
    canErdDocDownloadwordtemplate: permission?.indexOf('erd_doc_downloadWordTemplate ') > -1,//设置 -下载Word模板
    canErdDocUploadwordtemplate: permission?.indexOf('erd_doc_uploadWordTemplate ') > -1,//设置 -上传Word模板
  };
}


