/**
 *      Provide "static" , stand-alone functions for working with the `AsyncData` type
 *      without referencing the type directly.
 * 
 *      @see AsyncData
 * 
 *      @module
 * 
 */


import AsyncData from './type'


/**
 *      @see AsyncData.notQueried
 * 
 */
export const notQueried = <E , A>() : AsyncData<E , A> =>
    AsyncData.notQueried<E , A>()


/**
 *      @see AsyncData.waiting
 * 
 */
export const waiting = <E , A>() : AsyncData<E , A> =>
    AsyncData.waiting<E , A>()


/**
 *      @see AsyncData.right 
 * 
 */
export const right = <E , A>( a : A ) : AsyncData<E , A> =>
    AsyncData.right<E , A>( a )


/**
 *      @see AsyncData.left 
 * 
 */
export const left = <E , A>( e : E ) : AsyncData<E , A> =>
    AsyncData.left<E , A>( e )
