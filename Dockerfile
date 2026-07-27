FROM --platform=$BUILDPLATFORM golang:1.25 AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg make && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm

COPY Makefile ./
COPY go.mod go.sum package.json pnpm-lock.yaml ./

RUN make install
RUN go mod verify
RUN go install github.com/a-h/templ/cmd/templ@latest

COPY . .

ARG TARGETOS
ARG TARGETARCH
RUN make generate
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o stashbin .

FROM debian:bookworm-slim AS runner

WORKDIR /app

COPY --from=build /app/stashbin .
COPY --from=build /app/public ./public
COPY ./database/migrations ./database/migrations

EXPOSE 8080
CMD ["./stashbin"]
