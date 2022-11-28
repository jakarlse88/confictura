/**
 
    ██╗   ██╗████████╗██╗██╗     ███████╗
    ██║   ██║╚══██╔══╝██║██║     ██╔════╝
    ██║   ██║   ██║   ██║██║     ███████╗
    ██║   ██║   ██║   ██║██║     ╚════██║
    ╚██████╔╝   ██║   ██║███████╗███████║
     ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝
           
     
    @internal
    @module

 */
    

const objEq = ( x : unknown , y : unknown ) => {
    if ( !isObject( x ) || !isObject( y ) )
        return false

    const xKeys = Object.keys( x )
    const yKeys = Object.keys( y )

    if ( xKeys.length !== yKeys.length ) 
      return false

    for ( const k of xKeys ) {
      const xVal = x[ k as keyof typeof x ] 
      const yVal = y[ k as keyof typeof y ] 

      const areObjects = isObject( xVal ) && isObject( yVal )
      
      if (  areObjects && !objEq( xVal , yVal ) 
        || !areObjects && xVal !== yVal )  
        return false
    }

    return true
  }


const isObject = ( obj : unknown ) : obj is object => 
    obj != null && typeof obj === 'object'


const valueEq = ( x : unknown , y : unknown ) : boolean => {
    if ( typeof x !== typeof y ) 
        return false

    if ( !isObject( x ) )
        return x === y

    return objEq( x , y )
}


export { valueEq }