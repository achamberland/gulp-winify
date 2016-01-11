'use strict'

const config   = require( './config.js' )
let characters = require( './characters.js')

let minifiedSelectors = {}
let charcodes = {}

let selectors = {

  allowedSelectors: {
    className: '.',
    id: '#'
  },

  createMinifiedSelector( prefix, selector ) {

    if ( !minifiedSelectors.hasOwnProperty( selector )) {
      minifiedSelectors[ selector ] = prefix + characters.generateCharacter( prefix )
    }

    return minifiedSelectors[ selector ]

  },

  getMinifiedSelector( selector ){
    return minifiedSelectors[ selector ]

  },

  init() {

    if ( config.experimental === true ) this.allowedSelectors.tag = ''

  }
  
}



module.exports = selectors