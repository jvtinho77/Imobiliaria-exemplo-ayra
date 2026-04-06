import styles from './Banner.module.css';

export default function Banner() {
  return (
    <section className={styles.banner}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <h2>Pronto para encontrar seu lar dos sonhos?</h2>
        <p>Nossos corretores estão à disposição para um atendimento personalizado.</p>
        <button className={styles.btn}>Agendar Consultoria</button>
      </div>
    </section>
  );
}
