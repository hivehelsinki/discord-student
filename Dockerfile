FROM node:20-alpine3.16

RUN mkdir -p /app 
WORKDIR /app

RUN apk update && apk add bash
COPY package.json .
COPY package-lock.json .  
RUN npm install

COPY . /app 
