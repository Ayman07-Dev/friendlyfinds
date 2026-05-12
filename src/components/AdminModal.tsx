import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Theme } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
  editingProduct?: Product | null;
  theme: Theme;
}

export default function AdminModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  theme,
}: AdminModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: '',
    originalPrice: '',
    salePrice: '',
    description: '',
    imageUrl: '',
    productLink: '',
    category: '',
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        originalPrice: editingProduct.originalPrice || '',
        salePrice: editingProduct.salePrice || '',
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
        category: '',
      });
    }
  }, [editingProduct, isOpen]);

  // ✅ Firestore save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      price: formData.salePrice || formData.price,
    };

    await onSave(updatedData);
    onClose();
  };

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
            className={`relative w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl ${
              isDark
                ? 'glass border-white/10'
                : 'bg-white/95 border-white shadow-xl shadow-night/5'
            }`}
          >
            {/* Header */}
            <div
              className={`p-6 border-b flex justify-between items-center ${
                isDark ? 'border-white/5' : 'border-gray-100'
              }`}
            >
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-500/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              id="admin-form"
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
            >
              <input
                type="text"
                required
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />

              <input
                type="text"
                placeholder="Original Price"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />

              <input
                type="text"
                required
                placeholder="Sale Price"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />

              <input
                type="text"
                required
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />

              <textarea
                required
                rows={3}
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl resize-none"
              />

              <input
                type="url"
                required
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />

              <input
                type="url"
                required
                placeholder="Product Link"
                value={formData.productLink}
                onChange={(e) =>
                  setFormData({ ...formData, productLink: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              />
            </form>

            {/* Footer */}
            <div className="p-6 border-t">
              <button
                type="submit"
                form="admin-form"
                className="w-full bg-burgundy text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}