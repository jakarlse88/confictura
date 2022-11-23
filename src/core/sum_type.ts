/**
 *      Define {@link SumType}.
 * 
 *      @internal
 *      @module
 * 
 */

type Case = {
    [ key : symbol ] : unknown[]
}


type Matcher = {
    [ key : keyof Case ] : <A extends Case, B extends Case>( this : SumType<A> ) => B
}


abstract class SumType<A extends Case> {
    protected readonly _case : keyof A
    protected readonly _data : unknown

    constructor( c : keyof A , d : unknown ) {
        this._case = c
        this._data = d
    }
    
    abstract match<B>( m : Matcher ) : B
}


export default SumType
export { Case as State }