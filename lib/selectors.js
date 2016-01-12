'use strict'

let characters = require( './characters.js')

let minifiedSelectors = {}
let charcodes = {}

let selectors = {

  allowedSelectors: {},

  createMinifiedSelector( prefix, selector ) {

    if ( !minifiedSelectors.hasOwnProperty( selector )) {
      minifiedSelectors[ selector ] = prefix + characters.generateCharacter( prefix )
    }

    return minifiedSelectors[ selector ]

  },

  getMinifiedSelector( selector ){
    return minifiedSelectors[ selector ]

  },

  init( config ) {
    setAllowedSelectors( config )
  }
  
}

function setAllowedSelectors( config ){
  selectors.allowedSelectors.className = '.'
  if ( config.experimental === true ) selectors.allowedSelectors.tag = '\w'
  if ( config.minifyIds    === true ) selectors.allowedSelectors.id  = '#'
}


module.exports = selectors