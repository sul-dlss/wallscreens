import { Application } from "js/stimulus.js";
import AttractModeController from "js/controllers/attract-mode.js";

describe("attract mode controller", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        window.gtag = function() {};    // stub google analytics

        // fixture with testing value for next attract mode screen
        document.body.innerHTML = `<div data-controller="attract-mode"
            data-attract-mode-next-value="http://example.com/">`;
    });

    afterEach(() => {
        // failure to do this will make jest spew debug info at you!!
        jest.useRealTimers();
    });

    it("starts an interaction timer when connected", () => {
        // spy on timer methods before controller is connected
        jest.spyOn(window, "setTimeout");
        const application = Application.start();
        application.register("attract-mode", AttractModeController);

        // connecting controller should start timer once
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it("clears the existing timer when disconnected", () => {
        // spy on timer methods after the controller is connected
        const application = Application.start();
        application.register("attract-mode", AttractModeController);
        jest.spyOn(window, "clearTimeout");

        // removal of the controller's target element triggers disconnect():
        // https://stimulus.hotwired.dev/reference/lifecycle-callbacks#disconnection
        document.body.removeChild(document.body.firstChild);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    it("resets the timer when the user interacts with the page", () => {
        // spy on timer methods after the controller is connected
        const application = Application.start();
        application.register("attract-mode", AttractModeController);
        jest.spyOn(window, "setTimeout");
        jest.spyOn(window, "clearTimeout");

        // clicking anywhere should clear and reset the timer
        document.body.dispatchEvent(new Event("click"));
        expect(clearTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it("navigates to the next location when the timer elapses", () => {
        // replace window.location with something we can inspect; it's not
        // writable or mockable otherwise. see:
        // https://wildwolf.name/jest-how-to-mock-window-location-href/
        delete window.location
        window.location = { href: "" }

        // jump to end of timer; we should navigate to the next location
        const application = Application.start();
        application.register("attract-mode", AttractModeController);
        jest.runAllTimers();
        expect(window.location.href).toBe("http://example.com/");
    });
})
