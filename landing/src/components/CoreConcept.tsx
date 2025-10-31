import { motion } from "framer-motion";
import { landingInfo } from "../constants/landingInfo";
import styles from "./CoreConcept.module.css";

export const CoreConcept = () => {
  const { concept } = landingInfo;

  return (
    <section className={styles.section} id="concept">
      <div className={styles.background} />

      <div className="container">
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.badge}>{concept.badge}</div>

          <h2 className={styles.title}>{concept.title}</h2>

          <p className={styles.philosophy}>{concept.philosophy}</p>

          <div className={styles.principle}>
            <span className={styles.principleText}>{concept.principle}</span>
          </div>

          <motion.div
            className={styles.flowDiagram}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>📝</div>
              <div className={styles.flowLabel}>Log</div>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>🤖</div>
              <div className={styles.flowLabel}>Analyze</div>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>💡</div>
              <div className={styles.flowLabel}>Understand</div>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>🎯</div>
              <div className={styles.flowLabel}>Change</div>
            </div>
          </motion.div>

          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>"{concept.quote}"</p>
            <cite className={styles.quoteAuthor}>— {concept.quoteAuthor}</cite>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};
