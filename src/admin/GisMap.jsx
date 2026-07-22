import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip } from 'react-leaflet';
import Badge from '../components/Badge';
import AdminShell from '../components/AdminShell';

// ⚠️ Placeholder coordinates. San Carlos City center is approximate
// (San Carlos City, Pangasinan, PH). The establishment and barangay
// positions below are fabricated offsets around that center for demo
// purposes — replace with real geocoded addresses / barangay boundary
// data (GeoJSON) when you have them.
const CITY_CENTER = [10.487762714679034, 123.42574708482755];

const STATUS_COLOR = {
  Active: '#16A34A',
  Pending: '#D97706',
  Expiring: '#D97706',
  Expired: '#E11D48',
};

const ESTABLISHMENTS = [
  {
    name: 'Jollibee San Carlos',
    address: 'Corners St, Brgy. IV',
    status: 'Active',
    position: [15.9312, 120.3465],
  },
  {
    name: 'Sunshine Eatery',
    address: 'Burgos Ave, Brgy. II',
    status: 'Pending',
    position: [15.9251, 120.3518],
  },
  {
    name: 'Pala Sizzler',
    address: 'Portales, Brgy. III',
    status: 'Expired',
    position: [15.9268, 120.3441],
  },
  {
    name: "Carmel's Restaurant",
    address: 'Burgos Ave, Brgy. II',
    status: 'Expiring',
    position: [15.9243, 120.3502],
  },
  {
    name: 'Mang Inasal San Carlos',
    address: 'Alcala St, Brgy. IV',
    status: 'Active',
    position: [15.9329, 120.3487],
  },
];

const BARANGAYS = [
  { name: 'Barangay I', pct: 95, color: '#16A34A', position: [15.9295, 120.3475], radius: 380 },
  { name: 'Barangay II', pct: 90, color: '#16A34A', position: [15.9248, 120.3510], radius: 420 },
  { name: 'Barangay III', pct: 89, color: '#16A34A', position: [15.9270, 120.3450], radius: 400 },
  { name: 'Barangay IV', pct: 61, color: '#D97706', position: [15.9320, 120.3475], radius: 440 },
  { name: 'Barangay V', pct: 38, color: '#E11D48', position: [15.9235, 120.3455], radius: 400 },
];

const FILTERS = ['All', 'Active', 'Pending', 'Expiring', 'Expired'];

function LegendCard() {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="mb-3 text-[13px] font-bold text-ink">Legend</p>

      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">
        Establishment status
      </p>
      <div className="mb-3 space-y-1.5">
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <div key={status} className="flex items-center">
            <span
              className="mr-2 h-2.5 w-2.5 rounded-full border border-white"
              style={{ backgroundColor: color }}
            />
            <span className="text-[12px] text-ink">{status}</span>
          </div>
        ))}
      </div>

      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">
        Barangay compliance
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center">
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green" />
          <span className="text-[12px] text-ink">≥ 85% compliant</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-yellow" />
          <span className="text-[12px] text-ink">50–84% compliant</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-red" />
          <span className="text-[12px] text-ink">&lt; 50% compliant</span>
        </div>
      </div>
    </div>
  );
}

function BarangayListCard() {
  return (
    <div className="mt-4 rounded-xl border border-line bg-card p-4">
      <p className="mb-3 text-[13px] font-bold text-ink">Compliance by Barangay</p>
      {BARANGAYS.map((b) => (
        <div key={b.name} className="mb-3 last:mb-0">
          <div className="mb-1 flex justify-between">
            <span className="text-[12.5px] font-semibold text-ink">{b.name}</span>
            <span className="text-[12.5px] font-bold" style={{ color: b.color }}>
              {b.pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${b.pct}%`, backgroundColor: b.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GisMap() {
  const [filter, setFilter] = useState('All');

  const visibleEstablishments =
    filter === 'All' ? ESTABLISHMENTS : ESTABLISHMENTS.filter((e) => e.status === filter);

  return (
    <AdminShell actionLabel="Add Marker">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">GIS Map</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Establishments and barangay compliance across San Carlos City
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${
              filter === f
                ? 'border-indigo bg-indigo text-white'
                : 'border-line bg-card text-muted hover:bg-bg'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:flex-1">
          <MapContainer
            center={CITY_CENTER}
            zoom={14}
            scrollWheelZoom
            style={{ height: '560px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Barangay compliance overlay (approximate circles — swap for real boundary GeoJSON later) */}
            {BARANGAYS.map((b) => (
              <Circle
                key={b.name}
                center={b.position}
                radius={b.radius}
                pathOptions={{
                  color: b.color,
                  fillColor: b.color,
                  fillOpacity: 0.15,
                  weight: 1.5,
                }}
              >
                <Tooltip direction="center" opacity={1} permanent={false}>
                  {b.name} — {b.pct}% compliant
                </Tooltip>
              </Circle>
            ))}

            {/* Establishment pins */}
            {visibleEstablishments.map((e) => (
              <CircleMarker
                key={e.name}
                center={e.position}
                radius={8}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: STATUS_COLOR[e.status],
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{e.name}</p>
                    <p style={{ fontSize: 11.5, color: '#8A8FA3', marginBottom: 6 }}>
                      {e.address}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: STATUS_COLOR[e.status],
                      }}
                    >
                      {e.status}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="lg:w-72">
          <LegendCard />
          <BarangayListCard />
        </div>
      </div>
    </AdminShell>
  );
}
