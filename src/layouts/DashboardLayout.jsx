import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useUIStore } from '../store/uiStore.js';
import { NAVIGATION_ITEMS, ROLES } from '../utils/constants.js';
import { getUserInitials, getRoleName } from '../utils/helpers.js';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigationItems = NAVIGATION_ITEMS[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>🩸 DiabeticApp</h1>
          <button 
            className={styles.closeButton}
            onClick={closeSidebar}
          >
            ✕
          </button>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.path} className={styles.navItem}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${isActiveRoute(item.path) ? styles.active : ''}`}
                  onClick={closeSidebar}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {getUserInitials(user)}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userRole}>{getRoleName(user?.role)}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuButton}
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <h2 className={styles.pageTitle}>
              {navigationItems.find(item => isActiveRoute(item.path))?.name || 'Dashboard'}
            </h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userMenu}>
              <button 
                className={styles.userMenuButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userAvatarSmall}>
                  {getUserInitials(user)}
                </div>
                <span className={styles.userNameSmall}>{user?.name}</span>
                <span className={styles.dropdownArrow}>▼</span>
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      {getUserInitials(user)}
                    </div>
                    <div className={styles.dropdownUserInfo}>
                      <p className={styles.dropdownUserName}>{user?.name}</p>
                      <p className={styles.dropdownUserEmail}>{user?.email}</p>
                      <p className={styles.dropdownUserRole}>{getRoleName(user?.role)}</p>
                    </div>
                  </div>
                  <div className={styles.dropdownActions}>
                    <Link 
                      to="/profile" 
                      className={styles.dropdownLink}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <button 
                      className={styles.dropdownLink}
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}
    </div>
  );
};

export default DashboardLayout;
