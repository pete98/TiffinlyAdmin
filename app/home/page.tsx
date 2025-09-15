'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Star, Check, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Tiffinly</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Menu</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
                <Button className="bg-brand hover:bg-brand/90 text-white">
                  Download
                </Button>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Signup</a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
              <Button className="bg-brand hover:bg-brand/90 text-white">
                Download
              </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 px-6 py-4"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Menu</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Login</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Signup</a>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center space-y-8">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Fresh Indian lunches, ready when you are
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Enjoy freshly prepared Indian meals every day, ready for early morning pickup at your nearest store—perfect for your daily commute.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <Button className="bg-brand hover:bg-brand/90 text-white px-8 py-3 text-lg">
                  Download
                </Button>
              <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white px-8 py-3 text-lg">
                Learn More
              </Button>
            </motion.div>

            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mt-12"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-gray-500">Hero Image</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Steps to Enjoy Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Enjoy
            </h2>
            <p className="text-lg text-gray-600">
              Get your fresh Indian lunch in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Choose Your Plan",
                description: "Select from our weekly or monthly subscription plans that fit your schedule and preferences."
              },
              {
                title: "Place Your Order",
                description: "Browse our daily menu and place your order through our easy-to-use platform."
              },
              {
                title: "Pick Up & Enjoy",
                description: "Collect your fresh meal from your nearest store and enjoy authentic Indian flavors."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-6 h-full">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Tiffinly Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tiffinly for Your Lunch Needs?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the perfect blend of convenience, quality, and authentic Indian flavors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Convenience & Time Saving",
                description: "No more meal prep or cooking. Your lunch is ready when you are, saving you precious time every day."
              },
              {
                title: "Flexible Choice",
                description: "Choose from our rotating menu of authentic Indian dishes, with options to suit every taste preference."
              },
              {
                title: "Real & Authentic",
                description: "Made with traditional recipes and fresh ingredients by experienced chefs who understand authentic Indian cuisine."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-6 h-full">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Check className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Options Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscription Options
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that works best for your lifestyle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Weekly Plan",
                price: "$19/mo",
                features: ["5 meals per week", "Flexible delivery", "Cancel anytime", "Fresh daily preparation"],
                popular: false
              },
              {
                title: "Monthly Plan",
                price: "$29/mo",
                features: ["20 meals per month", "Priority delivery", "Menu customization", "Best value"],
                popular: true
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className={`p-8 h-full ${plan.popular ? 'ring-2 ring-brand' : ''}`}>
                  <CardContent className="p-0">
                    {plan.popular && (
                      <div className="absolute -top-3 right-6">
                        <Badge className="bg-brand text-white">Most Popular</Badge>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.title}
                    </h3>
                    <div className="text-4xl font-bold text-gray-900 mb-6">
                      {plan.price}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-brand mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-brand hover:bg-brand/90 text-white">
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover our delicious range of authentic Indian dishes
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: "Butter Chicken", price: "$15" },
                { name: "Dal Makhani", price: "$12" },
                { name: "Biryani Rice", price: "$18" },
                { name: "Palak Paneer", price: "$14" },
                { name: "Chicken Curry", price: "$16" }
              ].map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">
                        {product.price}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="hidden lg:flex justify-between absolute top-1/2 -translate-y-1/2 w-full -mx-6">
              <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                <ArrowRight className="w-6 h-6 text-gray-600 rotate-180" />
              </button>
              <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-purple-900 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center"
            >
              <span className="text-6xl">👤</span>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl mb-6 italic">
                "Tiffinly has completely transformed my lunch routine. The food is always fresh, authentic, and delicious. I can't imagine going back to meal prep!"
              </blockquote>
              <div className="mb-6">
                <p className="font-semibold text-lg">Sarah Johnson</p>
                <p className="text-purple-200">Software Engineer</p>
              </div>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm">📷</span>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm">🐦</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Get Your Fresh Lunch Today
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers who trust Tiffinly for their daily lunch needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-brand hover:bg-brand/90 text-white px-8 py-3 text-lg">
                Download
              </Button>
              <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="md:col-span-1">
              <span className="text-2xl font-bold text-white">Tiffinly</span>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm">📷</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm">🐦</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © 2023 Tiffinly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
