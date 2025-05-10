/**
 * YurYor - JavaScript для страницы "Полезная информация"
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переключения между разделами
    initInfoTabs();

    // Инициализация фильтрации категорий
    initCategoryFilters();

    // Инициализация поиска в FAQ
    initFAQSearch();

    // Инициализация аккордеона для FAQ
    initFAQAccordion();

    // Инициализация "Показать больше" для FAQ
    initFAQShowMore();

    // Инициализация "Загрузить еще" для советов
    initLoadMore();
    
    // Инициализация компактной навигации при прокрутке
    initCompactNavigation();
});

/**
 * Инициализация переключения между разделами
 */
function initInfoTabs() {
    const tabs = document.querySelectorAll('.info-tab');
    const sections = document.querySelectorAll('.info-section');

    if (tabs.length === 0 || sections.length === 0) return;

    // Проверяем, есть ли хэш в URL
    const hash = window.location.hash;

    if (hash) {
        // Убираем символ # из начала строки
        const targetId = hash.substring(1);

        // Ищем соответствующую вкладку
        const targetTab = document.querySelector(`.info-tab[data-target="${targetId}"]`);

        if (targetTab) {
            // Удаляем класс active у всех вкладок и разделов
            tabs.forEach(tab => tab.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Добавляем класс active для целевой вкладки и раздела
            targetTab.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Прокручиваем к разделу
            setTimeout(() => {
                const sectionOffset = document.getElementById(targetId).offsetTop;
                window.scrollTo({
                    top: sectionOffset - 100,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Обработчик кликов по вкладкам
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');

            // Удаляем класс active у всех вкладок и разделов
            tabs.forEach(tab => tab.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Добавляем класс active для текущей вкладки и целевого раздела
            this.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Обновляем URL с хэшем (без перезагрузки страницы)
            history.pushState(null, null, `#${target}`);

            // Прокручиваем к разделу
            const sectionOffset = document.getElementById(target).offsetTop;
            window.scrollTo({
                top: sectionOffset - 100,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Инициализация фильтрации категорий
 */
function initCategoryFilters() {
    // Фильтрация в разделе советов
    const tipCategoryButtons = document.querySelectorAll('.tips-categories .category-btn');
    const tipCards = document.querySelectorAll('.tip-card');

    tipCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Активация кнопки категории
            tipCategoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация карточек
            tipCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardCategories = card.getAttribute('data-categories').split(' ');
                    if (cardCategories.includes(category)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Фильтрация в разделе FAQ
    const faqCategoryButtons = document.querySelectorAll('.faq-categories .category-btn');
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');

    faqCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Активация кнопки категории
            faqCategoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация вопросов
            faqItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategories = item.getAttribute('data-categories').split(' ');
                    if (itemCategories.includes(category)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

/**
 * Инициализация поиска в FAQ
 */
function initFAQSearch() {
    const faqSearch = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    
    if (faqSearch) {
        faqSearch.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase();
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (questionText.includes(searchQuery) || answerText.includes(searchQuery)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Инициализация аккордеона для FAQ
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Закрываем все другие вопросы
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Открываем или закрываем текущий вопрос
            faqItem.classList.toggle('active');
        });
    });
}

/**
 * Инициализация "Показать больше" для FAQ
 */
function initFAQShowMore() {
    const faqMoreButton = document.querySelector('.faq-more button');
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    
    if (faqMoreButton) {
        // По умолчанию показываем только первые 6 вопросов
        const visibleFaqCount = 6;
        let showingAllFaqs = false;
        
        // Скрываем вопросы, начиная с 7-го
        faqItems.forEach((item, index) => {
            if (index >= visibleFaqCount) {
                item.style.display = 'none';
                item.classList.add('hidden-faq');
            }
        });
        
        faqMoreButton.addEventListener('click', function() {
            const hiddenFaqs = document.querySelectorAll('.hidden-faq');
            
            if (!showingAllFaqs) {
                // Показываем все вопросы
                hiddenFaqs.forEach(item => {
                    item.style.display = 'block';
                });
                this.textContent = 'Скрыть';
                showingAllFaqs = true;
            } else {
                // Скрываем лишние вопросы
                hiddenFaqs.forEach(item => {
                    item.style.display = 'none';
                });
                this.textContent = 'Показать больше вопросов';
                showingAllFaqs = false;
            }
        });
    }
}

/**
 * Инициализация "Загрузить еще" для советов
 */
function initLoadMore() {
    const loadMoreButton = document.querySelector('.load-more button');
    
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            alert('В разработке: функционал загрузки дополнительных советов');
            // Здесь будет AJAX-запрос для загрузки новых советов
        });
    }
}

/**
 * Инициализация компактной навигации при прокрутке
 */
function initCompactNavigation() {
    const infoNav = document.querySelector('.info-navigation');
    if (infoNav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                infoNav.classList.add('compact');
            } else {
                infoNav.classList.remove('compact');
            }
        });
    }
}