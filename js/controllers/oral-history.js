import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 }, start: { type: Number, default: 0}, next: { type: String, default: '' } }
  static targets = [ "chapterContainer", "steps", "video", "videoContainer", "attractGridContainer" ]
  static autoplayTimeout = 5 * 60 * 1000; // 5 minutes

  connect() {
    if (window.location.hash && this.stepsTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.stepsTargets.findIndex(x => x.id == window.location.hash.substring(1));
      this.startValue = this.getItem().dataset?.timestamp;
    }

    this.registerPlayerHooks();
  }

  // ensure we clean up the autoplay timer
  disconnect() {
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);
  }

  // enter the auto-play mode where we go back to the intro slide, and then
  // move to the initial slide of other experiences
  autoplay() {
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);

    this.autoplayTimer = window.setTimeout(() => {
      if (this.indexValue == 0) return this.nextValue && (window.location = this.nextValue);
      if (this.ended) return this.indexValue = 0;
    }, this.constructor.autoplayTimeout);
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

    this.videoTarget.addEventListener('ended', () => this.end());
  }

  // start playing the video from the first chapter
  start() {
    this.indexValue = 1;
    gtag('event', 'start-video');
    this.videoTarget.play();
  }

  // pause the video
  pause() {
    this.videoTarget.pause();
  }

  // resume playing the video
  unpause() {
    if (this.ended) return;

    this.videoTarget.play();
  }

  // when the video finishes playing, advance to the end slide
  end() {
    this.indexValue = this.stepsTargets.length - 1;
  }

  // check if we're on the final slide. this is necessary because occasionally
  // this.videoTarget.ended may be false even though the experience is over,
  // possibly because the video is still buffering
  get ended() {
    return this.indexValue == this.stepsTargets.length - 1;
  }

  // (re)set a timer for entering the autoplay after an idle timeout
  resetAutoplayTimer() {
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);

    if (this.indexValue == 0 && !this.nextValue) return;

    this.autoplayTimer = window.setTimeout(() => this.autoplay(), this.constructor.autoplayTimeout);
  }

  // navigate to the next chapter, advancing the video as needed
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.stepsTargets.length - 1);

    gtag('event', 'next', { index: this.indexValue });

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

    gtag('event', 'previous', { index: this.indexValue });

    if (this.getItem().dataset?.timestamp) {
      this.videoTarget.currentTime = this.getItem().dataset?.timestamp;
    } else {
      this.videoTarget.pause();
      this.videoTarget.currentTime = 0;
    }
  }

  showVideoContainer() {
    this.videoContainerTarget.classList.remove('d-none');
    this.attractGridContainerTarget.classList.add('d-none');
  }

  showAttractGridContainer() {
    this.attractGridContainerTarget.classList.remove('d-none');
    this.videoContainerTarget.classList.add('d-none');
  }

  // get the current chapter / step
  getItem() {
    return this.stepsTargets[this.indexValue];
  }

  // update the HTML to match the current chapter/step state
  indexValueChanged() {
    const item = this.getItem();

    if (item.id) history.replaceState({}, '', '#' + item.id);

    // reset the autoplay timer
    this.resetAutoplayTimer();

    // check if we're on the initial or final step.
    // in either case show the atrract grid container
    // and hide the video container. otherwise,
    // ensure the video container is visible
    if (this.indexValue == 0 || this.ended ) {
      this.showAttractGridContainer();
    } else {
      this.showVideoContainer();
    }

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
