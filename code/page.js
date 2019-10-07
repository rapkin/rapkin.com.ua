import PropTypes from "prop-types";
import React from "react";
import hlSyntax from "./utils/syntax-hl";

const yandexVerification = "39324391851d1a5d";

const Page = ({
  title,
  description,
  stylesheet,
  main,
  script,
  _relativeURL,
  _ID
}) => (
  <html lang="en">
    <head>
      <title>{title} - @rapkin</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="yandex-verification" content={yandexVerification} />

      <meta name="description" content={description} />

      <link rel="stylesheet" href="/assets/css/site.css" />
      {stylesheet && (
        <link
          rel="stylesheet"
          href={_relativeURL(`/assets/css/${stylesheet}.css`, _ID)}
        />
      )}

      <link rel="preconnect" href="https://www.google-analytics.com"></link>
      <link rel="preconnect" href="http://fonts.googleapis.com"></link>
    </head>
    <body>
      <div className="top">
        <header role="banner">
          <a className="logo" href="/">
            @rapkin
          </a>
          <span className="logo-details">Software developer</span>

          <ul className="menu-wrapper">
            <li>
              <a className="menu-item" href="/resume">
                Resume
              </a>
            </li>
            <li>
              <a className="menu-item" href="/about">
                About
              </a>
            </li>
          </ul>
        </header>

        <main id="swup">{hlSyntax(main)}</main>
      </div>

      <footer>&copy; Mikola Parfenyuck</footer>

      <script src="/assets/js/bundle.js" />
    </body>
  </html>
);

Page.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  main: PropTypes.node.isRequired
};

Page.defaultProps = {};

export default Page;
