
import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Mail, Search, Download, CheckCircle, XCircle, Star, Shield, Send, X, Loader2, Sparkles, Wallet, Plus, Coins } from './Icons';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  subscription: 'None' | 'Single' | 'Master';
  joinedDate: string;
  lastPayment: string;
  allowMarketing: boolean;
  totalSpent: number;
  credits: number;
}

const AdminCRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'master' | 'marketing'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [creditAmount, setCreditAmount] = useState<string>('10');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [messageData, setMessageData] = useState({ subject: '', body: '' });
  
  // Simulert datagrunnlag for CRM
  const [users, setUsers] = useState<UserRecord[]>([
    { id: '1', name: 'Freddy Bremseth', email: 'freddy.bremseth@gmail.com', subscription: 'Master', joinedDate: '2025-01-01', lastPayment: '2025-05-15', allowMarketing: true, totalSpent: 49, credits: 200000 },
    { id: '2', name: 'Astrid Astrolog', email: 'astrid@stjernen.no', subscription: 'Single', joinedDate: '2025-02-14', lastPayment: '2025-02-14', allowMarketing: true, totalSpent: 14, credits: 5 },
    { id: '3', name: 'Ola Nordmann', email: 'ola@test.no', subscription: 'None', joinedDate: '2025-03-10', lastPayment: '-', allowMarketing: false, totalSpent: 0, credits: 0 },
    { id: '4', name: 'Kari Sjel', email: 'kari@mystisk.no', subscription: 'Master', joinedDate: '2025-01-20', lastPayment: '2025-01-20', allowMarketing: true, totalSpent: 49, credits: 100 },
  ]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'master') return matchesSearch && u.subscription === 'Master';
    if (filter === 'marketing') return matchesSearch && u.allowMarketing;
    return matchesSearch;
  });

  const marketingUsers = users.filter(u => u.allowMarketing);

  const stats = {
    totalUsers: users.length,
    masterSubscribers: users.filter(u => u.subscription === 'Master').length,
    revenue: users.reduce((acc, curr) => acc + curr.totalSpent, 0),
    marketingAccept: users.filter(u => u.allowMarketing).length
  };

  const handleAddCredit = (user: UserRecord) => {
    setSelectedUser(user);
    setIsCreditModalOpen(true);
  };

  const executeAddCredit = async () => {
    if (!selectedUser) return;
    setIsSending(true);
    
    // Simulerer API-kall
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const amount = parseInt(creditAmount);
    setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, credits: u.credits + amount } : u
    ));
    
    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => {
        setSendSuccess(false);
        setIsCreditModalOpen(false);
        setSelectedUser(null);
        setCreditAmount('10');
    }, 1500);
  };

  const handleSendMassUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageData.subject || !messageData.body) return;

    setIsSending(true);
    setTimeout(() => {
        setIsSending(false);
        setSendSuccess(true);
        setTimeout(() => {
            setSendSuccess(false);
            setIsComposeModalOpen(false);
            setMessageData({ subject: '', body: '' });
        }, 2000);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <Shield size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sikker Arkiv-tilgang</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-white">Kontroll-senter</h2>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold italic">Superadmin: Freddy Bremseth</p>
        </div>
        <div className="flex gap-4 no-print">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                <Download size={14} /> Eksporter CSV
            </button>
            <button 
                onClick={() => setIsComposeModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2"
            >
                <Send size={14} /> Send Masseoppdatering
            </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: 'Totale Sjeler', val: stats.totalUsers, icon: Users, color: 'text-blue-400' },
            { label: 'Mester-medlemmer', val: stats.masterSubscribers, icon: Star, color: 'text-amber-400' },
            { label: 'Total Inntjening', val: `€${stats.revenue}`, icon: CreditCard, color: 'text-green-400' },
            { label: 'Markeds-mottakere', val: stats.marketingAccept, icon: Mail, color: 'text-purple-400' }
        ].map((stat, i) => (
            <div key={i} className="bg-[#0f0f25] border border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className={`p-4 bg-white/5 rounded-2xl w-fit ${stat.color}`}><stat.icon size={24} /></div>
                <div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif text-white">{stat.val}</p>
                </div>
            </div>
        ))}
      </div>

      {/* CRM Table */}
      <section className="bg-[#0a0a1a] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Søk i sjelene (navn/epost)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-amber-500 outline-none transition-all"
                />
            </div>
            <div className="flex gap-2">
                {['all', 'master', 'marketing'].map((f) => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f as any)}
                        className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/5 text-slate-500'}`}
                    >
                        {f === 'all' ? 'Alle' : f === 'master' ? 'Mestere' : 'Markedsføring'}
                    </button>
                ))}
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                        <th className="px-8 py-6">Bruker & E-post</th>
                        <th className="px-8 py-6">Abonnement</th>
                        <th className="px-8 py-6">Saldo</th>
                        <th className="px-8 py-6">Markedsføring</th>
                        <th className="px-8 py-6 text-right">Handlinger</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="px-8 py-6">
                                <div className="space-y-0.5">
                                    <p className="text-white font-serif text-lg">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    user.subscription === 'Master' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                    user.subscription === 'Single' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                    'bg-white/5 text-slate-600 border border-white/5'
                                }`}>
                                    {user.subscription}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-serif text-amber-100">{user.subscription === 'Master' ? '∞' : user.credits}</span>
                                    <Coins size={14} className="text-amber-500/40" />
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                {user.allowMarketing ? (
                                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                                        <CheckCircle size={14} /> JA
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                        <XCircle size={14} /> NEI
                                    </div>
                                )}
                            </td>
                            <td className="px-8 py-6 text-right">
                                <button 
                                    onClick={() => handleAddCredit(user)}
                                    className="p-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black rounded-xl transition-all group/btn"
                                    title="Tildel Kreditter"
                                >
                                    <Plus size={20} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="p-8 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest italic">Viser {filteredUsers.length} av {users.length} sjeler i databasen</p>
        </div>
      </section>

      {/* Credit Management Modal */}
      {isCreditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
              <div className="bg-[#0f0f25] border border-amber-500/20 w-full max-w-md rounded-[3rem] p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
                  <button onClick={() => !isSending && setIsCreditModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                  
                  {sendSuccess ? (
                      <div className="text-center py-20 space-y-6 animate-fade-in">
                          <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500">
                              <Sparkles size={48} />
                          </div>
                          <div className="space-y-2">
                              <h3 className="text-3xl font-serif text-white italic">Kreditter overført!</h3>
                              <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">Ny saldo for {selectedUser.name} er oppdatert</p>
                          </div>
                      </div>
                  ) : (
                      <>
                        <div className="text-center mb-10 space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Kreditthåndtering</h2>
                            <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">Mottaker: {selectedUser.name}</p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="bg-black/40 border border-white/5 p-8 rounded-3xl text-center space-y-2">
                                <p className="text-[9px] uppercase text-slate-500 font-black tracking-widest">Gjeldende Saldo</p>
                                <p className="text-4xl font-serif text-white">{selectedUser.credits} Kreditter</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Beløp å legge til</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['5', '20', '50'].map(val => (
                                        <button 
                                            key={val} 
                                            onClick={() => setCreditAmount(val)}
                                            className={`py-4 rounded-2xl border font-black text-xs transition-all ${creditAmount === val ? 'bg-amber-500 border-amber-400 text-black shadow-lg' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                        >
                                            +{val}
                                        </button>
                                    ))}
                                </div>
                                <input 
                                    type="number" 
                                    value={creditAmount}
                                    onChange={e => setCreditAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-center text-xl font-serif outline-none focus:border-amber-500 transition-all"
                                    placeholder="Egendefinert beløp"
                                />
                            </div>

                            <button 
                                onClick={executeAddCredit}
                                disabled={isSending || !creditAmount || parseInt(creditAmount) <= 0}
                                className="w-full bg-amber-500 text-black font-black uppercase tracking-widest py-6 rounded-2xl text-[11px] hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3"
                            >
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Bekreft Tildeling</>}
                            </button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Compose Bulk Message Modal */}
      {isComposeModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
              <div className="bg-[#0a0a16] border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
                  <button onClick={() => !isSending && setIsComposeModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                  
                  {sendSuccess ? (
                      <div className="text-center py-20 space-y-6 animate-fade-in">
                          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                              <CheckCircle size={48} />
                          </div>
                          <div className="space-y-2">
                              <h3 className="text-3xl font-serif text-white italic">Meldingene er kanalisert!</h3>
                              <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">Sending vellykket til {marketingUsers.length} mottakere</p>
                          </div>
                      </div>
                  ) : (
                      <>
                        <div className="text-center mb-10 space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-white">Masseoppdatering</h2>
                            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">
                                <Mail size={12} className="inline mr-2" /> 
                                Sender til {marketingUsers.length} sjeler med aktivt samtykke
                            </p>
                        </div>
                        
                        <form onSubmit={handleSendMassUpdate} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">E-post Emne</label>
                                    <input 
                                        type="text" 
                                        placeholder="f.eks. Ny oppgradering: Tidshjulet er her!" 
                                        value={messageData.subject}
                                        onChange={e => setMessageData({...messageData, subject: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" 
                                        required 
                                        disabled={isSending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Meldingstekst</label>
                                    <textarea 
                                        placeholder="Kjære søkende sjel..." 
                                        value={messageData.body}
                                        onChange={e => setMessageData({...messageData, body: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm h-64 resize-none" 
                                        required 
                                        disabled={isSending}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSending || !messageData.subject || !messageData.body} 
                                className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-6 rounded-2xl text-[11px] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Kanaliserer melding...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Send Broadcast Nå
                                    </>
                                )}
                            </button>
                            <p className="text-[9px] text-slate-600 text-center uppercase font-bold tracking-widest">Dette sender en e-post direkte til alle brukere som har huket av for markedsføring.</p>
                        </form>
                      </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminCRM;
