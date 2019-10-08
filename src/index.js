import Swup from "swup";
import LazyLoad from "vanilla-lazyload";
import SwupSlideTheme from "@swup/slide-theme";
import "./ga";

const ll = new LazyLoad({ elements_selector: ".lazyload" });
const sw = new Swup({
  plugins: [new SwupSlideTheme()]
});

const handleAchor = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });
};

handleAchor();

sw.on("contentReplaced", () => {
  ll.update();
  handleAchor();
  ga("send", "pageview", location.pathname);
});
