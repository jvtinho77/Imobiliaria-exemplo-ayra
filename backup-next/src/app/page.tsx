import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import PropertyGrid from '@/components/PropertyGrid/PropertyGrid';
import Banner from '@/components/Banner/Banner';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PropertyGrid />
      <Banner />
      <Footer />
    </>
  );
}
