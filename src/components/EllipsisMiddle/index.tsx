import React, {CSSProperties} from 'react';


export const EllipsisMiddle: React.FC<{ prefixCount?: number; suffixCount?: number; children: string; title?: string; style?: CSSProperties }> =
  ({prefixCount = 12, suffixCount = 4, children, title, style}) => {
    console.log(8, 'children', children);

    const length = children.length;
    if (length <= prefixCount) {
      return <span title={title} style={style}>{children}</span>;
    }
    const diff = length - prefixCount;
    //剩余字数少于三个
    if (diff <= 3) {
      return <span title={title} style={style}>{children}</span>;
    }
    //剩余字数比尾数少
    if (diff < suffixCount) {
      suffixCount = diff;
    }
    const start = children.slice(0, prefixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
      <span title={title} style={style}>
        {start}...{suffix}
      </span>
    );
  };

