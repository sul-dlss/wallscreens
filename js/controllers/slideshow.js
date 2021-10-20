import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 } }
  static targets = ["slides", "slideArea", "slideContainer" ]

  connect() {
    if (window.location.hash && this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1));
    }
  }

  // reset the slideshow back to the intro card
  reset() {
    this.indexValue = 0;
  }

  // paginate to the next slide, or the end card
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.slidesTargets.length - 1);
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.indexValue];
  }

  // make the current item visible
  indexValueChanged() {
    const item = this.getItem();
    if (item.id) history.replaceState({}, '', '#' + item.id);

    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    this.slideAreaTarget.style['background-image'] = "url(" + item.dataset.imageUrl + ")";
    item.classList.remove('d-none');

    this.slideContainerTargets.forEach(container => {
      if (container.contains(item)) {
        container.classList.remove('d-none');
      } else {
        container.classList.add('d-none');
      }
    });
  }
}
