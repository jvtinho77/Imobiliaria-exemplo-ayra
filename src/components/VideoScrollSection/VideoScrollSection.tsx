import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './VideoScrollSection.module.css';

// Force video paths
const LIGHT_VIDEO = '/nuvem-video.mp4';
const DARK_VIDEO = '/drone-video.mp4';

export default function VideoScrollSection() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Video sources
  const videoSrc = theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO;

  // Intersection Observer para animação de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll-based video control
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !videoRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Calculate progress based on section position
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + sectionHeight)
      ));

      setVideoProgress(scrollProgress);

      // Sync video time with scroll progress
      if (videoRef.current.duration) {
        videoRef.current.currentTime = scrollProgress * videoRef.current.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="experiencia">
      {/* Video Background */}
      <div className={styles.videoBg}>
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          loop
          poster="/assets/modern.png"
          onError={(e) => console.error('Video failed to load:', e)}
          onLoadedData={() => console.log('Video loaded successfully')}
        />
        <div className={styles.videoOverlay} />
      </div>

      {/* Content - Estilo Hero */}
      <div className={`${styles.content} ${isVisible ? styles.show : ''}`}>
        <h2 className={`${styles.fadeUp} ${styles.title}`}>
          Viva a Experiência
        </h2>
        <p className={`${styles.fadeUp} ${styles.subtitle}`}>
          Descubra um novo conceito de <strong>conforto</strong> e <strong>elegância</strong>
        </p>

        {/* Cards estilo Hero */}
        <div className={`${styles.fadeUp} ${styles.cards}`}>
          <div className={styles.featureCard}>
            <span className={styles.icon}>🏡</span>
            <h3>+500</h3>
            <p>Imóveis Disponíveis</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.icon}>🤝</span>
            <h3>98%</h3>
            <p>Clientes Satisfeitos</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.icon}>⭐</span>
            <h3>15+</h3>
            <p>Anos de Experiência</p>
          </div>
        </div>

        <button className={`${styles.fadeUp} ${styles.ctaBtn}`}>
          Explore Agora
        </button>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} style={{ opacity: 1 - videoProgress }}>
        <span>Role para ver mais</span>
        <div className={styles.arrow} />
      </div>
    </section>
  );
}
