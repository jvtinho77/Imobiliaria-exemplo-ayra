import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = "https://lfmyirpckhhaftrbcixq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbXlpcnBja2hoYWZ0cmJjaXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjYyMzAsImV4cCI6MjA5MDkwMjIzMH0.4lCwkDsE_ZM47gxRdXBIrn78ErRTnjAQayq4Xs0t-0g";
const supabase = createClient(supabaseUrl, supabaseKey);

const newProperties = [
  {
    titulo: 'Casa Brisa do Céu',
    localizacao: 'Trancoso, Bahia',
    quartos: 5, banheiros: 6, area_m2: 450, preco: 14000000.00, preco_formatado: 'R$ 14.000.000',
    tipo_negocio: 'Venda',
    tags: ['Venda', 'Praia', 'Exclusivo'],
    url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80',
    filename: 'brisa_do_ceu.jpg'
  },
  {
    titulo: 'Residência Alvorada',
    localizacao: 'Jardins, São Paulo',
    quartos: 4, banheiros: 5, area_m2: 320, preco: 9500000.00, preco_formatado: 'R$ 9.500.000',
    tipo_negocio: 'Venda', tags: ['Venda', 'Moderno'],
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    filename: 'residencia_alvorada.jpg'
  },
  {
    titulo: 'Cobertura Vista Sol',
    localizacao: 'Leblon, Rio de Janeiro',
    quartos: 3, banheiros: 4, area_m2: 210, preco: 12800000.00, preco_formatado: 'R$ 12.800.000',
    tipo_negocio: 'Venda', tags: ['Venda', 'Cobertura'],
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    filename: 'cobertura_vista_sol.jpg'
  },
  {
    titulo: 'Villa Luz do Dia',
    localizacao: 'Barra da Tijuca, RJ',
    quartos: 6, banheiros: 8, area_m2: 850, preco: 21000000.00, preco_formatado: 'R$ 21.000.000',
    tipo_negocio: 'Venda', tags: ['Venda', 'Premium'],
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    filename: 'villa_luz_do_dia.jpg'
  },
  {
    titulo: 'Terreno Vale Dourado',
    localizacao: 'Itaipava, Rio de Janeiro',
    quartos: 0, banheiros: 0, area_m2: 4000, preco: 3200000.00, preco_formatado: 'R$ 3.200.000',
    tipo_negocio: 'Loteamento', tags: ['Loteamento', 'Campo'],
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    filename: 'terreno_vale_dourado.jpg'
  },
  {
    titulo: 'Mansão Aurora',
    localizacao: 'Fazenda Boa Vista, SP',
    quartos: 7, banheiros: 9, area_m2: 1100, preco: 38000000.00, preco_formatado: 'R$ 38.000.000',
    tipo_negocio: 'Venda', tags: ['Venda', 'Alto Padrão'],
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    filename: 'mansao_aurora.jpg'
  }
];

const ASSETS_DIR = path.join(__dirname, '../public/assets');

async function run() {
  console.log('Baixando imagens de dia na web e preenchendo seu Supabase do zero...');
  for (const prop of newProperties) {
    try {
      console.log(`- Processando: ${prop.titulo}`);
      
      const res = await fetch(prop.url);
      const buffer = Buffer.from(await res.arrayBuffer());
      
      // Salva no seu computador localmente
      fs.writeFileSync(path.join(ASSETS_DIR, prop.filename), buffer);
      
      // Manda O ARQUIVO NOVO para a nuvem no Storage
      const { error: uploadError } = await supabase.storage
        .from('imoveis')
        .upload(prop.filename, buffer, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw new Error('Falha no upload do storage: ' + uploadError.message);
      
      // Pega o link real e final da nuvem
      const { data: { publicUrl } } = supabase.storage.from('imoveis').getPublicUrl(prop.filename);
      
      // Cria a linha nova no Banco de Dados com imagem 100% inédita
      const { error: dbError } = await supabase.from('imoveis').insert({
        titulo: prop.titulo,
        localizacao: prop.localizacao,
        quartos: prop.quartos,
        banheiros: prop.banheiros,
        area_m2: prop.area_m2,
        preco: prop.preco,
        preco_formatado: prop.preco_formatado,
        tipo_negocio: prop.tipo_negocio,
        tags: prop.tags,
        detalhe_extra: 'Exclusividade Aurora',
        imagem_url: publicUrl
      });
      
      if (dbError) throw new Error('Falha no banco de dados: ' + dbError.message);
      
      console.log(`✅ Concluído e salvo na Nuvem: ${prop.titulo}`);
    } catch (e) {
      console.error(`❌ Falha em ${prop.titulo}:`, e.message);
    }
  }
  console.log('🎉 Tudo perfeitamente armazenado!');
}

run();
