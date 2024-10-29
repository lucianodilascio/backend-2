/*import CartModel from "../models/cart.model.js";

class CartManager {

    
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("error al crear el carrito");
            return null;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log("no existe tal carrito");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por ID", error);
            throw error;
        }
    }
    

    
    async addProductsCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);


            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar el producto");
            throw error;
        }
    }


    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
                return null;
            }
    
            console.log("Carrito encontrado:", cart);
            console.log("Producto ID:", productId);
    
            const productExist = cart.products.find(item => item.product._id.toString() === productId);
    
            if (!productExist) {
                console.log("Producto no encontrado en el carrito");
                return null;
            }
    
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
    
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar el producto del carrito", error);
            throw error;
        }
    }
    
    
    

    async updateCart(cartId, products) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;
    
            cart.products = products;
    
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al actualizar el carrito");
            throw error;
        }
    }

    
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
                return null;
            }
        
            console.log("Carrito encontrado:", cart);
            console.log("Producto ID:", productId);
        
            
            const productExist = cart.products.find(item => item.product._id.toString() === productId);
        
            if (!productExist) {
                console.log("Producto no encontrado en el carrito");
                return null;
            }
        
            
            productExist.quantity = quantity;
        
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }
    
    

    async clearCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;
    
            cart.products = [];
    
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito");
            throw error;
        }
    }
    

}

export default CartManager;

