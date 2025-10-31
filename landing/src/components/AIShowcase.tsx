import { motion } from "framer-motion";
import { landingInfo } from "../constants/landingInfo";
import styles from "./AIShowcase.module.css";

export const AIShowcase = () => {
  const { aiShowcase } = landingInfo;

  return (
    <section className={styles.section} id="ai">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>{aiShowcase.badge}</div>
          <h2 className={styles.title}>{aiShowcase.title}</h2>
          <p className={styles.description}>{aiShowcase.description}</p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.capabilities}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={styles.capabilitiesTitle}>AI Capabilities</h3>
            <ul className={styles.capabilitiesList}>
              {aiShowcase.capabilities.map((capability, index) => (
                <motion.li
                  key={index}
                  className={styles.capabilityItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className={styles.checkmark}>✓</span>
                  {capability}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={styles.insightCard}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.insightHeader}>
              <span className={styles.insightIcon}>🤖</span>
              <span className={styles.insightTitle}>
                {aiShowcase.exampleInsight.title}
              </span>
            </div>
            <p className={styles.insightContent}>
              {aiShowcase.exampleInsight.content}
            </p>
            <div className={styles.thinkingIndicator}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
