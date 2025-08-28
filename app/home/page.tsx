'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Tiffinly</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Careers
            </a>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Start Your Subscription
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Indian Meals, Ready{' '}
                <span className="text-orange-500">When</span>{' '}
                You Are.
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Enjoy freshly prepared Indian meals every day, ready for early morning pickup at your nearest store—perfect for your daily commute. Subscribe once and receive a delicious lunch every weekday.
              </p>

              {/* App Store Downloads */}
              <div className="flex flex-col sm:flex-row max-w-sm gap-4">
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:scale-105 transition-transform hover:bg-transparent hover:shadow-none"
                  onClick={() => window.open('https://apps.apple.com', '_blank')}
                >
                  <Image
                    src="/app_store_download.svg"
                    alt="Download on App Store"
                    width={140}
                    height={42}
                    className="h-[42px] w-[140px] object-contain"
                  />
                </Button>
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:scale-105 transition-transform hover:bg-transparent hover:shadow-none"
                  onClick={() => window.open('https://play.google.com', '_blank')}
                >
                  <Image
                    src="/playstore_download.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    className="h-[42px] w-[140px] object-contain"
                  />
                </Button>
              </div>

                             {/* Service Area */}
               <div className="pt-4">
                 <p className="text-sm text-gray-500">
                   (Currently serving Jersey City & Iselin, New Jersey)
                 </p>
               </div>
            </motion.div>

            {/* Right Content - Mobile App */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Phone Wireframe */}
                <div className="w-72 h-[600px] relative">
                  <Image
                    src="/wireframe1.png"
                    alt="Tiffinly app wireframe"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white text-center mb-16"
          >
            We Made Lunch Easier!
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Fresh meals, ready at 7 AM!
                  </h3>
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 bg-orange-100 rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-2xl">🍱</span>
                      </div>
                      <p className="text-sm text-gray-600">Daily Fresh Lunch</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Menu</Button>
                        <Button size="sm" variant="outline">Subscribe</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Pick up anytime during the day
                  </h3>
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Lunch is ready for pickup!</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Available from 7 AM</p>
                        <p>No lines, no waiting</p>
                        <p>Fresh and hot</p>
                      </div>
                      <Button size="sm" variant="outline">Track Order</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Subscribe once, lunch every weekday
                  </h3>
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-900">Subscription Details</p>
                      <p className="text-xs text-gray-600">Monday - Friday</p>
                      <p className="text-xs text-gray-600">Fresh Daily</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Recent deliveries...</p>
                        <p>Today - Ready for pickup</p>
                        <p>Yesterday - Delivered</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Store CTA Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-16"
          >
            Download Tiffinly App
          </motion.h2>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-72 h-[500px] relative">
              <Image
                src="/wireframe1.png"
                alt="Tiffinly app wireframe"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side */}
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">Tiffinly</span>
              </div>
              
              <p className="text-gray-600 max-w-md">
                © Tiffinly is a food delivery service company 2024
              </p>

              <div className="flex flex-col sm:flex-row max-w-md gap-4">
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:scale-105 transition-transform hover:bg-transparent hover:shadow-none"
                  onClick={() => window.open('https://apps.apple.com', '_blank')}
                >
                  <Image
                    src="/app_store_download.svg"
                    alt="Download on App Store"
                    width={140}
                    height={42}
                    className="h-[42px] w-[140px] object-contain"
                  />
                </Button>
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:scale-105 transition-transform hover:bg-transparent hover:shadow-none"
                  onClick={() => window.open('https://play.google.com', '_blank')}
                >
                  <Image
                    src="/playstore_download.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    className="h-[42px] w-[140px] object-contain"
                  />
                </Button>
              </div>
            </div>

            {/* Right Side - Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">About Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Patch</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Updates</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Patch</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Updated</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Beta Test</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Account Information</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Early Access</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Talk to Support</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 