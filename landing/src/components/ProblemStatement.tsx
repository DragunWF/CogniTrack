import { motion } from "framer-motion";
import { landingInfo } from "../constants/landingInfo";
import styles from "./ProblemStatement.module.css";

export const ProblemStatement = () => {
  const { problem } = landingInfo;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className={styles.section} id="problem">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{problem.title}</h2>
          <p className={styles.subtitle}>{problem.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problem.painPoints.map((point, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={itemVariants}
            >
              <div className={styles.icon}>{point.icon}</div>
              <h3 className={styles.cardTitle}>{point.title}</h3>
              <p className={styles.cardDescription}>{point.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
