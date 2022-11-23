import { AsyncData }                    from '../src/index'
import { expect }                       from 'chai'
import { notQueried , waiting , right, left } from '../src/async_data'


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

        it( '`kind` should return `notQueried`' , () => {
            expect( sut.kind ).eq( 'not-queried' )
        } )
        
        it( '`eq` should return `true` for equal cases values' , () => {
            expect( sut.eq( sut ) ).true
        } )

        it( '`eq` should return `false` for case `waiting`' , () => {
            expect( sut.eq( waiting() ) ).false
        } )

        it( '`eq` should return `false` for case `left`' , () => {
            expect( sut.eq( left( "" ) as AsyncData<unknown , unknown> ) ).false
        } )

        it( '`eq` should return `false` for case `right`' , () => {
            expect( sut.eq( right( "" ) as AsyncData<unknown , unknown> ) ).false
        } )

        it( '`caseOf` should execute correctly' , () => {
            const result = sut.caseOf( {
                notQueried: () => "notQueried"
              , waiting   : () => "waiting"
              , left      :  e => e ?? 'left' 
              , right     :  v => v
            } )

            expect( result ).eq( 'notQueried' )
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

        it( '`kind` should return `waiting`' , () => {
            expect( sut.kind ).eq( 'waiting' )
        } )

        it( '`eq` should return `true` for equal cases values' , () => {
            expect( sut.eq( sut ) ).true
        } )

        it( '`eq` should return `false` for case `notQueried`' , () => {
            expect( sut.eq( notQueried() ) ).false
        } )

        it( '`eq` should return `false` for case `left`' , () => {
            expect( sut.eq( left( "" ) as AsyncData<unknown , unknown> ) ).false
        } )

        it( '`eq` should return `false` for case `right`' , () => {
            expect( sut.eq( right( "" ) as AsyncData<unknown , unknown> ) ).false
        } )

        it( '`caseOf` should execute correctly' , () => {
            const result = sut.caseOf( {
                notQueried: () => "notQueried"
              , waiting   : () => "waiting"
              , left      :  e => e ?? 'left' 
              , right     :  v => v
            } )

            expect( result ).eq( 'waiting' )
        } )
    } )


    context( 'when case is `right`' , () => {
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

        it( '`kind` should return `right`' , () => {
            expect( sut.kind ).eq( 'right' )
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

        it( '`mapLeft` do nothing' , () => {
            const result = sut.mapLeft( x => x.toUpperCase() )

            expect( result.isRight ).true
            expect( result.right ).eq( sut.right ) 
        } )

        it( '`eq` should return `true` for equal cases/err values' , () => {
            expect( sut.eq( sut ) ).true
        } )

        it( '`eq` should return `false` for same case/diff err vals' , () => {
            expect( sut.eq( right( "Different val" ) ) ).false
        } )

        it( '`eq` should return `false` for case `waiting`' , () => {
            expect( sut.eq( waiting() ) ).false
        } )

        it( '`eq` should return `false` for case `notQueried`' , () => {
            expect( sut.eq( notQueried() ) ).false
        } )

        it( '`eq` should return `false` for case `right`' , () => {
            expect( sut.eq( right( "" ) ) ).false
        } )

        it( '`caseOf` should execute correctly' , () => {
            const result = sut.caseOf( {
                notQueried: () => "notQueried"
              , waiting   : () => "waiting"
              , left      :  e => e ?? 'left' 
              , right     :  v => v
            } )

            expect( result ).eq( sut.right )
        } )

        it( '`leftOr` should return its default value' , () => {
            const result = sut.leftOr( 'default' )

            expect( result ).eq( 'default' )
        } )

        it( '`rightOr` should return the wrapped value' , () => {
            const result = sut.rightOr( 'default' )

            expect( result ).eq( sut.right )
        } )
    } )


    context( 'when case is `left`' , () => {
        const sut = AsyncData.left<string , string>( "This is an error!" )
        
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

        it( '`kind` should return `left`' , () => {
            expect( sut.kind ).eq( 'left' )
        } )

        it( '`fail` should return the wrapped error' , () => {
            expect( sut.left ).not.empty
        } )

        it( '`map` should not be applied to err val' , () => {
            const result = sut.map( x => x.toUpperCase() )

            expect( result.isLeft ).true
            expect( result.left ).eq( sut.left )
        } ) 

        it( '`fMap` should not be applied to err val' , () => {
            const result = sut.map( x => right( x.toUpperCase() ) )

            expect( result.isLeft ).true
            expect( result.left ).eq( sut.left )
        } ) 

        it( '`ap` should not be applied to err val' , () => {
            const fn     = ( x : string ) => right( x.toUpperCase() ) 
            const result = right<string , typeof fn>( fn ).ap( sut ) 

            expect( result.isLeft ).true
            expect( result.left ).eq( sut.left )
        } ) 

        it( '`mapLeft` should map the error val' , () => {
            const result = sut.mapLeft( x => x.toUpperCase() )

            expect( result.isLeft ).true
            expect( result.left ).eq( sut.left.toUpperCase() )
        } )

        it( '`eq` should return `true` for equal cases/err values' , () => {
            expect( sut.eq( sut ) ).true
        } )

        it( '`eq` should return `false` for same case/diff err vals' , () => {
            expect( sut.eq( left( "Different err" ) ) ).false
        } )

        it( '`eq` should return `false` for case `waiting`' , () => {
            expect( sut.eq( waiting() ) ).false
        } )

        it( '`eq` should return `false` for case `notQueried`' , () => {
            expect( sut.eq( notQueried() ) ).false
        } )

        it( '`eq` should return `false` for case `right`' , () => {
            expect( sut.eq( right( "" ) ) ).false
        } )

        it( '`caseOf` should execute correctly' , () => {
            const result = sut.caseOf( {
                notQueried: () => "notQueried"
              , waiting   : () => "waiting"
              , left      :  e => e ?? 'left' 
              , right     :  v => v
            } )

            expect( result ).eq( sut.left )
        } )

        it( '`rightOr` should return its default value' , () => {
            const result = sut.rightOr( 'default' )

            expect( result ).eq( 'default' )
        } )

        it( '`leftOr` should return the wrapped error value' , () => {
            const result = sut.leftOr( 'default' )

            expect( result ).eq( sut.left )
        } )
    } )
} )