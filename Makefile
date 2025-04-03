VERSION=$(shell jq -r .version package.json)
DATE=$(shell date +%F)

all: index.html

clean:
	rm -f index.html

index.html: src/index.md src/template.html Makefile
	pandoc --toc -s --css src/reset.css --css src/index.css -Vversion=v$(VERSION) -Vdate=$(DATE) -i $< -o $@ --template=src/template.html

.PHONY: all clean
