import productDao from "../dao/product.dao.js";

class ProductRepository {

    async createProduct(productData) {

        return await productDao.save(productData);
    }

    async getProductById(id) {

        return await productDao.findById(id);
    }

    async getProducts(query) {

        return await productDao.find(query);
    }

    async updateProduct(id, productData) {

        return await productDao.update(id, productData);
    }

    async deleteProduct(id) {

        return await productDao.delete(id);
    }

    async paginateProducts(query, options){
        return await productDao.paginate(query, options);
    }

    async getProductsByCategory(category){
        return await productDao.findOne({ category });
    }

    async getProductByCode(code){
        return await productDao.findOne({ code });
    }
}

export default ProductRepository;