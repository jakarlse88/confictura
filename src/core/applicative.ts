/**
 *      Define {@link Applicative }.
 * 
 *      @internal
 *      @module
 * 
 */


import Functor from "./functor"


/**
 * 
 *      `ap` function type declaration.
 * 
 *      @private
 * 
 */
type ApplicativeFn<A , B> = ( a : A ) => B // ( a -> b )


/**
 *      `applicative` definition.
 * 
 *      @internal
 * 
 */
interface Applicative<A> extends Functor<A> {
    ap<A , B>( this : Applicative<A> , fn : Applicative<ApplicativeFn<A , B>> ) : Applicative<B> // A a -> A ( a -> b ) -> A b
}


export default Applicative
export { ApplicativeFn }