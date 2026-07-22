import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';

const NAV_MAIN = [
  { key: 'Dashboard', icon: 'dashboard', route: '/' },
  { key: 'Establishments', icon: 'establishments', route: '/establishments' },
  { key: 'Permits', icon: 'permits', route: '/permits' },
  { key: 'Health Cards', icon: 'healthCard', route: '/health-cards' },
  { key: 'Inspections', icon: 'inspections', route: '/inspections' },
  { key: 'GIS Map', icon: 'map', route: '/gis-map' },
];
const NAV_WORKFLOW = [
  { key: 'Create', icon: 'plus', route: '/create' },
  { key: 'Incoming Permits', icon: 'clipboard', route: '/incoming-sanitary-permits' },
  { key: 'Incoming Health Cards', icon: 'clipboard', route: '/incoming-health-cards' },
  { key: 'Transactions', icon: 'refresh', route: '/transactions' },
];
const NAV_REPORTS = [{ key: 'Notifications', icon: 'notifications', route: '/notifications' }];
const NAV_SYSTEM = [{ key: 'Settings', icon: 'settings', route: '/settings' }];

function NavItem({ item, onNavigate }) {
  const location = useLocation();
  const active = item.route === location.pathname;

  const content = (
    <>
      <Icon name={item.icon} size={17} color={active ? '#4F46E5' : '#8A8FA3'} />
      <span
        className={`ml-2.5 hidden text-[12.5px] font-medium lg:inline ${
          active ? 'font-bold text-indigo' : 'text-muted'
        }`}
      >
        {item.key}
      </span>
    </>
  );

  const className = `mb-0.5 flex items-center rounded-lg px-2 py-2.5 ${
    active ? 'bg-indigo-light' : 'hover:bg-bg'
  }`;

  if (item.route) {
    return (
      <Link to={item.route} onClick={onNavigate} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <div className={`${className} cursor-not-allowed opacity-60`} title="Coming soon">
      {content}
    </div>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const renderItem = (item) => <NavItem key={item.key} item={item} onNavigate={onNavigate} />;

  const handleLogout = () => {
    signOut();
    navigate('/login');
    onNavigate && onNavigate();
  };

  return (
    <div className="flex h-full w-16 flex-col border-r border-line bg-card px-2 pt-4 lg:w-56 lg:px-3">
      <div className="mb-5 flex items-center px-1">
        <div className="mr-2 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-indigo">
          <Icon name="shield" size={15} color="#fff" />
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-bold text-ink leading-tight">iPermit SC</p>
          <p className="text-[10px] text-muted leading-tight">San Carlos City CHO</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-1.5">{NAV_MAIN.map(renderItem)}</div>

        <p className="mb-1.5 ml-2 mt-3 hidden text-[10px] font-bold tracking-wide text-muted lg:block">
          WORKFLOW
        </p>
        <div className="mb-1.5">{NAV_WORKFLOW.map(renderItem)}</div>

        <p className="mb-1.5 ml-2 mt-3 hidden text-[10px] font-bold tracking-wide text-muted lg:block">
          REPORTS
        </p>
        <div className="mb-1.5">{NAV_REPORTS.map(renderItem)}</div>

        <p className="mb-1.5 ml-2 mt-3 hidden text-[10px] font-bold tracking-wide text-muted lg:block">
          SYSTEM
        </p>
        <div className="mb-1.5">{NAV_SYSTEM.map(renderItem)}</div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center border-t border-line px-1 py-3.5 text-left hover:bg-bg"
        title="Sign out"
      >
        <div className="mr-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo">
          <span className="text-[11px] font-bold text-white">AU</span>
        </div>
        <div className="hidden lg:block">
          <p className="text-xs font-bold text-ink leading-tight">{user?.name || 'Admin User'}</p>
          <p className="text-[10px] text-muted leading-tight">{user?.role || 'CHO Administrator'}</p>
        </div>
        <Icon name="logout" size={15} color="#8A8FA3" className="ml-auto hidden lg:block" />
      </button>
    </div>
  );
}
