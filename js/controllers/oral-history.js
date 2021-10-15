import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 } }
  static targets = [ "chapterContainer", "steps", "video" ]

  connect() {
    this.registerPlayerHooks();
  }

  // listen to ontimeupdate to update the current index as needed
  registerPlayerHooks() {
    const timestamps = this.stepsTargets.map((item, index, arr) => ({'start': parseInt(item.dataset.timestamp,10), 'end': parseInt(arr[index+1]?.dataset?.timestamp, 10) || Infinity
    }))

    this.videoTarget.ontimeupdate = (event) => {
      if (this.videoTarget.paused) return

      const index = timestamps.findIndex((timestamp)=>(Number.isFinite(timestamp.start) && timestamp.start < event.target.currentTime && timestamp.end > event.target.currentTime));
      if (index >= 0 && this.indexValue != index) this.indexValue = index;
    };
  }

  // start playing the video from the first chapter
  start() {
    this.indexValue = 1;
    this.videoTarget.play();
  }

  // navigate to the next chapter, advancing the video as needed
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.stepsTargets.length);

    if (this.getItem().dataset?.timestamp) {
      this.videoTarget.currentTime = this.getItem().dataset?.timestamp;
    } else {
      this.videoTarget.pause();
      this.videoTarget.currentTime = this.videoTarget.duration;
    }
  }

  // navigate to the previous chapter, rewinding the video as needed
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);

    if (this.getItem().dataset?.timestamp) {
      this.videoTarget.currentTime = this.getItem().dataset?.timestamp;
    } else {
      this.videoTarget.pause();
      this.videoTarget.currentTime = 0;
    }
  }

  // get the current chapter / step
  getItem() {
    return this.stepsTargets[this.indexValue];
  }

  // update the HTML to match the current chapter/step state
  indexValueChanged() {
    const item = this.getItem();

    // hide/dehighlight all the other steps/chapters
    this.stepsTargets.forEach(x => {
      if (x == item) return;

      if (x.classList.contains('chapter'))  {
        x.classList.remove('current')
      } else {
        x.classList.add('d-none');
      }
    })

    // reveal/highlight the current step/chapter
    if (item.classList.contains('chapter')){
      item.classList.add('current')
    } else {
      item.classList.remove('d-none');
    }

    // reveal the containers (e.g. themes) in this item's hierarchy
    this.chapterContainerTargets.forEach(container => {
      if (container.contains(item)) {
        container.classList.remove('d-none');
      } else {
        container.classList.add('d-none');
      }
    });
  }
}
