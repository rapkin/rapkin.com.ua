import PropTypes from "prop-types";
import React from "react";
import hlSyntax from "./utils/syntax-hl";
import Icon from "./utils/icon";
import getImagePath from "./utils/get-image-path";

const yandexVerification = "39324391851d1a5d";
const googleVerification = "pnATuZP_aTcMjckmXnh2j6oO8Mk9YXUA7GfE7UO4QXk";
const author = "Mikola Parfenyuck";
const email = "mikola.parfenyuck@gmail.com";
const githubUser = "rapkin";
const siteName = "@rapkin | Software developer";
const bunny = getImagePath("/assets/img/bunny.png", true)

const articleMeta = ({ image, title, date }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: author,
    headline: title,
    datePublished: date,
    publisher: {
      "@type": "Organization",
      name: "rapkin",
      url: "https://rapkin.com.ua",
      logo: {
        "@type": "ImageObject",
        url: bunny
      }
    },
    image: image,
    name: title
  };
  return JSON.stringify(data);
};

const Page = ({
  title,
  description,
  stylesheet,
  image,
  date,
  main,
  _relativeURL,
  _ID
}) => {
  image = getImagePath(image, true) || bunny;

  return (
    <html lang="en">
      <head>
        {/* Kept in sync with src/dark-mode.js: same storage key and class name */}
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            var theme = null;
            try { theme = localStorage.getItem('theme'); } catch (e) {}
            if (!theme) {
              theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            if (theme === 'dark') {
              document.documentElement.classList.add('dark-mode');
            }
          })();
        `}} />
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="yandex-verification" content={yandexVerification} />
        <meta name="google-site-verification" content={googleVerification} />

        <link rel="stylesheet" href="/assets/css/site.css" />
        {stylesheet && (
          <link
            rel="stylesheet"
            href={_relativeURL(`/assets/css/${stylesheet}.css`, _ID)}
          />
        )}

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={siteName} />
        <meta itemProp="og:title" content={title} />
        <meta itemProp="name" content={title} />

        <meta name="author" content={author} />
        <meta property="article:author" content={author} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta itemProp="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        {image && (
          <>
            <meta itemProp="image" content={image} />
            <meta property="og:image" content={image} />
            <meta name="twitter:image" content={image} />
          </>
        )}

        <meta name="google" content="nositelinkssearchbox" />
        {date && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: articleMeta({ title, image, date })
            }}
          ></script>
        )}

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
        {/* Literata 700 is the only webfont face in use (headings) */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/fonts/literata-v13-cyrillic_latin-700.woff2"
          crossOrigin="true"
        ></link>
      </head>
      <body>
        {/* Lives outside #swup so it survives page transitions; hero-art.js
            shows it only on pages containing a .hero-art-here marker. */}
        <div id="hero-art" className="hero-art-bg" aria-hidden="true">
          <canvas id="hero-art-canvas" title="Click for another one"></canvas>
        </div>
        <div className="top">
          <header role="banner">
            <a className="logo" href="/">
              @rapkin
            </a>
            <span className="logo-details">Software developer</span>

            <ul className="menu-wrapper">
              <li>
                <a className="menu-item" href="/resume/">
                  Resume
                </a>
              </li>
              <li>
                <a className="menu-item" href="/about/">
                  About
                </a>
              </li>
              <li>
                <button id="theme-toggle" className="theme-toggle" aria-label="Toggle dark mode">
                  <svg className="sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <svg className="moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </button>
              </li>
            </ul>
          </header>

          <main id="swup">{hlSyntax(main)}</main>
        </div>

        <footer>
          &copy; {author}
          <div className="social-links">
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
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  main: PropTypes.node.isRequired
};

Page.defaultProps = {};

export default Page;
