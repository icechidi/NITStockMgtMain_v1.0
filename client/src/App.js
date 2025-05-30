import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
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

import StocksCopy from "./components/StocksCopy/StocksCopy"

import ComingSoon from "./components/ComingSoon/ComingSoon"
import ProtectedRoute from "./components/ProtectedRoute"

import "./styles/main.css"
import "./App.css"
import UserProfile from "./components/UserProfile/UserProfile"

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
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

              {/* All other pages redirect to Coming Soon */}
              <Route
                path="/groups"
                element={<ComingSoon pageTitle="Groups Management" pageType="under-development" />}
              />
              <Route
                path="/brands"
                element={<ComingSoon pageTitle="Brands Management" pageType="under-development" />}
              />
              <Route
                path="/category"
                element={<ComingSoon pageTitle="Category Management" pageType="under-development" />}
              />
              <Route
                path="/stores"
                element={<ComingSoon pageTitle="Stores Management" pageType="under-development" />}
              />
              {/* <Route
                path="/stocks"
                element={<ComingSoon pageTitle="Stock Management" pageType="under-development" />}
              /> */}
              <Route
                path="/attributes"
                element={<ComingSoon pageTitle="Attributes Management" pageType="under-development" />}
              />
              {/* <Route
                path="/products"
                element={<ComingSoon pageTitle="Products Management" pageType="under-development" />}
              /> */}
              <Route
                path="/orders"
                element={<ComingSoon pageTitle="Orders Management" pageType="under-development" />}
              />
              <Route
                path="/reports"
                element={<ComingSoon pageTitle="Reports & Analytics" pageType="under-development" />}
              />
              <Route
                path="/company"
                element={<ComingSoon pageTitle="Company Settings" pageType="under-development" />}
              />
              <Route path="/profile" element={<ComingSoon pageTitle="User Profile" pageType="under-development" />} />
              <Route path="/items" element={<ComingSoon pageTitle="Items Management" pageType="under-development" />} />
              <Route path="/items/new" element={<ComingSoon pageTitle="Add New Item" pageType="under-development" />} />
              <Route path="/items/:id" element={<ComingSoon pageTitle="Item Details" pageType="under-development" />} />
              <Route
                path="/items/:id/edit"
                element={<ComingSoon pageTitle="Edit Item" pageType="under-development" />}
              />
              <Route
                path="/stock-movements"
                element={<ComingSoon pageTitle="Stock Movements" pageType="under-development" />}
              />
              <Route
                path="/stock-movements/new"
                element={<ComingSoon pageTitle="Record Stock Movement" pageType="under-development" />}
              />
              <Route path="/requests" element={<ComingSoon pageTitle="Item Requests" pageType="under-development" />} />

              <Route path="/stocks" element={<Stocks />} />
              <Route path="/products" element={<Products />} />

              <Route path="/stocks-copy" element={<StocksCopy />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />

              {/* <Route path="/groups" element={<Groups />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/category" element={<Category />} />
              <Route path="/stores" element={<Stores />} />

              <Route path="/attributes" element={<Attributes />} />

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
              <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}

            </Routes>
          </div>
        </div>
      </>
    </ProtectedRoute>
  )
}

export default App
