import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { loadMe } from './store/slices/authSlice.js';

const Home = lazy(() => import('./pages/public/Home.jsx'));
const SearchResults = lazy(() => import('./pages/public/SearchResults.jsx'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails.jsx'));
const Category = lazy(() => import('./pages/public/Category.jsx'));
const Deals = lazy(() => import('./pages/public/Deals.jsx'));
const Brands = lazy(() => import('./pages/public/Brands.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
const Dashboard = lazy(() => import('./pages/user/Dashboard.jsx'));
const Wishlist = lazy(() => import('./pages/user/Wishlist.jsx'));
const SavedSearches = lazy(() => import('./pages/user/SavedSearches.jsx'));
const Alerts = lazy(() => import('./pages/user/Alerts.jsx'));
const Profile = lazy(() => import('./pages/user/Profile.jsx'));
const Notifications = lazy(() => import('./pages/user/Notifications.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics.jsx'));
const StoreManagement = lazy(() => import('./pages/admin/StoreManagement.jsx'));

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (token) dispatch(loadMe());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="categories/:id" element={<Category />} />
        <Route path="deals" element={<Deals />} />
        <Route path="brands" element={<Brands />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="saved-searches" element={<SavedSearches />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'manager']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/stores" element={<StoreManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
