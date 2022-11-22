/**
 *      Define {@link Functor}.
 * 
 *      @internal
 *      @module
 */


/**
 *      `map` function type declaration.
 * 
 *      @private
 * 
 */
type FunctorFn<A , B> = ( a : A ) => B // ( a -> b )


/**
 *      `functor` definition.
 * 
 *      @internal
 * 
 */
interface Functor<A> {
    map<B>( this : Functor<A> , fn : FunctorFn<A , B> ) : Functor<B> // F a -> ( a -> b ) -> F b
}


export default Functor
export { FunctorFn }

