import { $ } from "./dom.js";

export default class Component {
  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.render();
    this.selectDOM();
    this.setEvent();
  }

  setup() {}
  mounted() {}
  mainTemplate() {
    return "";
  }
  render() {
    this.$target.innerHTML = this.mainTemplate();
    this.mounted();
  }
  setEvent() {}
  setState() {}
  selectDOM() {}
  addEvent({ eventType, selector, selectors, target, callback, isBinding }) {
    if (selector) {
      if (isBinding) {
        $(selector).addEventListener(eventType, callback.bind(this));
      } else $(selector).addEventListener(eventType, callback);
    }
    if (selectors) {
      if (isBinding) {
        $(selectors).forEach((elem) =>
          elem.addEventListener(eventType, callback.bind(this))
        );
      } else elem.addEventListener(eventType, callback);
    }

    // selector가 아니라 DOM 객체를 주는 경우
    if (target) {
      if (target.length > 1) {
        target.forEach((elem) => {
          elem.addEventListener(eventType, callback.bind(this));
        });
      } else {
        target.addEventListener(eventType, callback.bind(this));
      }
    }
  }
}
