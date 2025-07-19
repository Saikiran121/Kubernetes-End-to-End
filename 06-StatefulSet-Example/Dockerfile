FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY test-replica.js ./
ENTRYPOINT ["node", "test-replica.js"]

