FROM node:18-alpine AS build
WORKDIR /app

# Copy both package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy your source and build
COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

