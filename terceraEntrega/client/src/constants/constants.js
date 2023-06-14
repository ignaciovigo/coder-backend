const URL ='http://localhost:8080'
const CONSTANTS = {
    LOGIN_URL : `${URL}/api/jwt/login`,
    REGISTER_URL: `${URL}/api/users/register`,
    LOGOUT_URL : `${URL}/api/jwt/logout`,
    USER_URL: `${URL}/api/users/data`,
    PRODUCTS_URL: `${URL}/api/products`,
    CART_URL:`${URL}/api/carts`,
    USER_TICKETS_URL:`${URL}/api/users/tickets`
}

export default CONSTANTS