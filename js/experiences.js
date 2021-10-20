import { Application } from "/js/stimulus.js"
import GuidedTourExperience from "/js/controllers/guided-tour.js"
import OralHistoryExperience from "/js/controllers/oral-history.js"
import SlideshowExperience from "/js/controllers/slideshow.js"
import MoreInfoModal from "/js/controllers/more-info.js"

window.Stimulus = Application.start()

Stimulus.register("guided-tour", GuidedTourExperience)
Stimulus.register("oral-history", OralHistoryExperience)
Stimulus.register("slideshow", SlideshowExperience)
Stimulus.register("more-info", MoreInfoModal)
