# React Router 앱용 Dockerfile
# 로컬에서 빌드하여 업로드하는 방식

FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json* ./

# 모든 의존성 설치
RUN npm ci

# 빌드된 앱을 컨테이너로 복사
COPY ./build ./build

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]