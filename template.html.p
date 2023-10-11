<!DOCTYPE html>

◊(require racket/string racket/list)

◊; if an index page, returns the containing dir for canonical link, else full path
◊(define (index-split-path) 
   (define sp (string-split (symbol->string here) "index.html"))
   (if (empty? sp) "" (first sp)))
◊(define domain https://zachary.ws/)
◊(define default-title "Zachary Weiss")

<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>◊(or (select-from-metas 'title metas) default-title)</title>
    <link rel="canonical" href="◊|domain|◊|index-split-path|" />
    <link rel="stylesheet" type="text/css" href="../styles.css" />
</head>
<body>
<article>
    ◊(->html doc)
</article>
</body>
</html>

