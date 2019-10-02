import PropTypes from "prop-types";
import React from "react";

const googleAnalytics = "UA - 37531241 - 1";
const yandexVerification = "39324391851d1a5d";
const gaScript = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '${googleAnalytics}', 'auto');
ga('send', 'pageview');
`;

const Page = ({
  title,
  description,
  stylesheet,
  main,
  script,
  _relativeURL,
  _ID
}) => (
  <html>
    <head>
      <title>@rapkin - {title}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="yandex-verification" content={yandexVerification} />

      <meta name="description" content={description} />

      <link rel="stylesheet" href={_relativeURL(`/assets/css/site.css`, _ID)} />
      {stylesheet && (
        <link
          rel="stylesheet"
          href={_relativeURL(`/assets/css/${stylesheet}.css`, _ID)}
        />
      )}
    </head>
    <body>
      <div className="top">
        <header role="banner">
          <a href="/">rapkin</a>
        </header>

        <main>{main}</main>
      </div>

      <footer>rapkin | Software developer</footer>

      {script && <script src={_relativeURL(`/assets/js/${script}.js`, _ID)} />}
      <script dangerouslySetInnerHTML={{ __html: gaScript }} />
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
