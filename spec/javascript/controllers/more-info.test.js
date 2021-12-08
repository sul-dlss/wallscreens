import { Application } from "js/stimulus.js";
import MoreInfoModal from "js/controllers/more-info.js"

describe("MoreInfoModal", () => {
  beforeEach(() => {
    // document.body.innerHTML = `<div data-controller="advanced">
    //   <input id="input" data-action="keyup->advanced#valueChanged"/>
    //
    //   <p id="result" data-target="advanced.result"/>
    // </div>`;

    const application = Application.start();
    application.register("more-info", MoreInfoModal);
  });


  it("can start", () => {
    const foo = 'boo';
    expect(foo).toBeDefined();
  });
});
