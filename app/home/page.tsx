"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Star, Check, ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import heroImage from "@/assets/wireframe1.png";
import frame1 from "@/assets/Frame 1.png";
import frame2 from "@/assets/Frame 2.png";
import frame3 from "@/assets/Frame 3.png";
import frame4 from "@/assets/Frame 4.png";
import pickupImage from "@/assets/pick up image.png";
import indianCurryIndiaGif from "@/assets/Indian Curry India GIF.gif";
import pbutterGif from "@/assets/pbutter.gif";
import indianCurryFoodGif from "@/assets/Indian Curry Food GIF.gif";
import tiffinlyBanner from "@/assets/TiffinlyBann.png";
import veggisImage from "@/assets/veggis.png";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const carouselImages = [
    indianCurryIndiaGif,
    pbutterGif,
    indianCurryFoodGif,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-100 px-4 py-2 sm:px-6 sm:py-3 sticky top-0 z-50"
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Image 
              src={tiffinlyBanner} 
              alt="Tiffinly Banner" 
              width={166} 
              height={55}
              className="rounded-sm"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Menu
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
            <Button className="bg-brand hover:bg-brand/90 text-white">
              Download
            </Button>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Signup
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <Button className="bg-brand hover:bg-brand/90 text-white">
              Download
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 sm:px-6"
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Menu
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Signup
              </a>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Repeating Stripe Pattern */}
      <div className="bg-black py-3 overflow-hidden">
        <div className="flex animate-scroll">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center whitespace-nowrap text-white text-sm font-bold uppercase tracking-wide">
              <span>Affordable</span>
              <span className="mx-2 text-orange-400">•</span>
              <span>Convenient</span>
              <span className="mx-2 text-orange-400">•</span>
              <span>Subscription Based</span>
              <span className="mx-2 text-orange-400">•</span>
              <span>HomeStyle Meals</span>
              <span className="mx-8"></span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 min-h-[calc(100vh-80px)] flex items-center py-12 sm:py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          <div className="grid gap-12 sm:gap-16 md:grid-cols-2 items-center">
            <div className="space-y-6 sm:space-y-8">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Fresh Indian lunches, ready when you are
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-lg text-white max-w-xl"
              >
                Experience the ultimate convenience with Tiffinly&apos;s
                subscription service. Enjoy freshly prepared Indian meals, ready
                for pickup whenever you need them.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
                  <Button className="bg-black text-white shadow-md px-7 py-3 text-base sm:px-10 sm:text-lg hover:opacity-90 rounded-full">
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-white text-black bg-white hover:bg-gray-100 px-7 py-3 text-base sm:px-10 sm:text-lg rounded-full"
                    onClick={() => {
                      const element = document.getElementById('subscription-options');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Pricing
                  </Button>
                </div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-white text-sm sm:text-base text-left"
                >
                  ( Jersey City • Hoboken • Iselin ) 
                </motion.p>
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex justify-center md:justify-end"
            >
              <Image
                src={heroImage}
                alt="Tiffinly app preview"
                priority
                width={720}
                height={720}
                sizes="(max-width: 768px) 72vw, (max-width: 1200px) 32vw, 288px"
                className="w-full max-w-[288px] sm:max-w-[304px] md:max-w-[256px] lg:max-w-[288px] h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Steps to Enjoy Section */}
      <section id="simple-steps" className="bg-gray-50 py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Enjoy
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Get your fresh Indian lunch in just a few simple steps
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div 
              className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide gap-4 pb-4" 
              style={{ 
                overscrollBehaviorX: 'contain',
                overscrollBehaviorY: 'auto',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'manipulation'
              }}
            >
              {[
                { image: frame1, alt: "Step 1" },
                { image: frame2, alt: "Step 2" },
                { image: frame3, alt: "Step 3" },
                { image: frame4, alt: "Step 4" },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 snap-start"
                >
                  <div className="w-[280px] sm:w-[320px] md:w-[360px] mx-auto">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {[frame1, frame2, frame3, frame4].map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Tiffinly Section */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-6 w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">
              Benefits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Tiffinly for Your Lunch Needs?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Tiffinly brings you the best of Indian cuisine with unmatched convenience. Our service allows you to enjoy healthy, authentic meals without the hassle of cooking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Convenience & Time Saving",
                description:
                  "No more meal prep or cooking. Your lunch is ready when you are, saving you precious time every day.",
                image: pickupImage,
                isCarousel: false,
              },
              {
                title: "Daily Variety Menu",
                description:
                  "Enjoy different authentic Indian dishes every day with our non-repeating weekly menu that keeps your meals exciting and diverse.",
                image: null,
                isCarousel: false,
              },
              {
                title: "Healthy HomeStyle Food",
                description:
                  "Made with traditional recipes and fresh ingredients by experienced chefs who understand authentic Indian cuisine.",
                image: null,
                isCarousel: false,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-white border-0 shadow-sm overflow-hidden h-full">
                  <CardContent className="p-0">
                    {/* Square Image Container */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {feature.image ? (
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    {/* Text Content */}
                    <div className="p-6 bg-green-900">
                      <h3 className="text-xl font-bold text-white mb-4 text-center">
                        {feature.title}
                      </h3>
                      <p className="text-white text-base leading-relaxed text-center">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Subscription Options Section */}
      <section id="subscription-options" className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={veggisImage}
            alt="Vegetables background"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscription Options
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Choose the plan that works best for your lifestyle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Weekly Plan",
                subtitle: "Try our meals for a week",
                price: "$55",
                period: "per week",
                features: [
                  "5 delicious meals per week",
                  "Flexible pickup times",
                  "Cancel anytime",
                  "Fresh daily preparation",
                  "Daily variety menu",
                ],
                popular: false,
              },
              {
                title: "Monthly Plan",
                subtitle: "Best value for busy students and professionals",
                price: "$180",
                period: "per month",
                features: [
                  "20 authentic meals per month",
                  "Priority pickup slots",
                  "Menu customization options",
                  "Best value guarantee",
                  "Premium customer support",
                ],
                popular: true,
                savings: "Save $40/month",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card
                  className={`p-6 sm:p-8 h-full shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-0 ${
                    plan.popular ? "text-white bg-gradient-to-br from-orange-500 to-red-600" : "bg-white"
                  }`}
                >
                  <CardContent className="p-0">
                    {plan.popular && (
                      <div className="absolute -top-3 right-4 sm:right-6">
                        <Badge className="bg-black text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        {plan.title}
                      </h3>
                      <p className={`text-sm mb-4 ${plan.popular ? 'text-white' : 'text-gray-600'}`}>
                        {plan.subtitle}
                      </p>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                        <span className={`ml-2 ${plan.popular ? 'text-white' : 'text-gray-600'}`}>/{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-4 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                          <span className={`text-sm leading-relaxed ${plan.popular ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-center">
                      <div className={`text-xs mb-2 ${plan.popular ? 'text-white' : 'text-gray-500'}`}>
                        No hidden fees • Cancel anytime
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Menu Section */}
      <section className="bg-white py-16 sm:py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Weekly Menu
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Discover our delicious range of authentic Indian dishes
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
              {[
                { name: "Butter Chicken", price: "$15" },
                { name: "Dal Makhani", price: "$12" },
                { name: "Biryani Rice", price: "$18" },
                { name: "Palak Paneer", price: "$14" },
                { name: "Chicken Curry", price: "$16" },
              ].map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
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
      <section className="py-16 sm:py-20 md:py-32" style={{ backgroundColor: '#4C00B3' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-full h-64 sm:h-80 md:h-96 bg-gray-700 rounded-lg flex items-center justify-center"
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
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl mb-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                "Tiffinly has completely transformed my lunch routine. The food
                is always fresh, authentic, and delicious. I can't imagine going
                back to meal prep!"
              </blockquote>
              <div className="mb-6">
                <p className="font-semibold text-lg text-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Het Shah</p>
                <p className="text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Software Engineer</p>
              </div>
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 text-left"
          >
            <h2 className="text-4xl font-medium text-black leading-tight" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Get Your Fresh<br className="sm:hidden" />
              <span className="hidden sm:inline"> </span>Lunch Today
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Download the Tiffinly app and choose your meal plan for effortless lunchtime convenience.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 justify-start">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 text-base sm:px-8 sm:text-lg rounded-full border-0 w-[35%] sm:w-auto">
                Download
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-black hover:bg-gray-50 px-6 py-3 text-base sm:px-8 sm:text-lg rounded-full bg-white w-[35%] sm:w-auto"
              >
                Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Logo */}
            <div className="md:col-span-1">
              <span className="text-2xl font-bold text-white">Tiffinly</span>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3 sm:space-x-4">
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
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2023 Tiffinly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

