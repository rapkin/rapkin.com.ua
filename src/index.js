import Swup from "swup";
import LazyLoad from "vanilla-lazyload";
import SwupSlideTheme from "@swup/slide-theme";
import "./ga";
import "./dark-mode";
import { initHeroArt } from "./hero-art";

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
initHeroArt();

sw.on("contentReplaced", () => {
  ll.update();
  handleAchor();
  initHeroArt();
  ga("send", "pageview", location.pathname);
});
