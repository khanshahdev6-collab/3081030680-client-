import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface AnnouncementBarProps {
  settings: StoreSettings;
  visible: boolean;
  onDismiss: () => void;
  lang: 'en' | 'ur';
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  settings,
  visible,
  onDismiss,
  lang,
}) => {
  if (!visible || !settings.announcementActive) return null;

  return (
    <div className="bg-[#282326] text-[#FFFDF9] text-xs py-2 px-4 relative z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
          <span className="font-medium tracking-wide truncate">
            {settings.announcementText}
          </span>
          <span className="hidden md:inline text-[#C5A46D] font-medium text-[11px] uppercase tracking-wider">
            · COD Across Pakistan
          </span>
        </div>

        <button
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="text-[#FAF7F2]/70 hover:text-white p-1 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
