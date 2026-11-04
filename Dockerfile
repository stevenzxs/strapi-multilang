# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /opt/app
ENV STRAPI_TELEMETRY_DISABLED=true
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY config ./config
COPY src ./src
COPY public ./public
COPY scripts/start.cjs ./scripts/start.cjs
ENV NODE_ENV=production
RUN NODE_OPTIONS=--max-old-space-size=3072 npm run build \
    && test -s build/index.html \
    && npm prune --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim AS runtime
WORKDIR /opt/app
ENV NODE_ENV=production STRAPI_TELEMETRY_DISABLED=true HOST=0.0.0.0 PORT=1337
RUN groupadd --gid 1001 strapi \
    && useradd --uid 1001 --gid 1001 --create-home strapi
COPY --from=build --chown=1001:1001 /opt/app /opt/app
RUN mkdir -p .tmp database/migrations public/uploads \
    && chown -R 1001:1001 .tmp database public/uploads
USER 1001:1001
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:1337/_health').then(r=>process.exit(r.status===204?0:1)).catch(()=>process.exit(1))"
CMD ["node", "scripts/start.cjs"]
