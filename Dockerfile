FROM kaptest/docker-atomapi-node
MAINTAINER Atom Api Team<atomapi@kaplan.com>

ARG BRANCH
ARG SHA
ARG BUILD_NUMBER

COPY package.json /usr/src/atom/package.json
WORKDIR /usr/src/atom
RUN npm install --production --loglevel warn

# Deploy app
COPY . /usr/src/atom

# build.json
RUN echo "{ \"status\": \"Ok\", \"result\": { \"version\": \"1.0.0\", \"informationalVersion\": \"branchName: $BRANCH, SHA: $SHA, buildDate: $(date), buildNumber: $BUILD_NUMBER\" } }" > build.json

# Expose port
EXPOSE 80

# Run supervisor as foreground process
CMD bash -c "./node_modules/.bin/knex migrate:latest && /usr/bin/supervisord"

