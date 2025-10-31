import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { landingInfo } from "../constants/landingInfo";
import styles from "./Footer.module.css";

export const Footer = () => {
  const { footer } = landingInfo;

  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />

      <div className="container">
        <div className={styles.content}>
          <div className={styles.about}>
            <div className={styles.logo}>
              <img
                src="/icon.png"
                alt="CogniTrack Logo"
                className={styles.logoImage}
              />
            </div>
            <p className={styles.tagline}>{footer.tagline}</p>
            <p className={styles.description}>
              An intelligent habit tracker that transforms awareness into
              lasting change.
            </p>
          </div>

          <div className={styles.links}>
            <h4 className={styles.linksTitle}>Links</h4>
            <ul className={styles.linksList}>
              {footer.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {link.title.includes("GitHub") ? (
                      <FaGithub className={styles.linkIcon} />
                    ) : (
                      <FaExternalLinkAlt className={styles.linkIcon} />
                    )}
                    <span>{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.social}>
            <h4 className={styles.linksTitle}>Connect</h4>
            <p className={styles.socialText}>
              Built with 🌟 and mindfulness by{" "}
              <a
                href="https://github.com/DragunWF"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                DragunWF
              </a>
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
