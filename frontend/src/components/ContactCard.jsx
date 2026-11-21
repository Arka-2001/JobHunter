import React from 'react';
import { Users, Search, Building2, ExternalLink } from 'lucide-react';

const ContactCard = ({ contacts, company, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Users className="w-4 h-4 text-indigo-600" />
          <h3>Hiring & Recruiter Contacts</h3>
        </div>
        <p className="text-xs text-slate-400 animate-pulse">Searching public verified sources...</p>
      </div>
    );
  }

  const companyName = company || contacts?.company || 'Company';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
        <Users className="w-5 h-5 text-indigo-600" />
        <h3>Company & Hiring Contacts</h3>
      </div>

      {contacts?.contact_name ? (
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">{contacts.contact_name}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {contacts.verification_status || 'Verified Lead'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{contacts.designation || 'Talent Acquisition'}</p>
          {contacts.email && (
            <p className="text-xs text-indigo-700 font-mono mt-1">{contacts.email}</p>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800">No Direct Contact Publicly Listed</p>
          <p className="text-[11px] text-slate-500">
            We never fabricate email addresses or phone numbers. Use the verified LinkedIn search shortcuts below to connect with internal recruiters.
          </p>
        </div>
      )}

      {/* Verified LinkedIn Shortcuts */}
      <div className="space-y-2 pt-1">
        <a
          href={
            contacts?.linkedin_url ||
            `https://www.linkedin.com/search/results/people/?keywords=Talent%20Acquisition%20${encodeURIComponent(companyName)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-800 hover:text-indigo-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            Find {companyName} Recruiters on LinkedIn
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <a
          href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-800 hover:text-indigo-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            {companyName} LinkedIn Company Page
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
