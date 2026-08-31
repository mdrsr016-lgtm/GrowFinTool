import { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  LayoutDashboard,
  PieChart,
  Settings,
  Bell,
  Search,
  CreditCard,
  Building,
  TrendingUp,
  Activity,
  Sparkles,
  User,
  Shield,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const offlineFavicon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 512 512' xml:space='preserve'%3E%3Cpath d='M459.813 280.313C443.922 153.172 532.954 17.25 410.891 42.266 140.234 97.688 35.875 365.126 0 472.735h512s-35.875-61.968-52.187-192.422' style='fill:%239ca3af'/%3E%3C/svg%3E";
    const updateFavicon = () => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      if (navigator.onLine) {
        link.href = '/logo-online.svg';
      } else {
        link.href = offlineFavicon;
      }
    };

    updateFavicon();
    window.addEventListener('online', updateFavicon);
    window.addEventListener('offline', updateFavicon);

    return () => {
      window.removeEventListener('online', updateFavicon);
      window.removeEventListener('offline', updateFavicon);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ];

  const transactions = [
    { id: 1, name: 'Stripe Deposit', type: 'incoming', amount: '+$4,500.00', date: 'Today, 10:42 AM', icon: <Building size={16} className="text-blue-400" /> },
    { id: 2, name: 'AWS Cloud Services', type: 'outgoing', amount: '-$120.50', date: 'Yesterday, 2:15 PM', icon: <Activity size={16} className="text-red-400" /> },
    { id: 3, name: 'Team Salaries', type: 'outgoing', amount: '-$12,450.00', date: 'Aug 25, 9:00 AM', icon: <Wallet size={16} className="text-purple-400" /> },
    { id: 4, name: 'Q3 Investment Dividend', type: 'incoming', amount: '+$850.00', date: 'Aug 22, 11:30 AM', icon: <TrendingUp size={16} className="text-green-400" /> },
  ];

  const effectivelyCollapsed = isCollapsed && !isMobileMenuOpen;

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className={`mobile-header ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div 
          className="sidebar-logo" 
          style={{ cursor: 'pointer' }} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src="/logo-online.svg" alt="GrowFinTool Logo" style={{ width: '24px', height: '24px', filter: 'var(--logo-filter)' }} id="mobile-header-logo-img" />
          </div>
          <span className="sidebar-text">GrowFinTool</span>
        </div>
      </div>

      {/* Sidebar Backdrop */}
      <div 
        className={`sidebar-backdrop ${isMobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${effectivelyCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobileMenuOpen ? 'flex-end' : (effectivelyCollapsed ? 'center' : 'space-between'), width: '100%' }}>
          {!isMobileMenuOpen && (
            <div className="sidebar-logo animate-fade-in delay-1" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
              <div className="logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
                <img src="/logo-online.svg" alt="GrowFinTool Logo" style={{ width: '24px', height: '24px', filter: 'var(--logo-filter)' }} id="sidebar-logo-img" />
              </div>
              {!effectivelyCollapsed && <span className="sidebar-text">GrowFinTool</span>}
            </div>
          )}
          {(isMobileMenuOpen || !effectivelyCollapsed) && (
            <button 
              onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsCollapsed(true)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="nav-menu animate-fade-in delay-2" style={{ marginTop: '2rem' }}>
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.icon}
              {!effectivelyCollapsed && <span className="nav-label">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="mt-auto" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div ref={menuRef} style={{ position: 'relative' }}>
            {isProfileMenuOpen && (
              <div className="profile-menu animate-fade-in">
                <div className="menu-item" style={{ padding: '0.75rem', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '28px', height: '28px', minWidth: '28px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Alex M.</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>View Profile</span>
                  </div>
                </div>
                <div className="menu-divider"></div>
                <a className="menu-item"><CreditCard size={14} /> Manage Subscription</a>
                <a className="menu-item"><HelpCircle size={14} /> Help & Support</a>
                <div className="menu-divider"></div>
                <a className="menu-item text-danger"><LogOut size={14} /> Log Out</a>
              </div>
            )}
            
            <div 
              className={`sidebar-profile ${effectivelyCollapsed ? 'collapsed' : ''}`}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="avatar" style={{ width: '28px', height: '28px', minWidth: '28px' }}></div>
              {!effectivelyCollapsed && (
                <div className="profile-info animate-fade-in">
                  <span className="profile-name">Alex M.</span>
                  <span className="profile-role">Admin</span>
                </div>
              )}
              <div 
                className={`profile-settings-btn ${effectivelyCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('settings');
                }}
              >
                <Settings size={14} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header animate-fade-in">
          <div>
            <h1>Overview</h1>
            <p>Welcome back, here's your financial summary.</p>
          </div>
        </header>


      </main>
    </div>
  );
}

export default App;
