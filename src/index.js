import Swup from "swup";
import LazyLoad from "vanilla-lazyload";
import SwupSlideTheme from "@swup/slide-theme";

const ll = new LazyLoad({ elements_selector: ".lazyload" });
const sw = new Swup({
  plugins: [new SwupSlideTheme()]
});

sw.on("contentReplaced", () => {
  ll.update();
  ga("send", "pageview");
});
