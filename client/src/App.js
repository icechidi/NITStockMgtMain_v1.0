import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header/Header"
import Navbar from "./components/Navbar/Navbar"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Dashboard from "./components/Dashboard/Dashboard"
import Groups from "./components/Groups/Groups"
import Brands from "./components/Brands/Brands"
import Category from "./components/Category/Category"
import Stores from "./components/Stores/Stores"
import Stocks from "./components/Stocks/Stocks"
import Attributes from "./components/Attributes"
import Products from "./components/Products/Products"
import Orders from "./components/Orders/Orders"
import Reports from "./components/Reports/Reports"
import Company from "./components/Companys/Company"

import ItemList from "./components/Items/ItemList"
import ItemForm from "./components/Items/ItemForm"
import ItemDetail from "./components/Items/ItemDetail"
import StockMovementList from "./components/StockMovements/StockMovementList"
import StockMovementForm from "./components/StockMovements/StockMovementForm"
import Requests from "./components/Requests/Requests"
import ProtectedRoute from "./components/ProtectedRoute"

import "./styles/main.css"
import "./App.css"
import UserProfile from "./components/UserProfile/UserProfile"

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

function AppContent() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes with layout */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </div>
  )
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <>
        <Header />
        <div className="main-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
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
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/items" element={<ItemList />} />
              <Route path="/items/new" element={<ItemForm />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/items/:id/edit" element={<ItemForm />} />
              <Route path="/stock-movements" element={<StockMovementList />} />
              <Route path="/stock-movements/new" element={<StockMovementForm />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </>
    </ProtectedRoute>
  )
}

export default App
