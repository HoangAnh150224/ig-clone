# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy source and build
COPY . .
# We can provide VITE_API_BASE_URL during build, or hardcode it for proxy
ENV VITE_API_BASE_URL=/api/v1
RUN npm run build

# Stage 2: Runtime
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
