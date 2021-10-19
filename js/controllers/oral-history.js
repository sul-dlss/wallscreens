import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 }, start: { type: Number, default: 0} }
  static targets = [ "chapterContainer", "steps", "video" ]

  connect() {
    if (window.location.hash && this.stepsTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.stepsTargets.findIndex(x => x.id == window.location.hash.substring(1));
      this.startValue = this.getItem().dataset?.timestamp;
    }

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

    this.videoTarget.addEventListener('loadedmetadata', () => { if (this.startValue > 0) this.videoTarget.currentTime = this.startValue }, false)

    // if the video finishes playing, advance to the end slide
    this.videoTarget.addEventListener('ended', () => this.next())
  }

  // start playing the video from the first chapter
  start() {
    this.indexValue = 1;
    this.videoTarget.play();
  }

  // pause the video
  pause() {
    this.videoTarget.pause();
  }

  // resume playing the video from wherever it was paused
  unpause() {
    this.videoTarget.play();
  }

  // navigate to the next chapter, advancing the video as needed
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.stepsTargets.length);

    if (this.indexValue == this.stepsTargets.length) return

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
    if (!item) return;

    if (item.id) history.replaceState({}, '', '#' + item.id);

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
