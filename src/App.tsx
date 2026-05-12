import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, LogOut, Loader2 } from 'lucide-react';

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { db, auth } from './lib/firebase';
import { Product, Theme } from './types';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AdminModal from './components/AdminModal';
import LoginModal from './components/LoginModal';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ Firebase Auth sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ✅ Realtime Firestore products
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Product[];

      setProducts(items);
    });

    return () => unsub();
  }, []);

  // ✅ Firestore handlers
  const handleSaveProduct = async (product: Partial<Product>) => {
  const finalData: Product = {
    name: product.name || '',
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    productLink: product.productLink || '',
    category: product.category || '',

    // IMPORTANT: Firestore-required field
    price: product.salePrice || product.price || '',

    // Optional UI-only fields (still stored)
    originalPrice: product.originalPrice || '',
    salePrice: product.salePrice || '',

    // Firestore-required timestamps
    createdAt: editingProduct?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  if (editingProduct) {
    await updateDoc(doc(db, 'products', editingProduct.id), finalData);
  } else {
    await addDoc(collection(db, 'products'), finalData);
  }

  setIsAdminModalOpen(false);
  setEditingProduct(null);
};

  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const handleLogin = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // ✅ Filtering
  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onLoginClick={() => setIsLoginOpen(true)}
        isAdmin={!!user}
      />

      {/* Search */}
      <div className="p-8 text-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-4 w-full max-w-xl"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-4 justify-center pb-8">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={!!user}
            onEdit={(p) => {
              setEditingProduct(p);
              setIsAdminModalOpen(true);
            }}
            onDelete={handleDeleteProduct}
            onImageClick={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      <Footer />

      {/* Floating Admin Buttons */}
      {user && (
        <>
          <button
            className="fixed bottom-24 right-8"
            onClick={() => {
              setEditingProduct(null);
              setIsAdminModalOpen(true);
            }}
          >
            <Plus />
          </button>

          <button
            className="fixed bottom-8 right-8"
            onClick={handleLogout}
          >
            <LogOut />
          </button>
        </>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        theme={theme}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        theme={theme}
      />

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        theme={theme}
      />
    </div>
  );
}