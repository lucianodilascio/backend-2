import { productService } from "../services/index.js";

class ProductController {

    async getProducts(req, res) {
        const { limit = 4, page = 1, sort = null, query = null } = req.query;

        try {
            const products = await productService.getProducts({ limit, page, sort, query });
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los productos", error: error.message });
        }
    }


    async getProductsById(req, res) {

        const { pid } = req.params;

        try {
            const product = await productService.getProductById(id);
            if (!product) return res.status(404).send("producto no encontrado");

            res.send(product);

        } catch (error) {
            res.status(500).send("error al obtener el producto por ID");
        }

    }

    async getProductsPaginate(req, res) {

        const limit = req.query.limit || 100;
        const page = req.query.page || 1;
        const orderQuery = req.query.sort;

        const sortOrder = orderQuery === "asc" ? 1 : (orderQuery === "des" ? -1 : null);

        try {

            const options = {
                limit: limit,
                page: page,
            }

            if (sortOrder) {
                options.sort = { price: sortOrder };
            }

            // const options = { limit, page, sortOrder };
            const query = {}

            const arrayProducts = await ProductService.paginateProducts(query, options);

            res.send(arrayProducts);

        } catch (error) {
            res.status(500).send("Error al obtener productos", error);
        }
    }

    async createProduct(req, res) {

        try {
            const product = await productService.createProduct(req.body);
            res.status(201).send(product);
        } catch (error) {
            res.status(500).send("Error al crear producto", error);
        }

    }

    async updateProduct(req, res) {
        const { pid } = req.params;
        const updatedProductData = req.body;

        try {
            const updatedProduct = await productService.updateProduct(pid, updatedProductData);
            if (!updatedProduct) return res.status(404).send("Producto no encontrado");

            res.send({ message: "Producto actualizado correctamente", product: updatedProduct });
        } catch (error) {
            res.status(500).send("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params;

        try {
            const deletedProduct = await productService.deleteProduct(pid);
            if (!deletedProduct) return res.status(404).send("Producto no encontrado");

            res.send({ message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).send("Error al eliminar el producto", error);
        }
    }
}






export default ProductController;