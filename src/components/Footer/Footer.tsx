import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <div className={styles.logoIcon} />
            <span>Sua Logo Aqui</span>
          </div>
          <p>A mais alta curadoria de imóveis do Brasil. Encontre o imóvel perfeito para o seu estilo de vida.</p>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.links}>
            <h4>Navegação</h4>
            <ul>
              <li><a href="#inicio">Início</a></li>
              <li><a href="#imoveis">Imóveis</a></li>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Imóveis</h4>
            <ul>
              <li><a href="#">Casas</a></li>
              <li><a href="#">Apartamentos</a></li>
              <li><a href="#">Terrenos</a></li>
              <li><a href="#">Fazendas</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Imobiliária Exemplo. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
