CREATE TABLE documents (
    id bigserial NOT NULL PRIMARY KEY,
    slug varchar(10) NOT NULL,
    content text NOT NULL,
    created_at timestamptz NOT NULL,

    CONSTRAINT idx_documents_slug UNIQUE (slug)
);
