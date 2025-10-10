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
import frame5 from "@/assets/phoneframe.png"
import pickupImage from "@/assets/pick up image.png";
import pickup from "@/assets/pickup.png";
import subbann from "@/assets/subbann.png";
import sub from "@/assets/food/sub.png";
import multiImage from "@/assets/food/multi.png";
import indianCurryIndiaGif from "@/assets/Indian Curry India GIF.gif";
import pbutterGif from "@/assets/pbutter.gif";
import indianCurryFoodGif from "@/assets/Indian Curry Food GIF.gif";
import tiffinlyBanner from "@/assets/TiffinlyBann.png";
import veggisImage from "@/assets/veggis.png";
import veggipImage from "@/assets/veggip.png";
import hetImage from "@/assets/people/het.jpeg";
import bharatImage from "@/assets/people/bharat.png";
import moumitaImage from "@/assets/people/moumita.png";
import { useState, useEffect } from "react";
import { WeeklyMenuSection } from "@/components/menu-items/weekly-menu-section";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailError, setHeroEmailError] = useState("");
  const [heroHoneypot, setHeroHoneypot] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaEmailError, setCtaEmailError] = useState("");
  const [ctaHoneypot, setCtaHoneypot] = useState("");
  
  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string, setEmail: (email: string) => void, setError: (error: string) => void) => {
    setEmail(email);
    if (email && !validateEmail(email)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  const handleEmailSubmit = async (
    email: string,
    honeypotValue: string,
    setError: (error: string) => void,
    setEmail: (email: string) => void,
    resetHoneypot: () => void,
  ) => {
    if (honeypotValue.trim()) {
      // Silently drop honeypot submissions
      setEmail("");
      resetHoneypot();
      setError("");
      return;
    }

    const sanitizedEmail = email.trim();

    if (!sanitizedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizedEmail, honeypot: honeypotValue }),
      });

      if (response.ok) {
        alert('Thank you for joining our waitlist! We\'ll be in touch soon.');
        setEmail('');
        setError('');
        resetHoneypot();
      } else {
        const error = await response.json();
        alert(error.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };
  
  const carouselImages = [
    indianCurryIndiaGif,
    pbutterGif,
    indianCurryFoodGif,
  ];

  const pickupPlans = [
    {
      title: "Weekly Plan",
      subtitle: "Try our meals for a week",
      price: "$55",
      period: "per week",
      features: [
        "5 delicious home style meals per week",
        "Just $11 per meal",
        "Pickup any time from any store*",
        "Free scheduled home delivery",
        "Upgrade to the monthly plan anytime",
      ],
      popular: false as const,
    },
    {
      title: "Monthly Plan",
      subtitle: "Best value for busy students and professionals",
      price: "$199",
      period: "per month",
      features: [
        "20 delicious home style meals per month",
        "Just $10 per meal",
        "Free scheduled home delivery",
        "Pickup any time at any store*",
        "Best value save up to $20/month",
      ],
      popular: true as const,
     
    },
  ];

  const renderSubscriptionContent = () => (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="bg-green-900/100 md:bg-transparent rounded-3xl md:rounded-none p-6 md:p-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white md:text-white mb-4">
            Subscription Options
          </h2>
          <p className="text-base sm:text-lg text-green-100 md:text-green-100">
            Choose the plan that works best for your lifestyle
          </p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto">
        {pickupPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <Card
              className={`p-5 sm:p-8 h-full shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-0 ${
                plan.popular ? "bg-white text-gray-900" : "bg-white"
              }`}
            >
              <CardContent className="p-0">
                {plan.popular && (
                  <div className="absolute -top-3 right-4 sm:right-6">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 font-semibold shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-5 md:mb-6">
                  <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${plan.popular ? 'text-gray-900' : 'text-gray-900'}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-sm md:text-base mb-3 md:mb-4 ${plan.popular ? 'text-gray-700' : 'text-gray-600]'}`}>
                    {plan.subtitle}
                  </p>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className={`text-5xl md:text-6xl font-bold ${plan.popular ? 'text-gray-900' : 'text-gray-900'}`}>{plan.price}</span>
                    <span className={`ml-2 text-base md:text-lg ${plan.popular ? 'text-gray-700' : 'text-gray-600'}`}>/{plan.period}</span>
                  </div>
      
                </div>
                
                <ul className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                  {plan.features.map((feature, featureIndex) => {
                    const isFreeDelivery = feature === "Free scheduled home delivery";
                    const isMonthlyHighlight =
                      plan.popular && feature === "Best value save up to $20/month";
                    const isHighlighted = isFreeDelivery || isMonthlyHighlight;

                    return (
                      <li key={featureIndex} className="flex items-start">
                        <Check
                          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                            isHighlighted ? "text-orange-500" : "text-gray-900"
                          }`}
                        />
                        <span
                          className={`text-sm md:text-base leading-relaxed ${
                            isHighlighted
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded-md"
                              : "text-gray-700"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                
                <div className="text-center">
                  <div className={`text-sm md:text-base mb-2 ${plan.popular ? 'text-gray-600' : 'text-gray-500'}`}>
                    Subscribe In-App • Cancel anytime
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle viewport changes for mobile browsers
  useEffect(() => {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handleResize = () => {
      // Force a reflow to prevent viewport issues
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      if (isiOS) {
        document.documentElement.style.setProperty("--ios-vh", `${window.innerHeight}px`);
      }
    };

    // Handle input focus/blur to prevent viewport issues and scroll to input
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') {
        const input = e.target as HTMLInputElement;
        // Check if it's an email input
        if (input.type === 'email') {
          setTimeout(() => {
            // Scroll the input into view with some offset from top
            input.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 100);
        } else {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') {
        setTimeout(() => {
          handleResize();
        }, 300);
      }
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    if (isiOS) {
      window.addEventListener("scroll", handleResize, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      if (isiOS) {
        window.removeEventListener("scroll", handleResize);
      }
    };
  }, []);

  return (
    <main
      className="w-full"
    >
      <div
        className="flex flex-col"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-gray-100 px-3 sm:px-4 pb-1 sm:pb-2"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
            backgroundColor: '#ffffff'
          }}
        >
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <Image 
                src={tiffinlyBanner} 
                alt="Tiffinly Banner" 
                width={116} 
                height={38}
                className="rounded-sm"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
               <a
                href="#simple-steps"
                className="text-gray-600 hover:text-gray-900 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-gray-900 after:w-0 hover:after:w-full after:transition-all after:duration-300"
              >
                How it works
              </a>
              <a
                href="#subscription-options"
                className="text-gray-600 hover:text-gray-900 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-gray-900 after:w-0 hover:after:w-full after:transition-all after:duration-300"
              >
                Pricing
              </a>
              <a
                href="#weekly-menu"
                className="text-gray-600 hover:text-gray-900 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-gray-900 after:w-0 hover:after:w-full after:transition-all after:duration-300"
              >
                Menu
              </a>
              
             
              {/* <Button className="bg-brand hover:bg-brand/90 text-white">
                Download
              </Button> */}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* <Button className="bg-brand hover:bg-brand/90 text-white">
                Download
              </Button> */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 px-3 py-3 sm:px-4"
              style={{ backgroundColor: '#ffffff' }}
            >
              <nav className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#weekly-menu"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Menu
                </a>
                <a
                  href="#subscription-options"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#simple-steps"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  How it works
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
      <section className="bg-gradient-to-r from-orange-500 to-red-600 min-h-screen lg:min-h-[90vh] flex items-center py-12 sm:py-16 md:py-20 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          <div className="grid gap-12 sm:gap-16 md:grid-cols-2 items-center">
            <div className="space-y-6 sm:space-y-8 w-full max-w-lg mx-auto text-left md:mx-0 md:max-w-xl justify-self-stretch md:justify-self-start">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                  <span className="text-white text-sm font-medium">Launching Soon</span>
                </div>
                <h1
                  className="text-5xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Fresh Indian Meals, ready when you are.
                </h1>
              </motion.div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-lg text-white max-w-xl"
              >
            Daily fresh Indian meals — pick up anytime from your nearest store or get them delivered to your home, all on one simple subscription.          </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Download and Pricing buttons commented out */}
                {/* <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
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
                </div> */}
                
                {/* Waitlist Email Signup */}
                <div className="space-y-4 w-full ">
                  <div className="flex flex-row items-center gap-3 w-full justify-start flex-wrap">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={heroEmail}
                      onChange={(e) => handleEmailChange(e.target.value, setHeroEmail, setHeroEmailError)}
                      className={`flex-1 min-w-0 px-4 py-3 rounded-full border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 h-12 ${
                        heroEmailError ? 'focus:ring-red-500/50' : 'focus:ring-white/50'
                      }`}
                    />
                    {/* Honeypot field – hidden from real users */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="hero-company" className="block text-sm">Company</label>
                      <input
                        id="hero-company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={heroHoneypot}
                        onChange={(event) => setHeroHoneypot(event.target.value)}
                        className="mt-1 w-full rounded border border-gray-200 bg-white text-gray-900"
                      />
                    </div>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium h-12 whitespace-nowrap shrink-0"
                      onClick={() => handleEmailSubmit(
                        heroEmail,
                        heroHoneypot,
                        setHeroEmailError,
                        setHeroEmail,
                        () => setHeroHoneypot("")
                      )}
                    >
                      Join Waitlist
                    </Button>
                  </div>
                  {heroEmailError && (
                    <p className="text-black text-sm ml-1">{heroEmailError}</p>
                  )}
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
              className="flex justify-center md:justify-end w-full"
            >
              <Image
                src={frame5}
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
              Get your fresh Indian meal in just a few simple steps
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
      <section className="bg-green-800 py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-6 w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-sm font-medium text-green-200 uppercase tracking-wide mb-4">
              Benefits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose Tiffinly for Your Lunch Needs?
            </h2>
            <p className="text-base sm:text-lg text-green-100 max-w-3xl mx-auto">
            For students and professionals away from home, Tiffinly brings you the comfort of authentic Indian food—just like mom’s cooking—without the stress of grocery shopping or kitchen time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Convenience & Time Saving",
                description:
                  "Skip cooking, your fresh meal is ready for easy pickup on your route or get it delivered to your scheduled time daily.",
                image: pickup,
                isCarousel: false,
              },
              {
                title: "Affordable & Flexible Plans",
                description:
                "Weekly and Monthly subscriptions that fit your budget and busy schedules.",
                image: subbann,
                isCarousel: false,
              },
              {
                title: "Weekly Rotating Menu",
                description:
                  "Enjoy something different every week, no fixed thali or repetitive routine, just exciting new homestyle foods.",
                image: multiImage,
                isCarousel: false,
              },
              {
                title: "Healthy HomeStyle Food",
                description:
                  "Cooked overnight, delivered fresh every morning or evening — real daily meals, not weekly fridge food.",
                image: sub,
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
                    {/* Image Container - perfect fit */}
                    <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                      {feature.image ? (
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    {/* Text Content */}
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-bold text-black mb-4 text-center">
                        {feature.title}
                      </h3>
                      <p className="text-black text-base leading-relaxed text-center">
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
      <section id="subscription-options" className="relative py-16 sm:py-20 md:py-32 overflow-hidden md:flex md:items-center">
        {/* Background Image - Mobile */}
        <div className="absolute inset-0 z-0 md:hidden">
          <Image
            src={veggipImage}
            alt="Vegetables background mobile"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Background Image - Desktop */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <Image
            src={veggisImage}
            alt="Vegetables background desktop"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6">
          <div className="md:hidden max-w-4xl mx-auto">
            {renderSubscriptionContent()}
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-green-900 text-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-[1000px] w-full">
              {renderSubscriptionContent()}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Menu Section */}
      <WeeklyMenuSection />

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-32" style={{ backgroundColor: '#4C00B3' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Early Adopters Testimonials
            </h2>
            <p className="text-base sm:text-lg text-gray-200">
              See what our happy customers have to say about their experience with our meal plans.
            </p>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                text: "Delicious food and excellent service! Highly recommend.",
                name: "Het",
                position: "Software Engineer",
                image: hetImage,
              },
              {
                text: "The affordable plan fits my budget perfectly and saves me hours every week. Highly recommend for busy students!",
                name: "Bharat",
                position: "Student",
                image: bharatImage,
              },
              {
                text: "The meals are always ready on time and save me so much effort during my busy week. Super convenient!",
                name: "Moumita",
                position: "Senior Quality Assurance Engineer",
                image: moumitaImage,
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gray-900 fill-current"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 mb-6 flex-grow leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} portrait`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Get your fresh<br className="sm:hidden" />
              <span className="hidden sm:inline"> </span>meals today
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Join our waitlist to be the first to know when Tiffinly launches in your area.
            </p>
            {/* Download and Pricing buttons commented out */}
            {/* <div className="flex flex-row gap-3 sm:gap-4 justify-start">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 text-base sm:px-8 sm:text-lg rounded-full border-0 w-[35%] sm:w-auto">
                Download
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-black hover:bg-gray-50 px-6 py-3 text-base sm:px-8 sm:text-lg rounded-full bg-white w-[35%] sm:w-auto"
              >
                Pricing
              </Button>
            </div> */}
            
            {/* Waitlist Email Signup */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Enter Email to Join Waitlist</h3>
              <div className="flex flex-col gap-3 max-w-md">
                <div className="flex flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={ctaEmail}
                    onChange={(e) => handleEmailChange(e.target.value, setCtaEmail, setCtaEmailError)}
                    className={`flex-1 px-4 py-3 rounded-full border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 h-12 ${
                      ctaEmailError 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-300 focus:ring-orange-500/50'
                    }`}
                  />
                  {/* Honeypot field – hidden from real users */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="cta-company" className="block text-sm">Company</label>
                    <input
                      id="cta-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={ctaHoneypot}
                      onChange={(event) => setCtaHoneypot(event.target.value)}
                      className="mt-1 w-full rounded border border-gray-200 bg-white text-gray-900"
                    />
                  </div>
                  <Button 
                    className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium h-12 whitespace-nowrap"
                    onClick={() => handleEmailSubmit(
                      ctaEmail,
                      ctaHoneypot,
                      setCtaEmailError,
                      setCtaEmail,
                      () => setCtaHoneypot("")
                    )}
                  >
                    Join Waitlist
                  </Button>
                </div>
                {ctaEmailError && (
                  <p className="text-black text-sm ml-1">{ctaEmailError}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 sm:py-16 pb-20">
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
    </main>
  );
}
