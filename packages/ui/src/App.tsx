import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, Die, Core, About } from './pages';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter basename="/platonic-dice">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="die" element={<Die />} />
          <Route path="core" element={<Core />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
