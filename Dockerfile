FROM golang:1.26 AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    unzip \
    make \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY Makefile ./
COPY go.mod go.sum package.json bun.lock ./

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