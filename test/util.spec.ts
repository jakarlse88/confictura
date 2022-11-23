
import { expect }  from 'chai'
import { valueEq } from '../src/internal/util'

import 'mocha'

describe( 'valueEq' , () => {

    context( 'types do not match' , () => {
        
        it( 'returns `false` for string and number' , () => {
            const result = valueEq( 'test' , 1 )

            expect( result ).false
        } )

        it( 'returns `false` for string and obj' , () => {
            const result = valueEq( 'test' , {} )

            expect( result ).false
        } )

        it( 'returns `false` for string and arr' , () => {
            const result = valueEq( 'test' , [] )

            expect( result ).false
        } )

    } )

    context( 'types match' , () => {
       
        it( 'returns `true` for eq strings' , () => {
            const result = valueEq( 'test' , 'test' )

            expect( result ).true
        } )

        it( 'returns `true` for eq caps strings' , () => {
            const result = valueEq( 'TEST' , 'TEST' )

            expect( result ).true
        } )

        it( 'returns `false` for non-eq strings' , () => {
            const result = valueEq( 'TEST' , 'test' )

            expect( result ).false
        } )

        it( 'returns `true` for integers' , () => {
            const result = valueEq( 1 ,  1 )

            expect( result ).true
        } )

        it( 'returns `false` for non-eq integers' , () => {
            const result = valueEq( 1 ,  2 )

            expect( result ).false
        } )

        it( 'returns `true` for floats' , () => {
            const result = valueEq( 1.1 ,  1.1 )

            expect( result ).true
        } )

        it( 'returns `false` for non-eq floats' , () => {
            const result = valueEq( 1.1 ,  2.2 )

            expect( result ).false
        } )

        it( 'returns `true` for eq objects' , () => {
            const obj = {
                a : 1
              , b : 2
              , c : 3
            }

            const result = valueEq( obj , obj )

            expect( result ).true
        } )

        it( 'returns `false` for non-eq objects' , () => {
            const obj = {
                a : 1
              , b : 2
              , c : 3
            }

            const result = valueEq( obj , { ...obj , c : 4 } )

            expect( result ).false           
        } )

        it( 'returns `true` for eq arrs' , () => {
            const arr = [
                1
              , 2
              , 3
            ]

            const result = valueEq( arr , arr )

            expect( result ).true
        } )

        it( 'returns `false` for non-eq objects' , () => {
            const arr = [
                1
              , 2
              , 3
            ]

            const result = valueEq( arr , [ ...arr , 4 ] )

            expect( result ).false
        } )
    } )

} )