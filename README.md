# wallscreens
[![Netlify Status](https://api.netlify.com/api/v1/badges/692ef43d-2785-4975-a5c4-9db57a66b315/deploy-status)](https://app.netlify.com/sites/sul-wallscreens/deploys)
[![Current release](https://img.shields.io/github/v/release/sul-dlss/wallscreens)](https://github.com/sul-dlss/wallscreens/releases)
[![Jekyll](https://img.shields.io/badge/powered_by-jekyll-blue.svg)](http://jekyllrb.com/)
[![License](https://img.shields.io/badge/license-apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

curated experiences for touch-screen installations on the stanford campus.  wallscreens.stanford.edu

## local development
wallscreens uses the [jekyll](http://jekyllrb.com/) static site generator, which [requires ruby](http://jekyllrb.com/docs/#prerequisites).

after cloning the repository, install dependencies:
```sh
$ bundle install
```
then, you can start a local development server:
```sh
$ bundle exec jekyll serve  # or with --livereload
```
the site should be visible at http://localhost:4000.

to build the site for production:
```sh
$ bundle exec jekyll build
```
this will generate HTML in a directory called `_site/`.

## wallscreen content
each wallscreen can host several experiences, and experiences can be shared across multiple wallscreens. an experience is a set of curated content, which can take the form of:
- a slideshow of many images with captions
- a guided tour that zooms in on locations in a single high-resolution image
- a video with multiple themed sections, each containing several clips

the content used in the wallscreens and experiences is stored as YAML files in the `_data/` directory. text content and media links supplied by curators are defined for each experience.

the layout of experience pages is defined by the HTML templates in the `_wallscreens/` directory. these templates have access to the "global" data in the `_data/` folder via `site.wallscreens`.

### local media
media referenced in wallscreens can be checked-in to the git repository if rights statements permit it. otherwise, files should be downloaded and stored in the `local-media/` directory so that they can be referenced during the jekyll build process.

when adding media to an experience, you can use the custom `file_or_link` liquid tag to insert a file from `local-media/`, falling back to a supplied URL if the file isn't present locally:
```html
<img src="{% file_or_link {{local_file}} {{image_url}} %}">
```
note the lack of whitespace around interpolated values (`{{local_file}}`); this is necessary for the tag to parse correctly. when the path pointed to by `local_file` can't be found or wasn't supplied, jekyll will issue a warning when building and use the value of `image_url` instead.

