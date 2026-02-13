# 프론트엔드 빌드 및 배포 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 빌드 인자 정의
ARG VITE_API_URL=http://leevelop.com:3002/api
ENV VITE_API_URL=$VITE_API_URL

# 패키지 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
