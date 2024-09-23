import Slider from './slider.js';
import RuningLine from './runing-line.js';
import Animation from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.participants-slider');
  const container2 = document.querySelector('.transformation-steps-slider');

  new Slider({
    container: container,
    responsiveConfig: {
      default: {
        slidesToShow: 3,
        enabled: true,
      },
      991: {
        slidesToShow: 2,
        enabled: true,
      },
      767: {
        slidesToShow: 1,
        enabled: true,
      },
    },
    autoScrollDisabled: false,
    autoScrollDelay: 4000,
    isSlidesCounterActive: true,
  });

  new Slider({
    container: container2,
    responsiveConfig: {
      default: {
        slidesToShow: 3,
        enabled: false,
      },
      991: {
        slidesToShow: 2,
        enabled: false,
      },
      767: {
        slidesToShow: 1,
        enabled: true,
      },
    },
    isDotsActive: true,
    useGridColumns: true,
    loop: false,
  });

  const runingLines = document.querySelectorAll('.runing-line');

  runingLines.forEach((runingLine) => {
    new RuningLine({ element: runingLine, speed: 0.3 });
  });

  new Animation(
    '.hero__layer',
    '.event--game',
    '.event-game__layers .animate',
    '.event-game__layers .svg-animate'
  );
});
