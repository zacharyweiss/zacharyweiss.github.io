#lang racket/base
(require pollen/core pollen/tag pollen/pagetree racket/list racket/format racket/string)

(provide (all-defined-out))
(define headline (default-tag-function 'h2))
(define items (default-tag-function 'ul))
(define item (default-tag-function 'li 'p))
(define (link url text) `(a ((href ,url)) ,text))

