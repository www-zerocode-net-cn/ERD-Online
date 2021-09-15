import React from "react";
import {Breadcrumb} from "@blueprintjs/core";

import {Breadcrumbs, IBreadcrumbProps, Icon} from "@blueprintjs/core";

const BREADCRUMBS: IBreadcrumbProps[] = [
  { text: "Users"},
  { text: "Janet"},
  {text: "image.jpg"},
];

export class BreadcrumbsExample extends React.Component {
  public render() {
    return (
      <Breadcrumbs
        currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
        breadcrumbRenderer={this.breadcrumbRenderer}
        items={BREADCRUMBS}
      />
    );
  }

  private breadcrumbRenderer = ({text, ...restProps}: IBreadcrumbProps) => {
    // customize rendering of last breadcrumb
    return <Breadcrumb {...restProps}>{text} <Icon icon="cross"/></Breadcrumb>;
  };

  private renderCurrentBreadcrumb = ({text, ...restProps}: IBreadcrumbProps) => {
    // customize rendering of last breadcrumb
    return <Breadcrumb {...restProps}>{text} <Icon icon="cross"/></Breadcrumb>;
  };
}
