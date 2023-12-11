package utils

import (
	"math/rand"
	"time"
)

var letterRunes = []rune("abcdef1ghijkl2mnopq3rstu4vwxy5zABC6DEFG7HIJK8LMNO9PQRST0UVWXYZ")

// RandStringRunes 随机数生成
func RandStringRunes(n int) string {
	rand.NewSource(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
