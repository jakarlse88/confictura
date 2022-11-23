"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const chai_1 = require("chai");
const async_data_1 = require("../src/async_data");
require("mocha");
describe('AsyncData', () => {
    context('when case is `isNotQueried`', () => {
        const sut = (0, async_data_1.notQueried)();
        it('`isNotQueried` should return `true`', () => {
            (0, chai_1.expect)(sut.isNotQueried).true;
        });
        it('`isWaiting` should return `false`', () => {
            (0, chai_1.expect)(sut.isWaiting).false;
        });
        it('`isSuccess` should return `false`', () => {
            (0, chai_1.expect)(sut.isRight).false;
        });
        it('`isFailure` should return `false`', () => {
            (0, chai_1.expect)(sut.isLeft).false;
        });
        it('`val` should throw', () => {
            (0, chai_1.expect)(() => sut.right).to.throw();
        });
        it('`fail` should throw', () => {
            (0, chai_1.expect)(() => sut.left).to.throw();
        });
    });
    context('when case is `waiting`', () => {
        const sut = (0, async_data_1.waiting)();
        it('`isNotQueried` should return `false`', () => {
            (0, chai_1.expect)(sut.isNotQueried).false;
        });
        it('`isWaiting` should return `true`', () => {
            (0, chai_1.expect)(sut.isWaiting).true;
        });
        it('`isSuccess` should return `false`', () => {
            (0, chai_1.expect)(sut.isRight).false;
        });
        it('`isFailure` should return `false`', () => {
            (0, chai_1.expect)(sut.isLeft).false;
        });
        it('`val` should throw', () => {
            (0, chai_1.expect)(() => sut.right).to.throw();
        });
        it('`fail` should throw', () => {
            (0, chai_1.expect)(() => sut.left).to.throw();
        });
    });
    context('when case is `success`', () => {
        const testVal = "This is a success!";
        const sut = (0, async_data_1.right)(testVal);
        it('`isNotQueried` should return `false`', () => {
            (0, chai_1.expect)(sut.isNotQueried).false;
        });
        it('`isWaiting` should return `false`', () => {
            (0, chai_1.expect)(sut.isWaiting).false;
        });
        it('`isSuccess` should return `true`', () => {
            (0, chai_1.expect)(sut.isRight).true;
        });
        it('`isFailure` should return `false`', () => {
            (0, chai_1.expect)(sut.isLeft).false;
        });
        it('`value` should return the wrapped value', () => {
            (0, chai_1.expect)(sut.right).not.empty;
        });
        it('`fail` should throw', () => {
            (0, chai_1.expect)(() => sut.left).to.throw();
        });
        it('`map` executes correctly', () => {
            const mapped = sut.map((x) => x.toUpperCase());
            (0, chai_1.expect)(mapped.isRight).true;
            (0, chai_1.expect)(typeof mapped.right).eq('string');
            (0, chai_1.expect)(mapped.right).not.empty;
            (0, chai_1.expect)(mapped.right).eq(testVal.toUpperCase());
        });
        it('`fMap` executes correctly', () => {
            const testFn = (x) => (0, async_data_1.right)(x.toUpperCase());
            const mapped = sut.fMap((x) => testFn(x));
            (0, chai_1.expect)(mapped.isRight).true;
            (0, chai_1.expect)(typeof mapped.right).eq('string');
            (0, chai_1.expect)(mapped.right).not.empty;
            (0, chai_1.expect)(mapped.right).eq(testVal.toUpperCase());
        });
        it('`ap` executes correctly', () => {
            const testFn = (x) => x.toUpperCase();
            const rightA = (0, async_data_1.right)(testFn);
            const result = rightA.ap(sut);
            (0, chai_1.expect)(result.isRight).true;
            (0, chai_1.expect)(typeof result.right).eq('string');
            (0, chai_1.expect)(result.right).not.empty;
            (0, chai_1.expect)(result.right).eq(testVal.toUpperCase());
        });
        it('`ap` correctly applies curried functions', () => {
            const testFn = (x) => (y) => x.toUpperCase() + y.toLowerCase();
            const succFn = (0, async_data_1.right)(testFn);
            const succB = (0, async_data_1.right)(testVal);
            const result = succFn.ap(sut).ap(succB);
            (0, chai_1.expect)(result.isRight).true;
            (0, chai_1.expect)(typeof result.right).eq('string');
            (0, chai_1.expect)(result.right).not.empty;
            (0, chai_1.expect)(result.right).eq(testVal.toUpperCase() + testVal.toLowerCase());
        });
    });
    context('when case is `failure`', () => {
        const sut = index_1.AsyncData.left("This is an error!");
        it('`isNotQueried` should return `false`', () => {
            (0, chai_1.expect)(sut.isNotQueried).false;
        });
        it('`isWaiting` should return `false`', () => {
            (0, chai_1.expect)(sut.isWaiting).false;
        });
        it('`isSuccess` should return `false`', () => {
            (0, chai_1.expect)(sut.isRight).false;
        });
        it('`isFailure` should return `true`', () => {
            (0, chai_1.expect)(sut.isLeft).true;
        });
        it('`value` should throw', () => {
            (0, chai_1.expect)(() => sut.right).to.throw();
        });
        it('`fail` should return the wrapped error', () => {
            (0, chai_1.expect)(sut.left).not.empty;
        });
    });
});
