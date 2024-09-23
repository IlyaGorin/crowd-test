export default class Animation {
  constructor(
    layersSelector,
    sectionsSelector,
    animatedLayerSelector,
    svgAnimatedLayerSelector
  ) {
    this.layers = document.querySelectorAll(layersSelector);
    this.sections = document.querySelectorAll(sectionsSelector);
    this.animatedLayers = document.querySelectorAll(animatedLayerSelector);
    this.svgAnimatedLayers = document.querySelectorAll(
      svgAnimatedLayerSelector
    );
    this.startDelay = 500; // Задержка перед началом анимации
    this.init();
  }

  init() {
    this.animateLayers();
    this.setupObserver();
  }

  animateLayers() {
    this.layers.forEach((layer, index) => {
      setTimeout(() => {
        layer.classList.add('hero__layer--visible');
      }, this.startDelay + index * 300); // Стартовая задержка + задержка для каждого слоя
    });
  }

  startAnimation(layers) {
    layers.forEach((layer) => {
      layer.classList.add('animate-play');
    });
  }

  setupObserver() {
    const screenWidth = window.innerWidth;
    let threshold;

    switch (true) {
      case screenWidth <= 768:
        threshold = 0.3;
        break;
      case screenWidth < 1200:
        threshold = 0.5;
        break;
      default:
        threshold = 1;
    }

    const observerOptions = {
      threshold: threshold,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.startAnimation(this.animatedLayers);
          }, 2500);

          setTimeout(() => {
            this.startAnimation(this.svgAnimatedLayers);
          }, 300);
          observer.unobserve(entry.target); // Прекращаем наблюдение после срабатывания
        }
      });
    }, observerOptions);

    this.sections.forEach((section) => observer.observe(section));
  }
}
