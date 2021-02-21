import { LOTTO_PRICE } from "../utils/constants.js";
import { $ } from "../utils/dom.js";
import Component from "../utils/Component.js";

export default class LottoPerchaseInput extends Component {
  mainTemplate() {
    return `
    <div class="flex-auto d-flex justify-between pr-1">
      <label class="mb-2 d-inline-block">구입할 금액을 입력해주세요.</label>
      <label class="switch">
            <input type="checkbox" class="lotto-purchase-type-checkbox" checked/>
            <span class="text-base font-normal">자동 구매</span>
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

  plusIconTemplate(width = 100) {
    return `<svg width="${width}" height="${width}">
    <line class="add-icon" x1="0" y1="${Number(
      width / 2
    )}" x2="${width}" y2="${Number(width / 2)}"/>
    <line class="add-icon" x1="${Number(width / 2)}" y1="0" x2="${Number(
      width / 2
    )}" y2="${width}"/>
</svg>`;
  }

  manualInputTemplate() {
    return `<div class="lotto-manual-purchase-input mb-2">
    <input type="number" class="manual-number mx-1 text-center"></input>
    <input type="number" class="manual-number mx-1 text-center"></input>
    <input type="number" class="manual-number mx-1 text-center"></input>
    <input type="number" class="manual-number mx-1 text-center"></input>
    <input type="number" class="manual-number mx-1 text-center"></input>
    <input type="number" class="manual-number mx-1 text-center"></input>
  </div>`;
  }

  manualInputAreaTemplate() {
    return `
    <div class="lotto-manual-purchase-input-container d-flex flex-col justify-between mt-3">
        <div id="manual-lotto-add-button" class="d-flex justify-end">
          <span>로또 추가</span>
          ${this.plusIconTemplate(15)}
        </div>
          ${this.manualInputTemplate()}
        <button
          id="lotto-manual-purchase-btn"
          type="button"
          class="btn btn-cyan"
          disabled
        >
          수동구매
        </button>
    </div>`;
  }

  setup() {
    this.purchaseInputValue = "";
    this.isAuto = true;
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
    this.addEvent({
      eventType: "change",
      target: this.$lottoPurchaseTypeCheckBox,
      callback: this.onChangeCheckbox,
      isBinding: true,
    });
  }

  setState({ purchaseInputValue, isAuto }) {
    this.purchaseInputValue = purchaseInputValue ?? this.purchaseInputValue;
    this.isAuto = isAuto ?? this.isAuto;
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

  onChangeCheckbox() {
    this.setState({ isAuto: this.$lottoPurchaseTypeCheckBox.checked });
  }

  onClickSubmit() {
    this.$lottoPurchaseInput.disabled = true;
    this.$lottoPurchaseButton.disabled = true;
    this.$lottoPurchaseTypeCheckBox.disabled = true;
    if (this.isAuto) {
      this.$props.mainObserver.notifyObservers({
        purchaseInputValue: this.purchaseInputValue,
      });
    } else {
      // render로 빼기
      this.$target.innerHTML += this.manualInputAreaTemplate();
      this.addEvent({
        eventType: "click",
        selector: "#manual-lotto-add-button",
        callback: this.onAddManualLotto,
        isBinding: true,
      });
    }
  }

  onKeyDownSubmit(e) {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    this.onClickSubmit();
  }

  onAddManualLotto() {
    console.log("hi");
    $("#manual-lotto-add-button").insertAdjacentHTML(
      "afterend",
      this.manualInputTemplate()
    );
  }

  notify({ restart }) {
    if (restart) {
      this.$lottoPurchaseInput.value = "";
      this.$lottoPurchaseInput.disabled = false;
      this.$lottoPurchaseButton.disabled = false;
      this.$lottoPurchaseTypeCheckBox.disabled = false;
    }
  }
}
