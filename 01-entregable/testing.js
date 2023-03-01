import ProductManager from "./ProductManager.js";

const instance1 = new ProductManager()

instance1.addProducts('sAMSUNG J5','SAMSUNG J5 v3423.6, 45gb',4555,'1312321','F3L2K4F2K3LÑJ4F',200)
instance1.addProducts('sAMSUNG J5','SAMSUNG J5 v3423.6, 45gb',4555,'aanyphoto','F3L2K4F2K3LdÑJ4F',200)
console.log(instance1.getProducts)
