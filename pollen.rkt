#lang racket/base
(require pollen/core pollen/tag pollen/pagetree racket/list racket/format racket/string)

(provide (all-defined-out))
(define headline (default-tag-function 'h2))
(define items (default-tag-function 'ul))
(define item (default-tag-function 'li 'p))
(define (link url text) `(a ((href ,url)) ,text))


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

(provide ptree-children pnode->src 
         srcnode->v pnode->v ptree->n-sum
)
