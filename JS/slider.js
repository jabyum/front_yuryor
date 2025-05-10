/**
 * YurYor - JavaScript для слайдера отзывов
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера отзывов
    initTestimonialsSlider();
});

/**
 * Инициализация слайдера отзывов
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');

    // Если на странице нет слайдера, выходим
    if (!slider) return;

    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    // Если слайдов меньше двух, скрываем элементы управления
    if (slides.length < 2) {
        const controls = document.querySelector('.slider-controls');
        if (controls) controls.style.display = 'none';
        return;
    }

    // Инициализация переменных
    let currentSlide = 0;
    let slideWidth = slides[0].offsetWidth;
    let slideInterval;

    // Скрываем все слайды, кроме первого
    for (let i = 1; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    // Создаем контейнер для слайдов, если их больше одного
    if (slides.length > 1) {
        startSlideInterval();
    }

    // Обновление размера слайдов при изменении размера окна
    window.addEventListener('resize', function() {
        slideWidth = slides[0].offsetWidth;
    });

    // Переключение на предыдущий слайд
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToSlide(currentSlide - 1);
            resetSlideInterval();
        });
    }

    // Переключение на следующий слайд
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
            resetSlideInterval();
        });
    }

    // Обработка клика по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetSlideInterval();
        });
    });

    /**
     * Переход к определенному слайду
     * @param {number} slideIndex Индекс слайда
     */
    function goToSlide(slideIndex) {
        // Скрываем текущий слайд
        slides[currentSlide].style.display = 'none';
        dots[currentSlide].classList.remove('active');

        // Вычисляем индекс нового слайда
        if (slideIndex < 0) {
            currentSlide = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = slideIndex;
        }

        // Показываем новый слайд
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');

        // Добавляем анимацию перехода
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].style.transform = 'translateY(20px)';

        // Анимируем появление слайда
        setTimeout(() => {
            slides[currentSlide].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slides[currentSlide].style.opacity = '1';
            slides[currentSlide].style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * Запускает автоматическое переключение слайдов
     */
    function startSlideInterval() {
        // Автоматическое переключение слайдов каждые 5 секунд
        slideInterval = setInterval(function() {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    /**
     * Сбрасывает и перезапускает таймер автоматического переключения
     */
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
}