# Pull the node image
FROM node:12.16.1-slim

# create a new directory and set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy the package.json files to the docker directory
COPY ./package.json /usr/src/app
COPY ./package-lock.json /usr/src/app

# Install dependencies
RUN npm install

# Copy the rest of the files to the docker directory
COPY . .

# Make the start script executable
RUN chmod u+x /usr/src/app/scripts/start.sh

# Create a user to run the app on docker
# Necessary for security reasons
RUN useradd -r -u 1234 -U docker-user

# Change the ownership of the working dir to the new user
# and give write access to the folder.
RUN chown -R docker-user:docker-user ./ && chmod 755 ./

USER docker-user
# EXPOSE $PORT

CMD [ "sh", "scripts/start.sh" ]

