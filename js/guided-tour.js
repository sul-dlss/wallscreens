import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("guided-tour", class extends Controller {
  static targets = [ "data", "slides", "bio", "caption", "initialScreen", "endScreen" ]

  connect() {
    this.index = -1;
    this.json = JSON.parse(this.dataTarget.innerHTML);
  }

  start() {
    this.index = 0;
    this.initialScreenTarget.classList.add('d-none');
    this.slidesTarget.classList.remove('d-none');
    this.endScreenTarget.classList.add('d-none');

    this.showCurrentItem();
    viewer.viewport.goHome();
  }

  reset() {
    this.index = -1;
    this.intialScreenTarget.classList.remove('d-none');
    this.slidesTarget.classList.add('d-none');
    this.endScreenTarget.classList.add('d-none');
  }

  end() {
    this.initialScreenTarget.classList.add('d-none');
    this.slidesTarget.classList.add('d-none');
    this.endScreenTarget.classList.remove('d-none');
    this.captionTarget.classList.add('d-none');
    viewer.viewport.goHome();
  }

  next() {
    if ((this.index + 1) >= Object.entries(this.json).length) {
      return this.end();
    }

    this.index++;
    this.showCurrentItem();
  }

  previous() {
    if (this.index <= 0) {
      return this.reset();
    }

    this.index--;
    this.showCurrentItem();
  }

  getItem() {
    const [key, value] = Object.entries(this.json)[this.index];

    return value;
  }

  showCurrentItem() {
    const item = this.getItem(this.index);

    if (item.viewport) {
      viewer.viewport.panTo(viewer.viewport.imageToViewportCoordinates(item.viewport.x, item.viewport.y));
      viewer.viewport.zoomTo(item.viewport.zoom);
    }

    if (item.bio) {
      this.bioTarget.classList.remove('d-none');
      const card = document.createElement('div');
      const title = document.createElement('h4');
      title.innerHTML = item.bio.title;
      card.prepend(title);
      this.bioTarget.replaceChildren(card);
    } else {
      this.bioTarget.classList.add('d-none');
    }

    if (item.caption) {
      this.captionTarget.innerHTML = item.caption;
      this.captionTarget.classList.remove('d-none');
    } else {
      this.captionTarget.classList.add('d-none');
    }
  }
})
