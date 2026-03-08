
import React, { useState, useEffect } from 'react';
import { supabase, profileService } from '../lib/supabase';
import { Users, CreditCard, Mail, Search, Download, CheckCircle, XCircle, Star, Shield, Send, X, Loader2, Sparkles, Wallet, Plus, Coins } from './Icons';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  subscription: 'None' | 'Single' | 'Master';
  joinedDate: string;
  lastPayment: string; // Mocked
  allowMarketing: boolean; // Mocked
  totalSpent: number; // Mocked
  credits: number;
}

const AdminCRM: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'master' | 'marketing'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [activeKPI, setActiveKPI] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [creditAmount, setCreditAmount] = useState('10');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [messageData, setMessageData] = useState({ subject: '', body: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        setError('Kunne ikke hente brukere. Har du kjørt SQL-skriptene for å oppdatere databasen og gi admin-tilgang?');
        setUsers([]);
      } else if (data) {
        const formattedUsers: UserRecord[] = data.map(profile => ({
          id: profile.id,
          name: profile.name || 'N/A',
          email: profile.email || 'Mangler e-post',
          subscription: profile.subscription || 'None',
          joinedDate: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('no-NO') : 'Ukjent',
          credits: profile.credits || 0,
          lastPayment: '-',
          allowMarketing: false, 
          totalSpent: 0,
        }));
        setUsers(formattedUsers);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

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
    
    const amount = parseInt(creditAmount);
    const newTotal = selectedUser.credits + amount;

    const { error: updateError } = await profileService.updateCredits(selectedUser.id, newTotal);
    
    if (updateError) {
        console.error("Failed to update credits", updateError);
        setIsSending(false);
        // Optional: show error message in UI
    } else {
        setUsers(prev => prev.map(u => 
            u.id === selectedUser.id ? { ...u, credits: newTotal } : u
        ));
        setIsSending(false);
        setSendSuccess(true);
        setTimeout(() => {
            setSendSuccess(false);
            setIsCreditModalOpen(false);
            setSelectedUser(null);
            setCreditAmount('10');
        }, 1500);
    }
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
            { id: 'souls',    label: 'Totale Sjeler',      val: stats.totalUsers,        icon: Users,       color: 'text-blue-400',   borderHover: 'hover:border-blue-500/40' },
            { id: 'masters',  label: 'Mester-medlemmer',   val: stats.masterSubscribers, icon: Star,        color: 'text-amber-400',  borderHover: 'hover:border-amber-500/40' },
            { id: 'revenue',  label: 'Total Inntjening',   val: `€${stats.revenue}`,     icon: CreditCard,  color: 'text-green-400',  borderHover: 'hover:border-green-500/40' },
            { id: 'marketing',label: 'Markeds-mottakere',  val: stats.marketingAccept,   icon: Mail,        color: 'text-purple-400', borderHover: 'hover:border-purple-500/40' }
        ].map((stat, i) => (
            <div
                key={i}
                onClick={() => setActiveKPI(stat.id)}
                className={`bg-[#0f0f25] border border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-xl cursor-pointer transition-all ${stat.borderHover} hover:bg-white/[0.03] hover:scale-[1.02]`}
            >
                <div className={`p-4 bg-white/5 rounded-2xl w-fit ${stat.color}`}><stat.icon size={24} /></div>
                <div>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif text-white">{stat.val}</p>
                </div>
                <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Klikk for detaljer →</p>
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
                    {isLoading ? (
                        <tr><td colSpan={5} className="text-center p-24"><Loader2 size={32} className="animate-spin inline-block text-amber-500" /></td></tr>
                    ) : error ? (
                        <tr><td colSpan={5} className="text-center p-24 text-red-500 font-semibold">{error}</td></tr>
                    ) : filteredUsers.map((user) => (
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

    </div>
  );
};

export default AdminCRM;
