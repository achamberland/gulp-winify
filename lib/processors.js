'use strict'

let processHTML = require( './processors/processHTML' )
let processCSS  = require( './processors/processCSS' )
let processJS   = require( './processors/processJS' )

let Processors = { processHTML
                 , processCSS
                 , processJS
                 , init
                 }


function init (config) {

  if ( !config.experimentalFeatures ) processJS = (data) => data
 
}


module.exports = Processors
