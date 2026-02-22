import React, { lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoutes from "../config/protect";

// Lazy load all screens for code splitting
const Login = lazy(() => import("../screens/Login"));
const Register = lazy(() => import("../screens/Register"));
const Dashboard = lazy(() => import("../screens/Dashboard"));
const Project = lazy(() => import("../screens/Project"));
const Home = lazy(() => import("../screens/Home"));
const ProjectDetail = lazy(() => import("../screens/ProjectDetail"));
const Content = lazy(() => import("../screens/Content"));

const SuspenseFallback = () => (
  <div className="flex items-center justify-center h-screen">Loading...</div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SuspenseFallback />}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Home />
            </motion.div>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/login"
          element={
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Dashboard/>
            </motion.div>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/project/detail/:id"
          element={
            <ProtectedRoutes>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            > 
              <ProjectDetail/>
            </motion.div>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoutes>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Project/>
            </motion.div>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/repo/:projectId/files/:fileId/content"
          element={
            <ProtectedRoutes>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Content />
            </motion.div>
            </ProtectedRoutes>
          }
        />



      </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRoute;
