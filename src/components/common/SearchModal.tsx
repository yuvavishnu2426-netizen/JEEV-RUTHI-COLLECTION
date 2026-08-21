import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (!query.trim() && selectedCategory === 'all') return [];

    const q = query.toLowerCase().trim();

    return products.filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category.toLowerCase() === selectedCategory.toLowerCase();
      
      if (!matchesCategory) return false;
      if (!q) return true;

      const matchesName = prod.name.toLowerCase().includes(q);
      const matchesSku = prod.sku.toLowerCase().includes(q);
      const matchesCat = prod.category.toLowerCase().includes(q);
      const matchesSub = prod.subcategory.toLowerCase().includes(q);
      const matchesDesc = prod.description.toLowerCase().includes(q);
      const matchesPrice = prod.offer_price.toString().includes(q);

      return matchesName || matchesSku || matchesCat || matchesSub || matchesDesc || matchesPrice;
    });
  }, [products, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6 bg-black/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white text-[#111] rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Top Integrated Search Box */}
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
            <SearchIcon className="w-7 h-7 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name, category (Women, Kids), SKU, keywords or price..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base sm:text-xl font-medium bg-transparent border-none focus:outline-none placeholder:text-gray-400 text-gray-900 font-sans"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-full transition duration-300"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters / Tags */}
          <div className="px-6 py-3 bg-gray-100 border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
            <span className="text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Catalog Scope:</span>
            </span>
            {['all', 'Women', 'Kids', 'Sarees', 'Kurtis', 'Dresses'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat === 'all' ? 'all' : cat);
                }}
                className={`px-3 py-1.5 rounded-full transition tracking-wider uppercase shrink-0 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#111111] text-[#D4AF37]'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
            {!query.trim() && selectedCategory === 'all' ? (
              <div className="text-center py-12 text-gray-400 space-y-3">
                <Sparkles className="w-12 h-12 text-[#D4AF37]/40 mx-auto animate-pulse" />
                <p className="text-sm tracking-wider font-medium">
                  Type your desire to search our royal archive of pure silk masterpieces and celebratory kids fashion.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <span onClick={() => setQuery('Kanchipuram')} className="cursor-pointer text-xs bg-gray-100 text-gray-800 hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 rounded-full transition font-semibold">
                    🔥 Kanchipuram Silks
                  </span>
                  <span onClick={() => setQuery('Anarkali')} className="cursor-pointer text-xs bg-gray-100 text-gray-800 hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 rounded-full transition font-semibold">
                    ✨ Chanderi Kurtis
                  </span>
                  <span onClick={() => setQuery('Gown')} className="cursor-pointer text-xs bg-gray-100 text-gray-800 hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 rounded-full transition font-semibold">
                    👑 Kids Party Gowns
                  </span>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 space-y-2">
                <p className="font-bold text-lg">No authentic creations found matching "{query}"</p>
                <p className="text-xs text-gray-400">Try adjusting your keywords, testing another category, or exploring our New Arrivals.</p>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">
                  Matching Masterpieces ({filteredProducts.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="group flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-xl hover:bg-amber-50/10 transition duration-300 cursor-pointer bg-white"
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        {product.discount_percentage > 0 && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                            -{product.discount_percentage}%
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest block">
                          {product.category} • {product.subcategory}
                        </span>
                        <h5 className="font-bold text-xs text-gray-900 group-hover:text-[#D4AF37] transition line-clamp-2 mt-0.5">
                          {product.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-extrabold text-xs text-[#111]">
                            ₹{product.offer_price.toLocaleString('en-IN')}
                          </span>
                          {product.mrp_price > product.offer_price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{product.mrp_price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition shrink-0 mr-1" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Footer */}
          <div className="bg-[#111111] text-gray-400 px-6 py-4 text-xs flex items-center justify-between">
            <div>
              <span>Can't find exactly what you seek?</span>
            </div>
            <a
              href="https://wa.me/919876543210?text=Hello%20JEEV%20RUTHI%20COLLECTION,%20I%20am%20looking%20for%20a%20custom%20design."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-white transition font-bold tracking-wider underline underline-offset-2 flex items-center gap-1"
            >
              <span>Speak to our Concierge on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
