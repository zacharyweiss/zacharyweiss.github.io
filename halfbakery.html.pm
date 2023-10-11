#lang pollen
◊(require pollen/pagetree racket/list racket/format racket/string)

Future home to half-baked ideas.

◊(define (ptree-take-n folder file n [root "pagetree-root"] [ext ".pm"])
   (map (λ(node) (string-append folder (symbol->string node) ext))
        (take (children (string->symbol root) (get-pagetree (string-append folder file))) n)))

◊(define (node->v node [field "date"])
   (select-from-metas (string->symbol field) node))
         
◊(apply ul
   (map (compose li node->v) (ptree-take-n "halfbakery/" "halfbakery.ptree" 3)))
         
