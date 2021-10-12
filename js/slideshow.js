import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("slideshow", class extends Controller {
  static targets = [ "data", "slides", "initialScreen", "slideArea", "slideContainer", "endScreen" ]

  connect() {
    this.index = -1;
  }

  // start the slideshow
  start() {
    this.index = 0;
    this.initialScreenTarget.classList.add('d-none');
    this.slideContainerTarget.classList.remove('d-none');
    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    this.endScreenTarget.classList.add('d-none');

    this.showCurrentItem();
  }

  // reset the slideshow back to the intro card
  reset() {
    this.index = -1;
    this.initialScreenTarget.classList.remove('d-none');
    this.slideContainerTarget.classList.add('d-none');
    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    this.endScreenTarget.classList.add('d-none');
  }

  // conclude the slideshow the end card
  end() {
    this.initialScreenTarget.classList.add('d-none');
    this.slideContainerTarget.classList.add('d-none');
    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    this.endScreenTarget.classList.remove('d-none');
  }

  // paginate to the next slide, or the end card
  next() {
    if ((this.index + 1) >= this.slidesTargets.length) {
      return this.end();
    }

    this.index++;
    this.showCurrentItem();
  }

  // paginate to the previous slide, or the intro card
  previous() {
    if (this.index <= 0) {
      return this.reset();
    }

    this.index--;
    this.showCurrentItem();
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.index];
  }

  // make the current item visible
  showCurrentItem() {
    const item = this.getItem(this.index);
    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    this.slideAreaTarget.style['background-image'] = "url(" + item.dataset.imageUrl + ")";
    item.classList.remove('d-none');
  }
})
