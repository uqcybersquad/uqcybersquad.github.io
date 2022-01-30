# uq cybersquad website

## local testing

install hugo, example for debian/ubuntu based systems:
```
apt install hugo
```

locally running:
```
hugo server

```

(educenter is the theme, under MIT license distributed w/ the repo)


## making new content

`hugo new <section>/<title>.md`

example:

```
hugo new posts/hello-world.md
```

then make sure you remove `draft: true` in the markdown metadata so that it shows up.

## TODO

- add custom uq cybersquad theme