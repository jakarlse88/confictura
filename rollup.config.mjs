import { defineConfig } from "rollup"
import   dts            from "rollup-plugin-dts"
import   typescript     from "@rollup/plugin-typescript"


const config = defineConfig( [
    {
         input  : 'dist/async-data/index.js'
      , output  : {
            file      : 'index.js'
          , sourcemap : true  
          , format    : 'es'
            }  
      , plugins : [
            typescript()
            ]  
        }
  , {
         input  : 'dist/async-data/index.d.ts'
      ,  output : {
            file : 'index.d.ts'
            } 
      , plugins : [
            dts()
            ]  
        }  
    ] )


export default config