/**
  
    ███╗   ███╗ ██████╗ ███╗   ██╗ █████╗ ██████╗ 
    ████╗ ████║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗
    ██╔████╔██║██║   ██║██╔██╗ ██║███████║██║  ██║
    ██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══██║██║  ██║
    ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║  ██║██████╔╝
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ 
                                               
  
    @internal
    @module
  
 */


/**
 *      `fMap` function type declaration.
 * 
 *      @private
 * 
 */
type MonadicFn<A , B> = ( a : A ) => Monad<B> // a -> M b 


/**
 *      `monad` definition.
 * 
 *      @internal
 * 
 */
interface Monad<A> {
    fMap<B>( this : Monad<A> , fn : MonadicFn<A , B> ) : Monad<B> // M a -> ( a-> M b ) -> M b
}


export default Monad