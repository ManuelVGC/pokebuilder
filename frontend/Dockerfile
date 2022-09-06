FROM node:18 as build-stage


RUN mkdir -p /usr/src/app-frontend


WORKDIR /usr/src/app-frontend

COPY package.json /usr/src/app-frontend
COPY package-lock.json /usr/src/app-frontend


RUN npm install


COPY . /usr/src/app-frontend

RUN npm run build


FROM nginx:1.13.12-alpine as production-stage

COPY --from=build-stage /usr/src/app-frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
