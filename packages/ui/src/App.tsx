import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@router/AppRouter';
import { useGitHubPagesRedirect } from './hooks';
import { getBasePath } from './utils';
import '@styles/index.css';

const AppContent = () => {
  useGitHubPagesRedirect();
  return <AppRouter />;
};

function App() {
  return (
    <BrowserRouter basename={getBasePath()}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
