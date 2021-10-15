import { Application } from "/js/stimulus.js"
import GuidedTourExperience from "/js/controllers/guided-tour.js"
import OralHistoryExperience from "/js/controllers/oral-history.js"
import SlideshowExperience from "/js/controllers/slideshow.js"

window.Stimulus = Application.start()

Stimulus.register("guided-tour", GuidedTourExperience)
Stimulus.register("oral-history", OralHistoryExperience)
Stimulus.register("slideshow", SlideshowExperience)
