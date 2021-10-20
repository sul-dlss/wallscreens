import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static targets = [ "modal" ]

  connect() {
  }

  show() {
    this.modalTarget.classList.remove('d-none');
  }

  hide() {
    this.modalTarget.classList.add('d-none');
  }
}
