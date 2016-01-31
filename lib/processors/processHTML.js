'use strict'

const cheerio  = require( 'cheerio' )

let processCSS = require( './processCSS.js' )
let Selectors  = require( '../Selectors.js' )
let Validation = require( '../Validation.js' )


function processHTML ( data, _charset, config ) {

  let $ = cheerio.load( data)

  let insertionType = helpers.setInsertSelectorType(config)

  transforms._charset = _charset
  transforms.config = config

  $('*').each( (i, $el) => {

    $el = transforms.tags( $el )
    $el = transforms.attributes( $el, insertionType )
    $el = transforms.styles( $el, $ )

  })

  return $.html( {decodeEntities: false} )

}


let transforms = {

  tags ($el) {

    if ( Selectors.validTypes.tag && Validation.isAllowedTagName($el.name) ) {
      $el.name = Selectors.add( '', $el.name )
    }

    return $el

  },

  attributes ($el, insertionType) {

    if ( $el.attribs ) {

      $el = $el.attribs.class && Selectors.validTypes.className
            ? helpers.replaceSelector( '.', $el, 'class', insertionType )
            : $el

      $el = $el.attribs.id && Selectors.validTypes.id
            ? helpers.replaceSelector( '.', $el, 'id', insertionType )
            : $el
    }

    return $el

  },

  styles ($el, $) {

    if ( $el.type === 'style' ) {
      $( $el ).html( processCSS( $($el).html(), this._charset, this.config  ) )
    }

    return $el

  }

}


let helpers = {

  replaceSelector (prefix, $el, selector, insertionType) {

    // $el.attribs[selector] is a string representing an attribute's properties.
    //   Ex) for a class attribute, it might be '.container .banner.wide' 

    $el.attribs[selector].split(' ').forEach( ( attr ) => {

      Selectors.add( prefix, prefix + attr )

      let minifiedClass = Selectors.getMinified( prefix + attr )
      let replacement   = insertionType( minifiedClass, attr )

      $el.attribs[selector] = $el.attribs[selector].replace( attr, replacement )

    })

    return $el

  },

  setInsertSelectorType (config) {
    // config.experimentalFeatures --> replace original class in html to save file size.
    //   will not work with any javascript until javascript transforms are build

    return !!config.experimentalFeatures
             ? ( className ) => className 
             : ( className, original ) => original + ' ' + className.slice(1)
  }

}


module.exports = processHTML
