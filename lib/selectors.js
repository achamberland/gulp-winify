'use strict'

let _ = require('lodash')

let Characters = require( './Characters.js')


let Selectors = {

  // Properties added on init:
  // - minifiedSet: the list of classes/ids/tags and their associated minified characters
  // - validTypes: valid types of classes/ids/tags to add, based on user config

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

    setDefaults()
    setSelectorTypes( config )

  }

}


function setDefaults ( ) {

  let defaults = {
    minifiedSet: {},
    validTypes:  { className: '.' }
  }

  Object.assign( Selectors, _.clone(defaults) )

}


function setSelectorTypes ( config ) {

  if ( !!config.experimentalFeatures ) Selectors.validTypes.tag = '^$'
  if ( !!config.minifyIds            ) Selectors.validTypes.id  = '#'

}


module.exports = Selectors
