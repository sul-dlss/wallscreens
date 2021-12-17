import { Application } from "js/stimulus.js";
import SlideshowExperience from "js/controllers/slideshow.js"

// TODO: Is there a better way to import this?
import { waitFor } from '@testing-library/dom/dist/@testing-library/dom.umd.js'

describe("SlideshowExperience", () => {
  let start_button
  let autoplay_button
  let next_button
  let first_card
  let slide_one
  let slide_two

  beforeEach(() => {
    window.gtag = function() {};
    document.body.innerHTML = `<div data-controller="slideshow"
         data-slideshow-next-value="next.html">
      <div class="program-content" data-slideshow-target="programArea"></div>
      <div class="preview-content" data-slideshow-target="previewArea"></div>
      <!-- first card -->
      <div id="first" data-slideshow-target="slides">
        <button id="start-button" data-action="slideshow#start"></button>
        <!-- attractor -->
        <template>
          <div id="attract-grid-first" data-slideshow-target="attractGridContainer"></div>
        </template>
      </div>
      <!-- middle cards -->
      <div id="slide-container" data-slideshow-target="slideContainer" hidden>
        <div id="slide-one" data-image-url="slide-one.jpg" data-slideshow-target="slides">Foo</div>
        <div id="slide-two" data-image-url="slide-two.jpg" data-slideshow-target="slides">Foo</div>
        <div id="slide-three" data-image-url="slide-three.jpg" data-slideshow-target="slides">Fooo</div>
        <button id="previous-button" data-action="slideshow#previous"></button>
        <button id="autoplay-button" data-action="slideshow#toggleAutoplay" data-slideshow-target="autoplayButton"></button>
        <button id="reset-autoplay-button" data-actopm="slideshow#resetAutoplayTimer"></button>
        <button id="next-button" data-action="slideshow#next"></button>
      </div>
      <div id="last" data-slideshow-target="slides" hidden>
        <!-- attractor -->
        <template>
          <div id="attract-grid-last" data-slideshow-target="attractGridContainer"></div>
        </template>
      </div>`;
    const application = Application.start();
    application.register("slideshow", SlideshowExperience);
    start_button = document.getElementById("start-button");
    autoplay_button = document.getElementById("autoplay-button");
    next_button = document.getElementById("next-button");
    first_card = document.getElementById("first");
    slide_one = document.getElementById("slide-one");
    slide_two = document.getElementById("slide-two");
  });

  describe("#connect", () => {
    it("stays on the first card", (done) => {
      setTimeout(() => {
        try {
          expect(first_card).toBeVisible();
          expect(slide_one).not.toBeVisible();
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });

  describe("#start", () => {
    it("advances to the first slide", async () => {
      start_button.click();
      await waitFor(() => expect(first_card).not.toBeVisible());
      await waitFor(() => expect(slide_one).toBeVisible());
    });
  });

  // TODO: There's some kind of interaction going on between tests.
  // Cleanup needed?
  describe("#next", () => {
    it("advances to the second slide", async () => {
      start_button.click();
      next_button.click();
      await waitFor(() => expect(slide_one).not.toBeVisible());
      await waitFor(() => expect(slide_two).toBeVisible());
    });
  });
});
