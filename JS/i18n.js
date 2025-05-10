// js/i18n.js

class I18nManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = null;
        this.defaultLanguage = 'UZ';
        this.supportedLanguages = ['RU', 'UZ', 'BG'];
        
        // Get language buttons (considering different class variants in different files)
        this.languageButtons = document.querySelectorAll('.lang-switcher button, button.lang-switcher');
    }
    
    // Initialize the language manager
    async init() {
        // Determine current language from URL or localStorage
        this.currentLanguage = this.getLanguageFromURL() || 
                              localStorage.getItem('selectedLanguage') || 
                              this.detectBrowserLanguage() || 
                              this.defaultLanguage;
        
        // Load translations
        await this.loadLanguage(this.currentLanguage);
        
        // Activate current language button
        this.updateLanguageButtons();
        
        // Add event handlers for language switching buttons
        this.initLanguageSwitcher();
  
        // Apply translations
        this.applyTranslations();
    }
    
    // Get language from URL
    getLanguageFromURL() {
        // Extract language from URL like /HTML/ru/page.html or /ru/page.html
        const path = window.location.pathname;
        
        // Try to find structure /HTML/lang/
        const htmlMatch = path.match(/\/HTML\/(RU|UZ|BG)\//);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1];
        }
        
        // Alternatively try to find structure /lang/
        const simpleMatch = path.match(/\/(RU|UZ|BG)\//);
        if (simpleMatch && simpleMatch[1]) {
            return simpleMatch[1];
        }
        
        return null;
    }
    
    // Detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const lang = browserLang ? browserLang.split('-')[0].toUpperCase() : null;        
        if (lang && this.supportedLanguages.includes(lang)) {
            return lang;
        }
        return null;
    }
    
    // Load language file
    async loadLanguage(language) {
        try {
            // Check cache
            if (sessionStorage.getItem(`translations_${language}`)) {
                this.translations = JSON.parse(sessionStorage.getItem(`translations_${language}`));
                return true;
            }
            
            // Calculate relative path to language files based on current page location
            let basePath = '';
            
            // Check if we're in a language-specific page
            if (window.location.pathname.includes('/HTML/')) {
                basePath = '../../'; // Go up from HTML/lang/ to root
            } else if (window.location.pathname.match(/\/[a-z]{2}\//)) {
                basePath = '../'; // Go up from /lang/ to root
            }
            
            const response = await fetch(`${basePath}langs/${language}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            
            // Cache translations
            sessionStorage.setItem(`translations_${language}`, JSON.stringify(this.translations));
            return true;
        } catch (error) {
            console.error(`Error loading language file for ${language}:`, error);
            if (language !== this.defaultLanguage) {
                console.log(`Falling back to default language: ${this.defaultLanguage}`);
                return this.loadLanguage(this.defaultLanguage);
            }
            return false;
        }
    }
    
    // Apply translations to the page
    applyTranslations() {
        if (!this.translations) return;
        
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.getAttribute('type') === 'placeholder') {
                    element.placeholder = translation;
                } else if (element.tagName === 'INPUT' && element.getAttribute('type') === 'value') {
                    element.value = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Apply translations to placeholder attributes for input fields
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
        
        // Apply translations to alt attributes for images
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.setAttribute('alt', translation);
            }
        });
    }
    
    // Get translation by key
    getTranslation(key) {
        const keyParts = key.split('.');
        let result = this.translations;
        
        for (const part of keyParts) {
            if (!result || typeof result[part] === 'undefined') {
                console.warn(`Translation key not found: ${key}`);
                return null;
            }
            result = result[part];
        }
        
        return result;
    }
    
    // Switch language
    switchLanguage(language) {
        language = language.toUpperCase(); // Убедимся в верхнем регистре
        
        if (!this.supportedLanguages.includes(language)) {
            console.error(`Неподдерживаемый язык: ${language}`);
            return;
        }
        
        // Сохраняем выбор пользователя
        localStorage.setItem('selectedLanguage', language);
        
        // Получаем текущий путь
        const currentPath = window.location.pathname;
        
        // Извлекаем имя текущей страницы из пути
        let currentPage = 'index.html'; // По умолчанию
        const pageMatch = currentPath.match(/\/([^\/]+\.[^\/]+)$/);
        if (pageMatch && pageMatch[1]) {
            currentPage = pageMatch[1];
        }
        
        // Проверяем, находимся ли мы уже в языковой директории HTML
        const htmlLangPathMatch = currentPath.match(/\/HTML\/([A-Z]{2})/i);
        
        if (htmlLangPathMatch) {
            // Заменяем только код языка, сохраняя текущую страницу
            const basePath = currentPath.replace(/\/HTML\/[A-Z]{2}\/.*$/, `/HTML/${language}/`);
            
            // Добавляем имя страницы (если она отличается от index.html или если мы явно указываем страницу)
            if (currentPage !== 'index.html' || currentPath.endsWith('index.html')) {
                window.location.href = basePath + currentPage;
            } else {
                window.location.href = basePath;
            }
        } else {
            // Если мы не в языковом пути, создаем новый
            let basePath = '';
            const pathSegments = currentPath.split('/').filter(Boolean);
            
            // Определяем количество уровней для подъема наверх
            if (pathSegments.length > 0) {
                basePath = '../'.repeat(pathSegments.length);
            }
            
            // Переходим на ту же страницу, но с другим языком
            window.location.href = `${basePath}HTML/${language}/${currentPage}`;
        }
    }
    
    // Update language button states
    updateLanguageButtons() {
        this.languageButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Also update lang attribute on HTML root element
        document.documentElement.lang = this.currentLanguage;
    }
    
    // Initialize language switcher
    initLanguageSwitcher() {
        this.languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const language = button.getAttribute('data-lang');
                this.switchLanguage(language);
            });
        });
    }
}
  
// Create and initialize manager on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nManager();
  window.i18n.init();
});