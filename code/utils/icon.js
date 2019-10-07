import React, { Fragment } from "react";
import _ from "lodash";
import fs from "fs";
import path from "path";

const byName = {};

const getText = name => {
  if (byName[name]) return byName[name];
  return fs.readFileSync(path.join(__dirname, `../icons/${name}.svg`), "utf-8");
};

export default ({ name, link }) => {
  const text = getText(name);
  return (
    <a
      className={`icon icon-${name}`}
      href={link}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
