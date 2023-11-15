FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENV TZ Asia/Bangkok

CMD [ "npm", "start" ]