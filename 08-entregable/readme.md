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

## Sessions
- `POST /api/sessions/register`: registers a new user
- `POST /api/sessions/login`: logs in a user
- `GET /api/sessions/logout`: logs out the current user
- `GET /api/sessions/github`: logs in a user using GitHub

# Views
- `GET /carts/:cid`: displays only the products of a specific cart and allows the user to remove them
- `GET /products`: displays all products in the database. Accepts parameters as limit, sort ('asc' or 'desc'), page, and query. The latter only accepts a category name and returns the products that have stock.
- `GET /user/login`: displays a login form
- `GET /user/register`: displays a registration form
- `GET /user/profile`: displays the user's profile

# Authentication and Authorization
The app uses Passport.js to manage authentication and authorization. The following strategies are implemented:
- `passport-local`: for registering and logging in users using email and password
- `passport-github2`: for logging in users using GitHub


# Notes
- Note that to use the `passport-github2` strategy, you need to provide a configuration object that includes the client ID, secret, and callback URL that GitHub requires. Also, your GitHub account must have your email set to public for the application to work with GitHub.

- For the app works you need to set the database url db.js file