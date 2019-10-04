import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Home = ({ _pages, _body }) => (
  <Fragment>
    {_body}
    <div>
      {Object.values(_pages)
        .filter(item => item.layout === "layouts/post")
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(({ title, date, description, _url }) => (
          <div className="post-item" key={_url}>
            <a href={_url} className="post-title">
              {title}
            </a>
            <span className="post-date">{new Date(date).toDateString()}</span>
            <p className="post-description">{description}</p>
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
