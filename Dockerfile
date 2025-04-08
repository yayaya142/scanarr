
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directories for Scanarr data
RUN mkdir -p /config /reports
VOLUME /config /media

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
