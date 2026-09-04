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
  X,
  Moon,
  Globe,
  Database,
  Image as ImageIcon,
  Users,
  Sliders,
  CircleDollarSign,
  ChevronDown
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundType, setBackgroundType] = useState('dark-black');
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [customBgColor, setCustomBgColor] = useState('#3b82f6');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'admin': true });
  const [customBgRotate, setCustomBgRotate] = useState(0);
  const [customBgScale, setCustomBgScale] = useState(1);
  const [customBgBlur, setCustomBgBlur] = useState(0);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // If it's one of our solid theme options, we map it to 'solid' for CSS to hide the blobs
    const bgAttr = (backgroundType === 'dark-black' || backgroundType === 'light-white') ? 'solid' : backgroundType;
    document.documentElement.setAttribute('data-bg', bgAttr);
    
    if (backgroundType === 'color') {
      document.documentElement.style.setProperty('--bg-color', customBgColor);
    } else {
      document.documentElement.style.removeProperty('--bg-color');
    }
  }, [backgroundType, customBgColor]);

  useEffect(() => {
    if (backgroundType === 'custom') {
      document.documentElement.style.setProperty('--custom-bg-url', `url('${customBgUrl}')`);
      document.documentElement.style.setProperty('--custom-bg-rotate', customBgRotate.toString());
      document.documentElement.style.setProperty('--custom-bg-scale', customBgScale.toString());
      document.documentElement.style.setProperty('--custom-bg-blur', customBgBlur.toString());
    }
  }, [backgroundType, customBgUrl, customBgRotate, customBgScale, customBgBlur]);

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

  const adminNavItems = [
    { 
      id: 'admin', 
      label: 'Admin Controls', 
      icon: <Shield size={16} />,
      subItems: [
        { id: 'role-manager', label: 'Role Manager', icon: <Users size={14} /> },
        { id: 'system-manager', label: 'System Manager', icon: <Sliders size={14} /> }
      ]
    }
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
            <div className="sidebar-logo animate-fade-in delay-1" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer', position: 'relative' }}>
              <div className="logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
                <img src="/logo-online.svg" alt="GrowFinTool Logo" style={{ width: '24px', height: '24px', filter: 'var(--logo-filter)' }} id="sidebar-logo-img" />
              </div>
              {!effectivelyCollapsed && <span className="sidebar-text">GrowFinTool</span>}
              {effectivelyCollapsed && <span className="nav-tooltip">GrowFinTool</span>}
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
        
        <div className="nav-scroll-area">
          <nav className="nav-menu animate-fade-in delay-2" style={{ marginTop: '2rem' }}>
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExactActive = activeTab === item.id;
              const isChildActive = hasSubItems && item.subItems.some(sub => activeTab === sub.id);

              return (
                <div key={item.id} className="nav-item-group">
                  <a
                    className={`nav-item ${isExactActive ? 'active' : ''} ${isChildActive ? 'child-active' : ''}`}
                    onClick={() => {
                      if (!hasSubItems) {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                        setIsCollapsed(true);
                        setExpandedGroups({});
                      }
                      // For this demo, clicking the parent when expanded doesn't do anything special,
                      // or it could select the first child. We'll leave it as a category label.
                    }}
                  >
                    {item.icon}
                    {!effectivelyCollapsed && <span className="nav-label">{item.label}</span>}
                    {effectivelyCollapsed && <span className="nav-tooltip">{item.label}</span>}
                  </a>

                  {hasSubItems && !effectivelyCollapsed && (
                    <div className="nav-subitems">
                      {item.subItems.map(subItem => (
                        <a
                          key={subItem.id}
                          className={`nav-subitem ${activeTab === subItem.id ? 'active' : ''}`}
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span className="nav-label">{subItem.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          
          <nav className="nav-menu animate-fade-in delay-2" style={{ width: '100%' }}>
            {adminNavItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExactActive = activeTab === item.id;
              const isChildActive = hasSubItems && item.subItems.some(sub => activeTab === sub.id);
              const hideParentInCollapsed = effectivelyCollapsed && isChildActive;

              return (
                <div key={item.id} className="nav-item-group">
                  {!hideParentInCollapsed && (
                    <a
                      className={`nav-item ${isExactActive ? 'active' : ''} ${isChildActive ? 'child-active' : ''}`}
                      onClick={() => {
                        if (!hasSubItems) {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                          setIsCollapsed(true);
                          setExpandedGroups({});
                        } else {
                        setExpandedGroups(prev => ({
                          ...prev,
                          [item.id]: !prev[item.id]
                        }));
                      }
                    }}
                  >
                    {item.icon}
                    {!effectivelyCollapsed && <span className="nav-label">{item.label}</span>}
                    {effectivelyCollapsed && <span className="nav-tooltip">{item.label}</span>}
                    
                    {hasSubItems && !effectivelyCollapsed && (
                      <div className="nav-chevron" style={{ transform: expandedGroups[item.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown size={14} />
                      </div>
                    )}
                    </a>
                  )}

                  {hasSubItems && (
                    <div className={`nav-subitems-container ${expandedGroups[item.id] || isChildActive ? 'expanded' : ''}`}>
                      <div className="nav-subitems">
                        {item.subItems.map(subItem => (
                          <a
                            key={subItem.id}
                            className={`nav-subitem ${activeTab === subItem.id ? 'active' : ''}`}
                            onClick={() => {
                              setActiveTab(subItem.id);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {subItem.icon && <span style={{ display: 'flex' }}>{subItem.icon}</span>}
                            {!effectivelyCollapsed && <span className="nav-label">{subItem.label}</span>}
                            {effectivelyCollapsed && <span className="nav-tooltip">{subItem.label}</span>}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div ref={menuRef} style={{ position: 'relative' }}>
            {isProfileMenuOpen && (
              <div className="profile-menu animate-fade-in">
                <div className="menu-item" style={{ padding: '0.75rem', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                    <User size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Rashid Shahriyar</span>
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
            
            {effectivelyCollapsed && (
              <div className="nav-item-group" style={{ marginBottom: '0.5rem' }}>
                <a
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMobileMenuOpen(false);
                    setIsCollapsed(true);
                    setExpandedGroups({});
                  }}
                >
                  <Settings size={16} />
                  <span className="nav-tooltip">Settings</span>
                </a>
              </div>
            )}
            
            <div 
              className={`sidebar-profile ${effectivelyCollapsed ? 'collapsed' : ''}`}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="avatar" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                <User size={16} />
              </div>
              {effectivelyCollapsed && <span className="nav-tooltip">Profile</span>}
              {!effectivelyCollapsed && (
                <div className="profile-info animate-fade-in">
                  <span className="profile-name">Rashid Shahriyar</span>
                  <span className="profile-role">Admin</span>
                </div>
              )}
              {!effectivelyCollapsed && (
                <div 
                  className="profile-settings-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('settings');
                    setIsMobileMenuOpen(false);
                    setIsCollapsed(true);
                  }}
                >
                  <Settings size={14} />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <header className="header animate-fade-in">
            <div>
              <h1>Overview</h1>
              <p>Welcome back, here's your financial summary.</p>
            </div>
          </header>
        ) : activeTab === 'settings' ? (
          <div className="settings-page animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Settings size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h2>Settings Removed</h2>
              <p>The configuration options have been documented and removed from the UI.</p>
            </div>
          </div>
        ) : activeTab === 'role-manager' ? (
          <div className="settings-page animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>Role Manager</h2>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(var(--overlay-color), 0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Coming Soon</span>
              </div>
              <p>Advanced role and permissions management is currently under development.</p>
            </div>
          </div>
        ) : activeTab === 'system-manager' ? (
          <div className="settings-page animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Sliders size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>System Manager</h2>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(var(--overlay-color), 0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Coming Soon</span>
              </div>
              <p>Global system configurations and diagnostic tools are currently under development.</p>
            </div>
          </div>
        ) : null}
      </main>

      {/* Custom Background Modal */}
      {isBgModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBgModalOpen(false)}>
          <div className="modal-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Custom Background</h2>
              <button className="close-btn" onClick={() => setIsBgModalOpen(false)}><X size={20} /></button>
            </div>
            
            <input 
              type="text" 
              className="input-field" 
              placeholder="Paste image URL here..." 
              value={customBgUrl}
              onChange={e => setCustomBgUrl(e.target.value)}
            />

            <div className="preview-box">
              {customBgUrl ? (
                <div 
                  className="preview-content"
                  style={{
                    backgroundImage: `url('${customBgUrl}')`,
                    transform: `scale(${customBgScale}) rotate(${customBgRotate}deg)`,
                    filter: `blur(${customBgBlur}px)`
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <ImageIcon size={32} opacity={0.5} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>No image pasted yet</span>
                </div>
              )}
            </div>

            <div className="slider-group">
              <label><span>Rotation</span> <span>{customBgRotate}°</span></label>
              <div className="segmented-control">
                <button className="btn-outline" onClick={() => setCustomBgRotate(r => r - 90)}>-90°</button>
                <button className="btn-outline" onClick={() => setCustomBgRotate(0)}>0°</button>
                <button className="btn-outline" onClick={() => setCustomBgRotate(r => r + 90)}>+90°</button>
              </div>
            </div>

            <div className="slider-group">
              <label><span>Scale</span> <span>{Math.round(customBgScale * 100)}%</span></label>
              <div className="segmented-control">
                <button className="btn-outline" onClick={() => setCustomBgScale(s => Math.max(0.1, s - 0.1))}>-</button>
                <button className="btn-outline" onClick={() => setCustomBgScale(1)}>Reset</button>
                <button className="btn-outline" onClick={() => setCustomBgScale(s => s + 0.1)}>+</button>
              </div>
            </div>

            <div className="slider-group">
              <label><span>Blur</span> <span>{customBgBlur}px</span></label>
              <div className="segmented-control">
                <button className="btn-outline" onClick={() => setCustomBgBlur(b => Math.max(0, b - 2))}>-</button>
                <button className="btn-outline" onClick={() => setCustomBgBlur(0)}>0px</button>
                <button className="btn-outline" onClick={() => setCustomBgBlur(b => b + 2)}>+</button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setIsBgModalOpen(false)}>Cancel</button>
              <button className="btn" onClick={() => setIsBgModalOpen(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
