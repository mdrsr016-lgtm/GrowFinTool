import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { 
  LayoutDashboard,
  Settings,
  CreditCard,
  User,
  Shield,
  HelpCircle,
  LogOut,
  X,
  Image as ImageIcon,
  Users,
  Sliders,
  ChevronDown,
  Palette,
  ClipboardPaste,
  RotateCw,
  Maximize,
  Droplet,
  RotateCcw,
  Move,
  Upload,
  Monitor,
  Smartphone
} from 'lucide-react';
import './index.css';

interface BgConfigCardProps {
  title: string;
  icon: React.ReactNode;
  type: 'desktop' | 'mobile';
  url: string;
  setUrl: (v: string) => void;
  rotate: number;
  setRotate: (v: number) => void;
  scale: number;
  setScale: (v: number) => void;
  blur: number;
  setBlur: (v: number) => void;
  offsetX: number;
  setOffsetX: (v: number) => void;
  offsetY: number;
  setOffsetY: (v: number) => void;
}

const BgConfigCard: React.FC<BgConfigCardProps> = ({
  title, icon, type, url, setUrl,
  rotate, setRotate, scale, setScale,
  blur, setBlur, offsetX, setOffsetX, offsetY, setOffsetY
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initX: 0, initY: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetScreenW = type === 'mobile' ? 390 : window.innerWidth;
  const targetScreenH = type === 'mobile' ? 844 : window.innerHeight;

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Top: Preview Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={`Paste ${type} image URL here...`}
              value={url}
              onChange={e => setUrl(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button 
              className="btn-outline"
              title="Upload from device"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '0 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Upload size={18} />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const blobUrl = URL.createObjectURL(file);
                  setUrl(blobUrl);
                }
              }}
            />
            <button 
              className="btn-outline"
              title="Paste from clipboard"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text) setUrl(text);
                } catch (err) {
                  console.error('Failed to read clipboard contents: ', err);
                  alert('Clipboard access denied or not supported. Please paste manually.');
                }
              }}
              style={{ padding: '0 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ClipboardPaste size={18} />
            </button>
          </div>

          <div 
            className="preview-box" 
            style={{ 
              width: type === 'mobile' ? '170px' : '100%', 
              height: type === 'mobile' ? '300px' : '200px',
              minHeight: type === 'mobile' ? '300px' : '200px',
              flexShrink: 0,
              borderRadius: type === 'mobile' ? '20px' : '12px',
              transition: 'all 0.3s ease',
              cursor: url ? (isDragging ? 'grabbing' : 'grab') : 'default',
              margin: type === 'mobile' ? '0 auto' : '0'
            }}
            onMouseDown={(e) => {
              if (!url) return;
              setIsDragging(true);
              setDragStart({ x: e.clientX, y: e.clientY, initX: offsetX, initY: offsetY });
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              let newX = dragStart.initX + (e.clientX - dragStart.x);
              let newY = dragStart.initY + (e.clientY - dragStart.y);
              
              const SNAP_THRESHOLD = 15;
              if (Math.abs(newX) < SNAP_THRESHOLD) newX = 0;
              if (Math.abs(newY) < SNAP_THRESHOLD) newY = 0;
              
              setOffsetX(newX);
              setOffsetY(newY);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onWheel={(e) => {
              if (!url) return;
              if (e.deltaY < 0) {
                setScale(Math.min(3, scale + 0.05));
              } else {
                setScale(Math.max(0.1, scale - 0.05));
              }
            }}
          >
            {url ? (
              <>
                <div 
                  className="preview-content"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${(targetScreenW * Math.abs(Math.cos(rotate * Math.PI / 180)) + targetScreenH * Math.abs(Math.sin(rotate * Math.PI / 180))) / targetScreenW * 100}%`,
                    height: `${(targetScreenW * Math.abs(Math.sin(rotate * Math.PI / 180)) + targetScreenH * Math.abs(Math.cos(rotate * Math.PI / 180))) / targetScreenH * 100}%`,
                    backgroundImage: `url('${url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale}) rotate(${rotate}deg)`,
                    filter: `blur(${blur}px)`
                  }}
                />
                
                {/* Magnetic Snap Lines */}
                {isDragging && offsetX === 0 && (
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: '#22c55e', boxShadow: '0 0 6px #22c55e', zIndex: 5, pointerEvents: 'none' }} />
                )}
                {isDragging && offsetY === 0 && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '2px', background: '#22c55e', boxShadow: '0 0 6px #22c55e', zIndex: 5, pointerEvents: 'none' }} />
                )}

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  background: isDragging ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  opacity: isDragging ? 0 : 1,
                  transition: 'opacity 0.2s',
                  gap: '0.5rem',
                  fontWeight: 500,
                  zIndex: 10
                }}>
                  <Move size={16} /> Drag to reposition, scroll to scale
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <ImageIcon size={32} opacity={0.5} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>No image pasted yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Controls */}
        <div className="modal-controls-grid">
          <div className="slider-group">
            <label>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCw size={14} /> Rotation
              </span> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{rotate}°</span>
                <button className="icon-btn" style={{ padding: 2, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setRotate(0)} title="Reset"><RotateCcw size={12} /></button>
              </div>
            </label>
            <input 
              type="range" 
              min="-180" 
              max="180" 
              list="rotation-markers"
              value={rotate} 
              onChange={e => {
                let val = Number(e.target.value);
                const nearest90 = Math.round(val / 90) * 90;
                if (Math.abs(val - nearest90) <= 8) val = nearest90;
                setRotate(val);
              }} 
            />
            <datalist id="rotation-markers">
              <option value="-180"></option>
              <option value="-90"></option>
              <option value="0"></option>
              <option value="90"></option>
              <option value="180"></option>
            </datalist>
          </div>

          <div className="slider-group">
            <label>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Maximize size={14} /> Scale
              </span> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{Math.round(scale * 100)}%</span>
                <button className="icon-btn" style={{ padding: 2, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setScale(1)} title="Reset"><RotateCcw size={12} /></button>
              </div>
            </label>
            <input type="range" min="0.1" max="3" step="0.05" value={scale} onChange={e => setScale(Number(e.target.value))} />
          </div>

          <div className="slider-group span-2">
            <label>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Droplet size={14} /> Blur
              </span> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{blur}px</span>
                <button className="icon-btn" style={{ padding: 2, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setBlur(0)} title="Reset"><RotateCcw size={12} /></button>
              </div>
            </label>
            <input type="range" min="0" max="100" step="1" value={blur} onChange={e => setBlur(Number(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundType, setBackgroundType] = useState('dark-black');
  const [customBgUrl, setCustomBgUrl] = useState('');
  const customBgColor = '#3b82f6';
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'admin': true });
  const [customBgRotate, setCustomBgRotate] = useState(0);
  const [customBgScale, setCustomBgScale] = useState(1);
  const [customBgBlur, setCustomBgBlur] = useState(0);
  const [customBgOffsetX, setCustomBgOffsetX] = useState(0);
  const [customBgOffsetY, setCustomBgOffsetY] = useState(0);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [mobileBgUrl, setMobileBgUrl] = useState('');
  const [mobileBgRotate, setMobileBgRotate] = useState(0);
  const [mobileBgScale, setMobileBgScale] = useState(1);
  const [mobileBgBlur, setMobileBgBlur] = useState(0);
  const [mobileBgOffsetX, setMobileBgOffsetX] = useState(0);
  const [mobileBgOffsetY, setMobileBgOffsetY] = useState(0);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 768);
  const [systemManagerSection, setSystemManagerSection] = useState('appearance');
  const [appWidth, setAppWidth] = useState(95);
  const [appHeight, setAppHeight] = useState(92);
  const [appRadius, setAppRadius] = useState(20);
  const [appBgOverride, setAppBgOverride] = useState('');
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

    if (appBgOverride) {
      document.documentElement.style.setProperty('--outer-bg-color', appBgOverride);
    } else {
      document.documentElement.style.removeProperty('--outer-bg-color');
    }
  }, [backgroundType, customBgColor, appBgOverride]);

  useEffect(() => {
    if (backgroundType === 'custom') {
      const isMobileActive = isMobileScreen && mobileBgUrl;
      const activeUrl = isMobileActive ? mobileBgUrl : customBgUrl;
      const activeRotate = isMobileActive ? mobileBgRotate : customBgRotate;
      const activeScale = isMobileActive ? mobileBgScale : customBgScale;
      const activeBlur = isMobileActive ? mobileBgBlur : customBgBlur;
      const activeOffsetX = isMobileActive ? mobileBgOffsetX : customBgOffsetX;
      const activeOffsetY = isMobileActive ? mobileBgOffsetY : customBgOffsetY;

      const rad = (activeRotate * Math.PI) / 180;
      const absCos = Math.abs(Math.cos(rad));
      const absSin = Math.abs(Math.sin(rad));
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const bgBoxW = screenW * absCos + screenH * absSin;
      const bgBoxH = screenW * absSin + screenH * absCos;
      document.documentElement.style.setProperty('--bg-box-width', `${bgBoxW}px`);
      document.documentElement.style.setProperty('--bg-box-height', `${bgBoxH}px`);

      document.documentElement.style.setProperty('--custom-bg-url', `url('${activeUrl}')`);
      document.documentElement.style.setProperty('--custom-bg-rotate', activeRotate.toString());
      document.documentElement.style.setProperty('--custom-bg-scale', activeScale.toString());
      document.documentElement.style.setProperty('--custom-bg-blur', activeBlur.toString());
      document.documentElement.style.setProperty('--custom-bg-offset-x', activeOffsetX.toString());
      document.documentElement.style.setProperty('--custom-bg-offset-y', activeOffsetY.toString());
    }
  }, [
    backgroundType, isMobileScreen,
    customBgUrl, customBgRotate, customBgScale, customBgBlur, customBgOffsetX, customBgOffsetY,
    mobileBgUrl, mobileBgRotate, mobileBgScale, mobileBgBlur, mobileBgOffsetX, mobileBgOffsetY
  ]);

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

  const navItems: { id: string; label: string; icon: ReactNode; subItems?: { id: string; label: string; icon: ReactNode }[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ];

  const adminNavItems: { id: string; label: string; icon: ReactNode; subItems?: { id: string; label: string; icon: ReactNode }[] }[] = [
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



  const effectivelyCollapsed = isCollapsed && !isMobileMenuOpen;

  return (
    <div className="app-container" style={{
      width: `${appWidth}vw`,
      height: `${appHeight}vh`,
      borderRadius: `${appRadius}px`
    }}>
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
              const isChildActive = hasSubItems && item.subItems?.some(sub => activeTab === sub.id);

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
                      {item.subItems?.map(subItem => (
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
              const isChildActive = hasSubItems && item.subItems?.some(sub => activeTab === sub.id);
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
                        {item.subItems?.map(subItem => (
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
          <div className="system-manager-layout animate-fade-in">
            {/* Left Sidebar (1) */}
            <div className="system-manager-sidebar">
              <h2 className="system-manager-title">System Manager</h2>
              <div className="system-manager-nav">
                <a 
                  className={`system-nav-item ${systemManagerSection === 'appearance' ? 'active' : ''}`}
                  onClick={() => setSystemManagerSection('appearance')}
                >
                  <Palette size={16} />
                  <span>Appearance</span>
                </a>
                <a 
                  className={`system-nav-item ${systemManagerSection === 'general' ? 'active' : ''}`}
                  onClick={() => setSystemManagerSection('general')}
                >
                  <Settings size={16} />
                  <span>General</span>
                </a>
                <a 
                  className={`system-nav-item ${systemManagerSection === 'security' ? 'active' : ''}`}
                  onClick={() => setSystemManagerSection('security')}
                >
                  <Shield size={16} />
                  <span>Security</span>
                </a>
              </div>
            </div>

            {/* Right Content Area (2) */}
            <div className="system-manager-content">
              {systemManagerSection === 'appearance' ? (
                <div className="animate-fade-in" style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <Palette size={24} style={{ color: 'var(--text-main)' }} />
                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>Appearance Options</h2>
                  </div>
                  
                  <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                    
                    <div className="setting-card" style={{ background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                      <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>App Dimensions</h3>
                      
                      <div className="slider-group" style={{ marginBottom: '1.5rem' }}>
                        <label>
                          <span>Window Width (vw)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAppWidth(95)}>Reset</span>
                            <span>{appWidth}vw</span>
                          </div>
                        </label>
                        <input type="range" min="50" max="100" value={appWidth} onChange={e => setAppWidth(parseInt(e.target.value))} />
                      </div>
                      
                      <div className="slider-group" style={{ marginBottom: '1.5rem' }}>
                        <label>
                          <span>Window Height (vh)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAppHeight(92)}>Reset</span>
                            <span>{appHeight}vh</span>
                          </div>
                        </label>
                        <input type="range" min="50" max="100" value={appHeight} onChange={e => setAppHeight(parseInt(e.target.value))} />
                      </div>

                      <div className="slider-group">
                        <label>
                          <span>Border Radius (px)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAppRadius(20)}>Reset</span>
                            <span>{appRadius}px</span>
                          </div>
                        </label>
                        <input type="range" min="0" max="50" value={appRadius} onChange={e => setAppRadius(parseInt(e.target.value))} />
                      </div>
                    </div>

                    <div className="setting-card" style={{ background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                      <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>Theme & Colors</h3>
                      
                      <div className="slider-group" style={{ marginBottom: '1rem' }}>
                        <label><span>Custom Background Color Override</span></label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                          <input 
                            type="color" 
                            value={appBgOverride || '#0f1115'} 
                            onChange={e => setAppBgOverride(e.target.value)} 
                            style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <button 
                            className="btn-outline" 
                            onClick={() => setAppBgOverride('')}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                          >
                            Reset to Theme Default
                          </button>
                        </div>
                      </div>
                      
                      <div className="slider-group" style={{ marginBottom: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
                        <label><span>Custom Background Image</span></label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                          <button 
                            className="btn" 
                            onClick={() => {
                              setBackgroundType('custom');
                              setIsBgModalOpen(true);
                            }}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            <ImageIcon size={14} /> Configure Image
                          </button>
                          <button 
                            className="btn-outline" 
                            onClick={() => {
                              setBackgroundType('dark-black');
                              setCustomBgUrl('');
                            }}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          >
                            Remove Image
                          </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                          Use this to set a custom image or wallpaper for the entire application background. Note: Extreme colors might reduce text legibility.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button 
                        className="btn" 
                        style={{ minWidth: '140px', display: 'flex', justifyContent: 'center' }}
                        onClick={() => {
                          setIsSavingAppearance(true);
                          setTimeout(() => setIsSavingAppearance(false), 2000);
                        }}
                      >
                        {isSavingAppearance ? 'Saved!' : 'Save Settings'}
                      </button>
                    </div>

                  </div>
                </div>
              ) : systemManagerSection === 'general' ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <Settings size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)' }}>General Settings</h2>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(var(--overlay-color), 0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Coming Soon</span>
                  </div>
                  <p>Core system configuration and defaults will be available here.</p>
                </div>
              ) : systemManagerSection === 'security' ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <Shield size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Security & Access</h2>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(var(--overlay-color), 0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Coming Soon</span>
                  </div>
                  <p>Security policies and audit logs will be available here.</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </main>

      {/* Custom Background Modal */}
      {isBgModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBgModalOpen(false)}>
          <div className="modal-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ gap: '2rem', width: '95%', maxWidth: '1400px' }}>
            <div className="modal-header">
              <h2>Custom Background</h2>
              <button className="close-btn" onClick={() => setIsBgModalOpen(false)}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <BgConfigCard 
                title="Desktop Background"
                icon={<Monitor size={18} />}
                type="desktop"
                url={customBgUrl} setUrl={setCustomBgUrl}
                rotate={customBgRotate} setRotate={setCustomBgRotate}
                scale={customBgScale} setScale={setCustomBgScale}
                blur={customBgBlur} setBlur={setCustomBgBlur}
                offsetX={customBgOffsetX} setOffsetX={setCustomBgOffsetX}
                offsetY={customBgOffsetY} setOffsetY={setCustomBgOffsetY}
              />
              <BgConfigCard 
                title="Mobile Portrait Background"
                icon={<Smartphone size={18} />}
                type="mobile"
                url={mobileBgUrl} setUrl={setMobileBgUrl}
                rotate={mobileBgRotate} setRotate={setMobileBgRotate}
                scale={mobileBgScale} setScale={setMobileBgScale}
                blur={mobileBgBlur} setBlur={setMobileBgBlur}
                offsetX={mobileBgOffsetX} setOffsetX={setMobileBgOffsetX}
                offsetY={mobileBgOffsetY} setOffsetY={setMobileBgOffsetY}
              />
            </div>

            <div className="modal-footer" style={{ marginTop: '0.5rem' }}>
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
