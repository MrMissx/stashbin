FROM node:22-bookworm-slim AS build

SHELL ["/bin/bash", "-lc"]

ARG GO_VERSION=1.25.12
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      make \
      git \
      bash \
      xz-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL "https://dl.google.com/go/go${GO_VERSION}.linux-arm64.tar.gz" -o /tmp/go.tgz && \
    tar -C /usr/local -xzf /tmp/go.tgz && \
    rm /tmp/go.tgz

ENV PATH=/usr/local/go/bin:$PATH
RUN /usr/local/go/bin/go version && ln -sf /usr/local/go/bin/go /usr/bin/go && go version

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY Makefile ./
COPY go.mod go.sum ./
RUN make install
RUN go mod verify
RUN go install github.com/a-h/templ/cmd/templ@latest
RUN go mod tidy

COPY . .
RUN make generate
RUN make build

FROM debian:bookworm-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/stashbin .
COPY --from=build /app/public ./public
COPY ./database/migrations ./database/migrations

EXPOSE 8080
CMD ["./stashbin"]
