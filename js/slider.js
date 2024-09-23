export default class Slider {
  /**
   * @param {Object} options - Опции.
   * @param {HTMLElement} options.container - Контейнер слайдера.
   * @param {Object} options.responsiveConfig - Конфиг для адаптивного отображения.
   * @param {number} [options.autoScrollDelay] - Задержка для автоматической прокрутки (в мс).
   * @param {boolean} [options.useGridColumns=false] - Грид-сетки для колонок слайдов.
   * @param {boolean} [options.autoScrollDisabled=true] - Автоматическая прокрутка.
   * @param {boolean} [options.isDotsActive=false] - Навигационные точки.
   * @param {boolean} [options.isSlidesCounterActive=false] - Счетчик слайдов.
   * @param {boolean} [options.loop=true] - Бесконечная прокрутка.
   */

  constructor({
    container,
    responsiveConfig,
    autoScrollDelay,
    useGridColumns = false,
    autoScrollDisabled = true,
    isDotsActive = false,
    isSlidesCounterActive = false,
    loop = true,
  }) {
    this.container = container;
    this.slidesContainer = container.querySelector('.slider__container');
    this.sliderNavigation = container.querySelector('.slder-controls');
    this.slides = container.querySelectorAll('.slide');
    this.prevButton = container.querySelector('.prev');
    this.nextButton = container.querySelector('.next');
    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    this.responsiveConfig = responsiveConfig;
    this.autoScrollDelay = autoScrollDelay;
    this.autoScrollInterval = null;
    this.useGridColumns = useGridColumns;
    this.autoScrollDisabled = autoScrollDisabled;
    this.isDotsActive = isDotsActive;
    this.isSlidesCounterActive = isSlidesCounterActive;
    this.loop = loop;

    this.updateSliderState();
    this.init();
  }

  updateButtonsState() {
    if (!this.loop) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex === this.maxIndex;
    }
  }

  updateSliderState() {
    const screenWidth = window.innerWidth;

    // По умолчанию берем настройки из default
    let slidesToShow = this.responsiveConfig.default.slidesToShow;
    let sliderEnabled = this.responsiveConfig.default.enabled;

    // Отфильтруем ключи оставляемтолько брейкпоинты
    const breakpoints = Object.keys(this.responsiveConfig)
      .filter((key) => key !== 'default')
      .map(Number)
      .sort((a, b) => b - a);

    // Проверяем разрешение для каждого брейкпоинта
    for (const breakpoint of breakpoints) {
      if (screenWidth <= breakpoint) {
        slidesToShow = this.responsiveConfig[breakpoint].slidesToShow;
        sliderEnabled = this.responsiveConfig[breakpoint].enabled;
      }
    }
    if (this.useGridColumns) {
      const gridContainer = document.querySelector(
        '.transformation-steps__list'
      );
      const computedStyle = window.getComputedStyle(gridContainer);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      const columns = gridTemplateColumns.split(' ');
      this.totalSlides = columns.length;
    }

    // Применяем настройки
    this.slidesToShow = slidesToShow;
    this.sliderEnabled = sliderEnabled;
    this.maxIndex = this.totalSlides - this.slidesToShow;
    this.currentSlideCountValue = this.slidesToShow;

    this.toggleSlider(this.sliderEnabled);
  }

  toggleSlider(enabled) {
    if (enabled) {
      this.container.classList.remove('slider-disabled');
      this.prevButton.style.display = 'block';
      this.nextButton.style.display = 'block';
      if (this.autoScrollDelay && !this.autoScrollEnabled) {
        this.startAutoScroll();
      }
    } else {
      this.container.classList.add('slider-disabled');
      this.prevButton.style.display = 'none';
      this.nextButton.style.display = 'none';
      this.stopAutoScroll();
    }
  }

  init() {
    if (this.isDotsActive) {
      this.createNavigation();
    }

    if (this.isSlidesCounterActive) {
      this.createSlidesCounter();
    }

    this.addEventListeners();
    this.updateSlidePosition();
    this.updateButtonsState();

    window.addEventListener('resize', () => {
      this.updateSliderState();
      this.updateSlidePosition();
      this.updateButtonsState();
    });
  }

  updateSlidePosition() {
    if (!this.sliderEnabled) return; // Не обновляем позицию, если слайдер отключён

    const slideWidth = this.slides[0].offsetWidth;
    const offset = -this.currentIndex * slideWidth;
    this.slidesContainer.style.transform = `translateX(${offset}px)`;
  }

  next() {
    if (!this.sliderEnabled) return;

    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.currentSlideCountValue++;
    } else if (this.loop) {
      this.currentSlideCountValue = this.slidesToShow;
      this.currentIndex = 0;
    }

    this.updateDotsState();
    this.updateSlidesCounterState();
    this.updateSlidePosition();
    this.updateButtonsState();
  }

  prev() {
    if (!this.sliderEnabled) return;

    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentSlideCountValue--;
    } else if (this.loop) {
      this.currentIndex = this.maxIndex;
      this.currentSlideCountValue = this.totalSlides;
    }

    this.updateDotsState();
    this.updateSlidesCounterState();
    this.updateSlidePosition();
    this.updateButtonsState();
  }

  addEventListeners() {
    this.nextButton.addEventListener('click', () => {
      this.next();
      this.resetAutoScroll();
    });

    this.prevButton.addEventListener('click', () => {
      this.prev();
      this.resetAutoScroll();
    });
  }

  startAutoScroll() {
    if (!this.autoScrollDisabled) {
      this.autoScrollInterval = setInterval(
        () => this.next(),
        this.autoScrollDelay
      );
    }
  }

  stopAutoScroll() {
    clearInterval(this.autoScrollInterval);
  }

  resetAutoScroll() {
    if (!this.autoScrollDisabled) {
      this.stopAutoScroll();
      this.startAutoScroll();
    }
  }

  createSlidesCounter() {
    const slidesCounter = document.createElement('div');
    slidesCounter.classList.add('slder-controls__slides-counter');
    this.sliderNavigation.appendChild(slidesCounter);
    this.updateSlidesCounterState();
  }

  updateSlidesCounterState() {
    const slidesCounterElement = this.container.querySelector(
      '.slder-controls__slides-counter'
    );
    if (this.isSlidesCounterActive) {
      slidesCounterElement.innerHTML = ` ${this.currentSlideCountValue}/${this.totalSlides}`;
    }
  }

  createNavigation() {
    const dotsContainer = document.createElement('ul');
    const dot = document.createElement('li');

    dot.classList.add('slider-dot');
    dotsContainer.classList.add('slider-dots');

    for (let index = 0; index < this.totalSlides; index++) {
      const dotClone = dot.cloneNode(true);

      if (index === this.currentIndex) {
        dotClone.classList.add('slider-dot--active');
      }

      dotClone.addEventListener('click', (evt) => {
        evt.target.classList.add('slider-dot--active');
        this.currentIndex = index;
        this.updateDotsState();
        this.updateSlidePosition();
        this.resetAutoScroll();
      });

      dotsContainer.appendChild(dotClone);
    }

    this.sliderNavigation.appendChild(dotsContainer);
  }

  updateDotsState() {
    const dots = this.sliderNavigation.querySelectorAll('.slider-dot');

    dots.forEach((dot, index) => {
      dot.classList.toggle('slider-dot--active', index === this.currentIndex);
    });
  }
}
