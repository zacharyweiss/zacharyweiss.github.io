#lang racket
(require racket/string pollen/pagetree pollen/core)

;; ptree building and sorting functions
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


;; my quick-n-dirty solutions for using ptrees as "dynamic" sources of meta vals
;; after generating the ptree(s) in a sorted order.
;; undoubtedly there are better / more lisp-y/racket-y/pollen-y ways to do this
;; but works for now.
(define (ptree-children file [path ""] [root "pagetree-root"])
  (children (string->symbol root) (get-pagetree (string-append path file))))

(define (pnode->src node [path ""] [ext ".pm"])
  (string-append path (symbol->string node) ext))

(define (srcnode->v node [field "date"])
  (select-from-metas (string->symbol field) node))

(define (pnode->v node [path ""] [ext ".pm"] [field "date"])
  (srcnode->v (pnode->src node path ext) field))

;; to be refined once I have a proper format for both display & writing
(define (srcnode->sum node)
  (string-append (srcnode->v node "title") (srcnode->v node "blurb")))

(define (ptree->n-sum file n [path ""] [ext ".pm"] [root "pagetree-root"])
  (map (compose srcnode->sum (λ(n) (pnode->src n path ext))) (take (ptree-children file path root) n)))


(provide make-pt
         ptree-children pnode->src 
         srcnode->v pnode->v 
         ptree->n-sum)
         
