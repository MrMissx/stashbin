FROM golang:1.21-alpine AS build

WORKDIR /app

RUN apk update && \
    apk add --no-cache \
    nodejs \
    npm \
    make

RUN npm i -g pnpm

COPY Makefile ./
COPY go.mod go.sum package.json pnpm-lock.yaml ./

RUN make install
RUN go mod verify
RUN go install github.com/a-h/templ/cmd/templ@latest

COPY . .

RUN make generate
RUN make build


FROM alpine as runner

WORKDIR /app

COPY --from=build /app/stashbin .
COPY --from=build /app/public ./public
COPY ./database/migrations ./database/migrations

CMD ["./stashbin"]
