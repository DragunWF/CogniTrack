import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { QRCodeCard } from "./QRCodeCard";
import { landingInfo } from "../constants/landingInfo";
import styles from "./AccessSection.module.css";

export const AccessSection = () => {
  const { access, hero } = landingInfo;

  return (
    <section className={styles.section} id="access">
      <div className={styles.background} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            <span className="gradient-text">{access.title}</span>
          </h2>
          <p className={styles.subtitle}>{access.subtitle}</p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.instructions}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={styles.instructionsTitle}>How to Access</h3>

            <div className={styles.steps}>
              {access.instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  className={styles.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={styles.stepNumber}>{instruction.step}</div>
                  <p className={styles.stepText}>{instruction.text}</p>
                </motion.div>
              ))}
            </div>

            <div className={styles.appStoreLinks}>
              <a
                href={hero.expoGoIOSLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <FaApple className={styles.storeIcon} />
                <div>
                  <div className={styles.storeLabel}>Download on the</div>
                  <div className={styles.storeName}>App Store</div>
                </div>
              </a>
              <a
                href={hero.expoGoAndroidLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <FaGooglePlay className={styles.storeIcon} />
                <div>
                  <div className={styles.storeLabel}>Get it on</div>
                  <div className={styles.storeName}>Google Play</div>
                </div>
              </a>
            </div>

            <p className={styles.disclaimer}>{access.disclaimer}</p>
          </motion.div>

          <motion.div
            className={styles.qrSection}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <QRCodeCard
              deepLink={hero.expoDeepLink}
              directLink={hero.directLink}
              githubLink={hero.githubLink}
              size="large"
              showGithubLink={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
