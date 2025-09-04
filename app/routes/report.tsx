// app/routes/report.tsx
import { Navigate } from 'react-router-dom';

export default function ReportRedirect() {
  return <Navigate to="/home" replace />;
}