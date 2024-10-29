import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";


 export const cartService = new CartRepository();
 export const productService = new ProductRepository();