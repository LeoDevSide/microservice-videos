FROM node:20-slim

RUN apt-get update -y && apt-get install -y

WORKDIR  /home/node/app

RUN npm install -g @nestjs/cli@10.1.0

USER node

CMD [ "tail", "-f", "/dev/null" ]