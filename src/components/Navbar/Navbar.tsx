import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Revelar Navbar após 3 segundos
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 3000); // Sincronizado com o Hero (3s)

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);

      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY.current) {
          setHidden(true); 
        } else {
          setHidden(false); 
        }
      } else {
        setHidden(false); 
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''} ${isInitialLoad ? styles.initialHide : ''}`}
    >
      <div className={styles.navContainer}>
        <Link to="#inicio" className={styles.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
            {/* Telhado Minimalista */}
            <path d="M8 22L20 12L32 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Chaminé elegante */}
            <path d="M26 15V12H29V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className={styles.logoText}>
            <span className={styles.brand}>SUA LOGO</span>
          </div>
        </Link>

        <ul className={styles.navLinks}>
          <li><Link to="#inicio">Início</Link></li>
          <li><Link to="#imoveis">Imóveis</Link></li>
          <li><Link to="#sobre">Sobre Nós</Link></li>
        </ul>

        <div className={styles.navActions}>
          <ThemeToggle />
          <Link to="#contato" className={styles.ctaBtn}>Fale Conosco</Link>
        </div>
      </div>
    </nav>
  );
}
