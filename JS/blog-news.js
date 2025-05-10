// Глобальные переменные для пагинации
let currentPage = 1;
let totalPages = 1;
let newsPerPage = 6;
let allNews = [];

// Функция для загрузки списка всех новостей
async function loadNews() {
    const newsListElement = document.getElementById('news-list');
    
    try {
        // Показываем индикатор загрузки
        newsListElement.innerHTML = `<div class="loading">Загрузка новостей...</div>`;
        
        const response = await fetch('http://64.23.228.140:8000/api/news', {
            headers: {
                'api-token': 'sk-L8jzVn3zRgT7q5YwX9eU2M1p0sDfHbCx'
            }
        });
        
        if (response.ok) {
            const newsData = await response.json();
            // Сортируем новости по дате (предполагаем, что у новостей есть поле date или created_at)
            // Если такого поля нет, можно сортировать по ID, предполагая, что более новые имеют больший ID
            allNews = newsData.sort((a, b) => {
                // Если есть поле даты, используем его
                if (a.date && b.date) {
                    return new Date(b.date) - new Date(a.date);
                }
                // Если есть поле created_at, используем его
                if (a.created_at && b.created_at) {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
                // Иначе сортируем по ID (предполагая, что новые новости имеют больший ID)
                return b.id - a.id;
            });
            
            // Вычисляем общее количество страниц
            totalPages = Math.ceil(allNews.length / newsPerPage);
            
            // Отображаем первую страницу
            displayNewsPage(1);
            
            // Создаем пагинацию
            createPagination();
        } else {
            throw new Error(`Ошибка загрузки новостей: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        newsListElement.innerHTML = `
            <div class="error-message">
                <p>Не удалось загрузить новости. Ошибка: ${error.message}</p>
            </div>
        `;
    }
}

// Модифицированная функция displayNewsPage
function displayNewsPage(page) {
    const newsListElement = document.getElementById('news-list');
    currentPage = page;
    
    // Проверяем валидность страницы
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    // Получаем новости для текущей страницы
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = Math.min(startIndex + newsPerPage, allNews.length);
    const paginatedNews = allNews.slice(startIndex, endIndex);
    
    if (paginatedNews.length === 0) {
        newsListElement.innerHTML = `
            <div class="no-news">
                <p>Новости отсутствуют</p>
            </div>
        `;
        return;
    }
    
    newsListElement.innerHTML = '';
    
    paginatedNews.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        newsItem.innerHTML = `
            <img class="news-image" src="/api/placeholder/300/200" alt="${news.title}" data-id="${news.id}">
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                ${news.date || news.created_at || news.reg_date ? 
                  `<span class="news-date">${formatDate(news.date || news.created_at || news.reg_date)}</span>` : ''}
                <p class="news-excerpt">${truncateText(news.text, 100)}</p>
                <a href="news-detail.html?id=${news.id}" class="news-link" data-id="${news.id}">Читать далее</a>
            </div>
        `;
        
        newsListElement.appendChild(newsItem);
        
        // Загружаем изображение для этой новости
        loadNewsImage(news.id, newsItem.querySelector('.news-image'));
        
        // Добавляем обработчик события для клика по всей карточке
        newsItem.addEventListener('click', function(e) {
            // Не перехватываем клик по ссылке "Читать далее", т.к. она обрабатывается стандартно
            if (e.target.classList.contains('news-link')) {
                return;
            }
            // Для клика по другим частям карточки программно кликаем по ссылке
            const newsLink = this.querySelector('.news-link');
            if (newsLink) {
                e.preventDefault();
                window.location.href = newsLink.href;
            }
        });
    });
    
    // Обновляем активную страницу в пагинации
    updateActivePage(page);
}

// Модифицированная функция форматирования даты
function formatDate(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ''; // Если дата недействительна
        
        return date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
    } catch (e) {
        console.error('Ошибка форматирования даты:', e);
        return '';
    }
}

// Функция для создания пагинации
function createPagination() {
    // Создаем контейнер для пагинации, если его еще нет
    let paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        document.querySelector('.news-section .container').appendChild(paginationContainer);
    }
    
    // Если страница всего одна, не показываем пагинацию
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<ul class="pagination">';
    
    // Кнопка "Предыдущая"
    paginationHTML += `
        <li class="pagination-item">
            <a href="#" class="pagination-link ${currentPage === 1 ? 'disabled' : ''}" data-page="prev">
                &laquo;
            </a>
        </li>
    `;
    
    // Отображаем максимум 5 номеров страниц
    // Определяем начальную и конечную страницы для отображения
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Корректируем, если не хватает страниц в конце
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Если первая страница не отображается, добавляем её и многоточие
    if (startPage > 1) {
        paginationHTML += `
            <li class="pagination-item">
                <a href="#" class="pagination-link" data-page="1">1</a>
            </li>
        `;
        
        if (startPage > 2) {
            paginationHTML += `
                <li class="pagination-item">
                    <span class="pagination-link disabled">...</span>
                </li>
            `;
        }
    }
    
    // Добавляем номера страниц
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="pagination-item">
                <a href="#" class="pagination-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Если последняя страница не отображается, добавляем многоточие и её
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `
                <li class="pagination-item">
                    <span class="pagination-link disabled">...</span>
                </li>
            `;
        }
        
        paginationHTML += `
            <li class="pagination-item">
                <a href="#" class="pagination-link" data-page="${totalPages}">${totalPages}</a>
            </li>
        `;
    }
    
    // Кнопка "Следующая"
    paginationHTML += `
        <li class="pagination-item">
            <a href="#" class="pagination-link ${currentPage === totalPages ? 'disabled' : ''}" data-page="next">
                &raquo;
            </a>
        </li>
    `;
    
    paginationHTML += '</ul>';
    paginationContainer.innerHTML = paginationHTML;
    
    // Добавляем обработчики событий для пагинации
    const paginationLinks = document.querySelectorAll('.pagination-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('disabled')) {
                return;
            }
            
            const page = this.getAttribute('data-page');
            
            if (page === 'prev') {
                displayNewsPage(currentPage - 1);
            } else if (page === 'next') {
                displayNewsPage(currentPage + 1);
            } else {
                displayNewsPage(parseInt(page, 10));
            }
            
            // Прокручиваем к началу секции с новостями
            document.querySelector('.news-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Функция для обновления активной страницы в пагинации
function updateActivePage(page) {
    const paginationLinks = document.querySelectorAll('.pagination-link');
    
    paginationLinks.forEach(link => {
        // Удаляем класс active у всех ссылок
        link.classList.remove('active');
        
        // Обновляем состояние кнопок Prev и Next
        if (link.getAttribute('data-page') === 'prev') {
            if (page === 1) {
                link.classList.add('disabled');
            } else {
                link.classList.remove('disabled');
            }
        } else if (link.getAttribute('data-page') === 'next') {
            if (page === totalPages) {
                link.classList.add('disabled');
            } else {
                link.classList.remove('disabled');
            }
        } else if (parseInt(link.getAttribute('data-page'), 10) === page) {
            // Добавляем класс active текущей странице
            link.classList.add('active');
        }
    });
}

// Функция для загрузки изображения новости с резервной альтернативой
async function loadNewsImage(newsId, imageElement) {
    try {
        const response = await fetch(`http://64.23.228.140:8000/api/news/photo/${newsId}`, {
            headers: {
                'api-token': 'sk-L8jzVn3zRgT7q5YwX9eU2M1p0sDfHbCx'
            }
        });
        
        if (response.ok) {
            // Проверяем, что API вернул изображение, а не пустой ответ
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            
            // Если получен пустой ответ или не изображение, используем резервное изображение
            if (!contentType || !contentType.includes('image') || contentLength === '0') {
                useDefaultImage(imageElement);
                return;
            }
            
            const imageBlob = await response.blob();
            // Проверяем размер blob (пустые изображения могут иметь размер меньше определенного порога)
            if (imageBlob.size < 100) { // Если размер меньше 100 байт, скорее всего изображение отсутствует
                useDefaultImage(imageElement);
                return;
            }
            
            const imageUrl = URL.createObjectURL(imageBlob);
            imageElement.src = imageUrl;
            
            // Добавляем обработчик ошибки для случая, если изображение не может быть загружено
            imageElement.onerror = function() {
                useDefaultImage(imageElement);
            };
        } else {
            console.error(`Ошибка загрузки изображения для новости ${newsId}: ${response.status}`);
            useDefaultImage(imageElement);
        }
    } catch (error) {
        console.error(`Ошибка при загрузке изображения для новости ${newsId}:`, error);
        useDefaultImage(imageElement);
    }
}

// Функция для использования резервного изображения
function useDefaultImage(imageElement) {
    imageElement.src = '../../IMG/news/News.jpg';
    
    // Добавляем обработчик ошибки на случай, если локальное изображение тоже не найдено
    imageElement.onerror = function() {
        // Если локальное изображение тоже не найдено, используем встроенный плейсхолдер
        imageElement.src = '/api/placeholder/300/200';
        // Удаляем обработчик, чтобы избежать бесконечной рекурсии
        imageElement.onerror = null;
    };
}

// Функция для сокращения текста
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Загружаем новости при загрузке страницы
window.addEventListener('DOMContentLoaded', loadNews);