#HOW IT WORKS
#A Dockerfile runs one command at a time, so  it is important to put the steps in the right order
#The steps/layers that doesn't chage are cached on running the docker image the first time. The reason we copy package.json before the rest 
#of the application is because this file doesn't change too often, so it can be cached. If package.json is cached, then so is npm install, 
#because no changes there either, and then it is just the source code that needs to be rebuild. This saves a lot of time.

#the image we are starting from, in this case the official node js image --v 15
FROM node:15 
#Specifying the working directory in the node js (optional)
WORKDIR /app
#Copy package.json to the working directory ( . ), which we just stated was /app above 
COPY package.json .
#Run the app
RUN npm install
#Should we npm install
 ARG NODE_ENV
 RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
#Copy current directory to the /app
COPY . ./
#Environment port
ENV PORT 8000
#Expose port 8000
EXPOSE $PORT
#Entrypoint at runtime (use node and run index.js)
CMD ["node", "index.js"]
                        