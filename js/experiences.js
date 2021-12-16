import { Application } from './stimulus.js';
import GuidedTourExperience from './controllers/guided-tour.js';
import OralHistoryExperience from './controllers/oral-history.js';
import SlideshowExperience from './controllers/slideshow.js';
import MoreInfoModal from './controllers/more-info.js';
import AttractMode from './controllers/attract-mode.js';

window.Stimulus = Application.start();

Stimulus.register('guided-tour', GuidedTourExperience);
Stimulus.register('oral-history', OralHistoryExperience);
Stimulus.register('slideshow', SlideshowExperience);
Stimulus.register('more-info', MoreInfoModal);
Stimulus.register('attract-mode', AttractMode);
