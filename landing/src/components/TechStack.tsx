import { motion } from "framer-motion";
import { landingInfo } from "../constants/landingInfo";
import styles from "./TechStack.module.css";

export const TechStack = () => {
  const { techStack } = landingInfo;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className={styles.section} id="tech-stack">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{techStack.title}</h2>
          <p className={styles.subtitle}>{techStack.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {techStack.technologies.map((tech, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.icon}>{tech.icon}</div>
              <div className={styles.category}>{tech.category}</div>
              <h3 className={styles.name}>{tech.name}</h3>
              <p className={styles.description}>{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.architectureNote}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.noteIcon}>🏗️</div>
          <div>
            <h4 className={styles.noteTitle}>Clean Architecture</h4>
            <p className={styles.noteText}>{techStack.architectureNote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
