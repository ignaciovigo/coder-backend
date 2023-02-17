class ProductManager {
  static productId = 5000;

  constructor() {
    this.products = [];
  }

  get getProducts(){
    return this.products
  }
   
  getProductById(id){
    const product = this.products.find(e => e.id === id)
    return product ?? console.error('Not Found')
  }

  addProducts(title, description, price, thumbnail, code, stock) {
    const product = { title, description, price, thumbnail, code, stock };
    this.validateProduct(product);
    product.id = ++ProductManager.productId;
    this.products.push(product);
  }

  validateProduct({ title, description, price, thumbnail, code, stock }) {
    const pattern = {
      title: /^([a-zA-ZáÁéÉíÍóÓúÚñÑÜü](\s)?)+$/,
      description: /^[a-zA-ZáÁéÉíÍóÓúÚñÑÜü].+$/,
      price: /^-?(0|[1-9]\d*)(\.\d+)?$/,
      stock: /^\d+$/,
    };
    if (!title || !description || !price || !thumbnail || !code || !stock)
      throw new Error("Not all required fields were provided");
    if (!pattern.title.test(title))
      throw new Error("The title provided must be a string");
    if (!pattern.description.test(description))
      throw new Error("The description provided must start with a string");
    if (!pattern.price.test(price))
      throw new Error("The price provided must be a number");
    if (!pattern.stock.test(stock))
      throw new Error("The stock provided must be an integer");

    const index = this.isCodeExist(code);
    if (index >= 0) throw new Error("The product code provided already exists");
  }

  isCodeExist(code) {
    return this.products.findIndex((e) => e.code === code);
  }
}

export default ProductManager