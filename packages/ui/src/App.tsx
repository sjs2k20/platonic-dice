import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@router/AppRouter';
import '@styles/index.css';

function App() {
  return (
    <BrowserRouter basename="/platonic-dice">
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
