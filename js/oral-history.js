import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("oral-history", class extends Controller {
  static targets = [ "initialScreen", "chapterContainer", "endScreen",  "chapters", "video" ]

  connect() {
    this.index = -1;
  }

  start() {
    this.index = 0;
    this.videoTarget.play();
    this.initialScreenTarget.classList.add('d-none');
    this.chapterContainerTarget.classList.remove('d-none');
    this.endScreenTarget.classList.add('d-none');

    this.showCurrentItem();
  }

  reset() {
    this.index = -1;
    this.videoTarget.pause();
    this.videoTarget.currentTime = 0;
    this.initialScreenTarget.classList.remove('d-none');
    this.chapterContainerTarget.classList.add('d-none');
    this.endScreenTarget.classList.add('d-none');
  }

  end() {
    this.videoTarget.pause();
    this.initialScreenTarget.classList.add('d-none');
    this.chapterContainerTarget.classList.add('d-none');
    this.endScreenTarget.classList.remove('d-none');
  }

  next() {
    if ((this.index + 1) >= this.chaptersTargets.length) {
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
    return this.chaptersTargets[this.index];
  }

  showCurrentItem() {
    const item = this.getItem(this.index);
    this.videoTarget.currentTime = item.dataset.timestamp
    this.videoTarget.play()
  }
})
