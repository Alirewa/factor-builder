'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

// SHA-256 hash of the valid license key (plaintext key is never stored in source).
// Default public key: FACTO-RSAZ0-PUBLI-CDEMO
// To use your own private key, replace this hash with: sha256(YOUR_KEY_WITHOUT_DASHES).toUpperCase()
const LICENSE_HASH = 'a4bf1cd2c38bcf136712461e45135b7e1f675b9eb5b30860b36d40790de03928';
const STORAGE_KEY  = 'fz_license_v1';

async function sha256(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const buffer  = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === LICENSE_HASH;
  } catch {
    return false;
  }
}

function storeUnlock(): void {
  try {
    localStorage.setItem(STORAGE_KEY, LICENSE_HASH);
  } catch { /* ignore */ }
}

interface Props {
  children: React.ReactNode;
}

export function LicenseGate({ children }: Props) {
  const [checked,  setChecked]  = useState(false);   // mount check done?
  const [unlocked, setUnlocked] = useState(false);
  const [code,     setCode]     = useState('');
  const [showCode, setShowCode] = useState(false);
  const [status,   setStatus]   = useState<'idle' | 'checking' | 'error'>('idle');
  const [shake,    setShake]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount — check localStorage
  useEffect(() => {
    if (isUnlocked()) {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  // Auto-focus input when gate shows
  useEffect(() => {
    if (checked && !unlocked) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [checked, unlocked]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const raw = code.replace(/-/g, '').toUpperCase().trim();
    if (!raw) return;

    setStatus('checking');
    const hash = await sha256(raw);

    if (hash === LICENSE_HASH) {
      storeUnlock();
      setStatus('idle');
      setUnlocked(true);
    } else {
      setStatus('error');
      setShake(true);
      setTimeout(() => { setShake(false); setStatus('idle'); }, 600);
    }
  };

  // Format input: auto-insert dashes every 5 chars
  const handleChange = (val: string) => {
    const raw = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
    const formatted = raw.match(/.{1,5}/g)?.join('-') ?? raw;
    setCode(formatted);
    if (status === 'error') setStatus('idle');
  };

  // Don't flash gate before localStorage check
  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        fontFamily: 'Vazirmatn, system-ui, sans-serif',
        direction: 'rtl',
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm"
        style={{
          animation: shake ? 'shake 0.5s ease' : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-8px); }
            40%      { transform: translateX(8px); }
            60%      { transform: translateX(-6px); }
            80%      { transform: translateX(6px); }
          }
          @keyframes pulse-ring {
            0%   { transform: scale(1);    opacity: 0.6; }
            100% { transform: scale(1.35); opacity: 0;   }
          }
        `}</style>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            {/* Icon */}
            <div className="relative inline-flex mb-5">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(99, 102, 241, 0.3)',
                  animation: 'pulse-ring 2s ease-out infinite',
                }}
              />
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              >
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1
              className="text-xl font-bold text-white mb-1"
              style={{ letterSpacing: '-0.01em' }}
            >
              فاکتورساز اختصاصی
            </h1>
            <p className="text-sm text-slate-400">
              برای دسترسی، کد لایسنس خود را وارد کنید
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 2rem' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-4">
            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-2"
                htmlFor="license-input"
              >
                کد لایسنس (۲۰ کاراکتر)
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="license-input"
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 0.875rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: `1.5px solid ${status === 'error' ? '#ef4444' : 'rgba(99,102,241,0.35)'}`,
                    borderRadius: '0.625rem',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.08em',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    direction: 'ltr',
                    textAlign: 'center',
                  }}
                  onFocus={(e) => {
                    if (status !== 'error')
                      e.target.style.borderColor = 'rgba(99,102,241,0.7)';
                  }}
                  onBlur={(e) => {
                    if (status !== 'error')
                      e.target.style.borderColor = 'rgba(99,102,241,0.35)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCode((v) => !v)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showCode
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye    className="w-4 h-4" />}
                </button>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-1.5 mt-2 text-red-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>کد لایسنس نامعتبر است. لطفاً دوباره بررسی کنید.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'checking' || code.replace(/-/g,'').length < 20}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.625rem',
                border: 'none',
                background: status === 'checking'
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: 'Vazirmatn, system-ui, sans-serif',
                cursor: status === 'checking' || code.replace(/-/g,'').length < 20
                  ? 'not-allowed'
                  : 'pointer',
                opacity: code.replace(/-/g,'').length < 20 ? 0.5 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              {status === 'checking' ? 'در حال بررسی...' : 'ورود به برنامه'}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '0.875rem 2rem',
              textAlign: 'center',
            }}
          >
            <p className="text-[11px] text-slate-600">
              این نرم‌افزار دارای لایسنس اختصاصی است
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
