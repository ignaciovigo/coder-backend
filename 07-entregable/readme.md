# Endpoints api/carts

## Creates a cart
-  POST http://localhost:8080/api/carts/

## Gets cart by id
-   GET http://localhost:8080/api/carts/:cid

## Add or rise the quantity of a specific product in a specific cart 
-   PUT http://localhost:8080/api/carts/:cid/product/:pid
>body example
>```
>{
>    "quantity": 30
>}
>```

## Overwrites the product's array of a specific cart id
-   PUT http://localhost:8080/api/carts/:cid

>body example
>```
>  [
>    {
>        "product": "6442f6d6843f62274af0ec04",
>        "quantity": 23
>    },
>    {
>        "product": "64419095718f9dd8b914f9ca",
>        "quantity": 12
>    }
>  ]
>```
## Deletes a product by id of a specific cart
-   DEL http://localhost:8080/api/carts/:cid/product/:pid

## Deletes all products of a specific cart
-   DEL http://localhost:8080/api/carts/:cid

----
# Endpoints api/products

 ## GET /api/products
show all products of the data base and accepts parameters as limit, sort ('asc' or 'desc'), page and query. The latter only accepts a category name and returns the products that have stock.
-   GET http://localhost:8080/api/products

## Get a specific product by ID
-   GET http://localhost:8080/api/products/:pid
## Create a product
-   POST http://localhost:8080/api/products/
>body example
>```
> {
>    "title": "Samsung J5",
>    "description": "A galactic map to explore the universe!",
>    "price": 19.99,
>    "thumbnails": [],
>    "code": "asda",
>    "stock": 35,
>    "status": false,
>    "category": "Technology"
>}
>```

## Update a specific product by id
-   PUT http://localhost:8080/api/products/:pid
>body example
>```
>
>```

## Deletes a specific product by id
-   DELETE http://localhost:8080/api/products/:pid
----
# endpoints api/sessions
-   POST http://localhost:8080/api/sessions/register
-   POST http://localhost:8080/api/sessions/login
-   GET http://localhost:8080/api/sessions/logout
---
# Views
 
-   show only the products of cart and you can remove them if you want.
    -   http://localhost:8080/carts/:cid

-   show all products of the data base and accepts parameters as limit, sort ('asc' or 'desc'), page and query. The latter only accepts a category name and returns the products that have stock.
    -   http://localhost:8080/products

-   Login form
    -   http://localhost:8080/user/login

-   Register form
    -   http://localhost:8080/user/register

-   Profile 
    -   http://localhost:8080/user/profile
    