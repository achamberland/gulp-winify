'use strict'

var chai = require('chai')
var chaiString = require('chai-string')
var should = chai.should()
var sinon = require('sinon')
chai.use(chaiString)

var File = require('vinyl')
var fs = require('fs')
var concatStream = require('concat-stream')

var Winify = require('../')
var Config = require('../lib/Config.js')
var Character = require('../lib/Characters.js')
var Processors = require('../lib/Processors.js')
var Selectors = require('../lib/Selectors.js')
var Validation = require('../lib/Validation.js')

var processHTML = require('../lib/processors/processHTML.js')
var processCSS = require('../lib/processors/processCSS.js')
var processJS = require('../lib/processors/processJS.js')



describe('gulp-winify', function() {

  describe('Config Module', function(){

    describe('Config.init( options )', function(){

      it ('should use default config if no options passed', function(done){

        Config.init().should.eql(Config.defaults)
        done()

      })

      it ('should apply options passed to the initial gulp-winify call', function(done){

        var testOption = { minifyIds: true }
        var expectedObject = Object.assign( {}, Config.defaults, testOption )

        Config.init( testOption ).should.eql( expectedObject )
        done()
        
      })
    })
  })

  describe('Character Module', function(){

    beforeEach(function(){
      Config.init()
    })

    describe('getNextCharacter( prefix )', function(){

      it ('should generate the first character to use for class names', function(done){
        Character.getNextCharacter( '.' ).should.equal( '¢' )
        done()
      })

      it ('should generate the same first character for ids and classes', function(done){
        Config.init( {minifyIds: true} )
        Character.getNextCharacter( '.' ).should.equal( '¢' )
        Character.getNextCharacter( '#' ).should.equal( '¢' )
        done()
      })

      it ('should skip whitespace characters', function(done){
        Character.charcodeSet['.'].currentCharcode = 172
        Character.getNextCharacter('.')

        Character.charcodeSet['.'].currentCharcode.should.not.equal(173)
        done()

      })

      it ('should generate 2-letter names after the last unicode character is used', function(done){
        //Force the current character to be the last valid character (the limit)
        Character.charcodeSet['.'].currentCharcode = Character.charcodeSet['.'].limit - 1
        Character.getNextCharacter('.')

        Character.charcodeSet['.'].len.should.equal(2)
        Character.charcodeSet['.'].currentCharcode.should.equal(161)

        done()
      })
    })
  })

  describe('Selectors Module', function(){

    beforeEach(function(){
      Config.init()
    })

    describe('add( prefix, selector )', function(){

      beforeEach(function(){
        Selectors.init({})
      })

      it('should add a {class: minifiedClass} pair to Selectors.minifiedSet', function(done){

        let className = '.container'
        Selectors.add('.', className)

        Selectors.minifiedSet.should.have.all.keys( className )
        Selectors.minifiedSet[ className ].should.have.length(2)

        done()
      })

      it('shouldn\'t reassign a new character to previously added selectors', function(done){

        let firstResult  = Selectors.add('.', '.container')
        let secondResult = Selectors.add('.', '.container')

        firstResult.should.equal( secondResult )
        done()
      })
    })

    describe('getMinified( selector )', function(){

      it('should return a minified class from the passed original class', function(done){
        let className = '.container'
        Selectors.add('.', className)

        Selectors.getMinified(className).should.equal( '.¢' )
        done()
      })
    })
  })

  describe('Validation Module', function(){

    beforeEach(function(){
      Config.init()
    })

    describe('isValidPrefix( prefix )', function(){

      it('should mark class selector prefixes valid', function() {
        Validation.isValidPrefix('.').should.be.true
      })

      it('should mark id prefixes valid if turned on in gulpfile options', function() {
        Config.init({minifyIds: true})
        Validation.isValidPrefix('#').should.be.true
        Config.init() 
      })

      it('should invalidate unrecognized css selector prefixes', function() {
        Validation.isValidPrefix('(').should.be.false
      })

      it('should invalidate prefixes with more than one character', function() {
        Validation.isValidPrefix('.a').should.be.false
      })
    })

    describe('isAllowedTagName( name )', function(){

      it('should invalidate special HTML tags like input, body', function() {
        Validation.isAllowedTagName('body').should.be.false
        Validation.isAllowedTagName('h1').should.be.false
        Validation.isAllowedTagName('input').should.be.false
      })

      it('should mark semantic, non-functional tags valid', function() {
        Validation.isAllowedTagName('article').should.be.true
        Validation.isAllowedTagName('customHTMLComponent').should.be.true
      })
    })
  })


  describe('End to End Tests', function(){

    describe('processHTML()', function() {

      it('should add minified classes to html tags', function(done) {
        resultFileTest( done, '.html' )
      })

      it('should add minified classes and ids to html tags', function(done) {
        resultFileTest( done, '.html', { minifyIds: true } )
      })

      it('should add minified classes (starting with alphabetical characters) to html tags', function(done) {
        resultFileTest( done, '.html', { alphabeticSelectors: true } )
      })

      it('should add minified classes and rename tags to minified versions', function(done) {
        resultFileTest( done, '.html', { experimentalFeatures: true } )
      })
    })

    describe('processCSS()', function() {

      it('should minify classes in CSS selectors', function(done) {
        resultFileTest( done, '.css' )
      })

      it('should minify classes and ids in CSS selectors', function(done) {
        resultFileTest( done, '.css', { minifyIds: true } )
      })

      it('should minify classes starting with basic alphabetical characters', function(done) {
        resultFileTest( done, '.css', { alphabeticSelectors: true } )
      })

      it('should minify classes and tag names in CSS selectors', function(done) {
        resultFileTest( done, '.css', { experimentalFeatures: true } )
      })

    })
  })
})


function resultFileTest( done, fileType, options ){
  if (typeof options !== 'object') options = {}
  
  Config.init(options)

  var file = new File({ path: 'test/fixtures/index' + fileType
                      , cwd: 'test/'
                      , base: 'test/fixtures'
                      , contents: fs.readFileSync( 'test/fixtures/index' + fileType )
                     })

  var filenameSuffix = ''
  Object.keys( options ).forEach( function(key) {
    if ( options[key] === true ) filenameSuffix += '_' + key
  })

  var stream = Winify(options)

  stream.on('data', function(newFile) {
    should.exist(newFile)
    should.exist(newFile.contents)

    String(newFile.contents).should.equalIgnoreSpaces(fs.readFileSync( 'test/expected/index' + filenameSuffix + fileType, 'utf8'))
    done()
  })

  stream.write(file)
  stream.end()
}


/* When streams are supported: 
   replace the "String(newFile.contents)..." block with this:

      newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
        data.should.equal(fs.readFileSync('test/expected/index' + fileType, 'utf8'))
        done()
      }))
*/