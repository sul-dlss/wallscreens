import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static targets = [ "modal" ]

  connect() {
  }

  show() {
    this.dispatch("show");
    this.modalTarget.classList.remove('d-none');
  }

  hide() {
    this.dispatch("hide");
    this.modalTarget.classList.add('d-none');
  }
}
