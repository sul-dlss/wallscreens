import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 } }
  static targets = [ "slides", "caption", "slideContainer" ]
  static autoplayTimeout = 5 * 60 * 1000; // 5 minutes
  static autoplayIntervalTime = 1 * 60 * 1000; // 1 minute per slide in autoplay mode

  connect() {
    if (window.location.hash && this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1));

      window.viewer.addOnceHandler('open', () => {
        this.indexValueChanged();
      });
    }

    this.resetAutoplayTimer();
  }

  disconnect() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);
  }

  // enter the auto-play mode where we cycle to the end of the tour and then go back to the
  // intro slide
  autoplay() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);

    this.autoplayInterval = window.setInterval(() => {
      if (this.indexValue == 0) return this.resetAutoplayTimer();
      if (this.ended) return this.indexValue = 0;
      this.indexValue = this.indexValue + 1
    }, this.constructor.autoplayIntervalTime);
  }

  // (re)set a timer for entering the autoplay after an idle timeout
  resetAutoplayTimer() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);
    if (this.indexValue == 0) return;

    this.autoplayTimer = window.setTimeout(() => this.autoplay(), this.constructor.autoplayTimeout);
  }

  // reset the slideshow back to the intro card
  reset() {
    this.indexValue = 0;
  }

  // paginate to the next slide, or the end card
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.slidesTargets.length - 1);
    this.resetAutoplayTimer();
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
    this.resetAutoplayTimer();
  }

  get ended() {
    return this.indexValue == this.slidesTargets.length - 1;
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.indexValue];
  }

  indexValueChanged() {
    const item = this.getItem();
    if (item.id) history.replaceState({}, '', '#' + item.id);

    this.slidesTargets.forEach(x => x.classList.add('d-none'));
    item.classList.remove('d-none');

    this.slideContainerTargets.forEach(container => {
      if (container.contains(item)) {
        container.classList.remove('d-none');
      } else {
        container.classList.add('d-none');
      }
    });

    const data = JSON.parse(item.querySelector("script[type='application/json']")?.textContent || null) ?? {};

    if (data.viewport) {
      window.viewer.viewport.panTo(window.viewer.viewport.imageToViewportCoordinates(data.viewport.x, data.viewport.y));
      window.viewer.viewport.zoomTo(data.viewport.zoom);
    } else {
      window.viewer.viewport.goHome();
    }

    if (data.caption) {
      this.captionTarget.innerHTML = data.caption;
      this.captionTarget.classList.remove('d-none');
    } else {
      this.captionTarget.classList.add('d-none');
    }
  }
}
