package model

import "time"

type Document struct {
	Id        uint       `json:"id"`
	Slug      string     `json:"key"`
	Content   string     `json:"content"`
	CreatedAt *time.Time `json:"date"`
	Views     uint       `json:"views"`
}
