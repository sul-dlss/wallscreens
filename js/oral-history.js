import { Application, Controller } from "/js/stimulus.js"
window.Stimulus = Application.start()

Stimulus.register("oral-history", class extends Controller {
  static targets = [ "chapterContainer", "steps", "video" ]

  connect() {
    this.index = 0;

    const timestamps = this.stepsTargets.map((item, index, arr) => ({'start': parseInt(item.dataset.timestamp,10), 'end': parseInt(arr[index+1]?.dataset?.timestamp, 10) || Infinity
    }))

    this.videoTarget.ontimeupdate = (event) => {
      if (this.videoTarget.paused) return

      const index = timestamps.findIndex((timestamp)=>(Number.isFinite(timestamp.start) && timestamp.start < event.target.currentTime && timestamp.end > event.target.currentTime));
      this.setIndex(index);
    };

    this.render();
  }

  start() {
    this.setIndex(1);
    this.videoTarget.play();
    this.render();
  }

  next() {
    this.setIndex(this.index+1);
    if (this.getItem().dataset?.timestamp) {
      this.videoTarget.currentTime = this.getItem().dataset?.timestamp;
    } else {
      this.videoTarget.pause();
      this.videoTarget.currentTime = this.videoTarget.duration;
    }
  }

  previous() {
    this.setIndex(this.index-1);
    if (this.getItem().dataset?.timestamp) {
      this.videoTarget.currentTime = this.getItem().dataset?.timestamp;
    } else {
      this.videoTarget.pause();
      this.videoTarget.currentTime = 0;
    }
  }

  getItem() {
    return this.stepsTargets[this.index];
  }

  setIndex(index) {
    this.index = Math.max(0, Math.min(index, this.stepsTargets.length));
    this.render();
  }

  render() {
    const item = this.getItem(this.index);
    this.stepsTargets.forEach(x => {
      if (x.classList.contains('chapter'))  {
        x.classList.remove('current')
      } else {
        x.classList.add('d-none');
      }
    })
    if (item.classList.contains('chapter')){
      item.classList.add('current')
    } else {
      item.classList.remove('d-none');
    }

    this.chapterContainerTargets.forEach(container => {
      if (container.contains(item)) {
        container.classList.remove('d-none');
      } else {
        container.classList.add('d-none');
      }
    });
  }
})
