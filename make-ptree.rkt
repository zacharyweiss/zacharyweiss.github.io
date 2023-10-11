#lang racket
(require racket/string pollen/pagetree pollen/core)

(define (sort-by-date-val lst [field "date"])
  (define (get-val obj)
    (string->number (select-from-metas (string->symbol field) obj)))
  (define (obj-ge? a b)
    (>= (get-val a) (get-val b)))
  (sort lst obj-ge?))

(define (include-files extension [field "date"])
  (map (λ(str)(string->symbol (format "~a" (string-replace str extension "html"))))
       (sort-by-date-val (remove "index.html.pm"
         (filter (λ(str) (string-suffix? str extension))
                 (map path->string (directory-list "."))))
        field)))

(define (make-pt [field "date"] [ext "html.pm"]) `(pagetree-root ,@(include-files ext field)))

(provide make-pt)
