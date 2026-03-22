import { NavLink } from "react-router-dom";

export function Sidebar({ items, collapsed, onToggle }) {
  return (
    <aside className={`sidebar-panel ${collapsed ? "collapsed" : ""}`}>
      <button type="button" className="sidebar-brand" onClick={onToggle}>
        <span className="brand-mark" />
        {!collapsed && (
          <div>
            <strong>PlayForYou</strong>
            <small>Curated listening</small>
          </div>
        )}
      </button>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            end={item.to === "/home" || item.to === "/admin"}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
