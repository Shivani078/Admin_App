import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, User, CreditCard, Mail, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-20 min-h-screen bg-gray-50"
    >
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-brand-blue/10 to-brand-red/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <Shield className="h-16 w-16 text-brand-red mr-4" />
                <Lock className="h-8 w-8 text-brand-blue absolute -top-2 -right-2" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
                Privacy Policy
              </h1>
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-700 font-medium"
            >
              Last Updated: November 23, 2025
            </motion.p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <p className="text-lg text-gray-600 leading-relaxed">
              At SCR Agro Farms, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This policy outlines how we collect, use, and safeguard your data.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <User className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us. This can include:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Contact information (name, email, phone)
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Shipping and billing addresses
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Payment information
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Order history and preferences
                </li>
              </ul>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Settings className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2">Order Processing</h3>
                  <p className="text-sm text-gray-600">Process and fulfill your orders efficiently</p>
                </div>
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2">Communication</h3>
                  <p className="text-sm text-gray-600">Send order confirmations and updates</p>
                </div>
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2">Support</h3>
                  <p className="text-sm text-gray-600">Provide personalized customer support</p>
                </div>
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2">Marketing</h3>
                  <p className="text-sm text-gray-600">Send marketing communications (with consent)</p>
                </div>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Shield className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">3. Data Security</h2>
              </div>
              <div className="bg-gradient-to-r from-brand-red/5 to-brand-blue/5 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  We implement comprehensive security measures to protect your personal information. 
                  Your payment information is processed through secure, encrypted payment gateways 
                  that comply with industry standards. We regularly monitor our systems for potential 
                  vulnerabilities and attacks.
                </p>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Mail className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">4. Your Rights</h2>
              </div>
              <p className="text-gray-700 mb-6">
                You have the following rights regarding your personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <User className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access & Correction</h3>
                    <p className="text-sm text-gray-600 mt-1">Access your personal information and correct inaccuracies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <Settings className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Deletion</h3>
                    <p className="text-sm text-gray-600 mt-1">Request deletion of your personal information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <Mail className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing Preferences</h3>
                    <p className="text-sm text-gray-600 mt-1">Opt out of marketing communications at any time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <Shield className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Portability</h3>
                    <p className="text-sm text-gray-600 mt-1">Request a copy of your data in a readable format</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Policy Updates */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Lock className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">5. Changes to This Policy</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or legal requirements. Any changes will be posted on this page with an updated 
                  "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <span>📧 scragro79@gmail.com</span>
              <span>•</span>
              <span>📞 +91 9868220018</span>
              <span>•</span>
              <Link to="/contact" className="text-brand-red hover:text-brand-blue transition-colors">
                Contact Form
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
};

export default PrivacyPolicy;