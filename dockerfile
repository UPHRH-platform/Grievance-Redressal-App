FROM node:16-alpine AS build


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .
COPY ./src/environments/environment.prod.ts ./src/environments/environment.ts

RUN npm run build --prod


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*


COPY --from=build /app/dist/grievance-app /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
