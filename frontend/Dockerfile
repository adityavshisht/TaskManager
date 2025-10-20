# --- frontend Dockerfile ---
FROM nginx:stable-alpine
COPY frontend /usr/share/nginx/html
COPY frontend/docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
