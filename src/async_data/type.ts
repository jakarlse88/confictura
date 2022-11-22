/**
 *      Provide a type to work with remote data.
 * 
 *      @module
 * 
 */

import { deepEqual } from "assert";


const notQueried = Symbol.for( 'not-queried' )
const waiting    = Symbol.for( 'waiting' ) 
const left       = Symbol.for( 'left' ) 
const right      = Symbol.for( 'right' ) 


type Case<E , A> = 
    [ key : typeof notQueried         ]
  | [ key : typeof waiting            ]
  | [ key : typeof left       , e : E ]
  | [ key : typeof right      , a : A ]


type MatchObj<E , A , U> = {
    notQueried : ()        => U
    waiting    : ()        => U
    failure    : ( e : E ) => U
    success    : ( a : A ) => U 
}


/**
 *      `AsyncData` implementation.
 * 
 *      @template E
 *      @template A    
 * 
 */
export class AsyncData<E , A> {

    /**
     *      Constructor.
     * 
     */
    private constructor( private _data : Case<E , A> ) {}

    
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
    get right() : A {
        if ( this._data[ 0 ] !== right )
            throw new Error( `Cannot get a value from a <${ this._data[ 0 ].description }>` )
        
        return this._data[ 1 ]
    }


    /**
     *      Get the error wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `left`.
     */
    get left() : E {
        if ( this._data[ 0 ] !== left )
            throw new Error( `Cannot get an error from a <${ this._data[ 0 ].description }>` )

        return this._data[ 1 ]
    }
    

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
     *      Apply the function `fn` to the value wrapped in the {@see AsyncData}
     *      if it is a `success`. 
     * 
     *      @fn         The {@link FunctorFn} to apply to the value wrapped in the `AsyncData`.
     * 
     *      @returns    A new `AsyncData` whose value is the result of the application 
     *                      of the function `fn` to the wrapped value.
     * 
     *      @public
     * 
     */
    public map<B>( fn : ( a : A ) => B ) : AsyncData<E , B> {
        return ( 
            this._data[ 0 ] === right
                ? AsyncData.right( fn( this._data[ 1 ] ) ) 
                : this 
        ) as AsyncData<E , B>
    }


    /**
     *      Apply the function `fn` to the error wrapped in the {@see AsyncData}
     *      if it is a `left`.
     * 
     *      @param fn 
     *      @returns 
     */
    public mapErr<F>( fn : ( e : E ) => F ) : AsyncData<F , A> {
        return (
            this._data[ 0 ] === left 
                ? AsyncData.left( fn( this._data[ 1 ] ) )
                : this
        ) as AsyncData<F ,  A>
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
     *      @public
     * 
     */
    public fMap<B>( fn : ( a : A ) => AsyncData<E , B> ) : AsyncData<E , B> {
        return (
            this._data[ 0 ] === right
                ? fn( this._data[ 1 ] )
                : this
        ) as AsyncData<E , B>
    } 


    /**
     *      Apply a function wrapped in an `AsyncData` to the value wrapped in another `AsyncData`,
     *      if the latter is a `success`.
     *      
     *      @param fn 
     *      @param u 
     * 
     */
    public ap<A , B>( this : ( AsyncData<E , ( a : A ) => B> ) , a : AsyncData<E , A> ) : AsyncData<E , B> {
        return a.fMap( val => this.map( fn => fn( val ) ) )
    }


    /**
     *      Unwrap the value from an {@see AsyncData} if it is a `right`,
     *      otherwise return the provided default value.
     * 
     *      @param dVal Default value to return if the `AsyncData` is not `success`.
     * 
     *      @returns    The wrapped value, or a default value if the `AsyncData` is not `success`.
     *  
     */
    public rightOr( dVal : A ) : A {
        return this._data[ 0 ] === right
            ? this._data[ 1 ]
            : dVal
    }


    /**
     *      Unwrap the error from an {@see AsyncData} if it is a `left`, 
     *      otherwise return the provided default value.
     * 
     *      @param dErr 
     *      @returns 
     */
    public leftOr( dErr : E ) : E {
        return this._data[ 0 ] === left
            ? this._data[ 1 ]
            : dErr
    }


    public match<U>( m : MatchObj<E , A , U> ) : U {
        switch ( this._data[ 0 ] ) {
            case notQueried : return m.notQueried()
            case waiting    : return m.waiting()
            case left       : return m.failure( this._data[ 1 ] )
            case right      : return m.success( this._data[ 1 ] )
        }
    }


    public eq( b : AsyncData<E , A> ) {
        switch ( this.kind ) 
        {
            case notQueried.description : return b.isNotQueried
            case    waiting.description : return b.isWaiting
            case       left.description : return b.isLeft  && deepEqual( this.left  , b.left  )
            case      right.description : return b.isRight && deepEqual( this.right , b.right )
            default                     : return false
        }
    }
}


export default AsyncData
export { notQueried , waiting , left as failure , right as success }
