# Portfolio: a static site. Built with Node, served by nginx as a non-root user.
#
#   docker build -t portfolio .
#   docker run --rm -p 8080:8080 portfolio     → http://localhost:8080
#
# VITE_SITE_URL is the public address written into the canonical link, the
# Open Graph tags, sitemap.xml, robots.txt and llms.txt at build time.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_SITE_URL=https://moanesbbr.tunispare.com
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

# nginx's official unprivileged image: listens on 8080, runs as user 101.
FROM nginxinc/nginx-unprivileged:1.31.5-alpine-slim
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
