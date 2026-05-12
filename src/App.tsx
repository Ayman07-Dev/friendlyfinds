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
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import firebaseConfig from '../firebase-applet-config.json';

import { Product, Theme } from './types';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AdminModal from './components/AdminModal';
import LoginModal from './components/LoginModal';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Test connection to Firestore as required by instructions
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'products', 'any-id'));
      } catch (error) {
        console.error("Connection test failed:", error);
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Firebase Auth sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const admins = ['revanthsai3567@gmail.com', 'ayman.saleem07@gmail.com'];
        if (firebaseUser.email && admins.includes(firebaseUser.email)) {
          setUser({ username: 'Admin' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loginError, setLoginError] = useState('');
  const [logoutStatus, setLogoutStatus] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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

  const handleLogin = async (email: string, pass: string) => {
    try {
      setLoading(true);
      setLoginError('');
      
      const loginEmail = email.includes('@') ? email : `${email}@friendlyfinds.com`;
      await signInWithEmailAndPassword(auth, loginEmail, pass);
      
      setIsLoginOpen(false);
    } catch (error: any) {
      console.error("Firebase Login Error", error);
      if (error.code === 'auth/operation-not-allowed') {
        setLoginError(`AUTH ERROR: Email/Password login is DISABLED for project [${firebaseConfig.projectId}]. Please enable it in your Firebase Console.`);
      } else if (error.code === 'auth/user-not-found') {
        setLoginError(`User not found. Ensure the account [revanthsai3567@gmail.com] is registered in Firebase.`);
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Incorrect password.');
      } else {
        setLoginError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, pass: string) => {
    try {
      setLoading(true);
      setLoginError('');
      
      const loginEmail = email.includes('@') ? email : `${email}@friendlyfinds.com`;
      await createUserWithEmailAndPassword(auth, loginEmail, pass);
      
      setIsLoginOpen(false);
    } catch (error: any) {
      console.error("Firebase Register Error", error);
      if (error.code === 'auth/operation-not-allowed') {
        setLoginError(`AUTH ERROR: Email/Password registration is DISABLED for project [${firebaseConfig.projectId}]. Please enable it in your Firebase Console.`);
      } else if (error.code === 'auth/email-already-in-use') {
        setLoginError('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        setLoginError('Password is too weak. Must be at least 6 characters.');
      } else {
        setLoginError(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLogoutStatus('Logged Out');
      setTimeout(() => setLogoutStatus(null), 2000);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          ...data,
          updatedAt: Date.now()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      setIsAdminModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setDeleteStatus('Product Deleted');
      setTimeout(() => setDeleteStatus(null), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
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
                  onImageClick={(p) => setSelectedProduct(p)}
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

      <ProductDetailModal
        theme={theme}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
