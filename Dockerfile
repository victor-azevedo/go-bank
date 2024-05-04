FROM node:20.12.2

WORKDIR /app

COPY . .

RUN npm cache clean --force && \
    npm install -g npm@latest && \
    npm install

RUN npm run build

CMD ["npm", "run", "start"]