import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Globe,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { translations, Language } from '../utils/i18n';
import { ProductCategory } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  lang: Language;
  onToggleLang: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  lang,
  onToggleLang,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#282326]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Wordmark in Display Serif */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group focus:outline-none"
            aria-label="Makeup Junction Home"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#282326] group-hover:text-[#C8798D] transition-colors">
              Makeup Junction
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#282326]/85">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap hover:text-[#C8798D] transition-colors ${
              currentView === 'home' ? 'text-[#C8798D] font-semibold' : ''
            }`}
          >
            {t.home}
          </button>

          <button
            onClick={() => handleNavClick('shop')}
            className={`whitespace-nowrap hover:text-[#C8798D] transition-colors ${
              currentView === 'shop' ? 'text-[#C8798D] font-semibold' : ''
            }`}
          >
            {t.shop}
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              className="flex items-center gap-1 whitespace-nowrap hover:text-[#C8798D] transition-colors py-2"
            >
              <span>{t.categories}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {categoryDropdownOpen && (
              <div
                onMouseLeave={() => setCategoryDropdownOpen(false)}
                className="absolute top-full left-0 w-64 bg-white border border-[#282326]/10 shadow-xl rounded-xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1"
              >
                <button
                  onClick={() => handleNavClick('shop', 'makeup')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.makeup}
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'skincare')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.skincare}
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'lipsticks')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.lipsticks}
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'foundations')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.foundations}
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'fragrances')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.fragrances}
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'tools')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-[#282326] hover:bg-[#F8E8EC] hover:text-[#C8798D] transition-colors"
                >
                  {t.tools}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap hover:text-[#C8798D] transition-colors ${
              currentView === 'about' ? 'text-[#C8798D] font-semibold' : ''
            }`}
          >
            {t.about}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap hover:text-[#C8798D] transition-colors ${
              currentView === 'contact' ? 'text-[#C8798D] font-semibold' : ''
            }`}
          >
            {t.contact}
          </button>
        </nav>

        {/* Zone 3: Actions & Shopping Bag */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#282326]/80 hover:text-[#C8798D] hover:bg-[#F8E8EC]/60 rounded-full transition-colors"
            title="Search Products"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#282326]/80 border border-[#282326]/15 rounded-full hover:border-[#C8798D] hover:text-[#C8798D] transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.switchLanguage}</span>
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => handleNavClick('wishlist')}
            className="p-2 relative text-[#282326]/80 hover:text-[#C8798D] hover:bg-[#F8E8EC]/60 rounded-full transition-colors"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C8798D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button (Primary Action) */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white px-4 py-2.5 rounded-full text-xs font-medium tracking-wide transition-colors shadow-sm"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.cart}</span>
            <span className="bg-[#C5A46D] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* Admin Switcher / Access */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-full transition-colors ${
              currentView === 'admin'
                ? 'bg-[#C8798D] text-white'
                : 'text-[#282326]/60 hover:text-[#282326] hover:bg-[#F8E8EC]/60'
            }`}
            title="Store Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#282326] hover:bg-[#F8E8EC]/60 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#282326]/10 px-6 py-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4 text-base font-medium text-[#282326]">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#C8798D]"
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#C8798D]"
            >
              {t.shop}
            </button>
            <div className="pl-4 py-1 flex flex-col gap-2 text-sm text-[#282326]/75">
              <button
                onClick={() => handleNavClick('shop', 'makeup')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.makeup}
              </button>
              <button
                onClick={() => handleNavClick('shop', 'skincare')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.skincare}
              </button>
              <button
                onClick={() => handleNavClick('shop', 'lipsticks')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.lipsticks}
              </button>
              <button
                onClick={() => handleNavClick('shop', 'foundations')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.foundations}
              </button>
              <button
                onClick={() => handleNavClick('shop', 'fragrances')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.fragrances}
              </button>
              <button
                onClick={() => handleNavClick('shop', 'tools')}
                className="text-left hover:text-[#C8798D]"
              >
                · {t.tools}
              </button>
            </div>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#C8798D]"
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#C8798D]"
            >
              {t.contact}
            </button>
            <button
              onClick={() => handleNavClick('account')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#C8798D]"
            >
              Customer Account & Orders
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 border-b border-stone-100 text-[#C8798D] flex items-center justify-between"
            >
              <span>Store Admin Portal</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile language & store address */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#282326]/20 rounded-full"
              >
                <Globe className="w-4 h-4" />
                <span>{t.switchLanguage}</span>
              </button>
              <span className="text-xs text-[#282326]/60 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8798D]" />
                Iqbal Town, Islamabad
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
