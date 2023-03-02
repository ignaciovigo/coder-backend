const pattern = {
  title: /^([a-zA-ZáÁéÉíÍóÓúÚñÑÜü]([0-9\s]+)?)+$/,
  description: /^[a-zA-ZáÁéÉíÍóÓúÚñÑÜü].+$/,
  price: /^-?(0|[1-9]\d*)(\.\d+)?$/,
  stock: /^\d+$/,
};

class ProductManager {
  static productId = 5000;

  constructor() {
    this.products = [];
  }

  get getProducts() {
    /* returns the products list */
    return this.products;
  }

  getProductById(id) {
    /*
    given an id returns the element of the list of products that contains it
     otherwise it returns an error not found
    */
    const product = this.products.find((e) => e.id === id);
    return product ?? console.error("Not Found");
  }

  isCodeExist(code) {
    /* returns a boolean if the given code exists in the products list */
    return this.products.some((e) => e.code === code);
  }

  validateProduct({ title, description, price, thumbnail, code, stock }) {
    /* validates each property of the given object*/
    if (!title || !description || !price || !thumbnail || !code || !stock)
      throw new Error("Not all required fields were provided");
    if (!pattern.title.test(title))
      throw new Error("The title provided must be and start with a string");
    if (!pattern.description.test(description))
      throw new Error("The description provided must start with a string");
    if (!pattern.price.test(price))
      throw new Error("The price provided must be a number");
    if (!pattern.stock.test(stock))
      throw new Error("The stock provided must be an integer");
    if (this.isCodeExist(code))
      throw new Error("The product code provided already exists");
  }

  addProducts(title, description, price, thumbnail, code, stock) {
    /* transforms the given product data into an object and adds it to the products list
     once its been validated, also adds it an id*/
    const product = { title, description, price, thumbnail, code, stock };
    this.validateProduct(product);
    product.id = ++ProductManager.productId;
    this.products.push(product);
  }
}

export default ProductManager;
