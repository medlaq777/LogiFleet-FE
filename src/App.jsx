import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Trucks from './pages/Trucks';
import Trailers from './pages/Trailers';
import Tires from './pages/Tires';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trucks" element={<Trucks />} />
            <Route path="/trailers" element={<Trailers />} />
            <Route path="/tires" element={<Tires />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/maintenance" element={<Maintenance />} />

          </Route>


          <Route element={<ProtectedRoute role="Admin" />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
