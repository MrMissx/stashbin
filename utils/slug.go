package utils

import "math/rand"

const length = 10

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

func CreateSlug() string {
	b := make([]rune, length)
	idx := len(letters)

	for i := range b {
		b[i] = letters[rand.Intn(idx)]
	}
	return string(b)
}
