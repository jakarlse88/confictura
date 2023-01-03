/**
 
     ██╗   ██╗███╗   ██╗██╗████████╗
    ██║   ██║████╗  ██║██║╚══██╔══╝
    ██║   ██║██╔██╗ ██║██║   ██║
    ██║   ██║██║╚██╗██║██║   ██║
    ╚██████╔╝██║ ╚████║██║   ██║
     ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝
                             
    @module

 */
/**
 *      Type-safe alternative to `null` or `undefined`.
 *
 *      @internal
 *
 */
declare const Unit: {
    readonly u: symbol;
    readonly isUnit: (u: unknown) => boolean;
};
//# sourceMappingURL=unit.d.ts.map

/**
  
    ███████╗██╗   ██╗███╗   ███╗    ████████╗██╗   ██╗██████╗ ███████╗
    ██╔════╝██║   ██║████╗ ████║    ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝
    ███████╗██║   ██║██╔████╔██║       ██║    ╚████╔╝ ██████╔╝█████╗
    ╚════██║██║   ██║██║╚██╔╝██║       ██║     ╚██╔╝  ██╔═══╝ ██╔══╝
    ███████║╚██████╔╝██║ ╚═╝ ██║       ██║      ██║   ██║     ███████╗
    ╚══════╝ ╚═════╝ ╚═╝     ╚═╝       ╚═╝      ╚═╝   ╚═╝     ╚══════╝
                                                                         
  
    @internal
    @module
  
 */

type SumCase<T> = {
    [I in keyof T]: T[I];
};
declare abstract class SumType<T extends SumCase<T>> {
    protected readonly __case: string;
    protected readonly __data: T[keyof T] | typeof Unit;
    protected constructor(c: string, d: T[keyof T] | typeof Unit);
}
//# sourceMappingURL=sum_type.d.ts.map

/**
 *      Provide a type to work with remote data.
 *
 *      @internal
 *      @module
 *
 */

type NotQueried = [key: 'notQueried', val: typeof Unit];
type Waiting = [key: 'waiting', val: typeof Unit];
type Left<T> = [key: 'left', val: T];
type Right<T> = [key: 'right', val: T];
type Case<L, R> = NotQueried | Waiting | Left<L> | Right<R>;
type MatchObj<L, R> = {
    'NotQueried': () => void;
    'Waiting': () => void;
    'Left': (l: L) => L | void;
    'Right': (r: R) => R | void;
};
/**
 *      `AsyncData` implementation.
 *
 *      @template L     The error type to be wrapped in potential `left` cases.
 *      @template R     The value type to be wrapped in potential `right` cases.
 *
 */
declare class AsyncData<L, R> extends SumType<Case<L, R>> {
    /**
     *      Constructor.
     *
     *      @param c
     *      @param d
     *
     *      @private
     *
     */
    private constructor();
    /**
     *      Create an instance of `notQueried`.
     *
     *      @typeparam E        The type of the error that would be wrapped in a `left`.
     *      @typeparam A        The type of the value that would be wrapped in a `right`.
     *
     *      @returns            A case `notQueried` of type {@link AsyncData}.
     *
     *      @static
     *      @public
     *
     */
    static notQueried<L, R>(): AsyncData<L, R>;
    /**
     *      Create an instance of 'waiting'.
     *
     *      @typeparam E        The type of the error that would be wrapped in a `left`.
     *      @typeparam A        The type of the value that would be wrapped in a `right`.
     *
     *      @returns {AsyncData<L , R>} A case `waiting` of {@link AsyncData}.
     *
     *      @static
     *      @public
     *
     */
    static waiting<L, R>(): AsyncData<L, R>;
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
     *      @static
     *      @public
     *
     */
    static right<E, A>(a: A): AsyncData<E, A>;
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
     *      @static
     *      @public
     *
     */
    static left<E, A>(e: E): AsyncData<E, A>;
    /**
     *      Determine whether the `AsyncData` is a `notQueriedb.
     *
     */
    get isNotQueried(): boolean;
    /**
     *      Determine whether the `AsyncData` is a `waiting`.
     *
     */
    get isWaiting(): boolean;
    /**
     *      Determine whether the `AsyncData` is a `failure`.
     *
     */
    get isLeft(): boolean;
    /**
     *      Determine whether the `AsyncData` is a `success`.
     *
     */
    get isRight(): boolean;
    /**
     *      Return the case of the {@link AsyncData}
     *      (IE. `NotQueried`, `Waiting`, `Left`, or `Right`).
     *
     */
    get case(): string;
    /**
     *      Get the value wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `right`.
     *
     */
    get right(): R;
    /**
     *      Get the error wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `left`.
     */
    get left(): L;
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
    map<S>(this: AsyncData<L, R>, fn: (a: R) => S): AsyncData<L, S>;
    /**
     *      Apply the function `fn` to the error wrapped in the {@see AsyncData}
     *      if it is a `left`.
     *
     *      @param      fn  The function to apply to the error value wrapped in a `left` case of {@see AsyncData}.
     *
     *      @returns        A `left` case of {@see AsyncData} wrapping the transformed error value.
     *
     */
    mapLeft<J>(fn: (e: L) => J): AsyncData<J, R>;
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
    fMap<S>(fn: (a: R) => AsyncData<L, S>): AsyncData<L, S>;
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
    ap<R, S>(this: (AsyncData<L, (a: R) => S>), a: AsyncData<L, R>): AsyncData<L, S>;
    /**
     *      Unwrap the value from an {@see AsyncData} if it is a `right`,
     *      otherwise return the provided default value.
     *
     *      @param dVal Default value to return if the {@see AsyncData} is not `right`.
     *
     *      @returns    The wrapped value, or a default value if the {@see AsyncData} is not `right`.
     *
     */
    rightOr(dVal: R): R;
    /**
     *      Unwrap the error from an {@see AsyncData} if it is a `left`,
     *      otherwise return the provided default value.
     *
     *      @param dErr     Default value to return if the {@see AsyncData} is not `left`.
     *
     *      @returns        The wrapped error value, or the supplied value if the {@see AsyncData} is not `left`.
     *
     */
    leftOr(dErr: L): L;
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
    caseOf(m: MatchObj<L, R>): void | L | R;
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
    eq<F, B>(this: AsyncData<L, R>, b: AsyncData<F, B>): boolean;
}

/**
 *      Provide "static" , stand-alone functions for working with the `AsyncData` type
 *      without referencing the type directly.
 *
 *      @see AsyncData
 *
 *      @module
 *
 */

/**
 *      @see AsyncData.notQueried
 *
 */
declare const notQueried: <E, A>() => AsyncData<E, A>;
/**
 *      @see AsyncData.waiting
 *
 */
declare const waiting: <E, A>() => AsyncData<E, A>;
/**
 *      @see AsyncData.right
 *
 */
declare const right: <E, A>(a: A) => AsyncData<E, A>;
/**
 *      @see AsyncData.left
 *
 */
declare const left: <E, A>(e: E) => AsyncData<E, A>;

export { AsyncData, left, notQueried, right, waiting };
