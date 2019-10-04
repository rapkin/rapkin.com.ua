FROM node:12.10-alpine as build
WORKDIR /app
COPY package* /app/
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/shapre/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
