###################
# DEVELOPMENT
###################

FROM node:18.15-alpine3.17 As dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

###################
# BUILD PRODUCTION
###################

FROM node:18.15-alpine3.17 As build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY --from=dev /usr/src/app/dist ./dist

###################
# PRODUCTION
###################

FROM node:18.15-alpine3.17 As prod
WORKDIR /app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
USER node
CMD [ "node", "dist/main.js" ]
