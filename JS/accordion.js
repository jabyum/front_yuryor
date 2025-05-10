document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аккордеона услуг
    initServicesAccordion();

    // Инициализация аккордеона FAQ
    initFaqAccordion();
});

/**
 * Инициализация аккордеона услуг
 */
function initServicesAccordion() {
    const accordionItems = document.querySelectorAll('.accordion .accordion-item');

    if (accordionItems.length === 0) return;

    // Добавляем класс для JS-инициализации
    document.querySelector('.accordion').classList.add('js-accordion-init');

    // Открываем первый элемент по умолчанию
    accordionItems[0].classList.add('active');

    // Назначаем обработчики клика на заголовки
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', function() {
            // Проверяем, активен ли текущий элемент
            const isActive = item.classList.contains('active');

            // Закрываем все элементы
            accordionItems.forEach(el => {
                el.classList.remove('active');
            });

            // Если элемент не был активен, открываем его
            if (!isActive) {
                item.classList.add('active');
            }

            // Прокручиваем к активному элементу с небольшой задержкой
            if (!isActive) {
                setTimeout(() => {
                    const headerOffset = header.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = headerOffset - 100;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });

    // Обработка ссылок, указывающих на конкретные услуги
    handleServiceLinks('.accordion');
}

/**
 * Инициализация аккордеона FAQ
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    // Назначаем обработчики клика на вопросы
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Переключаем класс active для текущего элемента
            item.classList.toggle('active');

            // Обновляем иконку
            const icon = question.querySelector('.toggle-icon i');
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Обработка ссылок, указывающих на конкретные вопросы
    handleServiceLinks('.faq-accordion');
}

/**
 * Обработка якорных ссылок на странице
 * @param {string} containerSelector - Селектор для контейнера аккордеона
 */
function handleServiceLinks(containerSelector) {
    // Проверяем, есть ли хэш в URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetItem = document.getElementById(targetId);

        if (targetItem) {
            // Если элемент найден и он находится внутри аккордеона
            const accordionItem = targetItem.closest('.accordion-item, .faq-item');

            if (accordionItem) {
                // Открываем элемент аккордеона
                accordionItem.classList.add('active');

                // Прокручиваем к элементу с небольшой задержкой
                setTimeout(() => {
                    const targetOffset = targetItem.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetOffset - 100;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }
    }

    // Добавляем обработчики для внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetItem = document.getElementById(targetId);

            if (targetItem) {
                e.preventDefault();

                const accordionItem = targetItem.closest('.accordion-item, .faq-item');
                if (accordionItem) {
                    // Открываем элемент аккордеона
                    const container = document.querySelector(containerSelector);

                    if (container.classList.contains('accordion')) {
                        // Для основного аккордеона закрываем все и открываем нужный
                        document.querySelectorAll('.accordion-item').forEach(item => {
                            item.classList.remove('active');
                        });
                    }

                    accordionItem.classList.add('active');

                    // Обновляем иконку
                    const icon = accordionItem.querySelector('.toggle-icon i');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }

                // Прокручиваем к элементу
                setTimeout(() => {
                    const targetOffset = targetItem.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetOffset - 100;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
}