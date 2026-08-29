import { useState } from 'react';
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
  Activity
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <PieChart size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'cards', label: 'Cards', icon: <CreditCard size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const transactions = [
    { id: 1, name: 'Stripe Deposit', type: 'incoming', amount: '+$4,500.00', date: 'Today, 10:42 AM', icon: <Building size={20} className="text-blue-400" /> },
    { id: 2, name: 'AWS Cloud Services', type: 'outgoing', amount: '-$120.50', date: 'Yesterday, 2:15 PM', icon: <Activity size={20} className="text-red-400" /> },
    { id: 3, name: 'Team Salaries', type: 'outgoing', amount: '-$12,450.00', date: 'Aug 25, 9:00 AM', icon: <Wallet size={20} className="text-purple-400" /> },
    { id: 4, name: 'Q3 Investment Dividend', type: 'incoming', amount: '+$850.00', date: 'Aug 22, 11:30 AM', icon: <TrendingUp size={20} className="text-green-400" /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo animate-fade-in delay-1" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
          <div className="logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src="/logo.svg" alt="GrowFinTool Logo" style={{ width: '32px', height: '32px', filter: 'var(--logo-filter)' }} />
          </div>
          {!isCollapsed && <span className="sidebar-text">GrowFinTool</span>}
        </div>
        
        <nav className="nav-menu animate-fade-in delay-2" style={{ marginTop: '2rem' }}>
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </a>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto animate-fade-in delay-3" style={{ marginTop: 'auto' }}>
            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Upgrade to Pro</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Get access to advanced analytics.</p>
              <button className="btn" style={{ width: '100%', padding: '0.5rem' }}>Upgrade</button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header animate-fade-in">
          <div>
            <h1>Overview</h1>
            <p>Welcome back, here's your financial summary.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <Search size={18} />
              <span style={{ color: 'var(--text-muted)' }}>Search...</span>
            </button>
            <div className="icon-box" style={{ cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-main)" />
            </div>
            <div className="user-profile">
              <div className="avatar"></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Alex M.</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid animate-fade-in delay-1">
          {/* Total Balance */}
          <div className="glass-card">
            <h3>Total Balance</h3>
            <div className="metric-value">
              $124,562.00
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span className="trend up" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowUpRight size={16} /> 12.5%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs last month</span>
            </div>
          </div>

          {/* Income */}
          <div className="glass-card">
            <h3>Monthly Income</h3>
            <div className="metric-value" style={{ color: 'var(--success)' }}>
              $34,210.50
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span className="trend up" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowUpRight size={16} /> 4.2%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs last month</span>
            </div>
          </div>

          {/* Expenses */}
          <div className="glass-card">
            <h3>Monthly Expenses</h3>
            <div className="metric-value">
              $18,450.00
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span className="trend down" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowDownRight size={16} /> 1.8%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs last month</span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-card span-2 animate-fade-in delay-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Cash Flow Overview</h2>
              <select style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--panel-border)', padding: '0.5rem', borderRadius: '8px', outline: 'none' }}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card animate-fade-in delay-3" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Recent Activity</h2>
              <button className="btn-outline" style={{ border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}>View All</button>
            </div>
            <div className="transactions-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="icon-box">
                      {tx.icon}
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{tx.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: tx.type === 'incoming' ? 'var(--success)' : 'var(--text-main)' }}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
