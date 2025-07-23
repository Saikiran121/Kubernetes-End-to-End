# Stage 1: Build the React app
FROM node:18 AS build
WORKDIR /app

# Copy package files and install deps (including react-scripts)
COPY package.json  ./
RUN npm install

# Copy source and public assets
COPY public ./public
COPY src ./src

# Build for production
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
