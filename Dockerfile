ARG NODE_VERSION_TAG=fermium-alpine

FROM node:$NODE_VERSION_TAG
# Create the directory for our application
RUN mkdir -p /usr/src/app
# Set the current working directory
WORKDIR /usr/src/app

# Reserve the build arg to allow details to be injected from codeship
ARG PRIVATE_SSH_KEY
# Install the basic requirements
RUN apk update
RUN apk add openssh
RUN apk add git

# Needed for @google-cloud/pubsub
RUN apk add libc6-compat

# Prepare the required ssh details
RUN mkdir ~/.ssh
RUN ssh-keyscan -T 10 github.com >> ~/.ssh/known_hosts

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Keep this one command, to not expose the secret.
RUN  echo -e $PRIVATE_SSH_KEY >> $HOME/.ssh/id_rsa && chmod o-rw $HOME/.ssh/id_rsa && chmod g-rw $HOME/.ssh/id_rsa && npm install && rm $HOME/.ssh/id_rsa

# Add the application source code
COPY . ./

# Build typescript
RUN npm run build-ts

EXPOSE 3370

CMD ["node", "dist/http_server"]
