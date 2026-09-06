import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { LogIn, UserPlus, X, Mail, Lock, User, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, registerUser, t } = useTransit();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 98401 55443');
  const [role, setRole] = useState('PASSENGER');
  const [agency, setAgency] = useState('MTC');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleFillDemoPassenger = () => {
    setEmail('passenger@pulsetransit.com');
    setPassword('password123');
    setMode('login');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@pulsetransit.com');
    setPassword('adminpassword');
    setMode('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (mode === 'login') {
      const res = await loginUser(email, password);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await registerUser({ name, email, password, phone, role, agency });
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg(res.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="flex items-center justify-center border-b border-slate-200 pb-3 gap-2">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t.login}</span>
          </button>

          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.register}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t.fullName}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Karthik Subramanian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t.emailAddress}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="passenger@pulsetransit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t.password}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t.phoneNo}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t.selectRole}</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white"
                  >
                    <option value="PASSENGER">Passenger</option>
                    <option value="DRIVER">Driver</option>
                    <option value="FLEET_ADMIN">Fleet Controller</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Agency</label>
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white"
                  >
                    <option value="MTC">MTC Chennai</option>
                    <option value="TNSTC">TNSTC Regional</option>
                    <option value="SETC">SETC Express</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : mode === 'login' ? t.signInNow : t.createAccountNow}</span>
          </button>
        </form>

        {/* Demo Login Shortcuts */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-xs text-slate-500 font-medium text-center">Quick Demo Credentials:</div>
          <div className="flex gap-2">
            <button
              onClick={handleFillDemoPassenger}
              className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold transition"
            >
              Passenger Login
            </button>
            <button
              onClick={handleFillDemoAdmin}
              className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold transition"
            >
              Fleet Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
