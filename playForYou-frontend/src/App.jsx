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

                    {/* Public Auth Route */}
                    <Route
                      path="/auth"
                      element={
                        <AuthRoute>
                          <AuthView />
                        </AuthRoute>
                      }
                    />

                    {/* Main App Routes */}
                    <Route path="/" element={<AppShell />}>
                      
                      {/* Default Home Page */}
                      <Route index element={<HomeView />} />

                      {/* Public Pages */}
                      <Route path="home" element={<HomeView />} />
                      <Route path="search" element={<SearchView />} />
                      <Route path="library" element={<LibraryView />} />
                      <Route path="song/:songId" element={<SongDetailsView />} />

                      {/* Protected User Route */}
                      <Route
                        path="profile"
                        element={
                          <ProtectedRoute>
                            <ProfileView />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
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

                    {/* Redirect Unknown Routes */}
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