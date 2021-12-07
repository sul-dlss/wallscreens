import { Controller } from '/js/stimulus.js';

export default class extends Controller {
  static values = { index: { type: Number, default: 0 }, next: { type: String, default: '' } };

  static targets = ['slides', 'caption', 'slideContainer', 'guidedTourMainContent', 'attractPanContainer', 'autoplayButton'];

  static autoplayTimeout = 5 * 60 * 1000; // 5 minutes

  static autoplayIntervalTime = 1 * 60 * 1000; // 1 minute per slide in autoplay mode

  static crossFadeTime = 1000; // 1 second

  connect() {
    if (window.location.hash && this.slidesTargets.findIndex((x) => x.id == window.location.hash.substring(1)) > 0) {
      this.indexValue = this.slidesTargets.findIndex((x) => x.id == window.location.hash.substring(1));

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
    if (this.autoplaying) window.clearInterval(this.autoplayInterval);
    if (this.autoplayTimer) window.clearTimeout(this.autoplayTimer);

    if (this.indexValue == 0 && !this.nextValue) return;

    this.autoplayTimer = window.setTimeout(() => {
      gtag('event', 'idle', { index: this.indexValue });
      this.autoplay();
    }, this.constructor.autoplayTimeout);
  }

  // start the tour by going to the first stop
  start() {
    this.indexValue = 1;
    gtag('event', 'start-tour');
  }

  // reset the slideshow back to the intro card
  reset() {
    this.indexValue = 0;
  }

  // paginate to the next slide, or the end card
  next() {
    this.indexValue = Math.min(this.indexValue + 1, this.slidesTargets.length - 1);
    gtag('event', 'next', { index: this.indexValue });
    this.pauseAutoplay();
  }

  // paginate to the previous slide, or the intro card
  previous() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
    gtag('event', 'previous', { index: this.indexValue });
    this.pauseAutoplay();
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
    }
    else {
      gtag('event', 'start-autoplay');
      this.autoplay();
    }
  }

  showGuidedTourMainContent() {
    this.guidedTourMainContentTarget.classList.add('fx-fade-in');
    this.guidedTourMainContentTarget.hidden = false;
    this.attractPanContainerTarget.classList.add('fx-fade-out');

    window.clearTimeout(this.attractModeTransitionTimer);
    this.attractModeTransitionTimer = window.setTimeout(() => {
      this.attractPanContainerTarget.hidden = true;
    }, this.constructor.crossFadeTime);
  }

  showAttractPanContainer() {
    this.attractPanContainerTarget.classList.add('fx-fade-in');
    this.attractPanContainerTarget.hidden = false;
    this.guidedTourMainContentTarget.classList.add('fx-fade-out');

    window.clearTimeout(this.attractModeTransitionTimer);
    this.attractModeTransitionTimer = window.setTimeout(() => {
      this.guidedTourMainContentTarget.hidden = true;
    }, this.constructor.crossFadeTime);
  }

  resetFxClasses() {
    this.guidedTourMainContentTarget.classList.remove('fx-fade-in');
    this.guidedTourMainContentTarget.classList.remove('fx-fade-out');
    this.attractPanContainerTarget.classList.remove('fx-fade-in');
    this.attractPanContainerTarget.classList.remove('fx-fade-out');
  }

  // @private
  // get the currently displayed item
  getItem() {
    return this.slidesTargets[this.indexValue];
  }

  indexValueChanged() {
    const item = this.getItem();
    if (item.id) history.replaceState({}, '', `#${item.id}`);

    this.slidesTargets.forEach((x) => x.hidden = true);
    item.hidden = false;

    this.slideContainerTargets.forEach((container) => {
      if (container.contains(item)) {
        container.hidden = false;
      } else {
        container.hidden = true;
      }
    });

    this.resetFxClasses();

    // check if we're on the initial or final step.
    // in either case show the atrract container
    // and hide the video container. otherwise,
    // ensure the video container is visible
    if (this.indexValue == 0 || this.ended) {
      this.showAttractPanContainer();
    } else {
      this.showGuidedTourMainContent();
    }

    const data = JSON.parse(item.querySelector('script[type="application/json"]')?.textContent || null) ?? {};

    if (data.viewport) {
      window.viewer.viewport.panTo(window.viewer.viewport.imageToViewportCoordinates(data.viewport.x, data.viewport.y));
      window.viewer.viewport.zoomTo(data.viewport.zoom);
    } else {
      window.viewer.viewport.goHome();
    }

    if (data.caption) {
      this.captionTarget.innerHTML = data.caption;
      this.captionTarget.hidden = false;
    } else {
      this.captionTarget.hidden = true;
    }
  }
}
