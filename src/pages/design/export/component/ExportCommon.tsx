import {ProList} from '@ant-design/pro-components';
import {Tag} from 'antd';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {FileDisplay, FileLock, FileWord, HtmlFive} from "@icon-park/react";


export default () => {

  const data = [
    {
      key: 'JSON',
      title: '导出ERD',
      subTitle: <Tag color="blue">ERD</Tag>,
      avatar: <FileLock theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
      content: (
        <div style={{marginLeft: '45px'}}>导出一个ERD格式的文件，文本内容已加密，可再次导入ERD系统</div>
      ),
    }, {
      key: 'Html',
      title: '导出HTML',
      subTitle: <Tag color="blue">HTML</Tag>,
      avatar: <HtmlFive theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
      content: (
        <div style={{marginLeft: '45px'}}>导出一个可以在任意浏览器中打开的HTML文件</div>
      ),
    }, {
      key: 'Word',
      title: '导出Word',
      subTitle: <Tag color="blue">Word</Tag>,
      avatar: <FileWord theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
      content: (
        <div style={{marginLeft: '45px'}}>导出一个漂亮的word文件，包含表元数据和关系图</div>
      ),
    }, {
      key: 'Markdown',
      title: '导出Markdown',
      subTitle: <Tag color="blue">Markdown</Tag>,
      avatar: <FileDisplay theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
      content: (
        <div style={{marginLeft: '45px'}}>导出一个Markdown文件，可以在任意Markdown编辑器中预览</div>
      ),
    },
  ];

  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);

  return (

    <ProList<any>
      grid={{gutter: 16, column: 2}}
      onItem={(record: any) => {
        return {
          onClick: () => {
            console.log(record);
            projectDispatch.exportFile(record.key)
          },
        };
      }}
      metas={{
        title: {},
        subTitle: {},
        type: {},
        avatar: {},
        content: {},
      }}
      headerTitle="导出文件"
      tooltip="单击下方区块即可导出"
      dataSource={data}
    />
  );
};
