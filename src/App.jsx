
import './App.css'
import './Responsive.css';
import { AuthProvider } from './contexts/AuthContext'
import RoutesComponent from './RoutesComponents'
import { ToastContainer } from 'react-toastify'
import ScreenLock from './components/ScreenLock/ScreenLock'
function App() {

  return (
    <>
      <ScreenLock>
        <AuthProvider>
          <ToastContainer />
          <RoutesComponent />
        </AuthProvider>
      </ScreenLock>
    </>
  )
}

export default App
