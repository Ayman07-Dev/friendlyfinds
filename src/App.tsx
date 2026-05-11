/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, LogOut, Loader2 } from 'lucide-react';

import { Product, Theme } from './types';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AdminModal from './components/AdminModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Heritage Watch',
    price: '$1,200',
    description: 'A timeless timepiece crafted with precision and elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    productLink: 'https://example.com/watch',
    category: 'Accessories',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Artisan Leather Bag',
    price: '$850',
    description: 'Hand-stitched premium leather bag for the modern professional.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
    productLink: 'https://example.com/bag',
    category: 'Fashion',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    name: 'Velvet Evening Perfume',
    price: '$240',
    description: 'A sophisticated scent capturing the essence of night.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000',
    productLink: 'https://example.com/perfume',
    category: 'Beauty',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loginError, setLoginError] = useState('');
  const [logoutStatus, setLogoutStatus] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = async (username: string, pass: string) => {
    setLoginError('');
    // Simple mock authentication based on requested details
    if (username === 'hassle_07' && pass === 'friendly_finds@0408') {
      setUser({ username });
      setIsLoginOpen(false);
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLogoutStatus('Logged Out');
    setTimeout(() => setLogoutStatus(null), 2000);
  };

  const handleSaveProduct = (data: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...data, updatedAt: Date.now() } 
          : p
      ));
    } else {
      const newProduct: Product = {
        ...data as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsAdminModalOpen(false);
    setEditingProduct(null);
  };

  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const handleDeleteProduct = (id: string) => {
    console.log('Attempting to delete product with ID:', id);
    setProducts(prev => {
      const filtered = prev.filter(p => String(p.id) !== String(id));
      if (filtered.length !== prev.length) {
        setDeleteStatus('Product Deleted');
        setTimeout(() => setDeleteStatus(null), 2000);
      }
      return filtered;
    });
  };

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-night text-white' : 'bg-white text-night'}`}>
        <Loader2 className="animate-spin text-burgundy" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-night text-white' : 'bg-white text-night'}`}>
      {/* Global Decorative Background Text - Animated Marquee */}
      <div className={`fixed inset-0 pointer-events-none select-none flex flex-col items-center justify-center -z-0 overflow-hidden transition-all duration-700`}>
        <div className="transform -rotate-12 scale-150 flex flex-col gap-12 w-full">
          {/* Line 1: Left to Right */}
          <motion.div 
            animate={{ x: ["-20%", "0%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`flex whitespace-nowrap transition-colors duration-700 ${isDark ? 'text-white/[0.03]' : 'text-burgundy/[0.12]'}`}
          >
            {[...Array(8)].map((_, i) => (
              <span key={i} className="text-[5vw] font-black uppercase tracking-[0.4em] px-20">
                PREMIUM SELECTION
              </span>
            ))}
          </motion.div>

          {/* Line 2: Right to Left */}
          <motion.div 
            animate={{ x: ["0%", "-20%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className={`flex whitespace-nowrap transition-colors duration-700 ${isDark ? 'text-white/[0.03]' : 'text-burgundy/[0.12]'}`}
          >
            {[...Array(8)].map((_, i) => (
              <span key={i} className="text-[5vw] font-black uppercase tracking-[0.4em] px-20">
                PREMIUM SELECTION
              </span>
            ))}
          </motion.div>

          {/* Line 3: Left to Right */}
          <motion.div 
            animate={{ x: ["-20%", "0%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className={`flex whitespace-nowrap transition-colors duration-700 ${isDark ? 'text-white/[0.02]' : 'text-burgundy/[0.08]'}`}
          >
            {[...Array(8)].map((_, i) => (
              <span key={i} className="text-[4vw] font-black uppercase tracking-[0.4em] px-20">
                PREMIUM SELECTION
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        onLoginClick={() => setIsLoginOpen(true)}
        isAdmin={!!user}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onContactClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-2xl mx-auto relative group mt-16`}
          >
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-500 group-focus-within:text-burgundy' : 'text-gray-400'}`} size={20} />
            <input 
              type="text"
              placeholder="Search exclusive collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-16 pl-14 pr-6 rounded-2xl border outline-none transition-all text-sm uppercase tracking-widest font-bold
                ${isDark ? 'glass border-white/10 text-white focus:border-burgundy focus:ring-4 focus:ring-burgundy/10' : 'glass-light border-white/50 text-night focus:border-night focus:ring-4 focus:ring-black/5'}`}
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border
                  ${selectedCategory === cat 
                    ? (isDark ? 'bg-burgundy text-white scale-110 shadow-xl shadow-burgundy/20 border-burgundy' : 'bg-night text-white scale-110 shadow-lg border-night') 
                    : (isDark ? 'glass border-white/5 text-gray-400 hover:bg-white/10' : 'glass-light border-white/40 text-gray-600 hover:bg-white')}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

      </section>

      {/* Product Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  theme={theme}
                  isAdmin={!!user}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsAdminModalOpen(true);
                  }}
                  onDelete={handleDeleteProduct}
                  onShare={(p) => {
                    if (navigator.share) {
                      navigator.share({
                        title: p.name,
                        text: p.description,
                        url: p.productLink
                      });
                    } else {
                      alert('Share link: ' + p.productLink);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 opacity-50 space-y-4">
              <Search size={64} className="mx-auto" />
              <p className="text-2xl font-bold">No products found</p>
              <button onClick={() => {setSearchQuery(''); setSelectedCategory('All')}} className="text-burgundy underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <Footer theme={theme} />

      {/* Admin Floating Actions */}
      {user && (
        <>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setEditingProduct(null);
              setIsAdminModalOpen(true);
            }}
            className="fixed bottom-24 right-8 z-40 bg-burgundy text-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 group transition-all hover:pr-6"
          >
            <Plus size={24} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">Add Product</span>
          </motion.button>

          <AnimatePresence>
            {deleteStatus && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-40 right-8 z-50 bg-burgundy text-white px-6 py-4 rounded-2xl shadow-2xl font-bold"
              >
                {deleteStatus}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!logoutStatus ? (
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                onClick={handleLogout}
                className="fixed bottom-8 right-8 z-40 bg-burgundy/10 text-burgundy border border-burgundy/20 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold hover:bg-burgundy hover:text-white transition-all active:scale-95"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-8 right-8 z-40 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold"
              >
                {logoutStatus}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin}
        theme={theme}
        error={loginError}
      />

      <AdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        theme={theme}
      />
    </div>
  );
}
