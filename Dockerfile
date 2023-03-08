FROM node:15.1.0

RUN mkdir -p /app 
WORKDIR /app

COPY package.json .
COPY package-lock.json .  
RUN npm install

COPY . /app 
