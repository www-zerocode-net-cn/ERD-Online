import React from "react";
import ZeroCodeGridLayout from "@/components/ZeroCodeGridLayout";
import {Image} from "antd";
import style from './index.less';
import {
  A0ECB66FF371,
  A4A2FC80847,
  A5EE507790CD,
  A6967C7DA93,
  B4A8891148F,
  B57EBF5,
  B9B052826F,
  BEA64466,
  C41115D309A1,
  C6EAD92D5954,
  CBD26AF00,
  CE988120,
  D18D5814A15E,
  DA20041567,
  DA8431CDF13,
  EA7A2573706,
  EA9A7DC2,
  F51F8E0D69B,
  F5F97B911538,
  F708241C15,
  FB695426DAA1,
  FE04ED336,
  FE70031C,
} from './gridLayouts';
import {ProjectLayoutLayoutProps} from "@/layouts/ProjectLayout";

const DesignLayout: React.FC<ProjectLayoutLayoutProps> = props => {
  const {children} = props;
  console.log('22', children)
  return (
    <>
      <div key="320400F6-E186-4B63-9E06-08446B57EBF5" className={style.B57EBF5}><ZeroCodeGridLayout layout={B57EBF5}>
        <div key="49C5719A-3ADC-46EE-8833-6A6967C7DA93" className={style.A6967C7DA93}><ZeroCodeGridLayout
          layout={A6967C7DA93}>
          <div key="90E41754-BBAA-47E2-AF4E-6957CE988120" className={style.CE988120}><ZeroCodeGridLayout
            layout={CE988120}>
            <div key="EA078916-1E80-4074-BD6B-D18D5814A15E" className={style.D18D5814A15E}><ZeroCodeGridLayout
              layout={D18D5814A15E}>
              <div key="E6A4AE13-E0FA-4C41-9B3A-1122BEA64466" className={style.BEA64466}><ZeroCodeGridLayout
                layout={BEA64466}>
                <div key="493C8BFC-F92C-4A26-86AC-A24D52A80940">
                  <div className={style.A24D52A80940}>数据表/视图/数据字典</div>
                </div>
                <div key="D0DABA2F-4AE1-4E21-8C15-9774A4995031"><Image preview={false} src={"/erd/Icon/Search.svg"}/>
                </div>
              </ZeroCodeGridLayout></div>
            </ZeroCodeGridLayout></div>
            <div key="205D5B43-504E-469D-8401-54F708241C15" className={style.F708241C15}><ZeroCodeGridLayout
              layout={F708241C15}>
              <div key="50373AA5-EEDF-47BF-BDFB-F40A76AEBFE7">
                <div className={style.F40A76AEBFE7}></div>
              </div>
              <div key="672C7662-A7AB-4B5D-B860-9F0D35F3BEDC">
                <div className={style.F0D35F3BEDC}></div>
              </div>
              <div key="3F9810BA-8F71-43F7-8DB6-D9CE1EC343A3">
                <div className={style.D9CE1EC343A3} style={{background: "url('/erd/重做.png')"}}></div>
              </div>
              <div key="101DB882-9625-4DA5-8BD3-F7D9721B2CCB">
                <div className={style.F7D9721B2CCB} style={{background: "url('/erd/新建表格.png')"}}></div>
              </div>
              <div key="35B3D26A-5BDB-4204-B138-9F6913D0A013">
                <div className={style.F6913D0A013} style={{background: "url('/erd/分组.png')"}}></div>
              </div>
              <div key="26C1F8E4-3128-432C-8A9D-0543544CC126">
                <div className={style.CC126} style={{background: "url('/erd/矩形.png')"}}></div>
              </div>
              <div key="7CD2F92F-D35B-452B-8B2E-E652D6BDF884">
                <div className={style.E652D6BDF884} style={{background: "url('/erd/圆角矩形.png')"}}></div>
              </div>
              <div key="B0E4B90D-7038-4C4D-A329-40066864EDE5">
                <div className={style.EDE5} style={{background: "url('/erd/字体颜色.png')"}}></div>
              </div>
              <div key="AEED8C15-B025-4F40-9CC1-49D677F90A09">
                <div className={style.D677F90A09} style={{background: "url('/erd/颜色填充.png')"}}></div>
              </div>
              <div key="28EFC6D7-8232-4670-ACA1-8582FE70031C" className={style.FE70031C}><ZeroCodeGridLayout
                layout={FE70031C}>
                <div key="D85ABE50-F7A8-44F0-AF23-9A4A2FC80847" className={style.A4A2FC80847}><ZeroCodeGridLayout
                  layout={A4A2FC80847}>
                  <div key="C4E03D48-9ADB-4A5C-BFAC-D06DE886234F">
                    <div className={style.D06DE886234F}>100%</div>
                  </div>
                  <div key="88752440-9D70-4966-A2C0-FE0FBB20AAA9"><Image preview={false} src={"/erd/减.svg"}/></div>
                  <div key="470F0F27-27CA-4D5F-A177-02FAFB792FFE"><Image preview={false} src={"/erd/加.svg"}/></div>
                  <div key="7CB96ED9-4EDA-4283-9814-6F206AE50B5B" className={style.F206AE50B5B}></div>
                  <div key="080B120F-50F5-4AAE-8F93-B99424D5E08A" className={style.B99424D5E08A}></div>
                </ZeroCodeGridLayout></div>
              </ZeroCodeGridLayout></div>
              <div key="07BC995F-0DB0-45AD-8E34-74EE4188F36C"><Image preview={false} src={"/erd/导入.svg"}/></div>
              <div key="407B7B27-0413-4E1C-9887-7FF616572796"><Image preview={false} src={"/erd/导出.svg"}/></div>
              <div key="DFF903E9-9441-4C73-8139-1A9A252EE6FF"><Image preview={false} src={"/erd/设置.svg"}/></div>
              <div key="A70BA4BD-C125-4586-9DBF-8277F535F344"><Image preview={false} src={"/erd/数据库.svg"}/></div>
              <div key="841A421A-BDBE-4F5E-80CD-C253539B816D">
                <div className={style.C253539B816D}>保存</div>
              </div>
              <div key="11A346AB-C54A-44F6-825C-FA572431827C">
                <div className={style.FA572431827C}>撤销</div>
              </div>
              <div key="99C7603F-7516-4382-A5DF-6FD9E714153B">
                <div className={style.FD9E714153B}>重做</div>
              </div>
              <div key="B840AA9C-346D-48AD-9F08-45258D25CA72">
                <div className={style.D25CA72}>新建空表</div>
              </div>
              <div key="D3456748-7466-463C-8EF8-6683C4F9C5F5">
                <div className={style.C4F9C5F5}>分组</div>
              </div>
              <div key="7F77B6D3-E322-4D89-8C30-A29A2B87CA0F">
                <div className={style.A29A2B87CA0F}>矩形</div>
              </div>
              <div key="91A54D72-211B-4C4F-B3ED-5B59D5AAE8EA">
                <div className={style.B59D5AAE8EA}>圆角矩形</div>
              </div>
              <div key="E01E418D-9693-4FD1-9303-C1D5DCCDA031">
                <div className={style.C1D5DCCDA031}>字体颜色</div>
              </div>
              <div key="4E7054D4-4696-4D20-90B6-14087924EF58">
                <div className={style.EF58}>颜色填充</div>
              </div>
              <div key="0657018A-3822-4BB8-AF35-266A3DBE13C3">
                <div className={style.A3DBE13C3}>缩放比例</div>
              </div>
              <div key="A84540EC-ECB6-46FE-820C-048777566C44">
                <div className={style.C44}>导入</div>
              </div>
              <div key="780E1477-FDB7-48D5-AF57-FB387EFE77B5">
                <div className={style.FB387EFE77B5}>导出</div>
              </div>
              <div key="30EB7ADE-18D2-4801-9336-E979E483524D">
                <div className={style.E979E483524D}>设置</div>
              </div>
              <div key="C7B0AFED-8023-4229-9281-798C7EE35B40">
                <div className={style.C7EE35B40}>数据库</div>
              </div>
            </ZeroCodeGridLayout></div>
            <div key="4CD45D18-A896-454A-AB66-E4FCEF3ED290" className={style.E4FCEF3ED290}></div>
            <div key="E65F85F9-8697-4254-83CF-8A85BEB82D45" className={style.A85BEB82D45}></div>
            <div key="4B8DDC7C-C9BA-4847-9521-D983650C74CF" className={style.D983650C74CF}></div>
            <div key="DD065A58-876B-4971-A96D-6F3B2CC04354" className={style.F3B2CC04354}></div>

          </ZeroCodeGridLayout></div>
        </ZeroCodeGridLayout></div>
        <div key="BCF1264B-6BF9-4B78-BB85-C41115D309A1" className={style.C41115D309A1}><ZeroCodeGridLayout
          layout={C41115D309A1}>
          <div key="FBA0EEF1-1EA1-45C3-BD32-641FE04ED336" className={style.FE04ED336}><ZeroCodeGridLayout
            layout={FE04ED336}>
            <div key="E26E0689-8497-4352-AD20-C6EAD92D5954" className={style.C6EAD92D5954}><ZeroCodeGridLayout
              layout={C6EAD92D5954}>
              <div key="80E071AC-9C50-4110-A7F7-0DA8431CDF13" className={style.DA8431CDF13}><ZeroCodeGridLayout
                layout={DA8431CDF13}>
                <div key="A21E6184-E2E0-4709-99F7-20CA9C821045">
                  <div className={style.CA9C821045}>模型</div>
                </div>
                <div key="9B9FFC2B-39B4-4301-A50E-C737B326D8AB"><Image preview={false} src={"/erd/模型.svg"}/></div>
              </ZeroCodeGridLayout></div>
              <div key="FCEC9F42-FC37-4537-B6B5-1320EA9A7DC2" className={style.EA9A7DC2}><ZeroCodeGridLayout
                layout={EA9A7DC2}>
                <div key="4B2B6500-C41B-4591-A58F-D322D3D206FD">
                  <div className={style.D322D3D206FD}>数据域</div>
                </div>
                <div key="5B4EFB26-AEED-4584-B915-0F2C9A08B3D3"><Image preview={false} src={"/erd/数据域.svg"}/></div>
              </ZeroCodeGridLayout></div>
              <div key="E53DF044-9FEE-402C-A575-981264C1CD72" className={style.C1CD72}></div>
            </ZeroCodeGridLayout></div>
          </ZeroCodeGridLayout></div>
        </ZeroCodeGridLayout></div>
        <div key="D4C55ED6-C3CF-4DC6-ABF1-6EA7A2573706" className={style.EA7A2573706}><ZeroCodeGridLayout
          layout={EA7A2573706}>
          <div key="26CAA066-90EF-4ED7-B1EF-A0ECB66FF371" className={style.A0ECB66FF371}><ZeroCodeGridLayout
            layout={A0ECB66FF371}>
            <div key="61405F19-E942-47A4-8FF8-259CBD26AF00" className={style.CBD26AF00}><ZeroCodeGridLayout
              layout={CBD26AF00}>
              <div key="B1474179-7C11-4E69-97F6-1D4FF99F6283"><Image preview={false} src={"/erd/表.svg"}/></div>
              <div key="5FB298E3-1C86-49F0-866C-2DE7AA8218E5">
                <div className={style.DE7AA8218E5}>测试表</div>
              </div>
              <div key="3530DAD0-0336-4B52-BFEF-06B7D0A3303B"><Image preview={false} src={"/erd/关 闭备份.svg"}/></div>
            </ZeroCodeGridLayout></div>
          </ZeroCodeGridLayout></div>
          <div key="B529F5BC-DBAB-45CD-B209-70DA20041567" className={style.DA20041567}><ZeroCodeGridLayout
            layout={DA20041567}>
            <div key="E0E8979C-437F-4AE6-82FF-3F51F8E0D69B" className={style.F51F8E0D69B}><ZeroCodeGridLayout
              layout={F51F8E0D69B}>
              <div key="B1474179-7C11-4E69-97F6-1D4FF99F6283"><Image preview={false} src={"/erd/表.svg"}/></div>
              <div key="EDAC43D0-90BA-40F6-B2EC-229EB039B956">
                <div className={style.EB039B956}>测试表</div>
              </div>
              <div key="270C0A43-D88D-4B64-AF01-676143560738"><Image preview={false} src={"/erd/关 闭备份 2.svg"}/></div>
            </ZeroCodeGridLayout></div>
          </ZeroCodeGridLayout></div>
          <div key="1F045142-5AA7-4F11-9360-A5EE507790CD" className={style.A5EE507790CD}><ZeroCodeGridLayout
            layout={A5EE507790CD}>
            <div key="B1474179-7C11-4E69-97F6-1D4FF99F6283"><Image preview={false} src={"/erd/表.svg"}/></div>
            <div key="E5E92ADA-A7AC-431A-BFA8-BA1443F2F5AE">
              <div className={style.BA1443F2F5AE}>测试表</div>
            </div>
            <div key="92CF9728-F8F8-4BBD-835F-E625CDABA460"><Image preview={false} src={"/erd/关 闭.svg"}/></div>
          </ZeroCodeGridLayout></div>
          <div key="13989823-F3D8-4F4E-BE7B-F5F97B911538" className={style.F5F97B911538}><ZeroCodeGridLayout
            layout={F5F97B911538}>
            <div key={"B82A6BE6-8BCD-4026-B11E-D435D3DE3111"}>{children}</div>
            <div key="F7F7FEB7-138A-414B-84B9-87B9B052826F" className={style.B9B052826F}><ZeroCodeGridLayout
              layout={B9B052826F}>
              <div key="6D9A97A5-2F7A-400D-B100-FB695426DAA1" className={style.FB695426DAA1}><ZeroCodeGridLayout
                layout={FB695426DAA1}>
                <div key="458536AC-F9D7-4A9B-B376-0B4A8891148F" className={style.B4A8891148F}><ZeroCodeGridLayout
                  layout={B4A8891148F}>
                  <div key="87BE7373-EC1B-4168-846B-3B326C500132" className={style.B326C500132}></div>
                </ZeroCodeGridLayout></div>
              </ZeroCodeGridLayout></div>
              <div key="FB27B04F-F950-40CD-80FC-D93296488FFE">
                <div className={style.D93296488FFE}>日间</div>
              </div>
            </ZeroCodeGridLayout></div>
          </ZeroCodeGridLayout></div>
        </ZeroCodeGridLayout></div>
      </ZeroCodeGridLayout></div>
    </>
  );
}
export default DesignLayout
