import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("oral-history", class extends Controller {
  static targets = [ "initialScreen", "chapterContainer", "endScreen",  "chapters", "video" ]

  connect() {
    this.setIndex(-1);

    const timestamps = this.chaptersTargets.map((item, index, arr) => ({'start': parseInt(item.dataset.timestamp,10), 'end': parseInt(arr[index+1]?.dataset?.timestamp, 10) || Infinity
    }))

    console.log(timestamps)
    this.videoTarget.ontimeupdate = (event) => {
      const index = timestamps.findIndex((timestamp)=>(timestamp.start < event.target.currentTime && timestamp.end > event.target.currentTime));
      console.log(index);
      this.setIndex(index);
      // console.log(event.target.currentTime);
    };
  }

  start() {
    this.setIndex(0);
    this.videoTarget.play();
    this.initialScreenTarget.classList.add('d-none');
    this.chapterContainerTarget.classList.remove('d-none');
    this.endScreenTarget.classList.add('d-none');

    this.showCurrentItem();
  }

  reset() {
    this.setIndex(-1);
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

    this.setIndex(this.index+1);
    this.showCurrentItem();
  }

  previous() {
    if (this.index <= 0) {
      return this.reset();
    }

    this.setIndex(this.index-1);
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

  setIndex(index) {
    this.index = index;
    this.chaptersTargets.forEach(x => x.classList.remove('current'));
    if (this.index >= 0) {
      this.getItem(this.index).classList.add('current');
    }
  }
})
