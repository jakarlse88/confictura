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
const objEq = (x, y) => {
    if (!isObject(x) || !isObject(y))
        return false;
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length)
        return false;
    for (const k of xKeys) {
        const xVal = x[k];
        const yVal = y[k];
        const areObjects = isObject(xVal) && isObject(yVal);
        if (areObjects && !objEq(xVal, yVal)
            || !areObjects && xVal !== yVal)
            return false;
    }
    return true;
};
const isObject = (obj) => obj != null && typeof obj === 'object';
const valueEq = (x, y) => {
    if (typeof x !== typeof y)
        return false;
    if (!isObject(x))
        return x === y;
    return objEq(x, y);
};

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
// TODO
// type MatchObj<T extends SumCase<T>> = {
//     [ K in keyof SumCase<T> ] : ( ...args : T[ K ]) => unknown
// }
class SumType {
    constructor(c, d) {
        this.__case = c;
        this.__data = d;
    }
}

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
const Unit = {
    u: Symbol.for('unit'),
    isUnit(u) {
        return u === Unit.u;
    }
};

/**
 *      Provide a type to work with remote data.
 *
 *      @internal
 *      @module
 *
 */
const notQueried$1 = Symbol.for('NotQueried');
const waiting$1 = Symbol.for('Waiting');
const left$1 = Symbol.for('Left');
const right$1 = Symbol.for('Right');
/**
 *      `AsyncData` implementation.
 *
 *      @template L     The error type to be wrapped in potential `left` cases.
 *      @template R     The value type to be wrapped in potential `right` cases.
 *
 */
class AsyncData extends SumType {
    /**
     *      Constructor.
     *
     *      @param c
     *      @param d
     *
     *      @private
     *
     */
    constructor(c, d) {
        super(c, d);
    }
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
    static notQueried() {
        return new AsyncData(notQueried$1.description, Unit);
    }
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
    static waiting() {
        return new AsyncData(waiting$1.description, Unit);
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
     *      @static
     *      @public
     *
     */
    static right(a) {
        return new AsyncData(right$1.description, a);
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
     *      @static
     *      @public
     *
     */
    static left(e) {
        return new AsyncData(left$1.description, e);
    }
    /**
     *      Determine whether the `AsyncData` is a `notQueriedb.
     *
     */
    get isNotQueried() {
        return this.__case === notQueried$1.description;
    }
    /**
     *      Determine whether the `AsyncData` is a `waiting`.
     *
     */
    get isWaiting() {
        return this.__case === waiting$1.description;
    }
    /**
     *      Determine whether the `AsyncData` is a `failure`.
     *
     */
    get isLeft() {
        return this.__case === left$1.description;
    }
    /**
     *      Determine whether the `AsyncData` is a `success`.
     *
     */
    get isRight() {
        return this.__case === right$1.description;
    }
    /**
     *      Return the case of the {@link AsyncData}
     *      (IE. `NotQueried`, `Waiting`, `Left`, or `Right`).
     *
     */
    get case() {
        return this.__case;
    }
    /**
     *      Get the value wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `right`.
     *
     */
    get right() {
        if (!this.isRight)
            throw new Error(`Cannot get a value from a <${this.__case}>`);
        return this.__data;
    }
    /**
     *      Get the error wrapped in this {@see AsyncData}.
     *      Will throw if the {@see AsyncData} is not a `left`.
     */
    get left() {
        if (!this.isLeft)
            throw new Error(`Cannot get an error from a <${this.__case}>`);
        return this.__data;
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
    map(fn) {
        return (this.isRight
            ? AsyncData.right(fn(this.right))
            : this);
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
    mapLeft(fn) {
        return (this.isLeft
            ? AsyncData.left(fn(this.left))
            : this);
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
    fMap(fn) {
        return (this.isRight
            ? fn(this.right)
            : this);
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
    ap(a) {
        return a.fMap(val => this.map(fn => fn(val)));
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
    rightOr(dVal) {
        return this.isRight
            ? this.right
            : dVal;
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
    leftOr(dErr) {
        return this.isLeft
            ? this.left
            : dErr;
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
    caseOf(m) {
        switch (this.case) {
            case notQueried$1.description: return m.NotQueried();
            case waiting$1.description: return m.Waiting();
            case left$1.description: return m.Left(this.left);
            case right$1.description: return m.Right(this.right);
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
    eq(b) {
        switch (this.case) {
            case notQueried$1.description: return b.isNotQueried;
            case waiting$1.description: return b.isWaiting;
            case left$1.description: return b.isLeft && valueEq(this.left, b.left);
            case right$1.description: return b.isRight && valueEq(this.right, b.right);
            default: return false;
        }
    }
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
const notQueried = () => AsyncData.notQueried();
/**
 *      @see AsyncData.waiting
 *
 */
const waiting = () => AsyncData.waiting();
/**
 *      @see AsyncData.right
 *
 */
const right = (a) => AsyncData.right(a);
/**
 *      @see AsyncData.left
 *
 */
const left = (e) => AsyncData.left(e);

export { AsyncData, left, notQueried, right, waiting };
//# sourceMappingURL=index.js.map
