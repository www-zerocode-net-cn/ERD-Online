import React, {useEffect} from "react";
import {WidthProvider, Responsive} from 'react-grid-layout';

const GridLayout = WidthProvider(Responsive);

export type ResponsiveGridLayoutProps = {
  children: any;
  layout: any;
};

const ZeroCodeGridLayout: React.FC<ResponsiveGridLayoutProps> = (props) => {
  const {
    children,
    layout
  } = props;

  useEffect(() => {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1)
  });
  return (
    <GridLayout layouts={{lg: layout, md: layout, sm: layout, xs: layout, xxs: layout}}
                className={"react-grid-layout"}
                rowHeight={180}
                cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
                margin={[0,0]}
                containerPadding={[0,0]}>
      {children}
    </GridLayout>
  );
};

export default ZeroCodeGridLayout;
