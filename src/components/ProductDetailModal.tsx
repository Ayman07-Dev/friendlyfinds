import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShoppingBag } from 'lucide-react';
import { Product, Theme } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose, theme }) => {
  if (!product) return null;

  const isDark = theme === 'dark';

  const calculateDiscount = () => {
    if (product.originalPrice && product.salePrice) {
      const original = parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''));
      const sale = parseFloat(product.salePrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(original) && !isNaN(sale) && original > 0) {
        return Math.round(((original - sale) / original) * 100);
      }
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row
              ${isDark ? 'glass border-white/10' : 'glass-light border-white/50 backdrop-blur-2xl shadow-night/10'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all
                ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-night/5 hover:bg-night/10 text-night'}`}
            >
              <X size={20} />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 aspect-square relative overflow-hidden bg-white/5">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {discount && (
                <div className="absolute top-6 left-6 bg-burgundy text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-hidden">
              <span className="text-burgundy font-black uppercase tracking-[0.3em] text-[10px] mb-1">
                {product.category}
              </span>
              <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 leading-none
                ${isDark ? 'text-white' : 'text-night'}`}>
                {product.name}
              </h2>

              <div className="flex flex-col gap-0.5 mb-4">
                <span className="text-burgundy font-black text-3xl">
                  {product.salePrice || product.price}
                </span>
                {product.originalPrice && (
                  <div className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white/40' : 'text-night/40'}`}>
                    M.R.P: <span className="line-through">{product.originalPrice}</span>
                    <span className="text-burgundy animate-pulse">• GREAT DEAL</span>
                  </div>
                )}
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 mb-6 min-h-0">
                <p className={`text-sm leading-relaxed font-medium
                  ${isDark ? 'text-white/60' : 'text-night/60'}`}>
                  {product.description}
                </p>
              </div>

              <a 
                href={product.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-burgundy text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-burgundy/90 transition-all active:scale-[0.98] shadow-xl shadow-burgundy/20 mt-auto"
              >
                <ShoppingBag size={18} />
                Get yours now
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
