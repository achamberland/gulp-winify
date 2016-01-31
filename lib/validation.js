'use strict'

let Selectors = require('./Selectors.js');

let Validation = {

	isValidPrefix ( prefix ) {

    if (prefix.length > 1) return false

    let prefixRegex = new RegExp( '['
                                + '\\'
                                + ( Selectors.validTypes.className || '' )
                                + ( Selectors.validTypes.id || '' )
                                + ']' 
                                + ( '|' + Selectors.validTypes.tag || '' )
                                )

	  return !!prefix.match( prefixRegex )

	},

  isAllowedTagName ( name ) {
    let invalidTagRegex = new RegExp( '^.$|^!DOCTYPE|^html$|^head$|^body$|' 
                                      + '^link$|^script$|^style$|^meta$|'
                                      + '^title$|^iframe$|^h.$|^input|^form|' 
                                      + '^option|^select|^map$|^canvas$|' 
                                      + '^area$|^img$', 'ig' )

    return !name.match( invalidTagRegex )
  
  }

}

module.exports = Validation
