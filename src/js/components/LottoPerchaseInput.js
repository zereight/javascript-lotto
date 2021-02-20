import { LOTTO_PRICE } from "../utils/constants.js";
import { $ } from "../utils/dom.js";
import Component from "../utils/Component.js";

export default class LottoPerchaseInput extends Component {
  template() {
    return `<label class="mb-2 d-inline-block"
        >구입할 금액을 입력해주세요.
      </label>
      <div class="d-flex">
        <input
          id="lotto-perchase-input"
          type="number"
          class="w-100 mr-2 pl-2"
          placeholder="구입 금액"
          />
        <button id="lotto-perchase-btn" type="button" class="btn btn-cyan" disabled>확인</button>
      </div>`;
  }

  setup() {
    this.purchaseInputValue = "";
  }

  mounted() {
    this.$lottoPerchaseInput = $("#lotto-perchase-input");
    this.$lottoPerchaseButton = $("#lotto-perchase-btn");
  }

  setEvent() {
    this.addEvent({
      eventType: "keyup",
      target: this.$lottoPerchaseInput,
      callback: this.onChangeInput,
      isBinding: true,
    });
    this.addEvent({
      eventType: "keydown",
      target: this.$lottoPerchaseInput,
      callback: this.onKeyDownSubmit,
      isBinding: true,
    });
    this.addEvent({
      eventType: "click",
      target: this.$lottoPerchaseButton,
      callback: this.onClickSubmit,
      isBinding: true,
    });
  }

  setState({ purchaseInputValue }) {
    this.purchaseInputValue = purchaseInputValue ?? this.purchaseInputValue;
  }

  onChangeInput(e) {
    const { target: $inputElement } = e;
    this.setState({ purchaseInputValue: Number($inputElement.value) });
    this.purchaseInputValue >= LOTTO_PRICE
      ? (this.$lottoPerchaseButton.disabled = false)
      : (this.$lottoPerchaseButton.disabled = true);
  }

  onClickSubmit() {
    this.$lottoPerchaseInput.disabled = true;
    this.$lottoPerchaseButton.disabled = true;
    this.$props.mainObserver.notifyObservers({
      purchaseInputValue: this.purchaseInputValue,
    });
  }

  onKeyDownSubmit(e) {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    this.onClickSubmit();
  }

  notify({ restart }) {
    if (restart) {
      this.$lottoPerchaseInput.value = "";
      this.$lottoPerchaseInput.disabled = false;
      this.$lottoPerchaseButton.disabled = false;
    }
  }
}
