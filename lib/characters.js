'use strict'

//Charcodes
const BASIC_LATIN_START = 65
const PUNCTUATION_START = 91
const PUNCTUATION_END   = 97
const BASIC_LATIN_END   = 123
const EXTENDED_START    = 161
const UNICODE_END       = 65535

const HTML_INVALID_SET = new Set( [ 888 ] )
const WHITESPACE = new Set( [ 173, 5760, 8192, 8193, 8194, 8195 , 8196
                            , 8197, 8198, 8199, 8200, 8201, 8202, 8203
                            , 8204, 8205, 8232, 8233, 8239, 8287, 10240
                            , 12288, 65279 ] )


let Characters = {

  getNextCharacter ( prefix ) {

    let output
    let prefixCharset = this.charcodeSet[ prefix ]
   
    if ( !prefixCharset ) return ''

    prefixCharset.currentCharcode++

    let shouldSkipCharacter = WHITESPACE.has(prefixCharset.currentCharcode) 
                           || HTML_INVALID_SET.has(prefixCharset.currentCharcode)

    if ( shouldSkipCharacter ) return this.getNextCharacter( prefix )

    let charcode = getNextCharcode( prefixCharset );

    return prefixCharset.baseString + String.fromCharCode( charcode )
  
  },

  init ( config ) {

    setDefaults();

    if (config.alphabeticSelectors) this.startCharcode = BASIC_LATIN_START

    this.charcodeSet = generateCharcodeSet( this.startCharcode );

  }

}


class PrefixCharcodeSet {

  constructor ( start, limit ) {
    this.currentCharcode = start
    this.baseString = ''
    this.len = 1
    this.limit = limit 
  } 
    
}

function generateCharcodeSet (startCharcode) {

  return { '' : new PrefixCharcodeSet( startCharcode, BASIC_LATIN_END )
         , '.': new PrefixCharcodeSet( startCharcode, UNICODE_END )
         , '#': new PrefixCharcodeSet( startCharcode, UNICODE_END )
         }
}


function getNextCharcode ( prefixSet ) {

  // TODO -- benchmark to see if this is slower than using if/else statement

  let codes = { 

      [ prefixSet.limit ]  : ( prefixSet ) => addCharacterSlot( prefixSet )
    , [ PUNCTUATION_START ]: () => PUNCTUATION_END
    , [ BASIC_LATIN_END ]  : () => EXTENDED_START

  }

  return codes[ prefixSet.currentCharcode ] 
         ? codes[ prefixSet.currentCharcode ](prefixSet) 
         : prefixSet.currentCharcode

}


function addCharacterSlot ( prefixSet ) {

  prefixSet.len++
  prefixSet.baseString = nextCharacterInString( prefixSet.baseString )
  prefixSet.currentCharcode = Characters.startCharcode

  return Characters.startCharcode

}

function nextCharacterInString ( str ) {

  let nextCharcode = str.charCodeAt( str.length - 1 ) + 1 
                  || Characters.startCharcode

  return String.fromCharCode( nextCharcode )

}


function setDefaults ( ) {

  let defaults = {
    startCharcode: EXTENDED_START,
    charcodeSet:   {}
  }

  Object.assign( Characters, defaults )

}


module.exports = Characters
