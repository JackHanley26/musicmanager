# Use Node v4 as the base image.
FROM node:4

ADD . /app

RUN npm install -g bower

# Install dependencies
RUN cd /app; \
    npm install; \
    bower install --allow-root

# Expose our server port.
EXPOSE 3001


# Run our app.
CMD ["node", "/app/app.js"]
