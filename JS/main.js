document.addEventListener('DOMContentLoaded', function () {
    // Мобильное меню
    initMobileMenu();

    // Языковое переключение
    initLanguageSwitcher();

    // Плавная прокрутка для якорных ссылок
    initSmoothScroll();

    // Фиксированное меню при прокрутке
    initStickyHeader();
});

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // Если на странице нет кнопки мобильного меню, выходим
    if (!mobileMenuBtn) return;

    // Создаем оверлей для мобильного меню, если его еще нет
    if (!document.querySelector('.mobile-menu-overlay')) {
        const mobileMenuHTML = `
        <div class="mobile-menu-overlay">
            <div class="mobile-menu-header">
                <div class="logo">
                    <a href="index.html">
                        <img src="../../IMG/logo.svg" alt="YurYor">
                    </a>
                </div>
                <button class="close-menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mobile-menu-nav">
                <ul>
                    <li><a href="about.html">О центре</a></li>
                    <li class="has-submenu">
                        <a href="services.html">Услуги</a>
                        <button class="submenu-toggle"><i class="fas fa-chevron-down"></i></button>
                        <ul class="mobile-submenu">
                            <li><a href="services-migrants.html">Для мигрантов</a></li>
                            <li><a href="services-employers.html">Для работодателей</a></li>
                        </ul>
                    </li>
                    <li><a href="info.html">Полезная информация</a></li>
                    <li><a href="blog.html">Блог</a></li>
                    <li><a href="contacts.html">Контакты</a></li>
                </ul>
            </nav>
            <div class="mobile-menu-footer">
                <div class="mobile-lang-switcher">
                    <button data-lang="RU">РУ</button>
                    <button class="active" data-lang="UZ">UZ</button>
                    <button data-lang="BG">BG</button>
                </div>
                <div class="mobile-social-links">
                    <a href="https://t.me/yuryorbg" target="_blank" title="Telegram"><i class="fab fa-telegram"></i></a>
                    <a href="https://wa.me/998773105566" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    <a href="https://facebook.com/yuryorbg" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                </div>
                <p>
                    <a href="tel:+998773105566">+998 77 310 55 66</a>
                </p>
            </div>
        </div>
        `;

        // Добавляем мобильное меню в DOM
        document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    }

    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    // Открытие мобильного меню
    mobileMenuBtn.addEventListener('click', function () {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });

    // Закрытие мобильного меню
    closeBtn.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Обработка клика вне меню для закрытия
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Переключение подменю
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const parent = this.parentElement;
            const submenu = parent.querySelector('.mobile-submenu');

            submenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-chevron-down');
            this.querySelector('i').classList.toggle('fa-chevron-up');
        });
    });
}

/**
 * Инициализация языкового переключателя
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-switcher button, .mobile-lang-switcher button');

    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Получаем выбранный язык
            const lang = this.getAttribute('data-lang');

            // Удаляем класс active со всех кнопок
            document.querySelectorAll('.lang-switcher button, .mobile-lang-switcher button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Добавляем класс active на выбранную кнопку
            document.querySelectorAll(`button[data-lang="${lang}"]`).forEach(btn => {
                btn.classList.add('active');
            });

            // В реальном приложении здесь будет логика переключения языка
            // Например, перенаправление на версию сайта с нужным языком
            // или обновление текстов без перезагрузки страницы

            // Пример вызова функции смены языка (нужно реализовать)
            // changeLanguage(lang);
        });
    });
}

/**
 * Плавная прокрутка для якорных ссылок
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Игнорируем клик, если это не якорная ссылка
            if (targetId === '#' || targetId === '') return;

            e.preventDefault();

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Закрываем мобильное меню, если оно открыто
                const mobileMenu = document.querySelector('.mobile-menu-overlay');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Плавная прокрутка к целевому элементу
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Отступ для фиксированного хедера
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Фиксированное меню при прокрутке
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');

    if (!header) return;

    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    document.body.style.paddingTop = headerHeight + 'px';
}
function handleHeaderBehavior() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function () {
        if (window.scrollY > headerHeight) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

window.addEventListener('scroll', handleHeaderBehavior);

// Функционал аккордеона FAQ
const faqItems = document.querySelectorAll('.faq-question');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const parentItem = item.closest('.faq-item');
        parentItem.classList.toggle('active');

        // Закрытие других открытых вопросов
        const otherItems = document.querySelectorAll('.faq-item.active');
        otherItems.forEach(otherItem => {
            if (otherItem !== parentItem) {
                otherItem.classList.remove('active');
            }
        });
    });
});
