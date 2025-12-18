/*
  Скрипты для сайта Ml20_volunteers

  - Плавный скролл по кнопкам
  - Анимации появления блоков при скролле (IntersectionObserver)
  - Мягкое "проявление" животных и карточек
*/

// ------------------------------
// ПЛАВНЫЙ ПРОКРУТ К БЛОКАМ
// ------------------------------
document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const targetSelector = btn.getAttribute("data-scroll-target");
    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ------------------------------
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ------------------------------

// Находим все элементы, которые должны "появляться" при скролле
const revealElements = document.querySelectorAll(".reveal-on-scroll");

// Настройки IntersectionObserver:
// - threshold: 0.2 означает, что 20% элемента должны быть видны, чтобы анимация запустилась
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -10% 0px", // немного раньше, чем элемент полностью войдёт в зону видимости
};

// Функция-обработчик для IntersectionObserver
const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    // Если элемент ещё не виден — ничего не делаем
    if (!entry.isIntersecting) return;

    // Добавляем класс visible, который включает CSS-анимацию (fade-in + slide-up)
    entry.target.classList.add("visible");

    // После первого появления можно "отписаться" от наблюдения за этим элементом,
    // чтобы не запускать анимацию повторно при прокрутке вверх/вниз.
    observer.unobserve(entry.target);
  });
};

// Создаём наблюдатель
const revealObserver = new IntersectionObserver(onIntersection, observerOptions);

// Подключаем наблюдатель к каждому элементу
revealElements.forEach((el) => revealObserver.observe(el));

// ------------------------------
// ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ
// ------------------------------
// Если фотография не загрузилась, автоматически показываем эмодзи
document.addEventListener("DOMContentLoaded", () => {
  const animalPhotos = document.querySelectorAll(".animal-photo, .animal-photo-card, .animal-photo-bubble");
  
  animalPhotos.forEach((img) => {
    img.addEventListener("error", function() {
      // Скрываем изображение
      this.style.display = "none";
      
      // Ищем эмодзи в том же родительском элементе
      const parent = this.parentElement;
      const emoji = parent.querySelector(".animal-emoji");
      if (emoji) {
        emoji.style.display = "inline-block";
      }
    });
    
    // Проверяем, загрузилось ли изображение при загрузке страницы
    if (!img.complete || img.naturalHeight === 0) {
      img.addEventListener("load", function() {
        // Если изображение загрузилось, скрываем эмодзи
        const parent = this.parentElement;
        const emoji = parent.querySelector(".animal-emoji");
        if (emoji) {
          emoji.style.display = "none";
        }
      });
    }
  });
});

/*
  Дополнительно можно было бы рандомизировать поведение лапок,
  но для читаемости и надёжности адаптива оставим их анимацию в CSS.
*/

