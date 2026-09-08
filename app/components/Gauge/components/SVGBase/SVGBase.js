import React, { PureComponent } from "react";

class SVGBase extends PureComponent {
  render() {
    const { children, ...props } = this.props;
    return <svg {...props}>{children}</svg>;
  }
}

export default SVGBase;
