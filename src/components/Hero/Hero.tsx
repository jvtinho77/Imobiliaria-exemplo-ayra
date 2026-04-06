import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Hero.module.css';

export default function Hero() {
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Garantir que o conteúdo apareça logo, sem depender 100% do vídeo
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000); // 3s conforme solicitado para o efeito de entrada impactante

    return () => clearTimeout(timer);
  }, [theme]);

  const videoSrc = theme === 'light'
    ? '/hero-light.mp4'
    : '/hero-home.mp4';

  return (
    <header className={styles.hero} id="inicio">
      <div className={styles.heroBg}>
        <video
          ref={videoRef}
          key={theme} // Force re-render on theme change
          className={styles.heroVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source
            src={videoSrc}
            type="video/mp4"
          />
        </video>
        <div className={styles.heroOverlay} />
      </div>

      <div className={`${styles.heroContent} ${showContent ? styles.show : ''}`}>
        <div className={styles.mobileBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.28 1.28L3 12l5.8 1.9a2 2 0 0 1 1.28 1.28L12 21l1.9-5.8a2 2 0 0 1 1.28-1.28L21 12l-5.8-1.9a2 2 0 0 1-1.28-1.28Z"/></svg>
          Seleção Exclusiva
        </div>
        <h1 className={`${styles.fadeUp} ${styles.heroTitle}`}>
          <span className={styles.desktopText}>O seu novo padrão de vida</span>
          <span className={styles.mobileText}>Bem-vindo ao Luxo</span>
        </h1>
        <p className={`${styles.fadeUp} ${styles.heroDescription}`}>
          Descubra <strong>residências exclusivas</strong> e lares deslumbrantes projetados para
          elevar a sua experiência de <strong>bem-estar</strong> e <strong>conforto</strong>.
        </p>

        <div className={`${styles.searchBar21st} ${styles.fadeUp}`}>
          <div className={styles.searchField21st}>
            <div className={styles.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.28 1.28L3 12l5.8 1.9a2 2 0 0 1 1.28 1.28L12 21l1.9-5.8a2 2 0 0 1 1.28-1.28L21 12l-5.8-1.9a2 2 0 0 1-1.28-1.28Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>
            </div>
            <div className={styles.inputContent} style={{ flex: 1, width: '100%' }}>
              <label htmlFor="ai-search">Pesquisa Inteligente (IA)</label>
              <input id="ai-search" type="text" placeholder="Digite aqui que tipo de casa você está buscando e aonde..." style={{ width: '100%' }} />
            </div>
          </div>

          <button className={styles.btnSearch21st}>
            Buscar
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
