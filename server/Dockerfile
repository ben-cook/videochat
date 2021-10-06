# Copy files and install dependencies
FROM node:16 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

# Build the typescript files
FROM base as production

ENV NODE_PATH=./build

RUN npm run build

EXPOSE 8000

CMD ["node", "build/server.js"]