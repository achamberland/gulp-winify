'use strict'

let validation = {

	isAllowedTagName( name ) {
	  return !name.match( /^html$|^head$|^body$|^link$|^script$|^style$|^meta$|^title$|^iframe$|^h.$|^.$|^map$|^canvas$|^area$|^img$/ig )
	},

	isValidPrefix( prefix ) {
	  return !!prefix.match( /[\.#]/ )
	}

}

module.exports = validation