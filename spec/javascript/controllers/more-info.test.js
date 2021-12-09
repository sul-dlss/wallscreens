import { Application } from "js/stimulus.js";
import MoreInfoModal from "js/controllers/more-info.js"

describe("MoreInfoModal", () => {
  let modal

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
  });

  describe("#hide", () => {
    it("hides the modal", () => {
      const button = document.getElementById("hide_button");

      modal.hidden = false;
      button.click();

      expect(modal).not.toBeVisible();
    });
  });

  describe("#show", () => {
    it("shows the modal", () => {
      const button = document.getElementById("show_button");

      button.click();

      expect(modal).toBeVisible();
    });
  });
});
