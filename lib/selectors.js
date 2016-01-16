'use strict'

let Characters = require( './Characters.js')


let Selectors = {

  // Example minifiedSet: { '.container': '.ç' }
  minifiedSet: {},
  validTypes:  {},

  add ( prefix, selector ) {

    if ( !this.minifiedSet.hasOwnProperty( selector )) {

      let newSelector = prefix + Characters.getNextCharacter( prefix )
      this.minifiedSet[ selector ] = newSelector
    }

    return this.minifiedSet[ selector ]

  },

  getMinified ( selector ) {

    return this.minifiedSet[ selector ]

  },

  init ( config ) {

    setSelectorTypes( config )

  }
  
}

function setSelectorTypes ( config ) {

  Selectors.validTypes.className = '.'
  if ( !!config.experimentalFeatures ) Selectors.validTypes.tag = '\w'
  if ( !!config.minifyIds            ) Selectors.validTypes.id  = '#'

}


module.exports = Selectors
