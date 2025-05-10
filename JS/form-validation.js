/**
 * YurYor - JavaScript для валидации форм
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация валидации форм
    initFormsValidation();
});

/**
 * Инициализация валидации форм
 */
function initFormsValidation() {
    // Форма контакта
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });
    }

    // Добавляем маску для телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    if (phoneInputs.length > 0) {
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                applyPhoneMask(this);
            });
        });
    }

    // Валидация для других форм на сайте может быть добавлена аналогично
}

/**
 * Валидация формы контакта
 * @param {HTMLFormElement} form Форма для валидации
 * @returns {boolean} Результат валидации
 */
function validateContactForm(form) {
    let isValid = true;
    const errorClass = 'input-error';

    // Удаляем предыдущие сообщения об ошибках
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Сбрасываем стили ошибок
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.remove(errorClass));

    // Проверка имени
    const nameInput = form.querySelector('#name');
    if (nameInput && nameInput.value.trim() === '') {
        showError(nameInput, 'Пожалуйста, введите ваше имя');
        isValid = false;
    }

    // Проверка телефона
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        if (phoneValue.length < 9) {
            showError(phoneInput, 'Пожалуйста, введите корректный номер телефона');
            isValid = false;
        }
    }

    // Проверка email
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Пожалуйста, введите корректный email');
            isValid = false;
        }
    }

    // Проверка типа запроса
    const requestTypeInput = form.querySelector('#requestType');
    if (requestTypeInput && requestTypeInput.value === '') {
        showError(requestTypeInput, 'Пожалуйста, выберите цель обращения');
        isValid = false;
    }

    // Проверка согласия на обработку данных
    const agreementInput = form.querySelector('#agreement');
    if (agreementInput && !agreementInput.checked) {
        showError(agreementInput, 'Необходимо согласие на обработку персональных данных');
        isValid = false;
    }

    return isValid;
}

/**
 * Отображение ошибки валидации
 * @param {HTMLElement} element Элемент с ошибкой
 * @param {string} message Сообщение об ошибке
 */
function showError(element, message) {
    element.classList.add('input-error');

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;

    const parent = element.parentElement;

    // Если элемент чекбокс, добавляем сообщение после label
    if (element.type === 'checkbox') {
        const label = parent.querySelector('label');
        if (label) {
            label.after(errorMessage);
        } else {
            parent.appendChild(errorMessage);
        }
    } else {
        // Для других элементов добавляем после самого элемента
        element.after(errorMessage);
    }
}

/**
 * Применение маски для телефона
 * @param {HTMLInputElement} input Поле ввода телефона
 */
function applyPhoneMask(input) {
    // Удаляем все символы, кроме цифр
    let value = input.value.replace(/\D/g, '');

    // Формируем маску в зависимости от количества цифр
    if (value.length > 0) {
        // Для узбекских номеров (пример)
        if (value.startsWith('998')) {
            value = value.substring(0, 12); // Ограничиваем 12 цифрами (код страны + номер)

            if (value.length > 3) {
                value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
            } else {
                value = '+' + value;
            }

            if (value.length > 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }

            if (value.length > 11) {
                value = value.substring(0, 11) + ' ' + value.substring(11);
            }
        }
        // Для болгарских номеров
        else if (value.startsWith('359')) {
            value = value.substring(0, 12); // Ограничиваем 12 цифрами

            if (value.length > 3) {
                value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
            } else {
                value = '+' + value;
            }

            if (value.length > 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }
        }
        // Для остальных номеров
        else {
            if (value.length > 0) {
                value = '+' + value;
            }
        }
    }

    input.value = value;
}

/**
 * Отправка формы контакта
 * @param {HTMLFormElement} form Форма для отправки
 */
function submitContactForm(form) {
    // Показываем индикатор загрузки
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

    // В реальном проекте здесь будет отправка данных на сервер через AJAX
    // Например, с использованием fetch API

    // Имитация отправки (в реальном проекте замените на реальный запрос)
    setTimeout(function() {
        // Возвращаем кнопку в исходное состояние
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Показываем сообщение об успешной отправке
        form.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Спасибо за ваше обращение!</h3>
                <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
            </div>
        `;
    }, 1500);
}