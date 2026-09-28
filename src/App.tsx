import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Smartphone,
  Trash2,
  Ban,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Search
} from 'lucide-react';
import { supabase } from './lib/supabase';
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
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

const CustomRoleDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'founder', label: 'Founder', icon: <img src="/logo-online.svg" alt="" style={{ width: '14px', height: '14px', filter: getRoleLogoFilter('founder') }} /> },
    { value: 'admin', label: 'Admin', icon: <img src="/logo-online.svg" alt="" style={{ width: '14px', height: '14px', filter: getRoleLogoFilter('admin') }} /> },
    { value: 'premium_user', label: 'Premium User', icon: <img src="/logo-online.svg" alt="" style={{ width: '14px', height: '14px', filter: getRoleLogoFilter('premium_user') }} /> },
    { value: 'user', label: 'User', icon: <img src="/logo-online.svg" alt="" style={{ width: '14px', height: '14px', filter: getRoleLogoFilter('user') }} /> }
  ];

  const selected = options.find(o => o.value === value) || options[3];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', zIndex: isOpen ? 50 : 1 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--panel-border)',
          color: 'var(--text-main)',
          padding: '0.4rem 0.75rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          minWidth: '145px',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(var(--overlay-color), 0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(var(--overlay-color), 0.03)'}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{selected.icon}</span>
          {selected.label}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          width: '100%',
          background: 'rgba(12, 14, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transform: 'translateZ(0)',
          border: '1px solid var(--panel-border)',
          borderRadius: '8px',
          padding: '0.25rem',
          zIndex: 50,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.15rem'
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: value === opt.value ? '#3b82f6' : 'var(--text-main)',
                background: value === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                transition: 'background 0.1s ease'
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) e.currentTarget.style.background = 'rgba(var(--overlay-color), 0.05)';
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ color: value === opt.value ? '#3b82f6' : 'var(--text-muted)' }}>
                {opt.icon}
              </div>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const APP_MODULES = [
  {
    category: 'General',
    categoryIcon: <LayoutDashboard size={16} />,
    id: 'general',
    label: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
    isTopLevel: true,
    placement: 'top',
    items: [
      { id: 'dashboard', label: 'View Dashboard', permission: 'View Dashboard', icon: <LayoutDashboard size={14} /> }
    ]
  },
  {
    category: 'System',
    categoryIcon: <Shield size={16} />,
    id: 'admin',
    label: 'Admin Controls',
    icon: <Shield size={16} />,
    isTopLevel: false,
    placement: 'bottom',
    items: [
      { id: 'role-manager', label: 'Users And Roles', permission: 'Manage Roles', icon: <Users size={14} /> },
      { id: 'system-manager', label: 'System Manager', permission: 'System Settings', icon: <Sliders size={14} /> }
    ]
  }
];

export function getRoleLogoFilter(role: string) {
  switch (role) {
    case 'founder': return 'hue-rotate(110deg) saturate(1.5)';
    case 'admin': return 'hue-rotate(-40deg) saturate(1.2) brightness(0.8)';
    case 'premium_user': return 'none';
    case 'user': return 'invert(1)';
    default: return 'invert(1)';
  }
}

const RoleManager = ({ rolePermissions, setRolePermissions, roles, pendingRequests, setPendingRequests, isMobileScreen }: any) => {
  const [activeSection, setActiveSection] = useState(() => localStorage.getItem('activeSection') || 'roles');
  
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);
  const [filterRole, setFilterRole] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('founder');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  
  const sections = ['roles', 'users', 'requests'];

  const handleSectionChange = (newSection: string, direction?: 'left' | 'right') => {
    if (direction) {
      setSlideDirection(direction);
    } else {
      const currentIndex = sections.indexOf(activeSection);
      const newIndex = sections.indexOf(newSection);
      setSlideDirection(newIndex > currentIndex ? 'right' : 'left');
    }
    setActiveSection(newSection);
  };

  const permissions = APP_MODULES.map(module => ({
    category: module.category,
    categoryIcon: module.categoryIcon,
    items: module.items.map(item => item.permission)
  }));

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'founder', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', status: 'Active' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'premium_user', status: 'Suspended' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'user', status: 'Active' }
  ]);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{id: string, name: string, description: string} | null>(null);

  const [mobileSelectedRole, setMobileSelectedRole] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'menu' | 'appearance' | 'permissions'>('menu');

  const handleToggle = (item: string) => {
    if (selectedRole === 'founder') return;
    setRolePermissions((prev: any) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [item]: !prev[selectedRole][item]
      }
    }));
  };

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = sections.indexOf(activeSection);
      if (isLeftSwipe) {
        if (currentIndex < sections.length - 1) handleSectionChange(sections[currentIndex + 1], 'right');
        else handleSectionChange(sections[0], 'right');
      }
      if (isRightSwipe) {
        if (currentIndex > 0) handleSectionChange(sections[currentIndex - 1], 'left');
        else handleSectionChange(sections[sections.length - 1], 'left');
      }
    }
  };

  return (
    <div 
      className="system-manager-layout animate-fade-in role-manager-layout"
      onTouchStart={isMobileScreen ? handleTouchStart : undefined}
      onTouchMove={isMobileScreen ? handleTouchMove : undefined}
      onTouchEnd={isMobileScreen ? handleTouchEnd : undefined}
    >
      {/* Primary Sidebar (Role Manager vs Users) */}
      <div className="system-manager-sidebar">
        <h2 className="system-manager-title">Users And Roles</h2>
        <div className="system-manager-nav">
          <a 
            className={`system-nav-item ${activeSection === 'roles' ? 'active' : ''}`}
            onClick={() => handleSectionChange('roles')}
          >
            <Shield size={16} /> Roles
          </a>
          <a 
            className={`system-nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => handleSectionChange('users')}
          >
            <Users size={16} /> Users
          </a>
          <a 
            className={`system-nav-item ${activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => handleSectionChange('requests')}
          >
            <UserPlus size={16} /> User Requests
          </a>
        </div>
      </div>

      <div 
        key={activeSection}
        className={`system-manager-content inner-flex role-manager-inner-content ${slideDirection === 'left' ? 'slide-in-left' : slideDirection === 'right' ? 'slide-in-right' : 'animate-fade-in'}`}
      >
        {activeSection === 'roles' ? (
          <>
            {/* Inner Sidebar (Roles List) */}
            <div className="system-manager-sidebar role-manager-sidebar" style={isMobileScreen && mobileSelectedRole ? { display: 'none' } : {}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobileScreen ? '0.75rem' : '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>ROLES</h3>
                <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }}>+ New</button>
              </div>
              <div className="system-manager-nav">
                {roles.map((role: any) => (
                  <a 
                    key={role.id}
                    className={`system-nav-item ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedRole(role.id);
                      if (isMobileScreen) {
                        setMobileSelectedRole(role.id);
                        setMobileView('menu');
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', gap: '0.5rem', height: 'auto', whiteSpace: 'normal' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src="/logo-online.svg" alt="" style={{ width: '18px', height: '18px', filter: getRoleLogoFilter(role.id) }} />
                        <span style={{ fontWeight: 600, color: selectedRole === role.id ? 'var(--text-main)' : 'inherit', fontSize: '0.95rem' }}>{role.name}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(var(--overlay-color), 0.1)', padding: '0.15rem 0.5rem', borderRadius: '12px', color: 'var(--text-main)' }}>{usersList.filter(u => u.role === role.id).length} users</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{role.description}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Permissions Area */}
            {!isMobileScreen && (
              <div className="role-manager-content-area">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {roles.find((r: any) => r.id === selectedRole)?.name} Permissions
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage what this role can see and do.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { setEditingRole(roles.find((r: any) => r.id === selectedRole) || null); setIsRoleModalOpen(true); }}>
                      <Settings size={14} /> Edit Role Details
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {permissions.map(group => (
                    <div key={group.category} style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
                      <div style={{ padding: '1rem 1.5rem', background: 'rgba(var(--overlay-color), 0.02)', borderBottom: '1px solid var(--panel-border)', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {group.categoryIcon || <Shield size={16} />}
                        {group.category}
                      </div>
                      <div style={{ padding: '0.5rem 0' }}>
                        {group.items.map((item, idx) => {
                          const isChecked = rolePermissions[selectedRole][item];
                          const isImmutable = selectedRole === 'founder';
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: idx !== group.items.length - 1 ? '1px solid var(--panel-border)' : 'none' }}>
                              <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{item}</span>
                              
                              <div 
                                className={`toggle-switch ${isChecked ? 'active' : ''}`}
                                onClick={() => handleToggle(item)}
                                style={{ opacity: isImmutable ? 0.5 : 1, cursor: isImmutable ? 'not-allowed' : 'pointer' }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            )}
          </>
        ) : activeSection === 'users' ? (
          <div className="role-manager-content-area">
            {/* Role Summary Cards */}
            <div className="role-summary-cards-container" style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobileScreen ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: isMobileScreen ? '0.5rem' : '1.5rem', 
              marginBottom: isMobileScreen ? '1.5rem' : '2.5rem',
            }}>
              {/* Total Users Card */}
              <div 
                onClick={() => setFilterRole('all')}
                style={{ 
                  background: 'var(--panel-bg)', 
                  borderRadius: '12px', 
                  border: `1px solid ${filterRole === 'all' ? '#3b82f6' : 'var(--panel-border)'}`, 
                  padding: isMobileScreen ? '0.5rem 0.25rem' : '1.25rem', 
                  display: 'flex', 
                  flexDirection: isMobileScreen ? 'column' : 'row',
                  alignItems: 'center', 
                  justifyContent: isMobileScreen ? 'center' : 'flex-start',
                  textAlign: isMobileScreen ? 'center' : 'left',
                  gap: isMobileScreen ? '0.25rem' : '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: filterRole === 'all' ? '0 0 0 1px #3b82f6' : 'none',
                }}
              >
                <div style={{ width: isMobileScreen ? '28px' : '48px', height: isMobileScreen ? '28px' : '48px', borderRadius: isMobileScreen ? '8px' : '12px', background: 'rgba(var(--overlay-color), 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: filterRole === 'all' ? '#3b82f6' : 'var(--text-main)', border: '1px solid var(--panel-border)' }}>
                  <Users size={isMobileScreen ? 14 : 20} />
                </div>
                <div style={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ order: isMobileScreen ? 2 : 1, color: 'var(--text-muted)', fontSize: isMobileScreen ? '0.6rem' : '0.85rem', fontWeight: 600, marginTop: isMobileScreen ? '0.2rem' : '0', marginBottom: isMobileScreen ? '0' : '0.25rem', whiteSpace: isMobileScreen ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Users</div>
                  <div style={{ order: isMobileScreen ? 1 : 2, color: 'var(--text-main)', fontSize: isMobileScreen ? '1rem' : '1.5rem', fontWeight: 700, lineHeight: 1 }}>
                    {usersList.length} {!isMobileScreen && <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>users</span>}
                  </div>
                </div>
              </div>

              {roles.map((role: any) => {
                const actualCount = usersList.filter(u => u.role === role.id).length;
                const isActive = filterRole === role.id;
                return (
                  <div 
                    key={role.id} 
                    onClick={() => setFilterRole(role.id)}
                    style={{ 
                      background: 'var(--panel-bg)', 
                      borderRadius: '12px', 
                      border: `1px solid ${isActive ? '#3b82f6' : 'var(--panel-border)'}`, 
                      padding: isMobileScreen ? '0.5rem 0.25rem' : '1.25rem', 
                      display: 'flex', 
                      flexDirection: isMobileScreen ? 'column' : 'row',
                      alignItems: 'center', 
                      justifyContent: isMobileScreen ? 'center' : 'flex-start',
                      textAlign: isMobileScreen ? 'center' : 'left',
                      gap: isMobileScreen ? '0.25rem' : '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 0 0 1px #3b82f6' : 'none',
                    }}
                  >
                    <div style={{ width: isMobileScreen ? '28px' : '48px', height: isMobileScreen ? '28px' : '48px', borderRadius: isMobileScreen ? '8px' : '12px', background: 'rgba(var(--overlay-color), 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#3b82f6' : 'var(--text-main)', border: '1px solid var(--panel-border)' }}>
                      <img src="/logo-online.svg" alt="" style={{ width: isMobileScreen ? '14px' : '24px', height: isMobileScreen ? '14px' : '24px', filter: getRoleLogoFilter(role.id) }} />
                    </div>
                    <div style={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ order: isMobileScreen ? 2 : 1, color: 'var(--text-muted)', fontSize: isMobileScreen ? '0.6rem' : '0.85rem', fontWeight: 600, marginTop: isMobileScreen ? '0.2rem' : '0', marginBottom: isMobileScreen ? '0' : '0.25rem', whiteSpace: isMobileScreen ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.name}</div>
                      <div style={{ order: isMobileScreen ? 1 : 2, color: 'var(--text-main)', fontSize: isMobileScreen ? '1rem' : '1.5rem', fontWeight: 700, lineHeight: 1 }}>
                        {actualCount} {!isMobileScreen && <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>users</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: isMobileScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobileScreen ? 'stretch' : 'center', marginBottom: '2rem', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: isMobileScreen ? '100%' : 'auto' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>Users</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage users and assign roles.</p>
                </div>
                {isMobileScreen && (
                  <button className="btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    + Invite
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: isMobileScreen ? 'none' : 1, justifyContent: 'flex-end', width: isMobileScreen ? '100%' : 'auto' }}>
                <div style={{ position: 'relative', width: isMobileScreen ? '100%' : '300px' }}>
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    style={{ 
                      padding: '0.6rem 2.5rem 0.6rem 1rem', 
                      borderRadius: '8px', 
                      border: '1px solid var(--panel-border)', 
                      background: 'var(--panel-bg)', 
                      color: 'var(--text-main)',
                      outline: 'none',
                      width: '100%',
                    }} 
                  />
                  <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
                {!isMobileScreen && (
                  <button className="btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    + Invite User
                  </button>
                )}
              </div>
            </div>

            {isMobileScreen ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                {usersList.filter(u => (filterRole === 'all' || u.role === filterRole) && (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))).map((user, i, arr) => (
                  <div key={user.id} style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: '40px', height: '40px' }}><User size={20} /></div>
                        <div>
                          <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem' }}>{user.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</div>
                        </div>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '12px', 
                        fontWeight: 600, 
                        background: user.status === 'Active' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        color: user.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {user.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--panel-border)', position: 'relative', zIndex: arr.length - i }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Role</div>
                        <CustomRoleDropdown 
                          value={user.role} 
                          onChange={(val) => {
                            setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, role: val } : u));
                          }}
                        />
                      </div>
                      {user.role !== 'founder' && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px' }}>
                          <button 
                            className="icon-btn" 
                            title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                            onClick={() => {
                              setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
                            }}
                            style={{ border: 'none', background: 'rgba(var(--overlay-color), 0.05)', color: 'var(--text-main)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Ban size={18} />
                          </button>
                          <button 
                            className="icon-btn" 
                            title="Delete"
                            onClick={() => {
                              setUsersList(prev => prev.filter(u => u.id !== user.id));
                            }}
                            style={{ border: 'none', background: 'rgba(248, 113, 113, 0.1)', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="responsive-table-container" style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', minHeight: '350px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(var(--overlay-color), 0.02)', borderBottom: '1px solid var(--panel-border)' }}>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>User</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Role</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.filter(u => (filterRole === 'all' || u.role === filterRole) && (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))).map((user, i, arr) => (
                      <tr key={user.id} style={{ position: 'relative', zIndex: arr.length - i, borderBottom: i !== arr.length - 1 ? '1px solid var(--panel-border)' : 'none' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="avatar" style={{ width: '32px', height: '32px' }}><User size={16} /></div>
                            <div>
                              <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>{user.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <CustomRoleDropdown 
                            value={user.role} 
                            onChange={(val) => {
                              setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, role: val } : u));
                            }}
                          />
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '12px', 
                            fontWeight: 600, 
                            background: user.status === 'Active' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            color: user.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                          }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          {user.role !== 'founder' && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                className="icon-btn" 
                                title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                                onClick={() => {
                                  setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
                                }}
                                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                              >
                                <Ban size={16} />
                              </button>
                              <button 
                                className="icon-btn" 
                                title="Delete"
                                onClick={() => {
                                  setUsersList(prev => prev.filter(u => u.id !== user.id));
                                }}
                                style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeSection === 'requests' ? (
          <div style={{ flex: 1, padding: isMobileScreen ? '1.5rem' : '2.5rem 3rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>User Requests</h1>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage incoming requests for platform access.</p>
              </div>
            </div>
            {pendingRequests && pendingRequests.length > 0 ? (
              isMobileScreen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                  {pendingRequests.map((req: any) => (
                    <div key={req.id} style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem' }}>{req.email}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{req.date}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: req.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : req.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: req.status === 'Pending' ? '#eab308' : req.status === 'Approved' ? 'var(--success)' : 'var(--danger)' }}>
                          {req.status}
                        </span>
                      </div>
                      
                      {req.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--panel-border)' }}>
                          <button 
                            onClick={() => setPendingRequests((prev: any) => prev.map((r: any) => r.id === req.id ? { ...r, status: 'Approved' } : r))}
                            style={{ flex: 1, padding: '0.6rem', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => setPendingRequests((prev: any) => prev.map((r: any) => r.id === req.id ? { ...r, status: 'Rejected' } : r))}
                            style={{ flex: 1, padding: '0.6rem', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="responsive-table-container" style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(var(--overlay-color), 0.02)', borderBottom: '1px solid var(--panel-border)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Email</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Date</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((req: any) => (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>{req.email}</td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{req.date}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: req.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : req.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: req.status === 'Pending' ? '#eab308' : req.status === 'Approved' ? 'var(--success)' : 'var(--danger)' }}>
                              {req.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            {req.status === 'Pending' && (
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => setPendingRequests((prev: any) => prev.map((r: any) => r.id === req.id ? { ...r, status: 'Approved' } : r))}
                                  style={{ padding: '0.4rem 0.8rem', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => setPendingRequests((prev: any) => prev.map((r: any) => r.id === req.id ? { ...r, status: 'Rejected' } : r))}
                                  style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No pending requests at this time.
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Role Editor Modal */}
      {isRoleModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '400px', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                {editingRole ? 'Edit Role Details' : 'Create New Role'}
              </h3>
              <button onClick={() => setIsRoleModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Role Name</label>
                <input 
                  type="text" 
                  defaultValue={editingRole?.name || ''}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(var(--overlay-color), 0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                  placeholder="e.g. Moderator"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Description</label>
                <textarea 
                  defaultValue={editingRole?.description || ''}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(var(--overlay-color), 0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                  placeholder="Describe what this role does..."
                />
              </div>

              {editingRole && (
                <div style={{ padding: '1rem', background: 'rgba(var(--overlay-color), 0.03)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Advanced Options</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                    Permissions for this role can be modified in the main Roles panel.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn-outline" onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
              <button className="btn" onClick={() => setIsRoleModalOpen(false)}>Save Role</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Mobile Role Editor Modal */}
      {isMobileScreen && mobileSelectedRole && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '1.5rem', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease', background: 'var(--panel-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {mobileView !== 'menu' && (
                  <button onClick={() => setMobileView('menu')} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', marginLeft: '-0.2rem' }}>
                    <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                )}
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {mobileView === 'menu' ? 'Role Settings' : mobileView === 'appearance' ? 'Appearance' : 'Permissions'}
                </h3>
              </div>
              
              {mobileView === 'menu' && (
                <button onClick={() => setMobileSelectedRole(null)} style={{ background: 'rgba(var(--overlay-color), 0.05)', borderRadius: '50%', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', marginRight: '-0.2rem' }}>
                  <X size={20} />
                </button>
              )}
            </div>

            {mobileView === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(var(--overlay-color), 0.03)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <img src="/logo-online.svg" alt="" style={{ width: '20px', height: '20px', filter: getRoleLogoFilter(mobileSelectedRole) }} />
                    <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{roles.find((r: any) => r.id === mobileSelectedRole)?.name}</h4>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {roles.find((r: any) => r.id === mobileSelectedRole)?.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    className="btn" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px' }}
                    onClick={() => { setMobileView('appearance'); }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Palette size={18} /> Appearance</span>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                  <button 
                    className="btn" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px' }}
                    onClick={() => setMobileView('permissions')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Shield size={18} /> Permissions</span>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                </div>
              </div>
            )}

            {mobileView === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Role Name</label>
                  <input 
                    type="text" 
                    defaultValue={roles.find((r: any) => r.id === mobileSelectedRole)?.name || ''}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(var(--overlay-color), 0.03)', border: '1px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Description</label>
                  <textarea 
                    defaultValue={roles.find((r: any) => r.id === mobileSelectedRole)?.description || ''}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(var(--overlay-color), 0.03)', border: '1px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn" onClick={() => setMobileView('menu')} style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}>Save Changes</button>
                </div>
              </div>
            )}

            {mobileView === 'permissions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {permissions.map(group => (
                  <div key={group.category} style={{ background: 'rgba(var(--overlay-color), 0.02)', borderRadius: '12px', border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', background: 'rgba(var(--overlay-color), 0.03)', borderBottom: '1px solid var(--panel-border)', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {group.categoryIcon || <Shield size={16} />}
                      {group.category}
                    </div>
                    <div style={{ padding: '0.5rem 0' }}>
                      {group.items.map((item, idx) => {
                        const isChecked = rolePermissions[mobileSelectedRole!][item];
                        const isImmutable = mobileSelectedRole === 'founder';
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: idx !== group.items.length - 1 ? '1px solid var(--panel-border)' : 'none' }}>
                            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{item}</span>
                            <div 
                              className={`toggle-switch ${isChecked ? 'active' : ''}`}
                              onClick={() => {
                                if (isImmutable) return;
                                setRolePermissions((prev: any) => ({
                                  ...prev,
                                  [mobileSelectedRole!]: {
                                    ...prev[mobileSelectedRole!],
                                    [item]: !prev[mobileSelectedRole!][item]
                                  }
                                }));
                              }}
                              style={{ opacity: isImmutable ? 0.5 : 1, cursor: isImmutable ? 'not-allowed' : 'pointer' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const SignInPage = ({ onSignIn, onRequestAccess }: { onSignIn: (role: string) => void, onRequestAccess: (email: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const email = emailRef.current?.value.toLowerCase() || '';
    const password = passwordRef.current?.value || '';

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        // Fallback to local auth to unblock development
        let role = 'user';
        if (email.includes('founder')) role = 'founder';
        else if (email.includes('admin')) role = 'admin';
        else if (email.includes('premium')) role = 'premium_user';
        localStorage.setItem('mockUserRole', role);
        onSignIn(role);
        return;
      }

      if (error.message.includes('Invalid login credentials')) {
        // Attempt to create the user automatically if they don't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          if (signUpError.message.includes('rate limit')) {
            let role = 'user';
            if (email.includes('founder')) role = 'founder';
            else if (email.includes('admin')) role = 'admin';
            else if (email.includes('premium')) role = 'premium_user';
            localStorage.setItem('mockUserRole', role);
            onSignIn(role);
            return;
          }
          setAuthError(signUpError.message);
        } else {
          setAuthError("Account created! You can now sign in (you may need to verify your email if required by Supabase).");
        }
      } else {
        setAuthError(error.message);
      }
    }
  };
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050505',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes aurora-1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(8vw, -8vh) scale(1.15) rotate(180deg); }
          100% { transform: translate(0, 0) scale(1) rotate(360deg); }
        }
        @keyframes aurora-2 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-8vw, 12vh) scale(1.2) rotate(-180deg); }
          100% { transform: translate(0, 0) scale(1) rotate(-360deg); }
        }
        @keyframes aurora-3 {
          0% { transform: translate(0, 0) scale(1.1) rotate(0deg); }
          50% { transform: translate(-12vw, -12vh) scale(0.9) rotate(90deg); }
          100% { transform: translate(0, 0) scale(1.1) rotate(180deg); }
        }
      `}</style>

      {/* Animated Aurora Background */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, animation: 'aurora-1 20s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(90px)', borderRadius: '50%', zIndex: 0, animation: 'aurora-2 25s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(70px)', borderRadius: '50%', zIndex: 0, animation: 'aurora-3 22s ease-in-out infinite alternate' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, animation: 'aurora-1 28s ease-in-out infinite reverse' }} />
      
      {/* Subtle Grid Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', zIndex: 1, maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)' }} />

      {/* Premium Glass Card */}
      <div className="animate-fade-in" style={{ 
        width: 'calc(100% - 2rem)', 
        maxWidth: '380px', 
        padding: '2rem', 
        borderRadius: '24px', 
        position: 'relative', 
        zIndex: 10, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.15) 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
              <img src="/logo-online.svg" alt="Logo" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Sign in to continue to GrowFinTool</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', display: 'flex' }}>
                <Mail size={16} />
              </div>
              <input 
                ref={emailRef}
                type="email" 
                required
                defaultValue="founder@growfin.com"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.2), inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#3b82f6'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#64748b'; }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowResetModal(true); }} style={{ color: '#10b981', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', display: 'flex' }}>
                <Lock size={16} />
              </div>
              <input 
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'} 
                required
                defaultValue="password123"
                style={{ width: '100%', padding: '0.75rem 2.5rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.2), inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#3b82f6'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#64748b'; }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          {authError && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {authError}
            </div>
          )}

          <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)', transition: 'all 0.2s', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
          >
            Sign In
          </button>
        </form>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }} 
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google
            </button>
            <button type="button" style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }} 
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <svg width="16" height="16" viewBox="0 0 384 512" fill="#ffffff"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-50-22.3-78.5-21.8-37.1.6-71.5 21.6-90.8 54.8-39.7 68.3-10.2 169.5 28.4 225.4 18.9 27.5 41.5 58.2 71.5 57 28.9-1.2 39.9-18.9 74.8-18.9 34.6 0 44.8 18.9 75.3 18.4 31.4-.5 50.7-28.5 69-55.7 21.3-31.5 30.1-62 30.7-63.5-1.1-.4-43-16.1-43.2-89zM250.7 87.2C267.4 66.8 277 39.4 273.7 12 250 13 221 27.3 203.4 47.7c-15.6 18-27 45.6-22.8 72 25.4 2 51.5-14.7 70.1-32.5z"/></svg>
              Apple
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setShowRequestAccessModal(true); }} style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>Request Access</a>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Reset Password</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
              Please contact your system administrator to reset your password.
            </p>
            <button 
              onClick={() => setShowResetModal(false)}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Request Access Modal */}
      {showRequestAccessModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Request Access</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
              Enter your email address to request an account.
            </p>
            <div style={{ position: 'relative', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', display: 'flex' }}>
                <Mail size={16} />
              </div>
              <input 
                id="request-access-email"
                type="email" 
                placeholder="Email address"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.2), inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#10b981'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'; (e.target.previousSibling as HTMLElement).style.color = '#64748b'; }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowRequestAccessModal(false)}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const email = (document.getElementById('request-access-email') as HTMLInputElement)?.value;
                  if (email) {
                    onRequestAccess(email);
                    setShowRequestAccessModal(false);
                  }
                }}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
    'founder': {
      'Manage Roles': true, 'System Settings': true, 'View Dashboard': true
    },
    'admin': {
      'Manage Roles': false, 'System Settings': true, 'View Dashboard': true
    },
    'premium_user': {
      'Manage Roles': false, 'System Settings': false, 'View Dashboard': true
    },
    'user': {
      'Manage Roles': false, 'System Settings': false, 'View Dashboard': true
    }
  });
  const [roles, setRoles] = useState([
    { id: 'founder', name: 'Founder', description: 'The highest level of system authority, acting as the ultimate owner of the platform.' },
    { id: 'admin', name: 'Admin', description: 'High-level operational management, responsible for day-to-day platform governance and user moderation.' },
    { id: 'premium_user', name: 'Premium User', description: 'Elevated user status granted access to advanced or monetized platform capabilities.' },
    { id: 'user', name: 'User', description: 'Baseline platform participant.' }
  ]);
  const [pendingRequests, setPendingRequests] = useState<{id: string, email: string, date: string, status: 'Pending' | 'Approved' | 'Rejected'}[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState('founder');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
  
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
  const [systemManagerSection, setSystemManagerSection] = useState(() => localStorage.getItem('systemManagerSection') || 'appearance');
  
  useEffect(() => {
    localStorage.setItem('systemManagerSection', systemManagerSection);
  }, [systemManagerSection]);
  const [appWidth, setAppWidth] = useState(95);
  const [appHeight, setAppHeight] = useState(92);
  const [appRadius, setAppRadius] = useState(20);
  const [appBgOverride, setAppBgOverride] = useState('');
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockRole = localStorage.getItem('mockUserRole');
    if (mockRole) {
      setCurrentUserRole(mockRole);
      setIsAuthenticated(true);
      setIsInitializing(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        const email = session.user.email || '';
        let role = 'user';
        if (email.includes('founder')) role = 'founder';
        else if (email.includes('admin')) role = 'admin';
        else if (email.includes('premium')) role = 'premium_user';
        setCurrentUserRole(role);
      }
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        const email = session.user.email || '';
        let role = 'user';
        if (email.includes('founder')) role = 'founder';
        else if (email.includes('admin')) role = 'admin';
        else if (email.includes('premium')) role = 'premium_user';
        setCurrentUserRole(role);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const topNavItems: any[] = [];
  const bottomNavItems: any[] = [];
  
  APP_MODULES.forEach(module => {
    const subItems = module.items
      .filter(item => rolePermissions[currentUserRole]?.[item.permission])
      .map(item => ({ id: item.id, label: item.label, icon: item.icon }));
    
    if (subItems.length > 0) {
      const targetArray = module.placement === 'bottom' ? bottomNavItems : topNavItems;
      if (module.isTopLevel && subItems.length === 1) {
        targetArray.push({
          id: subItems[0].id,
          label: module.label,
          icon: module.icon
        });
      } else {
        targetArray.push({
          id: module.id,
          label: module.label,
          icon: module.icon,
          subItems
        });
      }
    }
  });

  const effectivelyCollapsed = isCollapsed && !isMobileMenuOpen;

  const renderNavItems = (items: any[]) => (
    items.map((item) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isExactActive = activeTab === item.id;
      const isChildActive = hasSubItems && item.subItems?.some((sub: any) => activeTab === sub.id);
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
                {item.subItems?.map((subItem: any) => (
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
    })
  );

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <SignInPage 
      onSignIn={(role) => {
        setCurrentUserRole(role);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
      }} 
      onRequestAccess={(email) => {
        setPendingRequests(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), email, date: new Date().toLocaleDateString(), status: 'Pending' }]);
      }}
    />;
  }

  return (
    <div className="app-container" style={isMobileScreen ? { width: '100vw', height: '100vh', borderRadius: 0, border: 'none' } : {
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
            <img src="/logo-online.svg" alt="GrowFinTool Logo" style={{ width: '24px', height: '24px', filter: getRoleLogoFilter(currentUserRole) }} id="mobile-header-logo-img" />
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
                <img src="/logo-online.svg" alt="GrowFinTool Logo" style={{ width: '24px', height: '24px', filter: getRoleLogoFilter(currentUserRole) }} id="sidebar-logo-img" />
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
            {renderNavItems(topNavItems)}
          </nav>
        </div>

        <div className="mt-auto" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          
          <nav className="nav-menu animate-fade-in delay-2" style={{ width: '100%' }}>
            {renderNavItems(bottomNavItems)}
          </nav>

          <div ref={menuRef} style={{ position: 'relative' }}>
            {isProfileMenuOpen && (
              <div className="profile-menu animate-fade-in">
                <div className="menu-item" style={{ padding: '0.75rem', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                    <User size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{roles.find(r => r.id === currentUserRole)?.name || 'User'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>View Profile</span>
                  </div>
                </div>
                <div className="menu-divider"></div>
                <a className="menu-item"><CreditCard size={14} /> Manage Subscription</a>
                <a className="menu-item"><HelpCircle size={14} /> Help & Support</a>
                <div className="menu-divider"></div>
                <a className="menu-item text-danger" onClick={async () => { localStorage.removeItem('mockUserRole'); await supabase.auth.signOut(); setIsProfileMenuOpen(false); setIsAuthenticated(false); }} style={{ cursor: 'pointer' }}><LogOut size={14} /> Log Out</a>
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
                  <span className="profile-name">Active Account</span>
                  <span className="profile-role">{roles.find(r => r.id === currentUserRole)?.name || 'User'}</span>
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
          <RoleManager rolePermissions={rolePermissions} setRolePermissions={setRolePermissions} roles={roles} setRoles={setRoles} pendingRequests={pendingRequests} setPendingRequests={setPendingRequests} isMobileScreen={isMobileScreen} />
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
                <div className="animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <Palette size={24} style={{ color: 'var(--text-main)' }} />
                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>Appearance Options</h2>
                  </div>
                  
                  <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                    
                    {!isMobileScreen && (
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
                    )}

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
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            <ImageIcon size={14} /> Configure Image
                          </button>
                          <button 
                            className="btn-outline" 
                            onClick={() => {
                              setBackgroundType('dark-black');
                              setCustomBgUrl('');
                            }}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
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
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-muted)' }}>
                  <Settings size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)' }}>General Settings</h2>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(var(--overlay-color), 0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Coming Soon</span>
                  </div>
                  <p>Core system configuration and defaults will be available here.</p>
                </div>
              ) : systemManagerSection === 'security' ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-muted)' }}>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
              {!isMobileScreen && (
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
              )}
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
