import React, { useState, useEffect } from 'react';
import { PotholeReport, Role, ReportStatus } from './types';
import { INITIAL_REPORTS } from './data';
import { Language, LANGUAGES, TRANSLATIONS } from './translations';
import RoleSelector from './components/RoleSelector';
import CitizenView from './components/CitizenView';
import EmergencyView from './components/EmergencyView';
import BbmpView from './components/BbmpView';
import PulsePathLogo from './components/PulsePathLogo';
import { AlertTriangle, User, Ambulance, Shield, LogOut, RefreshCw, Layers, Sparkles, Sun, Moon, Globe } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('pulsepath_active_role');
    return (savedRole as Role) || null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('pulsepath_theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('pulsepath_language');
    return (savedLang as Language) || 'en';
  });

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isAlert?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pulsepath_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pulsepath_language', language);
  }, [language]);

  const [reports, setReports] = useState<PotholeReport[]>(() => {
    const saved = localStorage.getItem('pulsepath_reports_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to restore reports DB:', err);
      }
    }
    return INITIAL_REPORTS;
  });

  const changeRoleHandler = (role: Role) => {
    setCurrentRole(role);
    if (role) {
      localStorage.setItem('pulsepath_active_role', role);
    } else {
      localStorage.removeItem('pulsepath_active_role');
      localStorage.removeItem('pulsepath_logged_user_email');
      localStorage.removeItem('pulsepath_logged_user_label');
    }
  };

  const getActiveProfileDetails = () => {
    const email = localStorage.getItem('pulsepath_logged_user_email') || 'auditor@pulsepath.in';
    const label = localStorage.getItem('pulsepath_logged_user_label') || 'Authorized Guest';
    return { email, label };
  };

  const activeProfile = getActiveProfileDetails();

  const handleAddReport = (newReport: PotholeReport) => {
    setReports((prev) => {
      const updated = [newReport, ...prev];
      localStorage.setItem('pulsepath_reports_db', JSON.stringify(updated));
      return updated;
    });
  };

  const handleChangeStatus = (id: string, nextStatus: ReportStatus) => {
    setReports((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      );
      localStorage.setItem('pulsepath_reports_db', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteReport = (id: string) => {
    setDialog({
      isOpen: true,
      title: TRANSLATIONS[language].deleteReportBtn || "Confirm Delete",
      message: TRANSLATIONS[language].confirmDeleteReport,
      confirmText: TRANSLATIONS[language].deleteReportBtn || "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        setReports((prev) => {
          const updated = prev.filter((item) => item.id !== id);
          localStorage.setItem('pulsepath_reports_db', JSON.stringify(updated));
          return updated;
        });
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteAllResolved = () => {
    const resolvedCount = reports.filter((item) => item.status === 'resolved').length;
    if (resolvedCount === 0) {
      setDialog({
        isOpen: true,
        title: "Info",
        message: TRANSLATIONS[language].noActiveReportsToDelete,
        confirmText: "OK",
        onConfirm: () => {
          setDialog(prev => ({ ...prev, isOpen: false }));
        },
        isAlert: true
      });
      return;
    }

    setDialog({
      isOpen: true,
      title: TRANSLATIONS[language].deleteAllResolvedBtn || "Delete Resolved",
      message: TRANSLATIONS[language].confirmDeleteAllResolved,
      confirmText: TRANSLATIONS[language].deleteAllResolvedBtn || "Delete All",
      cancelText: "Cancel",
      onConfirm: () => {
        setReports((prev) => {
          const updated = prev.filter((item) => item.status !== 'resolved');
          localStorage.setItem('pulsepath_reports_db', JSON.stringify(updated));
          return updated;
        });
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const resetToFactoryDefault = () => {
    setDialog({
      isOpen: true,
      title: (TRANSLATIONS[language].appName || "PulsePath") + " Reset",
      message: TRANSLATIONS[language].resetBtn,
      confirmText: "Reset",
      cancelText: "Cancel",
      onConfirm: () => {
        setReports(INITIAL_REPORTS);
        localStorage.setItem('pulsepath_reports_db', JSON.stringify(INITIAL_REPORTS));
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Render current active view
  const renderDashboard = () => {
    switch (currentRole) {
      case 'citizen':
        return <CitizenView onAddReport={handleAddReport} existingCount={reports.length} language={language} />;
      case 'emergency':
        return <EmergencyView reports={reports} onAddReport={handleAddReport} language={language} theme={theme} />;
      case 'bbmp':
        return (
          <BbmpView
            reports={reports}
            onChangeStatus={handleChangeStatus}
            onDeleteReport={handleDeleteReport}
            onDeleteAllResolved={handleDeleteAllResolved}
            language={language}
          />
        );
      default:
        return <RoleSelector onSelectRole={changeRoleHandler} language={language} />;
    }
  };

  return (
    <div id="app_root" className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col justify-between transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Decorative Interactive Aurora Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft floating tech grid overlay */}
        <div className="absolute inset-0 tech-grid-bg opacity-[0.8] dark:opacity-[0.6]" />
        
        {/* Colorful dynamic aurora blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-cyan-300/15 dark:bg-cyan-500/5 blur-[90px] sm:blur-[150px] animate-aurora-1" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-300/12 dark:bg-emerald-500/4 blur-[100px] sm:blur-[160px] animate-aurora-2" />
        <div className="absolute top-[35%] right-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-rose-300/12 dark:bg-rose-500/4 blur-[80px] sm:blur-[130px] animate-aurora-3" />
        <div className="absolute bottom-[5%] left-[15%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full bg-amber-300/10 dark:bg-amber-500/3 blur-[90px] sm:blur-[140px] animate-aurora-1" style={{ animationDelay: '-7s' }} />
      </div>

      {/* GLOBAL LOBBY FLOATING THEME & LANG TOGGLER */}
      {!currentRole && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
          <div className="flex items-center gap-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 rounded-full px-3 py-1.5 shadow-md text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <select
              id="lobby_language_select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-none outline-none pr-1 cursor-pointer font-medium focus:ring-0 text-stone-700 dark:text-stone-300"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
 
          <button
            id="lobby_theme_toggle_btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center cursor-pointer"
            title="Toggle theme mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-500 animate-pulse" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      )}
 
      {/* GLOBAL HEAD NAVIGATION BAR */}
      {currentRole && (
        <header id="app_header" className="bg-stone-950/90 text-stone-100 border-b border-stone-800/80 sticky top-0 z-50 backdrop-blur-md relative z-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 flex-wrap sm:flex-nowrap gap-2 py-2 sm:py-0">
              {/* BRAND LEFT SECTION */}
              <div
                onClick={() => changeRoleHandler(null)}
                className="flex items-center gap-3 cursor-pointer group shrink-0"
                title="Return to lobby selection"
              >
                <div className="transition-transform group-hover:scale-105 duration-300">
                  <PulsePathLogo variant="header" className="h-9 w-auto" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black tracking-tight uppercase text-white leading-none font-display">
                      {TRANSLATIONS[language].appName}
                    </span>
                    <span className="hidden xl:inline-block text-[9px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-900/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Saving lives by clearing the path
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-stone-400 font-mono tracking-widest uppercase leading-none mt-1">
                    {TRANSLATIONS[language].appSubName}
                  </span>
                </div>
              </div>
 
              {/* DYNAMIC SHIFT SECTOR IN-PAGE CONTROLLER */}
              <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 p-1.5 rounded-xl text-xs">
                <span className="text-stone-500 font-mono px-1.5 hidden md:inline">{TRANSLATIONS[language].quickJump}</span>
                
                {/* Citizen Quick Jump */}
                <button
                  id="nav_jump_citizen"
                  onClick={() => changeRoleHandler('citizen')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    currentRole === 'citizen'
                      ? 'bg-sky-650/90 text-white font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{TRANSLATIONS[language].citizen}</span>
                </button>
 
                {/* Emergency Quick Jump */}
                <button
                  id="nav_jump_emergency"
                  onClick={() => changeRoleHandler('emergency')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    currentRole === 'emergency'
                      ? 'bg-cyan-650/90 text-white font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Ambulance className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{TRANSLATIONS[language].ambulance}</span>
                </button>
 
                {/* BBMP Quick Jump */}
                <button
                  id="nav_jump_bbmp"
                  onClick={() => changeRoleHandler('bbmp')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    currentRole === 'bbmp'
                      ? 'bg-amber-655/90 text-white font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{TRANSLATIONS[language].bbmp}</span>
                </button>
              </div>
 
              {/* UTILITY CONTROL RIGHT SECTION */}
              <div className="flex items-center gap-3">
                {/* Language selector dropdown inside logged header */}
                <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 text-stone-300 px-2.5 py-1 rounded-xl text-xs">
                  <Globe className="w-3.5 h-3.5 text-stone-500" />
                  <select
                    id="nav_language_select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-transparent border-none outline-none cursor-pointer font-bold focus:ring-0 text-white leading-none py-1"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-stone-950 text-white">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
 
                <div className="text-right hidden lg:block font-mono text-[10px]">
                  <p className="text-stone-300">
                    {activeProfile.label}: <span className="text-sky-400 font-semibold">{localStorage.getItem('pulsepath_logged_user_email') || 'bhanusuma1977@gmail.com'}</span>
                  </p>
                  <p className="text-[9px] text-stone-500">{TRANSLATIONS[language].activeNetwork}</p>
                </div>
 
                <div className="h-6 w-px bg-stone-800 hidden lg:block" />
 
                {/* Theme Switcher Button */}
                <button
                  id="nav_theme_toggle_btn"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-stone-900 flex items-center justify-center cursor-pointer"
                  title={`Switch to theme`}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
 
                {/* Reset button */}
                <button
                  onClick={resetToFactoryDefault}
                  className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-stone-900 cursor-pointer"
                  title="Reset database to original sample reports"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
 
                {/* Logout button */}
                <button
                  id="btn_logout_lobby"
                  onClick={() => changeRoleHandler(null)}
                  className="bg-stone-900 border border-stone-800 hover:bg-rose-950 hover:border-rose-900 text-stone-200 hover:text-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">{TRANSLATIONS[language].lobbyLogin}</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
 
      {/* CORE WORKER BODY VIEW */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {renderDashboard()}
      </main>
 
      {/* FOOTER BAR */}
      <footer id="global_app_footer" className="bg-white/70 dark:bg-stone-900/75 border-t border-stone-200/60 dark:border-stone-800/60 py-6 text-center text-xs text-stone-400 dark:text-stone-500 font-mono transition-colors duration-300 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p>© 2026 PulsePath Intelligent Infrastructure Solutions Corp.</p>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-sky-100 dark:border-sky-900/40">
              <Sparkles className="w-2.5 h-2.5 text-sky-500" /> {TRANSLATIONS[language].activeNetwork}
            </span>
            <span className="text-stone-400 dark:text-stone-500">bhanusuma1977@gmail.com</span>
          </div>
        </div>
      </footer>

      {/* Premium Custom Confirmation / Alert Modal */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <div 
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              if (!dialog.isAlert) {
                setDialog(prev => ({ ...prev, isOpen: false }));
              }
            }}
          />
          
          {/* Modal Panel with custom Golden Shining Border */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10 transition-all duration-300 golden-border-shining shadow-2xl animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-black tracking-tight text-stone-900 dark:text-stone-100 font-sans">
                  {dialog.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                  {dialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 border-t border-stone-100 dark:border-stone-800/80 pt-4">
              {!dialog.isAlert && (
                <button
                  type="button"
                  onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {dialog.cancelText || "Cancel"}
                </button>
              )}
              <button
                type="button"
                onClick={dialog.onConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-[#ffd700] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(244,63,94,0.3)] cursor-pointer"
              >
                {dialog.confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
