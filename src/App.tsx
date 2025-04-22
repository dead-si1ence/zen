import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import UFCPage from './pages/UFCPage';
import Formula1Page from './pages/Formula1Page';
import EsportsPage from './pages/EsportsPage';
import FootballPage from './pages/FootballPage';
import NotFound from './pages/NotFound';

// Import fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto-slab/400.css';
import '@fontsource/roboto-slab/600.css';
import '@fontsource/roboto-slab/700.css';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ufc" element={<UFCPage />} />
          <Route path="/formula1" element={<Formula1Page />} />
          <Route path="/esports" element={<EsportsPage />} />
          <Route path="/football" element={<FootballPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
