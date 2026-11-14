# Stage 1
FROM hub.kai.id/baseimage/base/node:26-alpine AS builder

WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA CONFIG — index.html & halaman SPA selalu revalidate (no-cache),
RUN echo 'map $uri $cache_control { \
    default "no-cache"; \
    ~^/assets/ "public, max-age=31536000, immutable"; \
} \
server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    add_header X-Frame-Options "DENY" always; \
    add_header Content-Security-Policy "frame-ancestors '"'"'none'"'"'" always; \
    add_header Cache-Control $cache_control; \
    location /assets/ { \
        try_files $uri =404; \
    } \
    location / { \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
