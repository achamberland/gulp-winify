'use strict'

let Selectors  = require( './Selectors.js' )
let Characters = require( './Characters.js')
let Processors = require( './Processors.js')


let Config = {

  defaults: {
    alphabeticSelectors: false,
    experimentalFeatures: false,
    minifyIds: false
  },

  init ( options ) {
    
    options = applyOptions(options)

    Selectors .init(options);
    Characters.init(options);
    Processors.init(options);

    return options

  }

}


function applyOptions ( options ) {

  return Object.assign( {}, Config.defaults, options )

}


module.exports = Config
