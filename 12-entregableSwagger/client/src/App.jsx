import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
const Main = lazy(() => import("./components/Main"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import ProfileContainer from "./components/ProfileContainer";
import HistoryContainer from "./components/HistoryContainer";
import ProductsContainer from "./components/ProductsContainer";
import { CartProvider } from "./contexts/CartProvider";
import Purchase from "./components/Purchase";
import AdminPanelContainer from "./components/AdminPanelContainer";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./components/NotFound";

function App() {
  const { currentUser } = useAuth()
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <CartProvider>
                    <Main />
                </CartProvider>
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index path="products" element={<ProductsContainer />} />
          <Route path='profile' element={<ProfileContainer />} />
          {currentUser?.role === 'USER' && (<Route path='history' element={<HistoryContainer />} />)}
          {currentUser?.role === 'USER' && ( <Route path='cart' element={<Purchase />} />)}
          {currentUser?.role === 'ADMIN' && (<Route path='adminpanel' element={<AdminPanelContainer />} />)}
        </Route>
        <Route
          path='/login'
          index
          element={
            <AuthRoute>
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            </AuthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <AuthRoute>
              <Suspense fallback={<Loading />}>
                <Register />
              </Suspense>
            </AuthRoute>
          }
        />
      <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
