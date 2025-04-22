import { ReactNode } from 'react';
import Header from './Header';
import '../../styles/Layout.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>ZEN - AI Sports Predictions © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;