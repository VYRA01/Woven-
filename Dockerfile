# Meatologia — site + booking API.
# No dependencies to install; this is just Node and the source.
FROM node:20-alpine

WORKDIR /app
COPY . .

# The diary lives on a mounted volume so redeploys do not wipe the bookings.
ENV BOOKINGS_FILE=/data/bookings.json
ENV PORT=3000
VOLUME ["/data"]
EXPOSE 3000

RUN addgroup -S app && adduser -S app -G app && mkdir -p /data && chown app:app /data
USER app

CMD ["node", "server/server.js"]
