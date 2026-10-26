import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Search,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Language, translations } from '../utils/i18n';

interface ShopViewProps {
  products: Product[];
  initialCategory?: ProductCategory | string;
  initialQuery?: string;
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  lang?: Language;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  initialCategory = 'all',
  initialQuery = '',
  wishlist,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  lang = 'en',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const t = translations[lang];

  // Distinct brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['all', ...list];
  }, [products]);

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'bestsellers') {
            if (!p.isBestSeller) return false;
          } else if (selectedCategory === 'new') {
            if (!p.isNewArrival) return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // In Stock
        if (inStockOnly && !p.inStock) {
          return false;
        }

        // Price range
        const effPrice = p.salePrice ?? p.price;
        if (effPrice < priceRange[0] || effPrice > priceRange[1]) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: popularity / rating
        return b.rating - a.rating;
      });
  }, [products, selectedCategory, searchQuery, selectedBrand, inStockOnly, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setInStockOnly(false);
    setPriceRange([0, 10000]);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    selectedBrand !== 'all' ||
    inStockOnly ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-[#A9874F] uppercase tracking-wider block mb-1">
          Catalog & Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282326]">
          Luxury Beauty & Cosmetics
        </h1>
        <p className="text-xs sm:text-sm text-[#5E555A] mt-1 max-w-2xl">
          Explore our range of authentic makeup, nourishing skincare elixirs, and signature perfumes available in our Islamabad store with nationwide delivery.
        </p>
      </div>

      {/* Main Control Strip */}
      <div className="bg-white p-4 rounded-2xl border border-[#282326]/10 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar in catalog */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand, or formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Trigger (Mobile) + Sort & Layout Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F2] border border-stone-200 rounded-xl text-xs font-semibold text-[#282326]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C8798D]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#C8798D]" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-[#282326] focus:outline-none focus:border-[#C8798D]"
            >
              <option value="popular">Most Popular & Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-[#F8E8EC] text-[#C8798D]' : 'text-stone-500 hover:bg-stone-50'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-[#F8E8EC] text-[#C8798D]' : 'text-stone-500 hover:bg-stone-50'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Catalog Body: Sidebar (desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${filterDrawerOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-[#282326]/10 shadow-xs h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-sm font-bold text-[#282326] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C8798D]" />
              <span>Refine Catalog</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#C8798D] hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A9874F] mb-2">
              Categories
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'makeup', label: 'Makeup Essentials' },
                { id: 'skincare', label: 'Luxury Skincare' },
                { id: 'lipsticks', label: 'Lipsticks & Lip Gloss' },
                { id: 'foundations', label: 'Foundations & Concealers' },
                { id: 'eyes', label: 'Eye Makeup' },
                { id: 'fragrances', label: 'Fine Fragrances' },
                { id: 'tools', label: 'Beauty Tools & Brushes' },
                { id: 'haircare', label: 'Hair Care & Serums' },
                { id: 'bestsellers', label: 'Bestselling Highlights' },
                { id: 'new', label: 'New Arrivals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#F8E8EC] text-[#9B4D60] font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-stone-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A9874F] mb-2">
              Brand
            </label>
            <div className="space-y-1 text-xs">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors capitalize ${
                    selectedBrand === b
                      ? 'bg-[#F8E8EC] text-[#9B4D60] font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {b === 'all' ? 'All Brands' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A9874F]">
                Price in PKR
              </label>
              <span className="text-[11px] font-bold text-[#282326] tabular-nums">
                Up to Rs. {priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={10000}
              step={250}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
              className="w-full accent-[#C8798D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Rs. 1,000</span>
              <span>Rs. 10,000</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#282326]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#C8798D] w-4 h-4"
              />
              <span className="font-medium">In Stock Only (Islamabad)</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-stone-500">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-[#282326]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-[#282326]">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-[#282326]">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-[#C8798D] hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
            <span>
              Showing <strong className="text-[#282326] tabular-nums">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Product Grid / Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#282326]/10 shadow-xs max-w-lg mx-auto my-12">
              <Sparkles className="w-10 h-10 text-[#C8798D] mx-auto mb-3 opacity-70" />
              <h3 className="font-serif text-xl font-bold text-[#282326] mb-2">
                No matching cosmetics found
              </h3>
              <p className="text-xs text-[#5E555A] leading-relaxed mb-6">
                Try loosening your filters or resetting the price and brand options.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-[#282326]/10 shadow-xs flex flex-col sm:flex-row items-center gap-4 hover:border-[#C8798D]/40 transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover bg-stone-100 shrink-0 cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A9874F]">
                      {product.brand} · {product.categoryLabel}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif text-base font-bold text-[#282326] hover:text-[#C8798D] cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#5E555A] line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-[#282326] tabular-nums">
                      Rs. {(product.salePrice ?? product.price).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onQuickView(product)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-4 py-1.5 text-xs font-semibold bg-[#282326] hover:bg-[#C8798D] text-white rounded-lg transition-colors"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
};
