import React, {useEffect, useState} from "react";
import Chat, {Bubble, Button, Card, CardActions, MessageProps, Modal, toast, useMessages} from '@chatui/core';
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';
import {ProCard} from "@ant-design/pro-components";
import _ from "lodash";
import {POST} from "@/services/crud";
import copy from 'copy-to-clipboard';
import {FloatButton, List, Typography} from "antd";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {uuid} from "@/utils/uuid";

const {Text} = Typography;


const initialMessages = [
  {
    type: 'text',
    content: {text: '主人好，我是智能助理，你的贴心小助手,关注下方公众号获取更多信息~'},
    user: {avatar: '/logo.svg'},
  },
  {
    type: 'image',
    content: {
      picUrl: '/mp.jpg',
    },
    user: {avatar: '/logo.svg'},
  },
];


export type ChatSQLProps = {};
const ChatSQL: React.FC<ChatSQLProps> = (props) => {
  const {modules} = useProjectStore(state => ({
    modules: state.project?.projectJSON?.modules || [],
  }), shallow);
// 消息列表
  const {messages, appendMsg, setTyping} = useMessages(initialMessages);

  const [mode, setMode] = useState(0);
  const [chatId, setChatId] = useState('');

  const [selectedTable, setSelectedTable] = useState([]);

  useEffect(
    () => console.log('283参数变化', mode, selectedTable, chatId), [mode, selectedTable.length]
  );
  const askQuickReplies = [
    {
      name: '问答模式',
      isHighlight: true,
    },
  ];
  const aiQuickReplies = [
    {
      name: 'AI模式',
      isHighlight: true,
    },
  ];

// 默认快捷短语，可选
  const defaultQuickReplies = [
    {
      name: '联系人工服务',
      // isNew: true,
      isHighlight: true,
    },
    {
      name: '赞助',
      isHighlight: true,
      // isNew: true,
    },
  ];

  const quickReplies = mode === 0 ? _.concat(aiQuickReplies, defaultQuickReplies) : _.concat(askQuickReplies, defaultQuickReplies);

  const fetchAiAnswer = (command: string) => {
    if (mode === 0) {
      setTimeout(() => {
        appendMsg({
          type: 'text',
          user: {avatar: '/logo.svg'},
          content: {text: '亲，普通模式仅支持普通对话，要体验高级AI功能请先切换到AI模式~'},
        });
      }, 500);
    } else {

      POST('/ncnb/ai/sqlTranslateOrRequest', {
          chatId,
          command,
          "tables": selectedTable,
          "schema": "Mysql",
        }
      ).then((result) => {
        console.log(result)
        if (result && result.code === 200) {
          appendMsg({
            type: 'sql',
            user: {avatar: '/logo.svg'},
            content: {text: result.data},
          });
        } else {
          if (result && result?.msg) {
            appendMsg({
              type: 'text',
              user: {avatar: '/logo.svg'},
              content: {text: result?.msg},
            });
          }
        }
      });
    }
  }

  // 发送回调
  const handleSend = (type: string, val: string) => {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: {text: val},
        position: 'right',
      });

      setTyping(true);

      // 根据消息类型来渲染
      switch (val) {
        case '联系人工服务':
          return setTimeout(() => {
            appendMsg({
              type: 'text',
              user: {avatar: '/logo.svg'},
              content: {text: '亲，关注微信公众号`零代科技`，公众号右下角VIP选项可开启人工服务~'},
            });
            appendMsg({
              type: 'image',
              user: {avatar: '/logo.svg'},
              content: {
                picUrl: '/mp.jpg',
              },
            });
          }, 500);
        case '赞助':
          return setTimeout(() => {
            appendMsg({
              type: 'text',
              user: {avatar: '/logo.svg'},
              content: {text: '亲，扫描下方二维码，赞助即可和作者成为朋友，开启人生另一扇窗户~'},
            });
            appendMsg({
              type: 'image',
              user: {avatar: '/logo.svg'},
              content: {
                picUrl: '/zanshang.jpg',
              },
            });
          }, 500);
        case '问答模式':
          return setTimeout(() => {
            setMode(0);
            appendMsg({
              type: 'text',
              user: {avatar: '/logo.svg'},
              content: {text: '亲，已进入普通问答模式，请简要描述您的问题~'},
            });
          }, 500);
        case 'AI模式':
          return setTimeout(() => {
            if (chatId === '') {
              setChatId(uuid());
            }
            setMode(1);
            appendMsg({
              type: 'text',
              user: {avatar: '/logo.svg'},
              content: {text: '亲，已进入Chat SQL智能AI模式，你可以开始智能对话了~'},
            });
          }, 500);
        default:
          return fetchAiAnswer(val);
      }
    } else {
      return setTimeout(() => {
        appendMsg({
          type: 'text',
          user: {avatar: '/logo.svg'},
          content: {text: '亲，目前仅支持文字聊天~'},
        });
      }, 500);
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  const handleQuickReplyClick = (item: any) => {
    handleSend('text', item.name);
  }

  const renderMessageContent = (msg: MessageProps) => {
    const {type, content} = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text}/>;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt=""/>
          </Bubble>
        )
      case 'sql':
        return (
          <>
            <Bubble content={content.text}/>
            <Card size="xl">
              <CardActions>
                {/*<Button color="primary">执行SQL</Button>*/}
                <Button onClick={() => {
                  copy(content.text);
                  toast.success('已复制');
                }}>复制</Button>
              </CardActions>
            </Card>
          </>);
      default:
        return null;
    }
  }
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClear() {
    setSelectedTable([]);
    setOpen(false);
  }

  const onDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('Text');
    console.log(283, data)
    if (data.startsWith('entity&')) {
      let moduleName = data.split('&')[1];
      let tableName = data.split('&')[2];
      const tmpModule = _.filter(modules, {'name': moduleName});
      console.log(283, tmpModule);
      const table = _.filter(tmpModule[0]?.entities, {'title': tableName});
      console.log(283, table);
      const map = _.map(table[0]?.fields, 'name');
      console.log(283, map);
      const fields = map?.join(",");
      console.log(283, fields);
      const template = '{tableName}({fields})';
      // @ts-ignore
      const aiKey = template.render({
        tableName,
        fields
      });
      console.log(283, aiKey);
      if (_.includes(selectedTable, aiKey)) {
        toast.fail(`表「${tableName}」已经添加！`);
        return;
      }
      if (selectedTable.length >= 5) {
        toast.fail('最多只能同时分析5张表！');
        return;
      }
      // @ts-ignore
      setSelectedTable([...selectedTable, aiKey]);
      toast.success('加入成功');
    } else {
      toast.fail('移动无效,该内容不是数据表，无法参与AI分析！')
    }
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };


  return (
    <ProCard
      style={{
        minHeight: '85vh',
        height: '85vh',
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <FloatButton
        badge={{count: selectedTable?.length}}
        description={'已选'}
        style={{right: '80vh', bottom: '12.3vh'}}
        onClick={handleOpen}
      />
      <Chat
        navbar={{title: 'Chat SQL'}}
        messages={messages}
        renderMessageContent={renderMessageContent}
        quickReplies={quickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}

      />
      <Modal
        active={open}
        title="已选中元数据"
        onClose={handleClose}
        actions={[
          {
            label: '清空',
            color: 'primary',
            onClick: handleClear,
          },
          {
            label: '返回',
            onClick: handleClose,
          },
        ]}
      >
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={selectedTable}
          renderItem={(item, index) => (
            <List.Item
              actions={[<a key={"delete" + index} onClick={() => {
                let tmp = [...selectedTable];
                _.pull(tmp, item);
                console.log(283, tmp);
                setSelectedTable(tmp);
              }}>删除</a>]}
            >
              <Text
                style={{width: 200}}
                ellipsis
              >
                {item}
              </Text>
            </List.Item>
          )}
        />
      </Modal>
    </ProCard>
  );
};

export default ChatSQL
