import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Layout/Dashboard';
import ItemList from './components/Items/ItemList';
import ItemForm from './components/Items/ItemForm';
import ItemDetail from './components/Items/ItemDetail';
import StockMovementList from './components/StockMovements/StockMovementList';
import StockMovementForm from './components/StockMovements/StockMovementForm';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/new" element={<ItemForm />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/items/:id/edit" element={<ItemForm />} />
            <Route path="/stock-movements" element={<StockMovementList />} />
            <Route path="/stock-movements/new" element={<StockMovementForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
