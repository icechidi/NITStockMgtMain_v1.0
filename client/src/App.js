// Desc: Main App component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';

import Dashboard from './components/Layout/Dashboard';
import Users from './components/Users/Users';
import Groups from './components/Groups/Groups';
import Brands from './components/Brands/Brands';
import Category from './components/Category/Category';
import Stores from './components/Stores/Stores';
import Stocks from './components/Stocks/Stocks';
import Attributes from './components/Attributes';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';
import Reports from './components/Reports';
import Company from './components/Companys/Company';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Logout from './components/Logout';

import ItemList from './components/Items/ItemList';
import ItemForm from './components/Items/ItemForm';
import ItemDetail from './components/Items/ItemDetail';
import StockMovementList from './components/StockMovements/StockMovementList';
import StockMovementForm from './components/StockMovements/StockMovementForm';

import './styles/main.css';
import './styles/dashboard.css';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <div className="content" style={{ marginLeft: '250px', padding: '20px' }}>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/category" element={<Category />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/attributes" element={<Attributes />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/company" element={<Company />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/items" element={<ItemList />} />
            <Route path="/items/new" element={<ItemForm />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/items/:id/edit" element={<ItemForm />} />
            <Route path="/stock-movements" element={<StockMovementList />} />
            <Route path="/stock-movements/new" element={<StockMovementForm />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;