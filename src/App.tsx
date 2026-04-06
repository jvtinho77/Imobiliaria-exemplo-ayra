import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import PropertyGrid from '@/components/PropertyGrid/PropertyGrid';
import Banner from '@/components/Banner/Banner';
import Footer from '@/components/Footer/Footer';
import PropertyDetails from '@/components/PropertyDetails/PropertyDetails';

function Home() {
  return (
    <>
      <Hero />
      <PropertyGrid />
      <Banner />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="ambient-light main-glow"></div>
      <div className="ambient-light secondary-glow"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis/:id" element={<PropertyDetails />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
