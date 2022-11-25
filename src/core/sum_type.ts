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


import Unit from './unit'


type SumCase<T> = {
    [ I in keyof T ] : T[ I ] 
}


// TODO
// type MatchObj<T extends SumCase<T>> = {
//     [ K in keyof SumCase<T> ] : ( ...args : T[ K ]) => unknown
// }


abstract class SumType<T extends SumCase<T>> {
    protected readonly __case : string
    protected readonly __data : T[ keyof T ] | typeof Unit


    protected constructor( c : string , d : T[ keyof T ] | typeof Unit ) {
        this.__case = c
        this.__data = d
    }


    // TODO
    // abstract caseOf( m : MatchObj<T> ) : void | unknown
}


export default SumType
export { SumCase }
