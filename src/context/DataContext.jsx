import { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_ESTABLISHMENTS, INITIAL_PERMITS } from '../data/seed';
import {
  INITIAL_HEALTH_CARDS,
  getBusinessCompliance,
  getPersonalCompliance,
} from '../data/healthCards';

const DataContext = createContext(null);

const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const oneYearFrom = (d) => {
  const n = new Date(d);
  n.setFullYear(n.getFullYear() + 1);
  return n;
};

let nextLogId = 1;

export function DataProvider({ children }) {
  const [establishments, setEstablishments] = useState(INITIAL_ESTABLISHMENTS);
  const [permits, setPermits] = useState(INITIAL_PERMITS);
  const [healthCards, setHealthCards] = useState(INITIAL_HEALTH_CARDS);
  const [logbook, setLogbook] = useState([]);

  const logEntry = useCallback((category, action, description) => {
    setLogbook((prev) => [
      { id: nextLogId++, category, action, description, timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  const permitLogCategory = (permit) =>
    permit.category === 'Business' ? 'Sanitary Permit Business' : 'Sanitary Permit';

  const checkPermitCompliance = useCallback(
    (permit) =>
      permit.category === 'Business'
        ? getBusinessCompliance(permit.name, healthCards)
        : getPersonalCompliance(permit.holder, healthCards),
    [healthCards]
  );

  /* ---------- Establishments ---------- */

  const addEstablishment = useCallback((data) => {
    setEstablishments((prev) => {
      const id = Math.max(0, ...prev.map((e) => e.id)) + 1;
      return [{ ...data, id }, ...prev];
    });
  }, []);

  const updateEstablishment = useCallback((id, data) => {
    setEstablishments((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }, []);

  /* ---------- Permits ---------- */

  const addPermit = useCallback(
    (form) => {
      const id = Math.max(0, ...permits.map((p) => p.id)) + 1;
      const name = form.category === 'Business' ? form.name : form.holder;
      const permit = {
        id,
        permitNo: `HP-2026-${String(id).padStart(3, '0')}`,
        category: form.category,
        name,
        holder: form.category === 'Personal' ? form.holder : null,
        address: form.category === 'Business' ? form.address || 'Pending address' : '—',
        owner: form.category === 'Business' ? form.owner : null,
        issued: '—',
        expires: '—',
        status: 'Pending',
      };
      setPermits((prev) => [permit, ...prev]);
      logEntry(
        permitLogCategory(permit),
        'Created',
        `New ${form.category === 'Business' ? 'business' : 'personal'} sanitary permit application recorded for ${name}.`
      );
      return permit;
    },
    [permits, logEntry]
  );

  /** Returns { ok, message } — does not mutate state if compliance fails. */
  const approvePermit = useCallback(
    (id) => {
      const permit = permits.find((p) => p.id === id);
      if (!permit) return { ok: false, message: 'Permit not found.' };
      const compliance = checkPermitCompliance(permit);
      if (!compliance.compliant) {
        const detail =
          permit.category === 'Business'
            ? compliance.total === 0
              ? 'no employee health cards are on file yet.'
              : `${compliance.total - compliance.validCount} of ${compliance.total} employee health card(s) are missing or expired.`
            : "the holder's own health card is missing or expired.";
        return { ok: false, message: `Cannot approve ${permit.permitNo} — ${detail}` };
      }
      const today = new Date();
      setPermits((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'Active', issued: fmt(today), expires: fmt(oneYearFrom(today)) } : p
        )
      );
      logEntry(permitLogCategory(permit), 'Approved', `${permit.permitNo} (${permit.name}) approved and set Active.`);
      return { ok: true, message: `${permit.permitNo} approved — all health card checks passed.` };
    },
    [permits, checkPermitCompliance, logEntry]
  );

  const renewPermit = useCallback(
    (id) => {
      const permit = permits.find((p) => p.id === id);
      if (!permit) return { ok: false, message: 'Permit not found.' };
      const compliance = checkPermitCompliance(permit);
      if (!compliance.compliant) {
        const detail =
          permit.category === 'Business'
            ? compliance.total === 0
              ? 'no employee health cards are on file yet.'
              : `${compliance.total - compliance.validCount} of ${compliance.total} employee health card(s) are missing or expired.`
            : "the holder's own health card is missing or expired.";
        return { ok: false, message: `Cannot renew ${permit.permitNo} — ${detail}` };
      }
      const today = new Date();
      setPermits((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'Active', issued: fmt(today), expires: fmt(oneYearFrom(today)) } : p
        )
      );
      logEntry(permitLogCategory(permit), 'Renewed', `${permit.permitNo} (${permit.name}) renewed for another year.`);
      return { ok: true, message: `${permit.permitNo} renewed for another year.` };
    },
    [permits, checkPermitCompliance, logEntry]
  );

  const deletePermit = useCallback(
    (id) => {
      const permit = permits.find((p) => p.id === id);
      setPermits((prev) => prev.filter((p) => p.id !== id));
      if (permit) {
        logEntry(permitLogCategory(permit), 'Deleted', `${permit.permitNo} (${permit.name}) removed from records.`);
      }
    },
    [permits, logEntry]
  );

  const rejectPermit = useCallback(
    (id, reason) => {
      const permit = permits.find((p) => p.id === id);
      setPermits((prev) => prev.filter((p) => p.id !== id));
      if (permit) {
        logEntry(
          permitLogCategory(permit),
          'Rejected',
          `${permit.permitNo} (${permit.name}) application rejected${reason ? `: ${reason}` : '.'}`
        );
      }
    },
    [permits, logEntry]
  );

  /* ---------- Health Cards ---------- */

  const addHealthCard = useCallback(
    (form) => {
      const id = Math.max(0, ...healthCards.map((c) => c.id)) + 1;
      const today = new Date();
      const card = {
        id,
        cardNo: `HC-2026-${String(id).padStart(3, '0')}`,
        holder: form.holder,
        type: form.type,
        establishment: form.type === 'Employee' ? form.establishment : null,
        issued: fmt(today),
        expires: fmt(oneYearFrom(today)),
        status: 'Pending Confirmation',
      };
      setHealthCards((prev) => [card, ...prev]);
      logEntry('Health Card', 'Created', `Health card application recorded for ${form.holder}.`);
      return card;
    },
    [healthCards, logEntry]
  );

  const confirmHealthCard = useCallback(
    (id) => {
      const card = healthCards.find((c) => c.id === id);
      setHealthCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Valid' } : c)));
      if (card) {
        logEntry('Health Card', 'Confirmed', `${card.cardNo} (${card.holder}) confirmed and marked Valid.`);
      }
    },
    [healthCards, logEntry]
  );

  const deleteHealthCard = useCallback(
    (id) => {
      const card = healthCards.find((c) => c.id === id);
      setHealthCards((prev) => prev.filter((c) => c.id !== id));
      if (card) {
        logEntry('Health Card', 'Deleted', `${card.cardNo} (${card.holder}) removed from records.`);
      }
    },
    [healthCards, logEntry]
  );

  const rejectHealthCard = useCallback(
    (id, reason) => {
      const card = healthCards.find((c) => c.id === id);
      setHealthCards((prev) => prev.filter((c) => c.id !== id));
      if (card) {
        logEntry('Health Card', 'Rejected', `${card.cardNo} (${card.holder}) application rejected${reason ? `: ${reason}` : '.'}`);
      }
    },
    [healthCards, logEntry]
  );

  const value = {
    establishments,
    addEstablishment,
    updateEstablishment,
    permits,
    addPermit,
    approvePermit,
    renewPermit,
    deletePermit,
    rejectPermit,
    checkPermitCompliance,
    healthCards,
    addHealthCard,
    confirmHealthCard,
    deleteHealthCard,
    rejectHealthCard,
    logbook,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
