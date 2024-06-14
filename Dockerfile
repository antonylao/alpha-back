# docker build -t back_express_image . 
# docker run --name back_express_container back_express_image

FROM node:21.1.0-alpine3.18 AS build_stage

LABEL maintainer="alpha"

ENV TZ=Europe/Paris

RUN apk --update add --no-cache tzdata \
  && cp /usr/share/zoneinfo/Europe/Paris /etc/localtime \
  && echo "Europe/Paris" > /etc/timezone\
  && apk del tzdata

COPY . ./app

WORKDIR /app

RUN npm install 
# --only=production

RUN npm run build

FROM build_stage AS production_stage

COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/package.json ./package.json
COPY --from=build_stage /app/build ./build

CMD ["npm", "run","linux:start:prod"]
