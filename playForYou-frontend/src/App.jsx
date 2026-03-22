import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./providers/AuthProvider";
import { PlayerProvider } from "./providers/PlayerProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { AppShell } from "./ui/AppShell";
import { AuthRoute, ProtectedRoute, RoleRoute } from "./ui/RouteGuards";

const AuthView = lazy(() => import("./views/AuthView"));
const HomeView = lazy(() => import("./views/HomeView"));
const SearchView = lazy(() => import("./views/SearchView"));
const LibraryView = lazy(() => import("./views/LibraryView"));
const SongDetailsView = lazy(() => import("./views/SongDetailsView"));
const ProfileView = lazy(() => import("./views/ProfileView"));
const AdminDashboardView = lazy(() => import("./views/admin/AdminDashboardView"));
const AdminUploadView = lazy(() => import("./views/admin/AdminUploadView"));
const AdminSongsView = lazy(() => import("./views/admin/AdminSongsView"));

function FallbackScreen() {
  return (
    <div className="screen-loader">
      <div className="loader-orb" />
      <p>Curating your listening space…</p>
    </div>
  );
}

function HomeRedirect() {
  const user = JSON.parse(localStorage.getItem("playforyou-user") || "null");
  return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/home"} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Suspense fallback={<FallbackScreen />}>
                  <Routes>
                    <Route
                      path="/auth"
                      element={
                        <AuthRoute>
                          <AuthView />
                        </AuthRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppShell />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<HomeRedirect />} />
                      <Route path="home" element={<HomeView />} />
                      <Route path="search" element={<SearchView />} />
                      <Route path="library" element={<LibraryView />} />
                      <Route path="song/:songId" element={<SongDetailsView />} />
                      <Route path="profile" element={<ProfileView />} />
                      <Route
                        path="admin"
                        element={
                          <RoleRoute role="ADMIN">
                            <AdminDashboardView />
                          </RoleRoute>
                        }
                      />
                      <Route
                        path="admin/upload"
                        element={
                          <RoleRoute role="ADMIN">
                            <AdminUploadView />
                          </RoleRoute>
                        }
                      />
                      <Route
                        path="admin/songs"
                        element={
                          <RoleRoute role="ADMIN">
                            <AdminSongsView />
                          </RoleRoute>
                        }
                      />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </BrowserRouter>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
