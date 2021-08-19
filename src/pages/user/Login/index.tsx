import React from "react";
import ZeroCodeGridLayout from "@/components/ZeroCodeGridLayout";
import style from './index.less';
import {B57EBF5, EE95921CF001, F5EBA0217,} from './gridLayouts';

export default class MyFirstGrid extends React.Component {
  render() {
    return (
      <>
        <div key="320400F6-E186-4B63-9E06-08446B57EBF5" className={style.B57EBF5}><ZeroCodeGridLayout layout={B57EBF5}>
          <div key="412BA199-4634-4993-97CA-EE95921CF001" className={style.EE95921CF001}><ZeroCodeGridLayout
            layout={EE95921CF001}>
            <div key="BDFACC91-8123-4D4A-89E8-FB94AA6C39A7">
              <div className={style.FB94AA6C39A7}>账号
                登录
              </div>
            </div>
            <div key="898D5E29-B062-4308-BAED-1E85986A488B" className={style.E85986A488B}></div>
            <div key="45D4A20A-D9C0-4F66-A426-896F5EBA0217" className={style.F5EBA0217}><ZeroCodeGridLayout
              layout={F5EBA0217}>
              <div key="504D50B9-1063-4E43-8214-94ACC58F6C42">
                <div className={style.ACC58F6C42}>ERD ONLINE</div>
              </div>
              <div key="F57CF37E-7029-4E7D-99D7-A7DB1CAE14CC">
                <div className={style.A7DB1CAE14CC}></div>
              </div>
              <div key="1AA65F24-6A32-4E12-9A4E-A416CBEB2E42" className={style.A416CBEB2E42}></div>
              <div key="9F62DDF1-9323-4A9E-8B7C-BA83E55A60D9" className={style.BA83E55A60D9}></div>
            </ZeroCodeGridLayout></div>
            <div key="894B1169-5A2B-4C51-B3F7-4F8FAAFD93E5">
              <div className={style.F8FAAFD93E5}>微信登录</div>
            </div>
            <div key="F976E6FC-D920-4C8C-98C7-CCCEB79715D1" className={style.CCCEB79715D1}></div>
            <div key="C20BBA7D-E4F2-480E-AE83-7E1B55906C24">
              <div className={style.E1B55906C24}>微信扫码 完成登录</div>
            </div>
          </ZeroCodeGridLayout></div>
          <div key="6D3C4B1E-151C-4973-9768-AFB58EC422E3">
            <div className={style.AFB58EC422E3}>Copyright &ERD ONLINE 2021</div>
          </div>
        </ZeroCodeGridLayout></div>
      </>
    );
  }
}
