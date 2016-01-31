'use strict'

const through = require( 'through2' )
const gutil   = require( 'gulp-util' )

let Config     = require( './lib/Config.js' )
let Processors = require( './lib/Processors.js' )


const PLUGIN_NAME = 'gulp-winify'


function winify ( options ) {

  Config.init( options );

  return through.obj( ( file, enc, cb ) => {

    let fileExtension = getExtension( file.history[0] )

    if ( file.isNull() || !fileExtension ) {
      return cb( null, file )
    }

    if ( file.isBuffer() ) {
      let fileString = file.contents.toString( 'utf-8' )
      let output = processFile( fileString, fileExtension, Config )

      file.contents = new Buffer( output )
    }

    else if ( file.isStream() ) {

      return this.emit("error", new PluginError(
        PLUGIN_NAME,  "Streams not yet supported"
      ));

    }

    cb( null, file )

  })

}


function getExtension( path ) {

  if      ( path.match(/\.(html|haml|htm|xhtml)$/im)     ) return 'HTML'
  else if ( path.match(/\.(scss|sass|less|pcss|css)$/im) ) return 'CSS'
  else if ( path.match(/\.(js|json|jsx|coffee|ts)$/im)   ) return 'JS'
}


function processFile( fileString, fileExtension ) {

  fileString = !!fileString 
    ? fileString.replace( /\s/, '' ) 
    : fileString

  let processorMethod = Processors[`process${fileExtension}`]
  let output = processorMethod( fileString, 'UTF-8', Config )

  return output || fileString

}


module.exports = winify
