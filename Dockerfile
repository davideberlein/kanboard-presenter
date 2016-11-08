FROM node:4.6

WORKDIR /opt/kanboard-presenter

ADD . /opt/kanboard-presenter

RUN npm install -g bower
RUN npm install
RUN bower install --allow-root

CMD ["node", "server.js"]

EXPOSE 16565
