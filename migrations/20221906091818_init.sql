-- +goose Up
-- +goose StatementBegin
CREATE TABLE documents (
    id bigserial NOT NULL,
    slug varchar(10) NOT NULL,
    content text NOT NULL,
    created_at timestamptz NOT NULL,

    CONSTRAINT documents_pkey PRIMARY KEY (id),
    CONSTRAINT idx_documents_slug UNIQUE (slug)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP DATABASE documents
-- +goose StatementEnd
