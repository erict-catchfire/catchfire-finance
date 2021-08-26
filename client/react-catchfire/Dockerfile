FROM node:10.19.0

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
