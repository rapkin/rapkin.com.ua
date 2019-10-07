import React, { Fragment } from "react";
import _ from "lodash";
import fs from "fs";
import path from "path";

const byName = {};

const getText = name => {
  if (byName[name]) return byName[name];
  return fs.readFileSync(path.join(__dirname, `../icons/${name}.svg`), "utf-8");
};

export default ({ name, link, title }) => {
  const text = getText(name);
  return (
    <a
      className={`icon icon-${name}`}
      rel="noopener"
      target="_blank"
      title={title}
      href={link}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
