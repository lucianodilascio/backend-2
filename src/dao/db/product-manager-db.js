import ProductModel from "../models/product.model.js";

class ProductManager {


    async addProduct({ title, description, price, code, img, stock, status, category, thumbnails }) {
        try {
            
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            
            const productExist = await ProductModel.findOne({ code: code });
            if (productExist) {
                console.log("el codigo debe ser unico");
                return;
            }

            

            const newProduct = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                img,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("no se pudo agregar el producto: ", error);
            return null;
        }
    }


     async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
    
            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }
    
            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }
    
            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
    
            const totalProducts = await ProductModel.countDocuments(queryOptions);
    
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
    
            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    } 

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                console.log("producto no encontrado");
                return null;
            }
            return product;
        } catch (error) {
            console.log("Error al buscar producto por ID", error);
        }
    }


    
    async updateProduct(id, updatedProduct) {
        try {
            const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);

            if (!updated) {

                console.log("no se puede encontrar el producto");
                return null;
            }
            return updated;
        } catch (error) {
            console.log("Tenemos un error al actualizar productos ", error);
        }
    }

    
    async deleteProduct(id) {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id);

            if (!deleted) {

                console.log("no se puede encontrar el producto");
                return null;
            }

            console.log("producto eliminado correctamente");

        } catch (error) {
            console.log("Tenemos un error al eliminar productos ", error);
        }
    }
}

export default ProductManager;