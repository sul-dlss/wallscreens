import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("slideshow", class extends Controller {
  static targets = ["slides", "slideArea", "slideContainer" ]

  connect() {
    this.index = 0;

    if (window.location.hash && this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.index = this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1));
    }

    this.render();
  }

  // reset the slideshow back to the intro card
  reset() {
    this.setIndex(0);
  }

  // paginate to the next slide, or the end card
  next() {
    this.setIndex(this.index + 1);
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.setIndex(this.index - 1);
  }

  setIndex(index) {
    this.index = Math.max(0, Math.min(index, this.slidesTargets.length));
    this.render();
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.index];
  }

  // make the current item visible
  render() {
    const item = this.getItem(this.index);

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
})
