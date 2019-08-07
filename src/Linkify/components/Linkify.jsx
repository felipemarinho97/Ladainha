import React from "react";

import defaultComponentDecorator from "../decorators/defaultComponentDecorator";
import defaultHrefDecorator from "../decorators/defaultHrefDecorator";
import defaultMatchDecorator from "../decorators/defaultMatchDecorator";
import defaultTextDecorator from "../decorators/defaultTextDecorator";

class Linkify extends React.Component {
  defaultProps = {
    componentDecorator: defaultComponentDecorator,
    hrefDecorator: defaultHrefDecorator,
    matchDecorator: defaultMatchDecorator,
    textDecorator: defaultTextDecorator
  };

  parseString(string) {
    if (string === "") {
      return string;
    }

    const matches = this.props.matchDecorator
      ? this.props.matchDecorator(string)
      : this.defaultProps.matchDecorator(string);

    if (!matches) {
      return this.props.notMatchDecorator(string);
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index));
      }

      const decoratedHref = this.props.hrefDecorator
        ? this.props.hrefDecorator(match.url)
        : this.defaultProps.hrefDecorator(match.url);
      const decoratedText = this.props.textDecorator
        ? this.props.textDecorator(match.text)
        : this.defaultProps.textDecorator(match.text);
      const decoratedComponent = this.props.componentDecorator
        ? this.props.componentDecorator(decoratedHref, decoratedText, i)
        : this.defaultProps.componentDecorator(decoratedHref, decoratedText, i);
      elements.push(decoratedComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      elements.push(string.substring(lastIndex));
    }

    return elements.length === 1 ? elements[0] : elements;
  }

  parse(children, key = 0) {
    if (typeof children === "string") {
      return this.parseString(children);
    } else if (
      React.isValidElement(children) &&
      children.type !== "a" &&
      children.type !== "button"
    ) {
      return React.cloneElement(
        children,
        { key: key },
        this.parse(children.props.children)
      );
    } else if (Array.isArray(children)) {
      return children.map((child, i) => this.parse(child, i));
    }

    return children;
  }

  render() {
    return <React.Fragment>{this.parse(this.props.children)}</React.Fragment>;
  }
}

export default Linkify;
