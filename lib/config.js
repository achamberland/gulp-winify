'use strict'

let selectors  = require( './selectors.js' )
let characters = require( './characters.js')


let config = {

  defaults: {
    alphabeticSelectors: false,
    experimental: false,
  },

  init( options ) {
    applyOptions(options)

    selectors.init();
    characters.init();
  }

}


function applyOptions( options ) {

  Object.assign( config, config.defaults, options )

}


module.exports = config