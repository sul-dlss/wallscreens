import { Application } from "js/stimulus.js";
import AttractModeController from "js/controllers/attract-mode.js";

describe("attract mode controller", () => {
    beforeEach(() => {
        window.gtag = jest.fn();    // stub google analytics

        // fixture with testing value for next attract mode screen
        document.body.innerHTML = `<div data-controller="attract-mode"
            data-attract-mode-next-value="http://example.com/">`;

        // create and connect the controller
        const application = Application.start();
        application.register("attract-mode", AttractModeController);
    });

    beforeAll(() => {
        jest.useFakeTimers();       // lets us time-travel
    });

    afterAll(() => {
        jest.useRealTimers();       // restore real timers
    });

    it("navigates to the next location when the timer elapses", () => {
        // mock window.location.assign to test for navigating away
        const savedLocation = window.location;
        let assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };

        // jump to end of timer; we should navigate to the next location
        jest.runOnlyPendingTimers();
        expect(assignMock).toHaveBeenCalledWith("http://example.com/");

        // restore functionality
        window.location = savedLocation;
    });

    // FIXME state is still being shared here...it thinks that location.assign
    // is being called twice in this test
    xit("cancels the timer if the component is disconnected", () => {
        // mock window.location.assign to test for navigating away
        const savedLocation = window.location;
        let assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };

        // disconnect the component and jump to end of timer; should do nothing
        document.body.removeChild(document.body.firstChild);
        jest.runOnlyPendingTimers();
        expect(assignMock).not.toHaveBeenCalled();

        // restore functionality
        window.location = savedLocation;
    })
})
