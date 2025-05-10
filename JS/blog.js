/**
 * YurYor - JavaScript для страницы блога
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация фильтрации постов по категориям
    initCategoryFilter();
    
    // Инициализация поиска по блогу
    initBlogSearch();
    
    // Инициализация кнопок "Поделиться"
    initShareButtons();
    
    // Инициализация аккордеона FAQ в статьях (если есть)
    initPostFaq();
    
    // Инициализация популярных тем
    initPopularTopics();
});

/**
 * Фильтрация постов по категориям
 */
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.categories-filter .category-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    if (!categoryButtons.length || !postCards.length) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Активация кнопки
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация постов
            if (category === 'all') {
                // Показать все посты
                postCards.forEach(card => {
                    card.style.display = 'flex';
                });
            } else {
                // Показать только посты выбранной категории
                postCards.forEach(card => {
                    const postCategories = card.getAttribute('data-categories');
                    
                    if (postCategories && postCategories.includes(category)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

/**
 * Поиск по блогу
 */
function initBlogSearch() {
    const searchInput = document.getElementById('searchBlog');
    const postCards = document.querySelectorAll('.post-card');
    
    if (!searchInput || !postCards.length) return;
    
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase();
        
        postCards.forEach(card => {
            const postTitle = card.querySelector('h2 a').textContent.toLowerCase();
            const postContent = card.querySelector('p').textContent.toLowerCase();
            
            if (postTitle.includes(searchQuery) || postContent.includes(searchQuery)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * Инициализация кнопок "Поделиться"
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    if (!shareButtons.length) return;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const dropdown = this.nextElementSibling;
            
            // Показать/скрыть выпадающее меню
            if (dropdown.style.visibility === 'visible') {
                dropdown.style.visibility = 'hidden';
                dropdown.style.opacity = '0';
            } else {
                // Скрыть все остальные меню
                document.querySelectorAll('.share-dropdown').forEach(menu => {
                    menu.style.visibility = 'hidden';
                    menu.style.opacity = '0';
                });
                
                // Показать текущее меню
                dropdown.style.visibility = 'visible';
                dropdown.style.opacity = '1';
            }
        });
    });
    
    // Скрывать меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.post-share')) {
            document.querySelectorAll('.share-dropdown').forEach(menu => {
                menu.style.visibility = 'hidden';
                menu.style.opacity = '0';
            });
        }
    });
}

/**
 * Инициализация аккордеона FAQ в статьях блога
 */
function initPostFaq() {
    const faqQuestions = document.querySelectorAll('.post-faq .faq-question');
    
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Закрыть все остальные вопросы
            document.querySelectorAll('.post-faq .faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Открыть/закрыть текущий вопрос
            faqItem.classList.toggle('active');
        });
    });
}

/**
 * Инициализация популярных тем
 */
function initPopularTopics() {
    const topicCards = document.querySelectorAll('.topic-card');
    
    if (!topicCards.length) return;
    
    topicCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            
            // Найти и активировать соответствующую кнопку категории
            const categoryButton = document.querySelector(`.categories-filter .category-btn[data-category="${category}"]`);
            
            if (categoryButton) {
                categoryButton.click();
                
                // Прокрутить к разделу с постами
                const blogPostsSection = document.querySelector('.blog-posts');
                if (blogPostsSection) {
                    const offset = blogPostsSection.offsetTop - 100;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}