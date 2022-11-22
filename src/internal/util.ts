const deepEqual = ( x : unknown , y : unknown ) => {
    if ( !isObject( x ) || !isObject( y ) )
        return false

    const xKeys = Object.keys( x )
    const yKeys = Object.keys( y )

    if ( xKeys.length !== yKeys.length ) 
      return false

    for ( const k of xKeys ) {
      const xVal = x[ k ]
      const yVal = y[ k ]

      const areObjects = isObject( xVal ) && isObject( yVal )
      
      if (  areObjects && !deepEqual( xVal , yVal ) 
        || !areObjects && xVal !== yVal )  
        return false
    }

    return true
  }


const isObject = ( obj : unknown ) : obj is object => 
    obj != null && typeof obj === 'object'


export const valueEquality = ( x : unknown , y : unknown ) : boolean => {
    if ( typeof x !== typeof y ) 
        return false

    if ( typeof x !== 'object' )
        return x === y

    return deepEqual( x , y )
}