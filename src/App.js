import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CropPredictionPage from './components/CropPredictionPage';
import ResultsPage from './components/ResultsPage';
import ReferencePage from './components/ReferencePage';
import NotFoundPage from './components/NotFoundPage';
import SeedsManagementPage from './components/SeedsManagementPage';
import SeedCatalogPage from './components/SeedCatalogPage';
import FieldManagementPage from './components/FieldManagementPage';
import PlantingTrackerPage from './components/PlantingTrackerPage';
import HarvestRecordsPage from './components/HarvestRecordsPage';
import PerformanceAnalyticsPage from './components/PerformanceAnalyticsPage';
import SeasonalPlanningPage from './components/SeasonalPlanningPage';
import FertilizerManagementPage from './components/FertilizerManagementPage';
import FertilizerInventoryPage from './components/FertilizerInventoryPage';
import FertilizerApplicationPage from './components/FertilizerApplicationPage';
import FertilizerAnalyticsPage from './components/FertilizerAnalyticsPage';
import FertilizerCompliancePage from './components/FertilizerCompliancePage';
import MachineryManagementPage from './components/MachineryManagementPage';
import EquipmentInventoryPage from './components/EquipmentInventoryPage';
import MaintenanceSystemPage from './components/MaintenanceSystemPage';
import MachineryAnalyticsPage from './components/MachineryAnalyticsPage';
import MachinerySchedulerPage from './components/MachinerySchedulerPage';
import FinancialManagementPage from './components/FinancialManagementPage';
import AccountOperationsPage from './components/AccountOperationsPage';
import FinancialPlanningPage from './components/FinancialPlanningPage';
import SavingsGoalsPage from './components/SavingsGoalsPage';
import ProfilePage from './components/ProfilePage';
import FeatureEngineeringDebug from './components/FeatureEngineeringDebug';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Debug Route - Public */}
          <Route path="/debug-features" element={<FeatureEngineeringDebug />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/crop-prediction" element={
            <ProtectedRoute>
              <CropPredictionPage />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } />
          <Route path="/reference" element={
            <ProtectedRoute>
              <ReferencePage />
            </ProtectedRoute>
          } />
          
          {/* Seeds Management Routes */}
          <Route path="/seeds" element={
            <ProtectedRoute>
              <SeedsManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/catalog" element={
            <ProtectedRoute>
              <SeedCatalogPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/fields" element={
            <ProtectedRoute>
              <FieldManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/planting" element={
            <ProtectedRoute>
              <PlantingTrackerPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/harvest" element={
            <ProtectedRoute>
              <HarvestRecordsPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/analytics" element={
            <ProtectedRoute>
              <PerformanceAnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/seeds/planning" element={
            <ProtectedRoute>
              <SeasonalPlanningPage />
            </ProtectedRoute>
          } />
          
          {/* Fertilizer Management Routes */}
          <Route path="/fertilizers" element={
            <ProtectedRoute>
              <FertilizerManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/fertilizers/inventory" element={
            <ProtectedRoute>
              <FertilizerInventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/fertilizers/application" element={
            <ProtectedRoute>
              <FertilizerApplicationPage />
            </ProtectedRoute>
          } />
          <Route path="/fertilizers/analytics" element={
            <ProtectedRoute>
              <FertilizerAnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/fertilizers/compliance" element={
            <ProtectedRoute>
              <FertilizerCompliancePage />
            </ProtectedRoute>
          } />
          
          {/* Machinery Management Routes */}
          <Route path="/machinery" element={
            <ProtectedRoute>
              <MachineryManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/machinery/inventory" element={
            <ProtectedRoute>
              <EquipmentInventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/machinery/maintenance" element={
            <ProtectedRoute>
              <MaintenanceSystemPage />
            </ProtectedRoute>
          } />
          <Route path="/machinery/analytics" element={
            <ProtectedRoute>
              <MachineryAnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/machinery/scheduler" element={
            <ProtectedRoute>
              <MachinerySchedulerPage />
            </ProtectedRoute>
          } />
          
          {/* Financial Management Routes */}
          <Route path="/financial" element={
            <ProtectedRoute>
              <FinancialManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/financial/account-operations" element={
            <ProtectedRoute>
              <AccountOperationsPage />
            </ProtectedRoute>
          } />
          <Route path="/financial/planning" element={
            <ProtectedRoute>
              <FinancialPlanningPage />
            </ProtectedRoute>
          } />
          <Route path="/financial/savings-goals" element={
            <ProtectedRoute>
              <SavingsGoalsPage />
            </ProtectedRoute>
          } />
          
          {/* Profile Route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Public Routes - Redirect if Authenticated */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;