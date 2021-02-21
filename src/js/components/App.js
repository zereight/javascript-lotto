import Component from "../utils/Component.js";
import LottoDisplay from "./LottoDisplay.js";
import LottoPurchaseInput from "./LottoPurchaseInput.js";
import ModalDisplay from "./ModalDisplay.js";
import WinningNumbersInput from "./WinningNumbersInput.js";
import { $ } from "../utils/dom.js";
import Observer from "../utils/Observer.js";

export default class App extends Component {
  mainTemplate() {
    return ` <div class="d-flex justify-center mt-5">
      <div class="w-100">
        <h1 class="text-center">🎱 행운의 로또</h1>
        <form id="lotto-perchase-input-container" class="mt-5"></form>
        <section id="lotto-display-container" class="mt-9 hidden"></section>
        <form id="winning-numbers-input" class="mt-9 hidden"></form>
      </div>
    </div>
    <div class="modal"></div>
          `;
  }

  setup() {
    // setInit이 낫지 않을까
    this.lottos = [];
    this.mainObserver = new Observer();
  }

  setObserver() {
    this.mainObserver.registerObserver(this); // App
    this.mainObserver.registerObserver(this.LottoPurchaseInput);
    this.mainObserver.registerObserver(this.LottoDisplay);
    this.mainObserver.registerObserver(this.WinningNumbersInput);
    this.mainObserver.registerObserver(this.ModalDisplay);
  }

  mounted() {
    this.LottoPurchaseInput = new LottoPurchaseInput(
      $("#lotto-perchase-input-container"),
      { mainObserver: this.mainObserver }
    );
    this.LottoDisplay = new LottoDisplay($("#lotto-display-container"), {
      mainObserver: this.mainObserver,
    });
    this.WinningNumbersInput = new WinningNumbersInput(
      $("#winning-numbers-input"),
      { mainObserver: this.mainObserver }
    );
    this.ModalDisplay = new ModalDisplay($(".modal"), {
      mainObserver: this.mainObserver,
    });
    this.setObserver();
  }

  notify({ lottos, restart }) {
    if (lottos) {
      this.setState({ lottos });
    }
    if (restart) {
      this.setState({ lottos: [] });
    }
  }

  setState({ lottos }) {
    this.lottos = lottos ?? this.lottos;
  }
}
