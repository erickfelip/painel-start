FROM node:lts-alpine3.20 as build

WORKDIR /srv/app

ENV PATH /srv/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . ./

RUN npm install
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /srv/app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx"]
