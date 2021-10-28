import { Controller } from "/js/stimulus.js"

export default class extends Controller {
  static values = { index: { type: Number, default: 0 }, next: { type: String, default: '' } }
  static targets = ["slides", "slideArea", "slideContainer" ]
  static autoplayTimeout = 5 * 60 * 1000; // 5 minutes
  static autoplayIntervalTime = 1 * 60 * 1000; // 1 minute per slide in autoplay mode

  connect() {
    if (window.location.hash && this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.slidesTargets.findIndex(x => x.id == window.location.hash.substring(1));
    }

    this.resetAutoplayTimer();
  }

  disconnect() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);
  }

  // enter the auto-play mode where we cycle to the end of the slideshow and then go back to the
  // intro slide
  autoplay() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);

    gtag('event', 'idle');

    this.autoplayInterval = window.setInterval(() => {
      if (this.indexValue == 0) return this.nextValue && (window.location = this.nextValue);
      if (this.ended) return this.indexValue = 0;
      this.indexValue = this.indexValue + 1
    }, this.constructor.autoplayIntervalTime);
  }

  // (re)set a timer for entering the autoplay after an idle timeout
  resetAutoplayTimer() {
    if (this.autoplayInterval) window.clearInterval(this.autoplayInterval);
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);

    if (this.indexValue == 0 && !this.nextValue) return;

    this.autoplayTimer = window.setTimeout(() => this.autoplay(), this.constructor.autoplayTimeout);
  }

  // reset the slideshow back to the intro card
  reset() {
    this.indexValue = 0;
  }

  // paginate to the next slide, or the end card
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.slidesTargets.length - 1);
    gtag('event', 'next', { index: this.indexValue });
    this.resetAutoplayTimer();
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
    gtag('event', 'previous', { index: this.indexValue });
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

  // make the current item visible
  indexValueChanged() {
    const item = this.getItem();
    if (item.id) history.replaceState({}, '', '#' + item.id);

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
}
