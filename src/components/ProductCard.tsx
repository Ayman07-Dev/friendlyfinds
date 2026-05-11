import React from 'react';
import { ExternalLink, Share2, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Theme } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  theme: Theme;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onShare: (product: Product) => void;
}

export default function ProductCard({ product, theme, isAdmin, onEdit, onDelete, onShare }: ProductCardProps) {
  const isDark = theme === 'dark';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group rounded-[2.5rem] overflow-hidden transition-all duration-500 border p-6 flex flex-col h-full
        ${isDark ? 'glass border-white/5' : 'glass-light border-white/40 shadow-xl shadow-black/5'}`}
    >
      {/* Category Badge */}
      <div className={`absolute top-10 left-10 z-10 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]
        ${isDark ? 'bg-burgundy text-white shadow-lg shadow-burgundy/20' : 'bg-night text-white'}`}>
        {product.category}
      </div>

      {/* Image Container */}
      <div className={`aspect-square rounded-2xl mb-6 overflow-hidden relative ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5' : 'bg-gray-100'}`}>
        {product.imageUrl && product.imageUrl.trim() !== '' ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).classList.add('opacity-0');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 capitalize text-[10px] font-black tracking-widest bg-gray-200/20">
            No Image
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
           <span className="text-xs font-bold uppercase tracking-widest">{product.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className={`text-xl font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-night'}`}>
          {product.name}
        </h3>
        <p className="text-burgundy font-black text-lg mb-3">
          {product.price}
        </p>
        
        <p className={`text-xs leading-relaxed line-clamp-2 mb-6
          ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {product.description}
        </p>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <a
            href={product.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${isDark 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-night text-white hover:bg-night/90'}`}
          >
            View
          </a>

          <button
            onClick={() => onShare(product)}
            className={`px-3 py-2.5 rounded-xl border transition-all
              ${isDark 
                ? 'border-white/10 text-white hover:bg-white/5' 
                : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            <Share2 size={16} />
          </button>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className={`p-3.5 rounded-xl border border-burgundy/30 text-burgundy hover:bg-burgundy/10 transition-all`}
                title="Edit Product"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className={`p-3.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all`}
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
