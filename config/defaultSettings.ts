import {Settings as LayoutSettings} from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "dark",
  "headerTheme": "dark",
  "primaryColor": "#FA541C",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "title": "Zero Code",
  "pwa": false,
  "iconfontUrl": "//at.alicdn.com/t/font_2750460_b2lnxw12jxe.js",
  "menu": {
    "locale": true
  },
  "headerHeight": 48,
  "splitMenus": true
};

export default Settings;
