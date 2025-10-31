import { QRCodeSVG } from "qrcode.react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./QRCodeCard.module.css";

interface QRCodeCardProps {
  deepLink: string;
  directLink: string;
  githubLink: string;
  size?: "small" | "medium" | "large";
  showGithubLink?: boolean;
}

export const QRCodeCard = ({
  deepLink,
  directLink,
  githubLink,
  size = "medium",
  showGithubLink = true,
}: QRCodeCardProps) => {
  const qrSize = size === "small" ? 160 : size === "large" ? 280 : 220;

  return (
    <motion.div
      className={`${styles.card} ${styles[size]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.badge}>
        <span className={styles.badgeIcon}>📱</span>
        <span className={styles.badgeText}>
          Personal Project - Expo Go Required
        </span>
      </div>

      <div className={styles.qrContainer}>
        <div className={styles.qrWrapper}>
          <QRCodeSVG
            value={deepLink}
            size={qrSize}
            level="H"
            fgColor="#0f0e17"
            bgColor="#fffffe"
            className={styles.qrCode}
            aria-label="QR code to open CogniTrack in Expo Go"
          />
        </div>
        <p className={styles.instruction}>
          Scan with <span className={styles.highlight}>Expo Go</span> or your
          camera
        </p>
      </div>

      <div className={styles.actions}>
        <a
          href={directLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directLink}
        >
          Or tap here for direct link
        </a>

        {showGithubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="View source code on GitHub"
          >
            <FaGithub className={styles.githubIcon} />
            <span>View on GitHub</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};
