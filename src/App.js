import logo from './logo.svg'
import './App.css'
import HomeScreen from './Screens/HomeScreen'
import CustomAppBar from './Components/CustomAppBar'
import JobsPage from './Components/JobsPage'
import CadidatePage from './Components/CadidatePage'
import HomePage from './Components/HomePage'
import EmployeePage from './Components/EmployeePage'
import SettingPage from './Components/SettingPage'
import RecruitmentPage from './Components/RecruitmentPage'
import Landing from './Components/Landing'
import Login from './Components/Login'
import NewPage from './Components/NewPage'
import MyEmployCandidate from './Components/MyEmployCandidate'
import CandidateRedirectForm from './Components/CadidateRedirectForm'
import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import history from './history'
import React from 'react'
import ProtectedRoute from './ProtectedRoute'

function App() {
    return (
        <div className="App">
            <div>
                <BrowserRouter>
                    <CustomAppBar />
                    <Routes history={history}>
                        {/* <Header /> */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/candidate-redirect"
                            element={<CandidateRedirectForm />}
                        />
                        <Route path="/" element={<ProtectedRoute />}>
                            <Route
                                path="/recruitment"
                                element={<RecruitmentPage />}
                            />
                            <Route path="/dashboard" element={<HomePage />} />
                            <Route
                                path="/employees"
                                element={<EmployeePage />}
                            />
                            <Route path="/settings" element={<SettingPage />} />
                            <Route path="/jobs" element={<JobsPage />} />
                            <Route
                                path="/candidates"
                                element={<CadidatePage />}
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/login" />}
                            />
                            <Route
                                path="/managers/employees"
                                element={<MyEmployCandidate />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    )
}

export default App
