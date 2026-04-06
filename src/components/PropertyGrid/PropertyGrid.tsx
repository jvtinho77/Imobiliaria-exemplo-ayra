import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './PropertyGrid.module.css';

// Interface com nomes de campos em português (como estão na tabela Supabase)
interface Property {
  id: string;
  titulo: string;
  localizacao: string;
  imagem_url: string | null;
  tipo_negocio: string;
  tags: string[] | null;
  quartos: number | null;
  banheiros: number | null;
  area_m2: number | null;
  preco_formatado: string;
  detalhe_extra?: string | null;
}

// Função para obter a imagem ou fallback
function getImageUrl(imagem_url: string | null): string {
  if (!imagem_url || imagem_url === '') {
    return '/modern.png';
  }
  return imagem_url;
}

// Componente de Card individual
function PropertyCard({ property }: { property: Property }) {
  return (
    <div className={styles.card}>
      <Link to={`/imoveis/${property.id}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img
            src={getImageUrl(property.imagem_url)}
            alt={property.titulo}
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/modern.png';
            }}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.badgesRow}>
            <span className={styles.simpleBadge}>{property.tipo_negocio}</span>
            {property.tags && property.tags[1] && (
              <span className={styles.simpleBadgeAccent}>{property.tags[1]}</span>
            )}
          </div>

          <h3 className={styles.title}>{property.titulo}</h3>
          <p className={styles.location}>{property.localizacao}</p>

          <div className={styles.cardSpecs}>
            <div className={styles.specItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
              <span>{property.quartos ?? '-'}</span>
            </div>
            <div className={styles.specItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 7 3"/><path d="M13 6 11 3"/><path d="M17 6 15 3"/><path d="M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1"/><path d="M5 16v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"/><path d="M12 12V6"/></svg>
              <span>{property.banheiros ?? '-'}</span>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.price}>{property.preco_formatado}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Fileira fixa superior (2 imóveis no mobile, 3 no desktop)
function StaticRow({ properties }: { properties: Property[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Velocidade do drag
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <div
      className={styles.staticRow}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.rowTrack}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

// Fileira inferior com scroll manual para o resto do catálogo
function CarouselRow({ allProperties }: { allProperties: Property[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Drag handlers para desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.scrollBehavior = 'auto'; // Disable smooth for drag
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  return (
    <div
      className={styles.carouselRow}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.rowTrack}>
        {allProperties.map((property) => (
          <PropertyCard key={`${property.id}-catalog`} property={property} />
        ))}
      </div>
    </div>
  );
}

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('imoveis')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro Supabase:', error);
          throw error;
        }
        console.log('Dados recebidos:', data);
        if (data) setProperties(data);
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className={styles.section} id="imoveis">
        <div className={styles.header}>
          <h2>Imóveis em Destaque</h2>
          <p>Carregando imóveis exclusivos...</p>
        </div>
        <div className={styles.skeletonRow}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className={styles.section} id="imoveis">
        <div className={styles.header}>
          <h2>Imóveis em Destaque</h2>
          <p>Nenhum imóvel encontrado no momento.</p>
        </div>
      </section>
    );
  }

  // Topo: Apenas os 3 primeiros (Destaques)
  const topCount = isMobile ? 2 : 3;
  const topProperties = properties.slice(0, topCount);
  
  // Baixo: O resto do catálogo com scroll lateral
  const bottomProperties = properties.slice(topCount);

  return (
    <section className={styles.section} id="imoveis">
      <div className={styles.header}>
        <h2>Imóveis em Destaque</h2>
        <p>Conheça as nossas opções mais exclusivas e refinadas disponíveis no mercado.</p>
      </div>

      <div className={styles.rowsContainer}>
        <div className={styles.rowLabel}>Novidades</div>
        <StaticRow properties={topProperties} />

        <div className={styles.rowLabel}>Mais Procurados</div>
        <CarouselRow allProperties={bottomProperties} />
      </div>
    </section>
  );
}
