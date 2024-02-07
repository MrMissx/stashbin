package response

type JSON map[string]interface{}

type Result struct {
	Ok      bool        `json:"ok"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func NewResult(msg string, data interface{}) *Result {
	return &Result{Ok: true, Message: msg, Data: data}
}
