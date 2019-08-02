import React from "react";
import ReactTinyLink from "react-tiny-link";

const Preview = ({ url, key }) => (
  <ReactTinyLink
    className="link-preview"
    cardSize="large"
    showGraphic={true}
    maxLine={1}
    url={url}
    key={key}
  />
);

export default (decoratedHref, decoratedText, key) => {
  return (
    <React.Fragment>
      <a href={decoratedHref} key={key}>
        {decoratedText}
      </a>
      {<Preview key={key} url={decoratedHref} />}
    </React.Fragment>
  );
};
