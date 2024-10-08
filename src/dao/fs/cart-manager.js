import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.lastId = 0;

        
        this.loadCarts();
    }

   

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if (this.carts.length > 0) {
                
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos", error);
            
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    
    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    
    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error("No se encontró un carrito con ese ID");
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por ID");
            throw error;
        }
    }

    
    async addProductsCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const productExist = cart.products.find(p => p.product === productId);

        if (productExist) {
            productExist.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }




}

export default CartManager;


