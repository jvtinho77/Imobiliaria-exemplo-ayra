'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './PropertyDetail.module.css';
import PropertyCard from '@/components/PropertyGrid/PropertyGrid'; 

interface Property {
  id: string;
  titulo: string;
  localizacao: string;
  imagem_url: string;
  tipo_negocio: string;
  tags: string[];
  quartos: number;
  banheiros: number;
  area_m2: number;
  preco_formatado: string;
  detalhe_extra?: string;
  descricao?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPropertyData() {
      // 1. Fetch current property
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
        return;
      }

      setProperty(data);

      // 2. Fetch 4 similar properties (excluding current)
      const { data: similar } = await supabase
        .from('imoveis')
        .select('*')
        .neq('id', params.id)
        .limit(4);
      
      if (similar) setSimilarProperties(similar);

      setLoading(false);
    }

    if (params.id) {
      fetchPropertyData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.notFound}>
        <h1>Imóvel não encontrado</h1>
        <Link href="/">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Camadas de Luz de Fundo (Aura) */}
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />

        <div className={styles.container}>
          {/* Back Button */}
          <Link href="/" className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Voltar para Início
          </Link>

          <div className={styles.layout}>
            {/* Gallery Section */}
            <div className={styles.gallerySection}>
              <div className={styles.mainImage}>
                <Image
                  src={property.imagem_url || '/assets/modern.png'}
                  alt={property.titulo}
                  fill
                  className={styles.image}
                  priority
                />
                <div className={styles.imageOverlay} />
                <span className={styles.badge}>{property.tipo_negocio}</span>
              </div>
              
              {/* Fake Gallery Thumbnails if no gallery field exists yet */}
              <div className={styles.thumbnails}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.thumb}>
                    <Image
                      src={property.imagem_url || '/assets/modern.png'}
                      alt={`${property.titulo} view ${i}`}
                      fill
                      className={styles.thumbImage}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
              <div className={styles.header}>
                <div className={styles.categoryRow}>
                  <span className={styles.badge}>{property.tipo_negocio}</span>
                  <div className={styles.priceTag}>{property.preco_formatado}</div>
                </div>
                <h1 className={styles.title}>{property.titulo}</h1>
                <p className={styles.location}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {property.localizacao}
                </p>
              </div>

              <div className={styles.specsCompactRow}>
                <div className={styles.specPill}>
                  <span className={styles.specIcon}>📐</span>
                  <span className={styles.specValue}>{property.area_m2} m²</span>
                </div>
                <div className={styles.specPill}>
                  <span className={styles.specIcon}>🛏️</span>
                  <span className={styles.specValue}>{property.quartos} Q</span>
                </div>
                <div className={styles.specPill}>
                  <span className={styles.specIcon}>🚿</span>
                  <span className={styles.specValue}>{property.banheiros} B</span>
                </div>
              </div>

              <div className={styles.descriptionBox}>
                <h3>Sobre o Imóvel</h3>
                <p>
                  {property.descricao || 
                    `Exclusiva residência em ${property.localizacao} com ${property.area_m2}m². Projeto que une sofisticação e conforto em cada detalhe.`
                  }
                </p>
              </div>

              <div className={styles.ctaBox}>
                <button className={styles.whatsappBtn}>
                  Falar com Corretor Especialista
                </button>
                <p className={styles.ctaNote}>Atendimento personalizado 24h</p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className={styles.mapSection}>
            <h3 className={styles.sectionTitle}>🗺️ Localização</h3>
            <div className={styles.mapWrapper}>
              <iframe
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '24px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Florianopolis,SC&t=&z=13&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>

          {/* Similar Properties Section */}
          {similarProperties.length > 0 && (
            <div className={styles.similarSection}>
              <h3 className={styles.sectionTitle}>✨ Imóveis Semelhantes</h3>
              <div className={styles.similarGrid}>
                {similarProperties.map((p) => (
                  <div key={p.id} className={styles.similarCard}>
                    <Link href={`/imoveis/${p.id}`} className={styles.similarLink}>
                      <div className={styles.similarImageWrapper}>
                        <Image src={p.imagem_url} alt={p.titulo} fill className={styles.similarImage} />
                      </div>
                      <div className={styles.similarInfo}>
                        <h4>{p.titulo}</h4>
                        <p>{p.preco_formatado}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
