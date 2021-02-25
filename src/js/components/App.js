import LottoPurchaseInput from './LottoPurchaseInput.js';
import LottoDisplay from './LottoDisplay.js';
import Component from '../core/Component.js';
import Store from '../redux/store.js';
import WinningNumbersInput from './WinningNumbersInput.js';
import RewardModalDisplay from './RewardModalDisplay.js';
import { $ } from '../utils/dom.js';

// export const lottoManager = new LottoManager([]);
export const store = new Store();
export default class App extends Component {
  execute() {
    this.mountComponent();
  }

  mountComponent() {
    this.lottoPurchaseInput = new LottoPurchaseInput(
      $('#lotto-purchase-input-container'),
    );
    this.lottoDisplay = new LottoDisplay($('#lotto-display-container'));
    this.winningNumbersInput = new WinningNumbersInput(
      $('#lotto-winning-number-input-container'),
    );
    this.modalDisplay = new RewardModalDisplay($('.modal'));
  }

  mainTemplate() {
    return `
    <div class="d-flex justify-center mt-5">
      <div class="w-100">
        <h1 class="text-center">🎱 행운의 로또</h1>
        <form id="lotto-purchase-input-container" class="mt-5 d-flex flex-col">
        </form>
        <section id="lotto-display-container" class="mt-9 d-none">
        </section>
        <form id="lotto-winning-number-input-container" class="mt-9 d-none">
        </form>
      </div>
    </div>
    <div class="modal"></div>
    `;
  }
}
