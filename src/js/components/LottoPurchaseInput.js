import { LOTTO_PRICE } from "../utils/constants.js";
import { $ } from "../utils/dom.js";
import Component from "../utils/Component.js";

export default class LottoPerchaseInput extends Component {
  template() {
    return `
    <div class="flex-auto d-flex justify-between pr-1">
      <label class="mb-2 d-inline-block">구입할 금액을 입력해주세요.</label>
      <label class="switch">
            <input type="checkbox" class="lotto-purchase-type-checkbox" />
            <span class="text-base font-normal">수동</span>
          </label>
    </div>
      <div class="d-flex">
        <input
          id="lotto-perchase-input"
          type="number"
          class="w-100 mr-2 pl-2"
          placeholder="구입 금액"
          />
        <button id="lotto-perchase-btn" type="button" class="btn btn-cyan" disabled>확인</button>
      </div>
      
      `;
  }

  setup() {
    this.purchaseInputValue = "";
    this.isAuto = false;
  }

  selectDOM() {
    this.$lottoPurchaseInput = $("#lotto-perchase-input");
    this.$lottoPurchaseButton = $("#lotto-perchase-btn");
    this.$lottoPurchaseTypeCheckBox = $(".lotto-purchase-type-checkbox");
  }

  setEvent() {
    this.addEvent({
      eventType: "keyup",
      target: this.$lottoPurchaseInput,
      callback: this.onChangeInput,
      isBinding: true,
    });
    this.addEvent({
      eventType: "keydown",
      target: this.$lottoPurchaseInput,
      callback: this.onKeyDownSubmit,
      isBinding: true,
    });
    this.addEvent({
      eventType: "click",
      target: this.$lottoPurchaseButton,
      callback: this.onClickSubmit,
      isBinding: true,
    });
  }

  setState({ purchaseInputValue }) {
    this.purchaseInputValue = purchaseInputValue ?? this.purchaseInputValue;
  }

  onChangeInput(e) {
    const { target: $inputElement } = e;
    this.setState({
      purchaseInputValue: Number($inputElement.value),
    });
    this.purchaseInputValue >= LOTTO_PRICE
      ? (this.$lottoPurchaseButton.disabled = false)
      : (this.$lottoPurchaseButton.disabled = true);
  }

  onClickSubmit() {
    this.$lottoPurchaseInput.disabled = true;
    this.$lottoPurchaseButton.disabled = true;
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
      this.$lottoPurchaseInput.value = "";
      this.$lottoPurchaseInput.disabled = false;
      this.$lottoPurchaseButton.disabled = false;
    }
  }
}
