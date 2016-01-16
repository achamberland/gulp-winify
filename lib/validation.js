'use strict'

let Selectors = require('./Selectors.js');

let Validation = {

	isAllowedTagName ( name ) {
    let invalidTagRegex = new RegExp( '^.$|^!DOCTYPE|^html$|^head$|^body$|' 
                                      + '^link$|^script$|^style$|^meta$|'
                                      + '^title$|^iframe$|^h.$|^map$|'
                                      + '^canvas$|^area$|^img$', 'ig' )

	  return !name.match( invalidTagRegex )
	
  },

	isValidPrefix ( prefix ) {

    let prefixRegex = new RegExp( '['
                                + '\\'
                                + ( Selectors.validTypes.className || '' )
                                + ( Selectors.validTypes.id || '' )
                                + ( Selectors.validTypes.tag || '' )
                                + ']' )

	  return !!prefix.match( prefixRegex )

	}

}

module.exports = Validation
