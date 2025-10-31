import { motion } from "framer-motion";
import { landingInfo } from "../constants/landingInfo";
import styles from "./HowItWorks.module.css";

export const HowItWorks = () => {
  const { howItWorks } = landingInfo;

  return (
    <section className={styles.section} id="how-it-works">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{howItWorks.title}</h2>
          <p className={styles.subtitle}>{howItWorks.subtitle}</p>
        </motion.div>

        <div className={styles.timeline}>
          {howItWorks.steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < howItWorks.steps.length - 1 && (
                <div className={styles.connector} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
