import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Theme } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product | null;
  theme: Theme;
}

export default function AdminModal({ isOpen, onClose, onSave, product, theme }: AdminModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: '',
    originalPrice: '',
    salePrice: '',
    description: '',
    imageUrl: '',
    productLink: '',
    category: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        originalPrice: product.originalPrice || '',
        salePrice: product.salePrice || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        salePrice: '',
        description: '',
        imageUrl: '',
        productLink: '',
        category: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If salePrice is provided, update the main price field as well for backward compatibility
    const updatedData = {
      ...formData,
      price: formData.salePrice || formData.price
    };
    onSave(updatedData);
  };

  const calculateDiscount = () => {
    if (formData.originalPrice && formData.salePrice) {
      const original = parseFloat(formData.originalPrice.replace(/[^0-9.]/g, ''));
      const sale = parseFloat(formData.salePrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(original) && !isNaN(sale) && original > 0) {
        const discount = Math.round(((original - sale) / original) * 100);
        return discount > 0 ? discount : null;
      }
    }
    return null;
  };

  const discount = calculateDiscount();

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl ${isDark ? 'glass border-white/10' : 'bg-white/95 border-white shadow-xl shadow-night/5'}`}
          >
            <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                    ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                  placeholder="e.g. Matrix MotionX Watch"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Original Price (M.R.P)</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                      ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                    placeholder="e.g. 1499"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Sale Price</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                        ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                      placeholder="e.g. 720"
                    />
                    {discount && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-burgundy text-white px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                    ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                  placeholder="e.g. watches, shoes"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20 resize-none
                    ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                  placeholder="Tell us about the product..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                    ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy ml-1">Product Link (Redirect)</label>
                <input
                  type="url"
                  required
                  value={formData.productLink}
                  onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                    ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                  placeholder="https://amazon.com/..."
                />
              </div>
            </form>

            <div className={`p-6 border-t ${isDark ? 'border-burgundy/20' : 'border-gray-100'}`}>
              <button
                onClick={handleSubmit}
                className="w-full bg-burgundy text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-burgundy/90 transition-all active:scale-95 shadow-lg shadow-burgundy/20"
              >
                <Save size={20} />
                {product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
