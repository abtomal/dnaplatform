import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NFTDetails from './pages/NFTDetails';
import MyCollection from './pages/MyCollection';
import Collection from './pages/Collection';  
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nft/:id" element={<NFTDetails />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/my-collection" element={<MyCollection />} />
          {/*Catch-all route that redirects to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;