FROM node:20-slim

RUN apt-get update -y && apt-get install -y

WORKDIR  /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]