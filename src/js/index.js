import App from "./components/App.js";
import { $ } from "./utils/dom.js";

document.addEventListener("DOMContentLoaded", () => {
  new App($("#app"));
});
