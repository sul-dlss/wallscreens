import { Controller } from '/js/stimulus.js';

export default class extends Controller {
  static values = { index: { type: Number, default: 0 }, next: { type: String, default: '' } };

  static targets = ['slides', 'programArea', 'previewArea', 'slideContainer', 'autoplayButton'];

  static autoplayTimeout = 5 * 60 * 1000; // 5 minutes

  static autoplayIntervalTime = 15 * 1000; // 15 seconds per slide in autoplay mode

  static crossFadeTime = 1000; // 1 second

  connect() {
    if (window.location.hash && this.slidesTargets.findIndex((x) => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.slidesTargets.findIndex((x) => x.id == window.location.hash.substring(1));
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
    if (this.autoplaying) window.clearInterval(this.autoplayInterval);

    this.autoplayButtonTarget.classList.add('active');

    this.autoplayInterval = window.setInterval(() => {
      if (this.indexValue == 0) return this.nextValue && (window.location = this.nextValue);
      if (this.ended) return this.indexValue = 0;
      this.indexValue += 1;
    }, this.constructor.autoplayIntervalTime);
  }

  // pause the autoplay mode, but make sure it can restart after timer elapses
  pauseAutoplay() {
    window.clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
    this.autoplayButtonTarget.classList.remove('active');
    this.resetAutoplayTimer();
  }

  // (re)set a timer for entering the autoplay after an idle timeout
  resetAutoplayTimer() {
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);

    if (this.indexValue == 0 && !this.nextValue) return;

    this.autoplayTimer = window.setTimeout(() => {
      gtag('event', 'idle', { index: this.indexValue });
      this.autoplay();
    }, this.constructor.autoplayTimeout);
  }

  // start the slideshow by going to the first slide
  start() {
    this.indexValue = 1;
    gtag('event', 'start-slideshow');
    this.autoplay();
  }

  // paginate to the next slide, or the end card
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.slidesTargets.length - 1);
    gtag('event', 'next', { index: this.indexValue });

    // restart autoplay interval if playing
    if (this.autoplaying) {
      this.pauseAutoplay();
      window.setTimeout(() => this.autoplay(), 1);
    }
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
    gtag('event', 'previous', { index: this.indexValue });

    // restart autoplay interval if playing
    if (this.autoplaying) {
      this.pauseAutoplay();
      window.setTimeout(() => this.autoplay(), 1);
    }
  }

  get ended() {
    return this.indexValue == this.slidesTargets.length - 1;
  }

  get autoplaying() {
    return this.autoplayInterval != null;
  }

  // start or stop autoplay when the user clicks the autoplay button
  toggleAutoplay() {
    if (this.autoplaying) {
      gtag('event', 'pause-autoplay');
      this.pauseAutoplay();
    } else {
      gtag('event', 'start-autoplay');
      this.autoplay();
    }
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.indexValue];
  }

  getSlide(item) {
    if (item.querySelector('template')) {
      return item.querySelector('template').content.cloneNode(true);
    }
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style['background-image'] = `url(${item.dataset.imageUrl})`;
    return slide;
  }

  // make the current item visible
  indexValueChanged() {
    const item = this.getItem();
    if (item.id) history.replaceState({}, '', `#${item.id}`);

    this.previewAreaTarget.innerHTML = '';
    this.previewAreaTarget.appendChild(this.getSlide(item));

    this.previewAreaTarget.classList.add('fx-fade-in');
    this.previewAreaTarget.hidden = false;

    this.programAreaTarget.classList.add('fx-fade-out');

    window.clearTimeout(this.previewToProgramTimer);
    this.previewToProgramTimer = window.setTimeout(() => {
      this.programAreaTarget.classList.remove('fx-fade-out');
      this.programAreaTarget.innerHTML = this.previewAreaTarget.innerHTML;

      this.previewAreaTarget.hidden = true;
      this.previewAreaTarget.innerHTML = '';
      this.previewAreaTarget.classList.remove('fx-fade-in');
    }, this.constructor.crossFadeTime);

    this.slidesTargets.forEach((x) => x.hidden = true);
    item.hidden = false;

    this.slideContainerTargets.forEach((container) => {
      if (container.contains(item)) {
        container.hidden = false;
      } else {
        container.hidden = true;
      }
    });
  }
}
