import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Home = ({ _pages, _body }) => (
  <Fragment>
    {_body}
    <pre>{JSON.stringify(_pages, null, 2)}</pre>
    <div>
      {Object.values(_pages).map(({ title, _url }) => (
        <div>
          <a href={_url}>{title}</a>
        </div>
      ))}
    </div>
  </Fragment>
);
Home.propTypes = {
  _body: PropTypes.node.isRequired
};

Home.defaultProps = {};
export default Home;
