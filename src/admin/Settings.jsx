import { useState } from 'react';
import Icon from '../components/Icon';
import Toggle from '../components/Toggle';
import AdminShell from '../components/AdminShell';

const SECTIONS = [
  { key: 'Profile', icon: 'user' },
  { key: 'Security', icon: 'security' },
  { key: 'Notifications', icon: 'notifications' },
  { key: 'Organization', icon: 'establishments' },
  { key: 'Users & Roles', icon: 'users' },
  { key: 'Permit Templates', icon: 'permits' },
  { key: 'GIS Settings', icon: 'map' },
  { key: 'Reports', icon: 'reports' },
  { key: 'Integrations', icon: 'integrations' },
];

/* ---------- shared bits ---------- */

function Card({ title, desc, children, onCancel, onSave, saveLabel = 'Save Changes' }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-[15px] font-bold text-ink">{title}</p>
      {desc && <p className="mt-1 text-[12px] text-muted">{desc}</p>}
      <div className="mt-5">{children}</div>
      {(onCancel || onSave) && (
        <div className="mt-5 flex justify-end gap-2.5">
          {onCancel && (
            <button className="rounded-lg border border-line bg-card px-4 py-2.5 text-[12.5px] font-semibold text-ink">
              Cancel
            </button>
          )}
          {onSave && (
            <button className="rounded-lg bg-indigo px-4 py-2.5 text-[12.5px] font-semibold text-white">
              {saveLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue, span, type = 'text' }) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
      />
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="pr-4">
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[11.5px] text-muted">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function StatusPill({ label, tone }) {
  const styles = {
    green: { bg: '#E7F7EC', color: '#16A34A' },
    yellow: { bg: '#FEF6E7', color: '#D97706' },
    red: { bg: '#FDECEF', color: '#E11D48' },
    indigo: { bg: '#EEF0FF', color: '#4F46E5' },
    grey: { bg: '#F3F4F8', color: '#8A8FA3' },
  }[tone];
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {label}
    </span>
  );
}

/* ---------- Profile ---------- */

function ProfileSection() {
  return (
    <Card
      title="Profile Information"
      desc="Update your account details and contact information."
      onCancel
      onSave
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" defaultValue="Admin" />
        <Field label="Last Name" defaultValue="User" />
        <Field label="Email Address" defaultValue="admin@sancarloscho.gov.ph" type="email" />
        <Field label="Phone Number" defaultValue="+63 900 000 0000" />
        <Field label="Role" defaultValue="CHO Administrator" />
        <Field label="Department" defaultValue="City Health Office" />
      </div>
    </Card>
  );
}

/* ---------- Security ---------- */

const SESSIONS = [
  { device: 'Chrome on Windows', location: 'San Carlos City, PH', current: true, lastActive: 'Active now' },
  { device: 'Safari on iPhone', location: 'San Carlos City, PH', current: false, lastActive: '2 hours ago' },
  { device: 'Chrome on Android', location: 'Dagupan City, PH', current: false, lastActive: '3 days ago' },
];

function SecuritySection() {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <>
      <Card title="Change Password" desc="Use a strong password you don't use elsewhere." onCancel onSave saveLabel="Update Password">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current Password" type="password" span />
          <Field label="New Password" type="password" />
          <Field label="Confirm New Password" type="password" />
        </div>
      </Card>

      <div className="mt-4 rounded-xl border border-line bg-card p-5">
        <p className="text-[15px] font-bold text-ink">Two-Factor Authentication</p>
        <p className="mt-1 text-[12px] text-muted">
          Add an extra layer of security to your account.
        </p>
        <div className="mt-2">
          <ToggleRow
            label="Require a verification code at sign-in"
            desc="We'll send a one-time code to your registered phone number"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-card p-5">
        <p className="text-[15px] font-bold text-ink">Active Sessions</p>
        <p className="mt-1 text-[12px] text-muted">Devices currently signed in to your account.</p>

        <div className="mt-3 divide-y divide-line">
          {SESSIONS.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-bg">
                  <Icon name="device" size={16} color="#8A8FA3" />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">
                    {s.device} {s.current && <span className="ml-1 text-[10.5px] font-bold text-indigo">This device</span>}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {s.location} · {s.lastActive}
                  </p>
                </div>
              </div>
              {!s.current && (
                <button className="flex items-center text-[11.5px] font-semibold text-red">
                  <Icon name="logout" size={14} color="#E11D48" />
                  <span className="ml-1.5">Log out</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Notifications ---------- */

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    permitExpiry: true,
    newApplications: true,
    inspectionReminders: true,
    complianceReports: false,
    systemUpdates: false,
  });

  const set = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }));

  return (
    <Card
      title="Notification Preferences"
      desc="Choose which events trigger notifications."
      onCancel={false}
      onSave
      saveLabel="Save Preferences"
    >
      <div className="divide-y divide-line">
        <ToggleRow
          label="Permit Expiry Alerts"
          desc="Notify 30 days before expiration"
          checked={prefs.permitExpiry}
          onChange={set('permitExpiry')}
        />
        <ToggleRow
          label="New Applications"
          desc="Alert when new permit applications are submitted"
          checked={prefs.newApplications}
          onChange={set('newApplications')}
        />
        <ToggleRow
          label="Inspection Reminders"
          desc="Remind inspectors 24 hours before scheduled visits"
          checked={prefs.inspectionReminders}
          onChange={set('inspectionReminders')}
        />
        <ToggleRow
          label="Compliance Reports"
          desc="Weekly compliance summary emails"
          checked={prefs.complianceReports}
          onChange={set('complianceReports')}
        />
        <ToggleRow
          label="System Updates"
          desc="Notifications for system maintenance and updates"
          checked={prefs.systemUpdates}
          onChange={set('systemUpdates')}
        />
      </div>
    </Card>
  );
}

/* ---------- Organization ---------- */

function OrganizationSection() {
  return (
    <Card title="Organization Settings" desc="Configure your CHO office details." onCancel onSave>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Organization Name" defaultValue="San Carlos City Health Office" />
        <Field label="Municipality / City" defaultValue="San Carlos City" />
        <Field label="Office Address" defaultValue="City Hall Compound, San Carlos City" span />
        <Field label="Contact Number" defaultValue="+63 900 000 0001" />
        <Field label="Office Email" defaultValue="cho@sancarloscho.gov.ph" type="email" />
      </div>
    </Card>
  );
}

/* ---------- Users & Roles ---------- */

const USERS = [
  { name: 'Admin User', email: 'admin@sancarloscho.gov.ph', role: 'CHO Administrator', status: 'Active' },
  { name: 'R. Dalisay', email: 'r.dalisay@sancarloscho.gov.ph', role: 'Inspector', status: 'Active' },
  { name: 'M. Vegas', email: 'm.vegas@sancarloscho.gov.ph', role: 'Inspector', status: 'Active' },
  { name: 'B. Leonar', email: 'b.leonar@sancarloscho.gov.ph', role: 'Inspector', status: 'Active' },
  { name: 'G. Garcia', email: 'g.garcia@sancarloscho.gov.ph', role: 'Inspector', status: 'Inactive' },
  { name: 'J. Santos', email: 'j.santos@sancarloscho.gov.ph', role: 'Records Clerk', status: 'Active' },
];

function UsersRolesSection() {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-bold text-ink">Users & Roles</p>
          <p className="mt-1 text-[12px] text-muted">Manage who has access to iPermit SC.</p>
        </div>
        <button className="flex items-center rounded-lg bg-indigo px-3.5 py-2.5 text-[12.5px] font-semibold text-white">
          <Icon name="invite" size={14} color="#fff" />
          <span className="ml-1.5">Invite User</span>
        </button>
      </div>

      <div className="mt-4 hidden md:block">
        <div className="mb-1 flex border-b border-line pb-2">
          <span className="flex-[1.6] text-[10.5px] font-bold text-muted">Name</span>
          <span className="flex-[1.8] text-[10.5px] font-bold text-muted">Email</span>
          <span className="flex-1 text-[10.5px] font-bold text-muted">Role</span>
          <span className="flex-1 text-[10.5px] font-bold text-muted">Status</span>
          <span className="flex-[0.6] text-right text-[10.5px] font-bold text-muted">Action</span>
        </div>
        {USERS.map((u, idx) => (
          <div key={u.email} className={`flex items-center py-3 ${idx < USERS.length - 1 ? 'border-b border-line' : ''}`}>
            <span className="flex-[1.6] text-[12.5px] font-semibold text-ink">{u.name}</span>
            <span className="flex-[1.8] text-[12.5px] text-muted">{u.email}</span>
            <span className="flex-1 text-[12.5px] text-muted">{u.role}</span>
            <div className="flex-1">
              <StatusPill label={u.status} tone={u.status === 'Active' ? 'green' : 'grey'} />
            </div>
            <div className="flex flex-[0.6] justify-end">
              <button>
                <Icon name="edit" size={15} color="#8A8FA3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 md:hidden">
        {USERS.map((u, idx) => (
          <div key={u.email} className={`py-3 ${idx < USERS.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-ink">{u.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">{u.email}</p>
                <p className="mt-1 text-[11px] text-muted">{u.role}</p>
              </div>
              <StatusPill label={u.status} tone={u.status === 'Active' ? 'green' : 'grey'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Permit Templates ---------- */

const TEMPLATES = [
  { name: 'Sanitary Permit — Food Service', updated: 'Updated May 2, 2026' },
  { name: 'Health Permit — General Establishment', updated: 'Updated Apr 18, 2026' },
  { name: 'Sanitary Permit — Market Stall', updated: 'Updated Mar 30, 2026' },
  { name: 'Health Certificate — Individual Worker', updated: 'Updated Feb 14, 2026' },
];

function PermitTemplatesSection() {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-bold text-ink">Permit Templates</p>
          <p className="mt-1 text-[12px] text-muted">
            Manage the document templates used when issuing permits.
          </p>
        </div>
        <button className="flex items-center rounded-lg bg-indigo px-3.5 py-2.5 text-[12.5px] font-semibold text-white">
          <Icon name="plus" size={14} color="#fff" />
          <span className="ml-1.5">New Template</span>
        </button>
      </div>

      <div className="mt-4 divide-y divide-line">
        {TEMPLATES.map((t) => (
          <div key={t.name} className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-light">
                <Icon name="file" size={16} color="#4F46E5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-ink">{t.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">{t.updated}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button>
                <Icon name="edit" size={15} color="#8A8FA3" />
              </button>
              <button className="ml-3">
                <Icon name="download" size={15} color="#8A8FA3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- GIS Settings ---------- */

function GisSettingsSection() {
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showPins, setShowPins] = useState(true);

  return (
    <Card title="GIS Settings" desc="Configure default behavior of the GIS Map screen." onCancel onSave>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Default Center Latitude" defaultValue="15.9284" />
        <Field label="Default Center Longitude" defaultValue="120.3489" />
        <Field label="Default Zoom Level" defaultValue="14" />
        <Field label="Tile Provider" defaultValue="OpenStreetMap" />
      </div>

      <div className="mt-2 divide-y divide-line border-t border-line">
        <ToggleRow
          label="Show barangay boundaries by default"
          desc="Display the compliance overlay when the map first loads"
          checked={showBoundaries}
          onChange={setShowBoundaries}
        />
        <ToggleRow
          label="Show establishment pins by default"
          desc="Display all establishment markers when the map first loads"
          checked={showPins}
          onChange={setShowPins}
        />
      </div>
    </Card>
  );
}

/* ---------- Reports ---------- */

const REPORTS = [
  { name: 'Monthly Compliance Report', desc: 'Barangay-level compliance summary for the current month', last: 'Last generated Jul 1, 2026' },
  { name: 'Permit Issuance Summary', desc: 'All permits issued, renewed, and expired in a date range', last: 'Last generated Jun 28, 2026' },
  { name: 'Inspection Performance Report', desc: 'Pass/fail rates and scores by inspector', last: 'Last generated Jun 15, 2026' },
  { name: 'Barangay Compliance Breakdown', desc: 'Detailed compliance percentages per barangay', last: 'Never generated' },
];

function ReportsSection() {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-[15px] font-bold text-ink">Reports</p>
      <p className="mt-1 text-[12px] text-muted">Generate and download system reports.</p>

      <div className="mt-4 divide-y divide-line">
        {REPORTS.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-3.5">
            <div className="pr-4">
              <p className="text-[13px] font-semibold text-ink">{r.name}</p>
              <p className="mt-0.5 text-[11.5px] text-muted">{r.desc}</p>
              <p className="mt-1 text-[10.5px] text-muted">{r.last}</p>
            </div>
            <button className="flex shrink-0 items-center rounded-lg border border-line bg-card px-3 py-2 text-[11.5px] font-semibold text-ink">
              <Icon name="download" size={14} color="#1F2430" />
              <span className="ml-1.5">Generate</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Integrations ---------- */

const INTEGRATIONS = [
  { name: 'SMS Gateway', desc: 'Send renewal and inspection reminders via SMS', icon: 'sms', connected: true },
  { name: 'Email Service', desc: 'Send notifications and reports via email', icon: 'mail', connected: true },
  { name: 'Payment Gateway', desc: 'Accept online permit fee payments', icon: 'payment', connected: false },
  { name: 'Maps / Geocoding API', desc: 'Convert establishment addresses into map coordinates', icon: 'map', connected: false },
];

function IntegrationsSection() {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-[15px] font-bold text-ink">Integrations</p>
      <p className="mt-1 text-[12px] text-muted">Connect iPermit SC to external services.</p>

      <div className="mt-4 divide-y divide-line">
        {INTEGRATIONS.map((i) => (
          <div key={i.name} className="flex items-center justify-between py-3.5">
            <div className="flex items-center">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-bg">
                <Icon name={i.icon} size={16} color="#8A8FA3" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-ink">{i.name}</p>
                <p className="mt-0.5 text-[11.5px] text-muted">{i.desc}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <StatusPill label={i.connected ? 'Connected' : 'Not connected'} tone={i.connected ? 'green' : 'grey'} />
              <button className="rounded-lg border border-line bg-card px-3 py-2 text-[11.5px] font-semibold text-ink">
                {i.connected ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- page ---------- */

const SECTION_COMPONENTS = {
  Profile: ProfileSection,
  Security: SecuritySection,
  Notifications: NotificationsSection,
  Organization: OrganizationSection,
  'Users & Roles': UsersRolesSection,
  'Permit Templates': PermitTemplatesSection,
  'GIS Settings': GisSettingsSection,
  Reports: ReportsSection,
  Integrations: IntegrationsSection,
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState('Profile');
  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <AdminShell hideAction>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-[12.5px] text-muted">Manage System Preferences</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="rounded-xl border border-line bg-card p-2 lg:w-56 lg:shrink-0 lg:self-start">
          {SECTIONS.map((s) => {
            const active = s.key === activeSection;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`mb-0.5 flex w-full items-center rounded-lg px-3 py-2.5 text-left last:mb-0 ${
                  active ? 'bg-indigo-light' : 'hover:bg-bg'
                }`}
              >
                <Icon name={s.icon} size={16} color={active ? '#4F46E5' : '#8A8FA3'} />
                <span
                  className={`ml-2.5 text-[12.5px] font-medium ${
                    active ? 'font-bold text-indigo' : 'text-ink'
                  }`}
                >
                  {s.key}
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 flex-1">
          <ActiveComponent />
        </div>
      </div>
    </AdminShell>
  );
}
