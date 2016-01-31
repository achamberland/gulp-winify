'use strict'

const acorn = require( 'acorn' )
const walk = require( 'walk-ast' )
const escodegen = require( 'escodegen' )


function processJS ( data, _charset, config ) {

  let ast = acorn.parse( data, {} )

  walk( ast, function ( node ) {
    
    // Javascript support not yet built

  })

  return escodegen.generate( ast )
}

module.exports = processJS
