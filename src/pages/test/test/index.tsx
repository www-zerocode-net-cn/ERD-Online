import React from "react";

export type indexProps = {};
const Test: React.FC<indexProps> = (props) => {
  return (<>123</>);
};

export default React.memo(Test)
