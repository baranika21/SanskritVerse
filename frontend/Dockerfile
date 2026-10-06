# ==============================================================================
# SANSKRITVERSE Frontend Dockerfile
# Multi-stage Vite build served via Nginx
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
RUN npm ci

COPY public ./public
COPY src ./src
RUN npm run build

# Nginx Production Stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
