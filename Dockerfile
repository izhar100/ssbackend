FROM ghcr.io/puppeteer/puppeteer:21.6.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/user/bin/chromium

WORKDIR /user/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node","index.js"]