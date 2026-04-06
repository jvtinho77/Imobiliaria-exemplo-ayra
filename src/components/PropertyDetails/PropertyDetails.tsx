import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import styles from './PropertyDetails.module.css';

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
  detalhe_extra: string | null;
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rola para o topo sempre que entrar na página
    window.scrollTo(0, 0);

    async function fetchProperty() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('imoveis')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Erro ao buscar imóvel:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Buscando detalhes exclusivos...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.error}>
        <h2>Imóvel não encontrado</h2>
        <p>A residência que você procura não está mais disponível ou o link é inválido.</p>
        <Link to="/" className={styles.backButton}>Voltar ao Início</Link>
      </div>
    );
  }

  const imageUrl = property.imagem_url || '/modern.png';

  return (
    <div className={styles.detailsContainer}>
      <Link to="/" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Voltar para os Destaques
      </Link>

      <div className={styles.grid}>
        {/* Lado Esquerdo: Imagem e Descrição Longa */}
        <div>
          <div className={styles.imageSection}>
            <img 
              src={imageUrl} 
              alt={property.titulo} 
              className={styles.mainImage} 
              onError={(e) => { (e.target as HTMLImageElement).src = '/modern.png'; }}
            />
          </div>

          <div className={styles.description}>
            <h3>Sobre a Residência</h3>
            <p>
              {property.detalhe_extra || 
                "Uma propriedade excepcional que redefine o conceito de moradia de luxo. Com acabamentos de altíssimo padrão e design arquitetônico pensado para maximizar o conforto e a entrada de luz natural, este imóvel oferece uma experiência de vida ímpar."}
            </p>
          </div>
        </div>

        {/* Lado Direito: Caixa Flutuante com Informações de Compra */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div className={styles.badges}>
              <span className={styles.badge}>{property.tipo_negocio}</span>
              {property.tags && property.tags[1] && (
                <span className={styles.badgeAccent}>{property.tags[1]}</span>
              )}
            </div>
            <h1 className={styles.title}>{property.titulo}</h1>
            <p className={styles.location}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {property.localizacao}
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
              <span>{property.quartos ?? '-'} Quartos</span>
            </div>
            <div className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 7 3"/><path d="M13 6 11 3"/><path d="M17 6 15 3"/><path d="M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1"/><path d="M5 16v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"/><path d="M12 12V6"/></svg>
              <span>{property.banheiros ?? '-'} Banheiros</span>
            </div>
            {property.area_m2 && (
              <div className={styles.feature}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                <span>{property.area_m2} m²</span>
              </div>
            )}
          </div>

          <div>
            <div className={styles.price}>{property.preco_formatado}</div>
            <button className={styles.actionBtn}>
              Agendar Visita Exclusiva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
