import ProductManager from "./ProductManager.js";

const productToUp = {
  title: "Holaa  todos",
  description: "adsad",
  price: 123,
  thumbnail: "any",
  code: "d1248040-d69d-4328-8dcb-d0db03340209",
  stock: 12,
};

const instance1 = new ProductManager();
console.log(typeof instance1.getProducts);

instance1.addProduct(
  "Samsung J5",
  "Empezamos a probar",
  123,
  "any",
  "1234dkj",
  29
);

console.log(instance1.getProducts)

console.log("Producto by ID: ", instance1.getProductById("ingresar id"));
console.log("Obtener productos: ", instance1.getProducts);
instance1.updateProduct("ingresar id", productToUp);
instance1.deleteProduct("ingresar id");
console.log(instance1.getProducts);
// instance1.deleteAll()
