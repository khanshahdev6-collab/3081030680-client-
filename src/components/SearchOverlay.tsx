import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && query.trim()) {
      onViewAllResults(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#282326]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
        <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-[#282326]/10 overflow-hidden">
          {/* Search Bar Input */}
          <div className="p-4 sm:p-5 border-b border-[#282326]/10 flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-[#C8798D] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search authentic foundations, lipsticks, serums, scents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm sm:text-base text-[#282326] focus:outline-none placeholder:text-stone-400 font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-600 p-1"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions when empty */}
          {!query && (
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A9874F] block mb-3">
                Trending Searches in Islamabad
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Liquid Foundation', 'Velvet Lipstick', 'Hyaluronic Serum', 'Haute Perfume', 'Master Brush Set'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F8E8EC] text-xs font-medium text-stone-700 hover:text-[#C8798D] rounded-full border border-stone-200 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>

              <div className="border-t border-stone-100 pt-4 flex items-center justify-between text-xs text-stone-500">
                <span>Free delivery across Islamabad above Rs. 2,500</span>
                <span>Press ESC to exit</span>
              </div>
            </div>
          )}

          {/* Results list */}
          {query && (
            <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  <p className="text-sm font-medium text-[#282326]">
                    No products found for "{query}"
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Try checking spelling or search a category like "foundation", "lipstick", or "serum".
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1 mb-2">
                    <span>Found {filtered.length} matching products</span>
                    <button
                      onClick={() => {
                        onViewAllResults(query);
                        onClose();
                      }}
                      className="text-[#C8798D] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View in catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {filtered.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[#F8E8EC]/40 border border-stone-100 hover:border-[#F2D2DA] cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A9874F]">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-[#282326] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-stone-500">
                          {product.categoryLabel}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#282326] tabular-nums">
                          Rs. {(product.salePrice ?? product.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
