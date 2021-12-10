import { Controller } from '/js/stimulus.js';

export default class extends Controller {
  static values = { next: { type: String, default: '' } };

  static timeout = 5 * 60 * 1000; // 5 minutes

  // reset timer on load
  connect() {
    this.resetTimer();
  }

  // clear timer on unload
  disconnect() {
    if (this.timer) window.clearTimeout(this.timer);
  }

  // reset the timer when the user interacts with the page
  resetTimer() {
    if (this.timer) window.clearTimeout(this.timer);

    this.timer = window.setTimeout(() => {
      // go to the configured next page
      window.location.href = this.nextValue;
    }, this.constructor.timeout);
  }
}
