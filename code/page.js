import PropTypes from "prop-types";
import React from "react";
import hlSyntax from "./utils/syntax-hl";
import Icon from "./utils/icon";
import getImagePath from "./utils/get-image-path";

const yandexVerification = "39324391851d1a5d";
const author = "Mikola Parfenyuck";
const email = "mikola.parfenyuck@gmail.com";
const twitterUser = "i_rapkin";
const githubUser = "rapkin";
const siteName = "@rapkin | Software developer";

const Page = ({ title, description, stylesheet, image, main, _relativeURL, _ID }) => {
  image = getImagePath(image, true)

  return (
    <html lang="en">
      <head>
        <title>{title} - @rapkin</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="yandex-verification" content={yandexVerification} />

        <link rel="stylesheet" href="/assets/css/site.css" />
        {stylesheet && (
          <link
            rel="stylesheet"
            href={_relativeURL(`/assets/css/${stylesheet}.css`, _ID)}
          />
        )}

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={siteName} />
        <meta itemprop="name" content={title} />

        <meta name="author" content={author} />
        <meta property="article:author" content={author} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={"@" + twitterUser} />

        <meta name="description" content={description} />
        <meta itemProp="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        {image && (<>
          <meta itemProp="image" content={image} />
          <meta property="og:image" content={image} />
          <meta name="twitter:image" content={image} />
        </>)}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

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

        <footer>
          &copy; {author}
          <div className="social-links">
            <Icon
              name="twitter"
              title="My twitter"
              link={`https://twitter.com/${twitterUser}`}
            />
            <Icon
              name="github"
              title="My github"
              link={`https://github.com/${githubUser}`}
            />
          </div>
        </footer>

        <script src="/assets/js/bundle.js" />
      </body>
    </html>
  );
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  main: PropTypes.node.isRequired
};

Page.defaultProps = {};

export default Page;
