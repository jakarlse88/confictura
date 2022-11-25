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
    u : Symbol.for( 'unit' ) 
    , isUnit( u : unknown ) : boolean {
        return u === Unit.u
    }
} as const


export default Unit
