const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Suas credenciais
const supabaseUrl = "https://lfmyirpckhhaftrbcixq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbXlpcnBja2hoYWZ0cmJjaXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjYyMzAsImV4cCI6MjA5MDkwMjIzMH0.4lCwkDsE_ZM47gxRdXBIrn78ErRTnjAQayq4Xs0t-0g";
const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const BUCKET_NAME = 'imoveis';

async function uploadImages() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Diretório de assets não encontrado: ${ASSETS_DIR}`);
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));

  if (files.length === 0) {
    console.log("⚠️ Nenhuma imagem encontrada para upload em public/assets.");
    return;
  }

  console.log(`🚀 Iniciando upload de ${files.length} imagens para o bucket '${BUCKET_NAME}'...`);

  for (const file of files) {
    const filePath = path.join(ASSETS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);

    // Upload para o Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, { 
        contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
        upsert: true 
      });

    if (error) {
      if (error.message.includes('bucket not found')) {
        console.error(`❌ Erro: Bucket '${BUCKET_NAME}' não encontrado. Crie ele como PUBLIC no Supabase.`);
        return;
      }
      console.error(`❌ Erro no arquivo ${file}:`, error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file);
      console.log(`✅ ${file} enviado! Link: ${publicUrl}`);
      
      // Atualiza a tabela imoveis automaticamente encontrando o imóvel pelo título próximo ao nome do arquivo
      const fileNameWithoutExt = file.split('.')[0];
      
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ imagem_url: publicUrl })
        .ilike('titulo', `%${fileNameWithoutExt}%`);

      if (updateError) {
        console.error(`❌ Erro ao atualizar banco para ${file}:`, updateError.message);
      } else {
        console.log(`🔗 Banco de dados atualizado para ${file}.`);
      }
    }
  }
  
  console.log("✨ Processo finalizado!");
}

uploadImages();
