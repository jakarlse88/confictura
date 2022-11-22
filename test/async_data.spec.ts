import { AsyncData }                    from '../src/index'
import { expect }                       from 'chai'
import { notQueried , waiting , right } from '../src/async_data'

import 'mocha'


describe( 'AsyncData' , () => {

    context( 'when case is `isNotQueried`' , () => {
        const sut = notQueried()
        
        it( '`isNotQueried` should return `true`' , () => {
            expect( sut.isNotQueried ).true
        } )
            
        it( '`isWaiting` should return `false`' , () => {
           expect( sut.isWaiting ).false 
        } )

        it( '`isSuccess` should return `false`' , () => {
            expect( sut.isRight ).false
        } )

        it( '`isFailure` should return `false`' , () => {
            expect( sut.isLeft ).false
        } )

        it( '`val` should throw' , () => {
            expect( () => sut.right ).to.throw()
        } )

        it( '`fail` should throw' , () => {
            expect( () => sut.left ).to.throw()
        } )
    } )


    context( 'when case is `waiting`' , () => {
        const sut = waiting()
        
        it( '`isNotQueried` should return `false`' , () => {
            expect( sut.isNotQueried ).false
        } )
            
        it( '`isWaiting` should return `true`' , () => {
           expect( sut.isWaiting ).true 
        } )

        it( '`isSuccess` should return `false`' , () => {
            expect( sut.isRight ).false
        } )

        it( '`isFailure` should return `false`' , () => {
            expect( sut.isLeft ).false
        } )

        it( '`val` should throw' , () => {
            expect( () => sut.right ).to.throw()
        } )

        it( '`fail` should throw' , () => {
            expect( () => sut.left ).to.throw()
        } )
    } )


    context( 'when case is `success`' , () => {
        const testVal = "This is a success!" 
        const sut     = right<string , string>( testVal )
        
        it( '`isNotQueried` should return `false`' , () => {
            expect( sut.isNotQueried ).false
        } )
            
        it( '`isWaiting` should return `false`' , () => {
           expect( sut.isWaiting ).false 
        } )

        it( '`isSuccess` should return `true`' , () => {
            expect( sut.isRight ).true
        } )

        it( '`isFailure` should return `false`' , () => {
            expect( sut.isLeft ).false
        } )

        it( '`value` should return the wrapped value' , () => {
            expect( sut.right ).not.empty
        } )

        it( '`fail` should throw' , () => {
            expect( () => sut.left ).to.throw()
        } )

        it( '`map` executes correctly' , () => {
            const mapped = sut.map( ( x : string ) => x.toUpperCase() )

            expect( mapped.isRight ).true
            expect( typeof mapped.right ).eq( 'string' )
            expect( mapped.right ).not.empty
            expect( mapped.right ).eq( testVal.toUpperCase() )
        } )

        it( '`fMap` executes correctly' , () => {
            const testFn = ( x : string ) : AsyncData<string , string> =>
                right( x.toUpperCase() )

            const mapped = sut.fMap( ( x : string ) => testFn( x ) )

            expect( mapped.isRight ).true
            expect( typeof mapped.right ).eq( 'string' )
            expect( mapped.right ).not.empty
            expect( mapped.right ).eq( testVal.toUpperCase() )
        } )

        it( '`ap` executes correctly' , () => {
            const testFn = ( x : string ) : string =>
                x.toUpperCase() 

            const rightA = right<string , ( ( x : string ) => string )>( testFn )
            
            const result = rightA.ap( sut ) 

            expect( result.isRight ).true
            expect( typeof result.right ).eq( 'string' )
            expect( result.right ).not.empty
            expect( result.right ).eq( testVal.toUpperCase() )
        } )

        it( '`ap` correctly applies curried functions' , () => {
            const testFn = ( x : string ) => ( y : string ) : string =>
                x.toUpperCase() + y.toLowerCase()

            const succFn = right<string , ( ( x : string ) => ( y : string ) => string )>( testFn ) 
            const succB  = right<string , string>( testVal )

            const result = succFn.ap( sut ).ap( succB )

            expect( result.isRight ).true
            expect( typeof result.right ).eq( 'string' )
            expect( result.right ).not.empty
            expect( result.right ).eq( testVal.toUpperCase() + testVal.toLowerCase() )
        } )
    } )


    context( 'when case is `failure`' , () => {
        const sut = AsyncData.left( "This is an error!" )
        
        it( '`isNotQueried` should return `false`' , () => {
            expect( sut.isNotQueried ).false
        } )
            
        it( '`isWaiting` should return `false`' , () => {
           expect( sut.isWaiting ).false 
        } )

        it( '`isSuccess` should return `false`' , () => {
            expect( sut.isRight ).false
        } )

        it( '`isFailure` should return `true`' , () => {
            expect( sut.isLeft ).true
        } )

        it( '`value` should throw' , () => {
            expect( () => sut.right ).to.throw()
        } )

        it( '`fail` should return the wrapped error' , () => {
            expect( sut.left ).not.empty
        } )
    } )
} )