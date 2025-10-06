"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItemCard } from "./menu-item-card";
import { menuItemsApi } from "@/lib/api";
import { MenuItem } from "@/lib/types";

export function WeeklyMenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await menuItemsApi.getAll();
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <section id="weekly-menu" className="bg-white py-16 sm:py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              This Week's Menu
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Loading our delicious range of authentic Indian dishes...
            </p>
          </motion.div>

          {/* Mobile horizontal scroll */}
          <div className="flex overflow-x-auto gap-4 pb-4 sm:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="overflow-hidden min-w-[280px] flex-shrink-0">
                <div className="w-full h-40 bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Desktop grid */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="weekly-menu" className="bg-white py-16 sm:py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              This Week's Menu
            </h2>
            <p className="text-base sm:text-lg text-red-600">
              {error}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="weekly-menu" className="bg-white py-16 sm:py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            This Week's Menu
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Discover our delicious range of authentic Indian dishes
          </p>
        </motion.div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto gap-4 pb-4 sm:hidden">
          {menuItems.map((menuItem, index) => (
            <motion.div
              key={menuItem.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[280px] flex-shrink-0"
            >
              <MenuItemCard menuItem={menuItem} />
            </motion.div>
          ))}
        </div>
        
        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {menuItems.map((menuItem, index) => (
            <motion.div
              key={menuItem.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <MenuItemCard menuItem={menuItem} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
