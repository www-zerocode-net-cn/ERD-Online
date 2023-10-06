import React from 'react';

import styles from './index.less';

export type EditableLink = {
  title: string;
  href: string;
  id?: string;
};

type EditableLinkGroupProps = {};

const EditableLinkGroup: React.FC<EditableLinkGroupProps> = (props) => {
  return (
    <div className={styles.linkGroup}>
      <a href={"https://www.erdonline.com/"} target={"_blank"}>官网</a>
      <a href={"https://www.erdonline.com/ERD%20Online%E7%99%BD%E7%9A%AE%E4%B9%A6.html"} target={"_blank"}>白皮书</a>
      <a href={"https://doc.erdonline.com/"} target={"_blank"}>文档</a>
      <a href={"https://github.com/orgs/www-zerocode-net-cn/discussions"} target={"_blank"}>社区</a>
      <a href={"https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg4MjkwMTA3NQ==&action=getalbum&album_id=2801247904861765633&scene=173&from_msgid=2247484463&from_itemidx=1&count=3&nolastread=1#wechat_redirect"} target={"_blank"}>公众号</a>
    </div>
  );
};

export default EditableLinkGroup;
