const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;

        this.loadArray();
    }

    async loadArray() {
        try {
            this.products = await this.readFile();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }

    async addProduct({ title, description, price, img, code, stock, status, category, id }) {
        // Validación y creación del objeto con el ID auto-incrementable
        if (!title || !description || !price || !img || !code || !stock || !category || !status || !id) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // Validar que el código sea ÚNICO
        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        // Ahora crea el nuevo objeto
        const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        const newProduct = {
            id: lastProductId + 1,
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status
        };

        // Una vez creado, agregarlo al array
        this.products.push(newProduct);

        // Guardarlo en el archivo
        await this.saveFile(this.products);
    }

    async getProducts() {
        try {
            const productArray = await this.readFile();
            return productArray;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

    async getProductById(id) {
        try {
            const productArray = await this.readFile();
            const foundProduct = productArray.find(item => item.id === id);

            if (!foundProduct) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return foundProduct;
            }
        } catch (error) {
            console.log("Error al buscar producto por ID", error);
        }
    }

    // Métodos auxiliares
    async readFile() {
        const response = await fs.readFile(this.path, "utf-8");
        const productArray = JSON.parse(response);
        return productArray;
    }

    async saveFile(productArray) {
        await fs.writeFile(this.path, JSON.stringify(productArray, null, 2));
    }

 // Método para actualizar un producto existente
 async updateProduct(id, updatedProduct) {
    try {
        const productArray = await this.readFile(); 

        const index = productArray.findIndex(item => item.id === id); 

        if (index !== -1) {
            productArray[index] = { ...productArray[index], ...updatedProduct }; 
            await this.saveFile(productArray); 
            console.log("Producto actualizado"); 
        } else {
            console.log("No se encuentra el producto"); 
        }
    } catch (error) {
        console.log("Tenemos un error al actualizar productos"); 
    }
}

// Método para borrar productos
async deleteProduct(id) {
    try {
        const productArray = await this.readFile(); 

        const index = productArray.findIndex(item => item.id === id); 

        if (index !== -1) {
            productArray.splice(index, 1); 
            await this.saveFile(productArray); 
            console.log("Producto eliminado"); 
        } else {
            console.log("No se encuentra el producto"); 
        }
    } catch (error) {
        console.log("Tenemos un error al eliminar productos"); 
    }
}
}





module.exports = ProductManager;
