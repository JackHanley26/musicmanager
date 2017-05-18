# Use Node v4 as the base image.
FROM node:4

ADD . /app

# Install dependencies
RUN cd /app; \  
     npm install

# Expose our server port.
EXPOSE 4001
EXPOSE 4002

# Run our app.
CMD ["node", "/app/app.js"]  
