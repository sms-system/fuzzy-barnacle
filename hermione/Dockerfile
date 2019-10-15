FROM node:latest
USER node

RUN mkdir /home/node/.npm-global \
    mkdir -p /home/node/app \
    chown -R node:node /home/node/.npm-global

WORKDIR /home/node/app

ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install hermione@2.13.0 -g
RUN npm install html-reporter -g

CMD ["hermione"]