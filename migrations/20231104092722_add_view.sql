-- +goose Up
-- +goose StatementBegin
ALTER TABLE documents ADD views int8 NOT NULL DEFAULT 0
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE documents DROP COLUMN views
-- +goose StatementEnd
