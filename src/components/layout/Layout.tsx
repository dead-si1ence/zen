import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import '../../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Animation variants for page content
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="layout">
      <Header />

      <motion.main 
        className="main-content" 
        role="main"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <div className="container">
          {children}
        </div>
      </motion.main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-copyright">
              ZEN - AI Sports Predictions © {new Date().getFullYear()}
            </p>
            <nav className="footer-nav" aria-label="Footer Navigation">
              <ul>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;