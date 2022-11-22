/**
 *      Define {@link Monad}.
 * 
 *      @internal
 *      @module
 * 
 */

import Applicative from "./applicative"


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
interface Monad<A> extends Applicative<A> {
    fMap<A , B>( this : Monad<A> , fn : MonadicFn<A , B> ) : Monad<B> // M a -> ( a-> M b ) -> M b
}


export default Monad
export { MonadicFn }