'use strict'

const config = require( './config.js')

const BASIC_LATIN_START = 65
    , PUNCTUATION_START = 91
    , PUNCTUATION_END   = 97
    , BASIC_LATIN_END   = 123
    , EXTENDED_START    = 161
    , UNICODE_END       = 65535

    , WHITESPACE_SET    = new Set( [ 173, 5760, 8192, 8193, 8194, 8195, 8196, 8197
                                   , 8198, 8199, 8200, 8201, 8202, 8203, 8204, 8205
                                   , 8232, 8233, 8239, 8287, 10240, 12288, 65279 ])

let character = {

  startCharcode: BASIC_LATIN_START,
  charcodeSet:   {},

  generateCharacter( prefix ){

    let output,
        currentSet = this.charcodeSet[ prefix ]

    if ( !currentSet ) return ''

    currentSet.currentCharcode++

    if ( WHITESPACE_SET.has(currentSet.currentCharcode) ) {

      return this.generateCharacter( prefix )

    }
    else {

      let currentCode = getNextCharcode( currentSet );

      return currentSet.baseString + String.fromCharCode( currentCode )

    }
  
  },

  init() {

    this.startCharcode = config.alphabeticSelectors === true ? BASIC_LATIN_START : EXTENDED_START

    this.charcodeSet = generateCharcodeSet( this.startCharcode );

  }

}


function SelectorCharcodeSet( start, limit ) {

  return { currentCharcode: start, baseString: '', len: 1, limit: limit }
}

function generateCharcodeSet(startCharcode){

  return { '' : new SelectorCharcodeSet( startCharcode, BASIC_LATIN_END )
         , '.': new SelectorCharcodeSet( startCharcode, UNICODE_END )
         , '#': new SelectorCharcodeSet( startCharcode, UNICODE_END )
         }
}


function getNextCharcode(currentSet) {

  let codes = {}

  codes[ currentSet.limit  ] = ( currentSet ) => addCharacterSlot( currentSet )
  codes[ PUNCTUATION_START ] = () => PUNCTUATION_END
  codes[ BASIC_LATIN_END   ] = () => EXTENDED_START

  return codes[ currentSet.currentCharcode ] ? codes[ currentSet.currentCharcode ]() : currentSet.currentCharcode

}


function addCharacterSlot( currentSet ){

  currentSet.len++
  currentSet.baseString = nextCharacterInString( currentSet.baseString )

  return this.startCharcode

}

function nextCharacterInString( str ){

  let nextCharcode = str.charCodeAt( str.length - 1 ) + 1 || character.startCharcode

  return String.fromCharCode( nextCharcode )
}



module.exports = character