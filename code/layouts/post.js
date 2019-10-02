import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Post = ({ _body }) => <Fragment>{_body}</Fragment>;

Post.propTypes = {
  _body: PropTypes.node.isRequired
};

Post.defaultProps = {};

export default Post;
