# base image that the container will be built on top of
FROM node:latest

# working directory for any command that follows it in the Dockerfile
WORKDIR /app

# copy local files from the host machine to the current working directory
COPY . /app

# execute commands that will run during the image build process
RUN npm install

# tell Docker which ports the container will listen on at runtime
EXPOSE 3000

CMD ["npm", "run", "start"];