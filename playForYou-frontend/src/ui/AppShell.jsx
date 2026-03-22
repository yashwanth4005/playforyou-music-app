import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MusicPlayer } from "./MusicPlayer";
import { useAuth } from "../providers/AuthProvider";

const USER_ITEMS = [
  { to: "/home", label: "Home", icon: "01" },
  { to: "/search", label: "Search", icon: "02" },
  { to: "/library", label: "Library", icon: "03" },
  { to: "/profile", label: "Profile", icon: "04" },
];

const ADMIN_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "A1" },
  { to: "/admin/upload", label: "Upload", icon: "A2" },
  { to: "/admin/songs", label: "Manage", icon: "A3" },
];

export function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const items = user?.role === "ADMIN" ? [...USER_ITEMS, ...ADMIN_ITEMS] : USER_ITEMS;

  return (
    <div className="app-frame">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Sidebar items={items} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

      <div className="app-main">
        <Topbar />
        <motion.main
          key={location.pathname}
          className="content-stack"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <Outlet />
        </motion.main>
        <MusicPlayer />
      </div>
    </div>
  );
}
