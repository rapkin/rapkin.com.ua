import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Post = ({ _body, _ID, _pages }) => (
  <Fragment>
    <h1 className="page-title">{_pages[_ID].title}</h1>
    {_body}
    <p className="thank-you-for-attention 😉">Thank you for attention!</p>
  </Fragment>
);

Post.propTypes = {
  _body: PropTypes.node.isRequired
};

Post.defaultProps = {};

export default Post;
