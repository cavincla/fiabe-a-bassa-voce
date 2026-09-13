ARG NODE_VERSION=22

#
# STAGE 1 - Base
#
# Common base for dev/build: Node.js with a non-root user, same
# uid/gid-fixup pattern used by cavincla/python images (see
# ~/personale/docker-image-python) — no equivalent Node base image exists
# yet, so it's reproduced here directly (same as fanta-web).
#
FROM node:${NODE_VERSION}-slim AS base

ARG DOCKER_USER=bob
ARG DOCKER_GROUP=bob

ENV DOCKER_USER=${DOCKER_USER} \
    DOCKER_GROUP=${DOCKER_GROUP}

# node:slim already ships a uid/gid 1000 "node" user — rename it instead
# of creating a colliding one, so bob keeps the same fixed 1000:1000.
RUN set -ex; groupmod -n ${DOCKER_GROUP} node && \
    usermod -l ${DOCKER_USER} -d /home/${DOCKER_USER} -m node

RUN mkdir /app && chown -R ${DOCKER_USER}:${DOCKER_GROUP} /app
WORKDIR /app

# Pre-create node_modules owned by the app user: Docker seeds a fresh named
# volume from whatever already exists at the mount point in the image, so
# this is what makes the bind-mounted /app/node_modules volume writable by
# bob instead of defaulting to root.
RUN mkdir -p /app/node_modules && chown -R ${DOCKER_USER}:${DOCKER_GROUP} /app/node_modules

# npm-installed binaries (next, eslint, ...) end up in node_modules/.bin
ENV PATH="/app/node_modules/.bin:${PATH}"

USER ${DOCKER_USER}

#
# STAGE 2 - Dev
#
# Image used for local development
#
FROM base AS dev

ARG FIX_UID
ARG FIX_GID
ARG DOCKER_USER=bob
ARG DOCKER_GROUP=bob

USER 0
COPY .build/dockerfiles/fix-perm.sh /fix-perm.sh
RUN chmod +x /fix-perm.sh && /fix-perm.sh

# Run as normal user
USER ${DOCKER_USER}

# Set entrypoint so the container will run without doing anything
ENTRYPOINT ["/bin/sleep", "infinity"]

#
# STAGE 3 - Build
#
# Image used for local development
#
FROM dev AS build

#
# This is empty but it is left defined to maintain the same
# three-stages-structure of other languages' configuration
#

#
# STAGE 4 - Assets
#
# Installs dependencies and compiles the production build (Next.js
# standalone output: a self-contained server bundle with only the
# node_modules it actually needs, instead of the full dev tree).
#
FROM base AS assets

ARG DOCKER_USER=bob
ARG DOCKER_GROUP=bob

COPY --chown=${DOCKER_USER}:${DOCKER_GROUP} app/package*.json ./
RUN npm ci

COPY --chown=${DOCKER_USER}:${DOCKER_GROUP} app/ .

# Le fiabe sono file YAML sotto app/content/ (copiati con il resto del
# sorgente qui sopra): `next build` li legge, li valida e pre-genera una pagina
# statica per ciascuna. Nessun database da raggiungere in fase di build.
RUN npm run build

#
# STAGE 5 - Dist
#
# Image used for application distribution: the standalone Next.js server,
# no dev dependencies or source maps included.
#
FROM node:${NODE_VERSION}-slim AS dist

ARG DOCKER_USER=bob
ARG DOCKER_GROUP=bob

RUN set -ex; groupmod -n ${DOCKER_GROUP} node && \
    usermod -l ${DOCKER_USER} -d /home/${DOCKER_USER} -m node

WORKDIR /app

COPY --from=assets --chown=${DOCKER_USER}:${DOCKER_GROUP} /app/.next/standalone ./
COPY --from=assets --chown=${DOCKER_USER}:${DOCKER_GROUP} /app/.next/static ./.next/static
COPY --from=assets --chown=${DOCKER_USER}:${DOCKER_GROUP} /app/public ./public

USER ${DOCKER_USER}

ENV PORT=3000 \
    HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
