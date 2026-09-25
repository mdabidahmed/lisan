# syntax=docker/dockerfile:1

# ── Stage 1: dependencies ────────────────────────────────────────────────────
# Isolated so a source-only change never invalidates the npm install layer.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# GNU gzip (busybox's applet has no -k) and brotli, for pre-compressing the bundle.
RUN apk add --no-cache gzip brotli

COPY --from=deps /app/node_modules ./node_modules

# Config first: it changes far less often than src/, so these layers stay warm.
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.node.json vite.config.ts vite-env.d.ts eslint.config.js ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm run build

# Pre-compress every text asset so nginx serves it via gzip_static/brotli_static and spends
# no CPU per request. Files under 1 KB are skipped — framing costs more than it saves.
RUN find dist -type f -size +1k \
      \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' \
         -o -name '*.json' -o -name '*.webmanifest' -o -name '*.txt' \) \
    | while IFS= read -r file; do \
        gzip -9 -k "$file"; \
        brotli -q 11 -k "$file"; \
      done

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# The container runs unprivileged, so: drop the `user` directive (it only warns when the
# master is not root), create the optional brotli include directory referenced by
# nginx.conf, and hand nginx's writable paths to the image's existing `nginx` user.
RUN sed -i '/^user  *nginx;/d' /etc/nginx/nginx.conf \
    && mkdir -p /etc/nginx/conf.d/brotli-enabled /var/cache/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html \
    && chmod -R a-w /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

STOPSIGNAL SIGQUIT

# The PID file must live somewhere the nginx user can write; /var/run is root-owned.
CMD ["nginx", "-g", "daemon off; pid /tmp/nginx.pid;"]
