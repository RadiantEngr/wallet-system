FROM node:14.15.4

WORKDIR /code

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn tsc

EXPOSE 3000

CMD ["yarn", "start"]