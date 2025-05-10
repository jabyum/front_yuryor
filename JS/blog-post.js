// news-detail.js - Скрипт для страницы отдельной новости

// Функция для получения ID новости из URL
function getNewsIdFromUrl() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    // Возвращаем параметр id, или null если его нет
    return urlParams.get('id');
}

// Функция для загрузки данных новости
async function loadNewsDetail() {
    const newsId = getNewsIdFromUrl();
    const newsDetailContainer = document.getElementById('news-detail-container');
    
    // Проверяем, есть ли ID новости в URL
    if (!newsId) {
        newsDetailContainer.innerHTML = `
            <div class="error-message">
                <p>Новость не найдена. Пожалуйста, вернитесь на <a href="blog.html">страницу новостей</a>.</p>
            </div>
        `;
        return;
    }
    
    try {
        // Показываем индикатор загрузки
        newsDetailContainer.innerHTML = `<div class="loading">Загрузка новости...</div>`;
        
        // Выполняем запрос к API
        const response = await fetch(`http://64.23.228.140:8000/api/news/${newsId}`, {
            headers: {
                'api-token': 'sk-L8jzVn3zRgT7q5YwX9eU2M1p0sDfHbCx'
            }
        });
        
        if (response.ok) {
            const newsData = await response.json();
            displayNewsDetail(newsData);
        } else {
            throw new Error(`Ошибка загрузки новости: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
        newsDetailContainer.innerHTML = `
            <div class="error-message">
                <p>Не удалось загрузить новость. Ошибка: ${error.message}</p>
                <a href="blog.html" class="back-to-news">Вернуться к списку новостей</a>
            </div>
        `;
    }
}

// Функция для отображения данных новости
function displayNewsDetail(newsData) {
    const newsDetailContainer = document.getElementById('news-detail-container');
    
    // Форматируем дату, если она есть
    let formattedDate = '';
    if (newsData.reg_date) {
        const date = new Date(newsData.reg_date);
        formattedDate = date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Создаем HTML для детальной страницы новости
    const newsDetailHTML = `
        <article class="news-detail">
            <h1 class="news-detail-title">${newsData.title}</h1>
            
            ${formattedDate ? `<div class="news-detail-date">${formattedDate}</div>` : ''}
            
            <div class="news-detail-content">
                ${newsData.photo ? `
                    <div class="news-detail-image-container">
                        <img src="http://64.23.228.140:8000/api/news/photo/${newsData.id}" 
                             alt="${newsData.title}" 
                             class="news-detail-image">
                    </div>
                ` : ''}
                
                <div class="news-detail-text">
                    ${formatNewsText(newsData.text)}
                </div>
            </div>
            
            <div class="news-detail-actions">
                <a href="blog.html" class="back-to-news">← Вернуться к списку новостей</a>
            </div>
        </article>
    `;
    
    newsDetailContainer.innerHTML = newsDetailHTML;
    
    // Обновляем заголовок страницы
    document.title = `${newsData.title} - Новости`;
   

    const pageTitleElement = document.getElementById('news-title');
    const breadcrumbTitleElement = document.getElementById('breadcrumb-title');
    
    if (pageTitleElement) {
        pageTitleElement.textContent = newsData.title;
    }
    
    if (breadcrumbTitleElement) {
        breadcrumbTitleElement.textContent = newsData.title;
    }
}

// Функция для форматирования текста новости (разбивка на абзацы)
function formatNewsText(text) {
    if (!text) return '';
    
    // Разбиваем текст на абзацы по переносам строк
    const paragraphs = text.split(/\n\n|\r\n\r\n|\n|\r\n/);
    
    // Возвращаем отформатированный HTML с абзацами
    return paragraphs
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
}

// Загружаем данные новости при загрузке страницы
window.addEventListener('DOMContentLoaded', loadNewsDetail);

// Функция для форматирования текста новости (разбивка на абзацы)
function formatNewsText(text) {
    if (!text) return '';
    
    // Разбиваем текст на абзацы по переносам строк
    const paragraphs = text.split(/\n\n|\r\n\r\n|\n|\r\n/);
    
    // Возвращаем отформатированный HTML с абзацами
    return paragraphs
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
}