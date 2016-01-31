#gulp-winify changelog


##0.1.4 (01/25/16)

- Add unit and end-to-end testing with mocha and chai
- Use default properties for each module to reset to on init
- Bugfix: User config wasn't applied when processing embedded css
- Bugfix: Charactrer not reset to start when last valid character reached and selector length extended to 2

##0.1.3 (01/15/16)

###Refactor

- Split processors.js into separate files for HTML, CSS and JS
- Follow felixge's [style guide](https://github.com/felixge/node-style-guide)
- Improve readability and clean up code


##0.1.2 (01/11/16)

###Prevent ID tags from being minified unless `minifyIds` is set to true in the gulpfile's winify call

Also:
- Fix issues preventing user settings from being applied in builds
- Prevent '.' being prepended to classes in the html file output


##0.1.1 (01/11/16)

###Close pseudo-selector parentheses

- Refactor extracting classes and id's from css selector strings
- Update Readme


##0.1.0 (01/11/16)

###Initial Release

- Minify CSS Selectors
- Add Minified classes to HTML