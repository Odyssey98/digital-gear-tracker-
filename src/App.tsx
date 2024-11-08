import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/UserContext';
import AppContent from './components/AppContent';

function App() {
  return (
    <UserProvider>
      <AppContent />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </UserProvider>
  );
}

export default App;