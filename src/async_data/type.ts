/**
 *      Provide a type to work with remote data.
 * 
 *      @module
 * 
 */


import { valueEq } from '../internal/util'


const notQueried = Symbol.for( 'not-queried' )
const waiting    = Symbol.for( 'waiting' ) 
const left       = Symbol.for( 'left' ) 
const right      = Symbol.for( 'right' ) 


type Case<L , R> = 
    [ key : typeof notQueried         ]
  | [ key : typeof waiting            ]
  | [ key : typeof left       , l : L ]
  | [ key : typeof right      , r : R ]


type MatchObj<L , R> = {
    notQueried : ()        => void
    waiting    : ()        => void
    left       : ( l : L ) => L
    right      : ( r : R ) => R 
}


/**
 *      `AsyncData` implementation.
 * 
 *      @template L     The error type to be wrapped in potential `left` cases.
 *      @template R     The value type to be wrapped in potential `right` cases. 
 * 
 */
export class AsyncData<L , R> {

    /**
     *      Constructor.
     * 
     */
    private constructor( private _data : Case<L , R> ) {}


    /**
     *      Create an instance of `notQueried`.
     * 
     *      @typeparam E        The type of the error that would be wrapped in a `left`.
     *      @typeparam A        The type of the value that would be wrapped in a `right`.
     * 
     *      @returns {AsyncData<E , A>} A case `notQueried` of type {@link AsyncData}.
     * 
     *      @public
     * 
     */
    static notQueried<E , A>() : AsyncData<E , A> { 
        return new AsyncData( [ notQueried ] ) 
    }


    /**
     *      Create an instance of 'waiting'.
     * 
     *      @typeparam E        The type of the error that would be wrapped in a `left`.
     *      @typeparam A        The type of the value that would be wrapped in a `right`.
     * 
     *      @returns {AsyncData<E , A>} A case `waiting` of {@link AsyncData}.
     * 
     *      @public
     * 
     */
    static waiting<E , A>() : AsyncData<E , A> { 
        return new AsyncData( [ waiting ] ) 
    }
    

    /**
     *      Create an instance of `right`.
     * 
     *      @typeparam E        The type of the error that would be wrapped in a `left`.
     *      @typeparam A        The type of the value wrapped in this `right`.
     * 
     *      @param {A} a        The value to wrap in this `right`.
     * 
     *      @return {AsyncData<E, A>}   A case `right` of {@link AsyncData} wrapping a value of type A. 
     * 
     *      @public
     * 
     */
    static right<E , A>( a : A ) : AsyncData<E , A> {
        return new AsyncData<E , A>( [ right , a ] )
    }
    

    /**
     *      Create an instance of `left`.
     * 
     *      @typeparam E        The type of the error wrapped in this `left`.
     *      @typeparam A        The type of the value that would be wrapped in a `right`.
     * 
     *      @param {E} e        The error to wrap in this `left`.
     * 
     *      @returns {AsyncData<E , A>} A case `left` of {@link AsyncData} wrapping an error of {E}
     * 
     *      @public
     * 
     */
    static left<E , A>( e : E ) : AsyncData<E , A> { 
        return new AsyncData<E , A>( [ left , e ] ) 
    }   


    /**
     *      Determine whether the `AsyncData` is a `notQueriedb.
     * 
     */
    get isNotQueried() {
        return this._data[ 0 ] === notQueried 
    }


    /**
     *      Determine whether the `AsyncData` is a `waiting`.
     * 
     */
    get isWaiting() : boolean {
        return this._data[ 0 ] === waiting 
    }


    /**
     *      Determine whether the `AsyncData` is a `failure`.
     * 
     */
    get isLeft() : boolean {
        return this._data[ 0 ] === left 
    }


    /**
     *      Determine whether the `AsyncData` is a `success`.
     * 
     */
    get isRight() : boolean {
        return this._data[ 0 ] === right 
    }


    /**
     *      Return the case of the {@link AsyncData}
     *      (IE. `notQueried`, `waiting`, `left`, or `right`).
     * 
     */
    get kind() : string {
        return this._data[ 0 ].description ?? ''
    }


    /**
     *      Get the value wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `right`.
     * 
     */
    get right() : R {
        if ( this._data[ 0 ] !== right )
            throw new Error( `Cannot get a value from a <${ this._data[ 0 ].description }>` )
        
        return this._data[ 1 ]
    }


    /**
     *      Get the error wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `left`.
     */
    get left() : L {
        if ( this._data[ 0 ] !== left )
            throw new Error( `Cannot get an error from a <${ this._data[ 0 ].description }>` )

        return this._data[ 1 ]
    }


    /**
     *      Apply the function `fn` to the value wrapped in the {@see AsyncData}
     *      if it is a `success`. 
     * 
     *      @fn         The {@link FunctorFn} to apply to the value wrapped in the `AsyncData`.
     * 
     *      @returns    A new `AsyncData` whose value is the result of the application 
     *                      of the function `fn` to the wrapped value.
     * 
     */
    public map<S>( fn : ( a : R ) => S ) : AsyncData<L , S> {
        return ( 
            this._data[ 0 ] === right
                ? AsyncData.right( fn( this._data[ 1 ] ) ) 
                : this 
        ) as AsyncData<L , S>
    }


    /**
     *      Apply the function `fn` to the error wrapped in the {@see AsyncData}
     *      if it is a `left`.
     * 
     *      @param      fn  The function to apply to the error value wrapped in a `left` case of {@see AsyncData}. 
     * 
     *      @returns        A `left` case of {@see AsyncData} wrapping the transformed error value.
     * 
     */
    public mapLeft<J>( fn : ( e : L ) => J ) : AsyncData<J , R> {
        return (
            this._data[ 0 ] === left 
                ? AsyncData.left( fn( this._data[ 1 ] ) )
                : this
        ) as AsyncData<J ,  R>
    }


    /**
     *      Apply the function `fn` to the value wrapped in the `RemoteData` 
     *      if it is a `success`.
     * 
     *      @param fn   The {@link MonadicFn} to apply to the value wrapped in the `AsyncData`.
     * 
     *      @returns    A new `AsyncData` whose value is the result of the application
     *                      of the function `fn` to the wrapped value.
     * 
     */
    public fMap<S>( fn : ( a : R ) => AsyncData<L , S> ) : AsyncData<L , S> {
        return (
            this._data[ 0 ] === right
                ? fn( this._data[ 1 ] )
                : this
        ) as AsyncData<L , S>
    } 


    /**
     *      Apply a function wrapped in an {@see AsyncData} to the value wrapped in another {@see AsyncData}
     *      if the latter is a `success`.
     *      
     *      @param this     The function to apply to the wrapped value. 
     *      @param a        The {@see AsyncData}-wrapped value to which to apply the function.
     * 
     *      @return         The result of applying the given function to the given argument,
     *                      wrapped in an {@see AsyncData}. 
     * 
     */
    public ap<R , S>( this : ( AsyncData<L , ( a : R ) => S> ) , a : AsyncData<L , R> ) : AsyncData<L , S> {
        return a.fMap( val => this.map( fn => fn( val ) ) )
    }


    /**
     *      Unwrap the value from an {@see AsyncData} if it is a `right`,
     *      otherwise return the provided default value.
     * 
     *      @param dVal Default value to return if the {@see AsyncData} is not `right`.
     * 
     *      @returns    The wrapped value, or a default value if the {@see AsyncData} is not `right`.
     *  
     */
    public rightOr( dVal : R ) : R {
        return this._data[ 0 ] === right
            ? this._data[ 1 ]
            : dVal
    }


    /**
     *      Unwrap the error from an {@see AsyncData} if it is a `left`, 
     *      otherwise return the provided default value.
     * 
     *      @param dErr     Default value to return if the {@see AsyncData} is not `left`.
     * 
     *      @returns        The wrapped error value, or the supplied value if the {@see AsyncData} is not `left`.
     * 
     */
    public leftOr( dErr : L ) : L {
        return this._data[ 0 ] === left
            ? this._data[ 1 ]
            : dErr
    }

    /**
     *      Apply a function to the error or value wrapped in an {@see AsyncData} based on its case. 
     *      The supplied functions will receive no arguments if the case is `notQueried` or `waiting`,
     *      the wrapped error value if the case if `left`, and the wrapped value if the case is `right`. 
     *  
     *      @param m    The {@see AsyncData} against which to match. 
     *      
     *      @returns    The result of applying the matching function to the wrapped value or lack thereof.
     * 
     */
    public caseOf( m : MatchObj<L , R> ) : void | L | R {
        switch ( this._data[ 0 ] ) {
            case notQueried : return m.notQueried()
            case waiting    : return m.waiting()
            case left       : return m.left(  this._data[ 1 ] )
            case right      : return m.right( this._data[ 1 ] )
        }
    }

    /**
     *      Determine whether two {@see AsyncData} instances are equal in terms of both
     *      case and wrapped value.
     * 
     *      @param this     Base {@see AsyncData} with which to compare.
     *      @param b        Incoming {@see AsyncData} against which to compare.    
     *      
     *      @returns        A boolean value indicating whether the two {@see AsyncData}
     *                      instances are equal. 
     * 
     *      @public
     * 
     */
    public eq<F , B>( this : AsyncData<L , R> , b : AsyncData<F , B> ) {
        switch ( this.kind ) 
        {
            case notQueried.description : return b.isNotQueried
            case    waiting.description : return b.isWaiting
            case       left.description : return b.isLeft  && valueEq( this.left  , b.left  )
            case      right.description : return b.isRight && valueEq( this.right , b.right )
            default                     : return false
        }
    }
}


export default AsyncData
export { notQueried , waiting , left , right }
