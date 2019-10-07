var ghpages = require("gh-pages");

ghpages.publish(
  "site",
  {
    branch: "master",
    repo: "https://github.com/rapkin/rapkin.github.io.git"
  },
  function(err) {
    if (err) {
      console.error(err);
    }
    console.log("Done!");
  }
);
