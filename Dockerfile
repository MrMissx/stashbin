FROM golang:1.24 AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    make \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm

COPY Makefile ./
COPY go.mod go.sum package.json pnpm-lock.yaml ./

RUN make install
RUN go mod verify
RUN go install github.com/a-h/templ/cmd/templ@latest

COPY . .

RUN make generate
RUN make build


FROM debian:bookworm-slim AS runner

WORKDIR /app

COPY --from=build /app/stashbin .
COPY --from=build /app/public ./public
COPY ./database/migrations ./database/migrations

CMD ["./stashbin"]
