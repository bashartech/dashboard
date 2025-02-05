import { type SchemaTypeDefinition } from 'sanity'
import  {product}  from './product'
import post from "./post"
import order from './order'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ product,post,order],
}
