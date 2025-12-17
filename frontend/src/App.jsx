import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import this
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './Layout';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// App Pages
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';

function App() {
    // Replace with your actual Client ID from Google Cloud Console
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Protected Routes */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Layout><Dashboard /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/transactions/add" element={
                            <ProtectedRoute>
                                <Layout><AddTransaction /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/transactions" element={
                            <ProtectedRoute>
                                <Layout><Transactions /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/categories" element={
                            <ProtectedRoute>
                                <Layout><Categories /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <Layout><Analytics /></Layout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;