# Используем официальный образ Nginx
FROM nginx:stable-alpine

# Копируем собственный конфиг nginx
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Копируем все файлы проекта в директорию, обслуживаемую Nginx
COPY . /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]