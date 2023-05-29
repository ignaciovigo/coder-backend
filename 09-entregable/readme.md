# Endpoints

## Carts
- `POST /api/carts/`: creates a new cart
- `GET /api/carts/:cid`: retrieves a cart by ID
- `PUT /api/carts/:cid/product/:pid`: adds or increases the quantity of a specific product in a specific cart. Request body example:
    ```
    {
        "quantity": 30
    }
    ```
- `PUT /api/carts/:cid`: overwrites the products array of a specific cart ID. Request body example:
    ```
    [
        {
            "product": "6442f6d6843f62274af0ec04",
            "quantity": 23
        },
        {
            "product": "64419095718f9dd8b914f9ca",
            "quantity": 12
        }
    ]
    ```
- `DELETE /api/carts/:cid/product/:pid`: deletes a product by ID from a specific cart
- `DELETE /api/carts/:cid`: deletes all products from a specific cart

## Products
- `GET /api/products`: retrieves all products in the database. Accepts parameters as limit, sort ('asc' or 'desc'), page, and query. The latter only accepts a category name and returns the products that have stock.
- `GET /api/products/:pid`: retrieves a specific product by ID
- `POST /api/products/`: creates a new product. Request body example:
    ```
    {
        "title": "Samsung J5",
        "description": "A galactic map to explore the universe!",
        "price": 19.99,
        "thumbnails": [],
        "code": "asda",
        "stock": 35,
        "status": false,
        "category": "Technology"
    }
    ```
- `PUT /api/products/:pid`: updates a specific product by ID. Request body example:
    ```
    {
        "title": "Updated Product",
        "description": "New Description",
        "price": 29.99,
        "stock": 50
    }
    ```
- `DELETE /api/products/:pid`: deletes a specific product by ID

# Views
- `GET /carts/:cid`: displays only the products of a specific cart and allows the user to remove them
- `GET /products`: displays all products in the database. Accepts parameters as limit, sort ('asc' or 'desc'), page, and query. The latter only accepts a category name and returns the products that have stock.
- `GET /user/login`: displays a login form
- `GET /user/register`: displays a registration form
- `GET /user/profile`: displays the user's profile

# Authentication and Authorization
- `POST /api/jwt/login`: Creates the token and saves it inside of a cookie in your browser
- `GET /api/jwt/logout`: Deletes the token cookie
- `GET /api/jwt/github`: To join with github account
- `GET /api/jwt/githubcallback`: Its necessary for going back to our page.
- `POST /api/users/register`: Creates an user in the database once you send an object that contains email, password, age, firstName, lastName.
- `POST /api/users/data`: Provides the not sensitive user data.



# Notes
Env variables
- MONGO_URL = 'url database'

- CLIENT_ID_GITHUB = for github login
- CLIENT_SECRET = for github login
- CALLBACK_URL = for github login
- PRIVATE_KEY = for passport jwt strategy
- SECRET_COOKIE = for cookies
- PORT = 