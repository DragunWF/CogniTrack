import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { QRCodeCard } from "./QRCodeCard";
import { landingInfo } from "../constants/landingInfo";
import styles from "./HeroSection.module.css";

export const HeroSection = () => {
  const { hero } = landingInfo;

  return (
    <section className={styles.hero}>
      <div className={styles.background} />

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={styles.logoContainer}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={styles.logo}>
              <span className={styles.logoText}>CT</span>
            </div>
          </motion.div>

          <h1 className={styles.tagline}>
            <span className="gradient-text">{hero.tagline}</span>
          </h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href={hero.primaryCTA.link} className={styles.primaryButton}>
              {hero.primaryCTA.text}
            </a>
            <a href={hero.secondaryCTA.link} className={styles.secondaryButton}>
              {hero.secondaryCTA.text}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.qrSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <QRCodeCard
            deepLink={hero.expoDeepLink}
            directLink={hero.directLink}
            githubLink={hero.githubLink}
            size="medium"
          />
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FaChevronDown />
      </motion.div>
    </section>
  );
};
