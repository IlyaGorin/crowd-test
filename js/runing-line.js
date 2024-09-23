export default class RuningLine {
  /**
   * @param {Object} options - Опции.
   * @param {HTMLElement} options.element - Контейнер.
   * @param {number} [options.speed=0.5] - Скорость анимации.
   */

  constructor({ element, speed = 0.5 }) {
    this.element = element;
    this.contentContainer = element.querySelector(
      '.runing-line__content-container'
    );
    this.content = element.querySelector('.runing-line__content');
    this.speed = speed;

    this.cloneContent();
    this.startAnimation();
  }

  cloneContent() {
    // Клонируем текст для создания непрерывного текста
    const clone = this.content.cloneNode(true);
    this.contentContainer.appendChild(clone);
  }

  startAnimation() {
    let position = 0;

    const move = () => {
      position -= this.speed;

      // Когда текст заканчивается сбрасываем позицию
      if (Math.abs(position) >= this.content.offsetWidth) {
        position = 0;
      }

      this.contentContainer.style.transform = `translateX(${position}px)`;

      requestAnimationFrame(move);
    };

    move();
  }
}
