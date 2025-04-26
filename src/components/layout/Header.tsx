import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import '../../styles/Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Detect scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when pressing escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [mobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="header-logo-container"
        >
          <Link to="/" className="logo" aria-label="ZEN - Home">
            <span className="logo-text">ZEN</span>
            <span className="logo-glow"></span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NavItem path="/ufc" label="UFC/MMA" isActive={isActive('/ufc')} />
            <NavItem path="/formula1" label="Formula 1" isActive={isActive('/formula1')} />
            <NavItem path="/esports" label="Esports" isActive={isActive('/esports')} />
            <NavItem path="/football" label="Football" isActive={isActive('/football')} />
          </motion.ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu} 
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              className="nav mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <NavItem path="/ufc" label="UFC/MMA" isActive={isActive('/ufc')} />
                <NavItem path="/formula1" label="Formula 1" isActive={isActive('/formula1')} />
                <NavItem path="/esports" label="Esports" isActive={isActive('/esports')} />
                <NavItem path="/football" label="Football" isActive={isActive('/football')} />
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// NavItem component for consistent styling and animations
interface NavItemProps {
  path: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ path, label, isActive }: NavItemProps) => (
  <motion.li 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link to={path} className={isActive ? 'active' : ''}>
      {label}
      {isActive && (
        <motion.span 
          className="active-indicator" 
          layoutId="activeIndicator"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </Link>
  </motion.li>
);

export default Header;