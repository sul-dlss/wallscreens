import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static timeout = 15*60*1000; // 15 minutes
  static targets = [ "modal" ]

  connect() {
  }

  disconnect() {
    if (this.autohideCallback) window.clearTimeout(this.autohideCallback);
  }

  show() {
    this.dispatch("show");
    this.modalTarget.classList.remove('d-none');
    this.autohideCallback = window.setTimeout(() => this.hide(), this.constructor.timeout);
  }

  hide() {
    this.dispatch("hide");
    this.modalTarget.classList.add('d-none');
    if (this.autohideCallback) window.clearTimeout(this.autohideCallback);
  }
}
