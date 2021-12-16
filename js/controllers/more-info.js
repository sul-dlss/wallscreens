import { Controller } from '../stimulus.js';

export default class extends Controller {
  static timeout = 15 * 60 * 1000; // 15 minutes

  static targets = ['modal'];

  disconnect() {
    if (this.autohideCallback) window.clearTimeout(this.autohideCallback);
  }

  show() {
    this.dispatch('show');
    gtag('event', 'more-info:show');
    this.modalTarget.hidden = false;
    this.autohideCallback = window.setTimeout(() => this.hide(), this.constructor.timeout);
  }

  hide() {
    this.dispatch('hide');
    gtag('event', 'more-info:hide');
    this.modalTarget.hidden = true;
    if (this.autohideCallback) window.clearTimeout(this.autohideCallback);
  }
}
