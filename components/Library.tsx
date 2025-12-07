import React, { useState } from 'react';
import { AUTHORS, RESOURCES } from '../constants';
import { Search, ExternalLink, FileText } from './icons';

const Library: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredAuthors = AUTHORS.filter(author => {
    const matchesSearch = author.name.toLowerCase().includes(search.toLowerCase()) || 
                          author.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || author.era === filter || author.methodologies.some(m => m.includes(filter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Kunnskapsbase</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Autoritative kilder og biografier for profesjonelle.</p>
        </div>
        
        <div className="flex gap-3 bg-white dark:bg-space-900 p-1 rounded-lg border border-gray-200 dark:border-space-800 flex-wrap shadow-sm">
          {['All', 'Ancient', 'Modern', 'Esoterisk', 'Vestlig'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-gray-100 dark:bg-space-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-space-800'
              }`}
            >
              {f === 'All' ? 'Alle' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Søk etter forfatter, bok eller metode..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-gold-500/50 transition-colors shadow-sm placeholder-gray-400 dark:placeholder-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
        {filteredAuthors.map((author) => (
          <div key={author.id} className="group bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 hover:border-gold-500/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-space-800 flex items-center justify-center text-gold-600 dark:text-gold-500 font-serif text-xl font-bold border border-gray-200 dark:border-space-700">
                {author.name.charAt(0)}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                author.era === 'Ancient' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' :
                author.era === 'Modern' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' :
                author.era === '20th Century' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30' :
                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}>
                {author.era === 'Ancient' ? 'Antikk' : author.era === 'Modern' ? 'Moderne' : author.era === '20th Century' ? '20. Årh' : author.era}
              </span>
            </div>
            
            <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{author.name}</h3>
            <p className="text-sm text-gold-600/80 dark:text-gold-600/80 font-medium mb-3">{author.specialty}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow leading-relaxed line-clamp-4">{author.description}</p>
            
            <div className="pt-4 border-t border-gray-200 dark:border-space-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Viktige Verk</p>
              <div className="flex flex-wrap gap-2">
                {author.keyWorks.map((work, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-xs text-gray-700 dark:text-space-300 bg-gray-100 dark:bg-space-800 px-2 py-1 rounded">
                    <FileText size={12} /> {work}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-space-800 pt-8">
        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-200 mb-6">Anbefalte Kilder & Oversettelser</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESOURCES.map((res) => (
            <a 
              key={res.id} 
              href={res.link || '#'} 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-lg hover:bg-gray-50 dark:hover:bg-space-800 transition-colors group shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-gray-100 dark:bg-space-800 rounded text-gray-500 dark:text-gray-400 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-200 flex items-center gap-2">
                  {res.title}
                  {res.isRecommended && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 rounded border border-green-200 dark:border-green-900/50">ANBEFALT</span>}
                </h4>
                <p className="text-sm text-gray-500">{res.author} • {res.type}</p>
                <p className="text-xs text-gray-400 mt-1">{res.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
