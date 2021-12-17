import { Application } from "js/stimulus.js";
import MoreInfoModal from "js/controllers/more-info.js"

describe("MoreInfoModal", () => {
  let hide_button
  let modal
  let show_button

  beforeEach(() => {
    window.gtag = function() {};
    document.body.innerHTML = `<div data-controller="more-info">
      <button id="show_button" data-action="more-info#show">More info</button>
      <button id="hide_button" data-action="more-info#hide">Close</button>
      <div id="modal" data-more-info-target="modal" hidden></div>
    </div>`;

    const application = Application.start();
    application.register("more-info", MoreInfoModal);
    modal = document.getElementById("modal");
    hide_button = document.getElementById("hide_button");
    show_button = document.getElementById("show_button");
  });

  describe("#hide", () => {
    it("hides the modal", () => {
      modal.hidden = false;
      hide_button.click();
      expect(modal).not.toBeVisible();
    });

    it("clears the existing timeout", () => {
      jest.spyOn(window, 'clearTimeout');
      show_button.click();
      hide_button.click();
      expect(window.clearTimeout).toHaveBeenCalled();
    });
  });

  describe("#show", () => {
    it("shows the modal", () => {
      show_button.click();
      expect(modal).toBeVisible();
    });

    it("hides the modal when the timeout expires", () => {
      jest.useFakeTimers();
      show_button.click();
      jest.runOnlyPendingTimers();
      expect(modal).not.toBeVisible();
      jest.useRealTimers();
    });
  });
});
