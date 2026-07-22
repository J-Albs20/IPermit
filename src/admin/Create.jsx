import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import AdminShell from '../components/AdminShell';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';

const CERTIFICATES = [
  {
    key: 'Sanitary Permit',
    icon: 'permits',
    desc: 'Personal sanitary permit for an individual.',
  },
  {
    key: 'Sanitary Permit (Business)',
    icon: 'establishments',
    desc: 'Business sanitary permit for an establishment.',
  },
  {
    key: 'Health Certificate',
    icon: 'healthCard',
    desc: "An individual's health card / health certificate.",
  },
];

function StepDots({ step }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
              n <= step ? 'bg-indigo text-white' : 'bg-line text-muted'
            }`}
          >
            {n}
          </div>
          {n < 3 && <div className={`h-0.5 w-8 ${n < step ? 'bg-indigo' : 'bg-line'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Create() {
  const { addPermit, addHealthCard } = useData();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();

  const [step, setStep] = useState(1);
  const [certificate, setCertificate] = useState(null);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState(null);

  const reset = () => {
    setStep(1);
    setCertificate(null);
    setName('');
    setBusinessType(null);
  };

  const selectCertificate = (key) => {
    setCertificate(key);
    setStep(2);
  };

  const submit = () => {
    if (certificate === 'Health Certificate') {
      addHealthCard({ holder: name, type: 'Personal' });
      showToast(`Health certificate application recorded for ${name}.`);
      navigate('/incoming-health-cards');
      return;
    }
    if (certificate === 'Sanitary Permit (Business)') {
      addPermit({ category: 'Business', name, owner: name, address: `${businessType || 'Food'} establishment` });
    } else {
      addPermit({ category: 'Personal', holder: name });
    }
    showToast(`${certificate} application recorded for ${name}.`);
    navigate('/incoming-sanitary-permits');
  };

  return (
    <AdminShell hideAction>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Create</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Start a new sanitary permit or health certificate application.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-line bg-card p-6">
        <StepDots step={step} />

        {/* Step 1: Select Certificate */}
        {step === 1 && (
          <>
            <p className="mb-4 text-[14px] font-bold text-ink">Select Certificate</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CERTIFICATES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => selectCertificate(c.key)}
                  className="flex flex-col items-start rounded-xl border border-line p-4 text-left hover:border-indigo hover:bg-indigo-light"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-light">
                    <Icon name={c.icon} size={16} color="#4F46E5" />
                  </div>
                  <p className="text-[13px] font-bold text-ink">{c.key}</p>
                  <p className="mt-1 text-[11px] text-muted">{c.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Input the name of the Establishment / Holder */}
        {step === 2 && (
          <>
            <p className="mb-1 text-[14px] font-bold text-ink">
              {certificate === 'Sanitary Permit (Business)'
                ? 'Input the name of the Establishment'
                : 'Input the holder\u2019s full name'}
            </p>
            <p className="mb-4 text-[12px] text-muted">Selected: {certificate}</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                certificate === 'Sanitary Permit (Business)' ? 'e.g. Jollibee San Carlos' : 'e.g. Juan Dela Cruz'
              }
              className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink"
              >
                Back
              </button>
              <button
                disabled={!name.trim()}
                onClick={() => (certificate === 'Sanitary Permit (Business)' ? setStep(3) : submit())}
                className="rounded-lg bg-indigo px-4 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-40"
              >
                {certificate === 'Sanitary Permit (Business)' ? 'Continue' : 'Submit Application'}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Food / Non-Food */}
        {step === 3 && (
          <>
            <p className="mb-1 text-[14px] font-bold text-ink">Establishment Classification</p>
            <p className="mb-4 text-[12px] text-muted">Applies for {name}</p>
            <div className="grid grid-cols-2 gap-3">
              {['Food', 'Non-Food'].map((t) => (
                <button
                  key={t}
                  onClick={() => setBusinessType(t)}
                  className={`rounded-xl border p-4 text-left ${
                    businessType === t ? 'border-indigo bg-indigo-light' : 'border-line hover:bg-bg'
                  }`}
                >
                  <p className={`text-[13px] font-bold ${businessType === t ? 'text-indigo' : 'text-ink'}`}>{t}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink"
              >
                Back
              </button>
              <button
                disabled={!businessType}
                onClick={submit}
                className="rounded-lg bg-indigo px-4 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-40"
              >
                Submit Application
              </button>
            </div>
          </>
        )}
      </div>

      {step > 1 && (
        <button onClick={reset} className="mt-4 text-[11.5px] font-semibold text-muted underline">
          Start over
        </button>
      )}

      {Toast}
    </AdminShell>
  );
}
