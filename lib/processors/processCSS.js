'use strict'

const css  = require( 'css')

let Selectors  = require( '../Selectors.js')
let Validation = require( '../Validation.js')


function processCSS ( data, _charset, config ) {

  let styles = css.parse( data )
  let rules  = styles.stylesheet.rules

  helpers.processCSSRules( rules )

  return css.stringify( styles )

}


let helpers = {

  processCSSRules ( rules ) {

    let childRules = []

    rules.forEach( (rule) => {

      if ( rule.rules ) childRules = childRules.concat( rule.rules )
      if ( rule.selectors )  this.iterateCSSSelectors( rule )

    })

    if ( childRules.length ) this.processCSSRules( childRules )

  },

  iterateCSSSelectors ( rule ) {

    let attributes, prefix, newSelector

    rule.selectors.forEach( ( selector, i ) => {

      // Split each class, id or tag from the current selector into an array
      attributes = selector.split( /(?=[\.#\[\:\~\)])|\s+/gm ).slice()
      attributes.forEach( ( attr ) => {

        //Get the attribute's 1st character to see its type (id||class||tag)
        prefix = attr.match( /^\W/g ) || ['']
        prefix = prefix[0]

        if ( !prefix && !Validation.isAllowedTagName(attr) ) return false

        if ( Validation.isValidPrefix( prefix ) ) {
          newSelector = Selectors.add( prefix, attr )
          rule.selectors[i] = rule.selectors[i].replace( attr, newSelector )
        }

      })

    })
  }
}


module.exports = processCSS
