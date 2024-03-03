package response

import (
	"net/http"

	"github.com/lib/pq"
)

type ErrorResponse struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}

func NewError(msg string) *ErrorResponse {
	return &ErrorResponse{Ok: false, Message: msg}
}

func PostgreErrToResponse(err error) (int, *ErrorResponse) {
	pgErr, ok := err.(*pq.Error)
	if !ok {
		return http.StatusInternalServerError, ErrInternalServerError
	}

	switch pgErr.Code {
	case "23505":
		return http.StatusConflict, NewError("row already exists")
	default:
		return http.StatusInternalServerError, ErrInternalServerError
	}
}

var (
	ErrInternalServerError = NewError("internal server error")
	ErrDocumentNotFound    = NewError("document not found")
	ErrInvalidBody         = NewError("invalid body")
	ErrContentEmpty        = NewError("content is empty")
	ErrNoKeyQuery          = NewError("no document key provided")
)
