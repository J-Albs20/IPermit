import { Routes, Route } from 'react-router-dom';
import Dashboard from './admin/Dashboard';
import Establishments from './admin/Establishments';
import Permits from './admin/Permits';
import GisMap from './admin/GisMap';
import Inspections from './admin/Inspections';
import Notifications from './admin/Notifications';
import Settings from './admin/Settings';
import HealthCards from './admin/HealthCards';
import Login from './admin/Login';
import Create from './admin/Create';
import IncomingSanitaryPermits from './admin/IncomingSanitaryPermits';
import IncomingHealthCards from './admin/IncomingHealthCards';
import Transactions from './admin/Transactions';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/establishments" element={<ProtectedRoute><Establishments /></ProtectedRoute>} />
      <Route path="/permits" element={<ProtectedRoute><Permits /></ProtectedRoute>} />
      <Route path="/health-cards" element={<ProtectedRoute><HealthCards /></ProtectedRoute>} />
      <Route path="/gis-map" element={<ProtectedRoute><GisMap /></ProtectedRoute>} />
      <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
      <Route
        path="/incoming-sanitary-permits"
        element={
          <ProtectedRoute>
            <IncomingSanitaryPermits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incoming-health-cards"
        element={
          <ProtectedRoute>
            <IncomingHealthCards />
          </ProtectedRoute>
        }
      />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
    </Routes>
  );
}
