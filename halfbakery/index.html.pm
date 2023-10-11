#lang pollen
◊(require "../ptree-utils.rkt")

◊define-meta[date]{19990208}
◊define-meta[title]{index}
◊define-meta[blurb]{index blurb}

Welcome to the halfbakery; half-baked ideas fresh out the oven since 1999.

◊(apply ul (map li (ptree->n-sum "halfbakery.ptree" 3)))

◊(select-from-metas 'here-path metas)
