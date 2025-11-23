import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, UserCog, Server, Database, Lock, Eye, Trash2, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
                <UserCog className="h-8 w-8 text-brand-blue absolute -top-2 -right-2" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
                SCR Admin Terms of Service
              </h1>
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-700 font-medium"
            >
              Last Updated: April 18, 2025
            </motion.p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
              These Terms of Service govern your use of the SCR Admin application. 
              By accessing and using SCR Admin, you agree to comply with these terms and conditions.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Account Access and Security */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Lock className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">1. Account Access and Security</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Admin accounts are granted to authorized personnel only. You are responsible for:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                    Maintaining the confidentiality of your login credentials
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                    Not sharing your account with unauthorized users
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                    Immediately reporting any security breaches or unauthorized access
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Data Management and Privacy */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Database className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">2. Data Management and Privacy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Data Access
                  </h3>
                  <p className="text-sm text-gray-600">You may only access data necessary for your administrative duties</p>
                </div>
                <div className="bg-brand-blue/5 rounded-lg p-4">
                  <h3 className="font-semibold text-brand-blue mb-2 flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Data Modification
                  </h3>
                  <p className="text-sm text-gray-600">All data modifications are logged and subject to audit</p>
                </div>
              </div>
            </motion.div>

            {/* Permissions and Responsibilities */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <UserCog className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">3. Admin Permissions and Responsibilities</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <Shield className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Authorized Actions</h3>
                    <p className="text-sm text-gray-600 mt-1">You may perform only those actions that are within your assigned role permissions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                    <AlertCircle className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prohibited Activities</h3>
                    <p className="text-sm text-gray-600 mt-1">Unauthorized data export, system manipulation, or privilege escalation is strictly prohibited</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Usage */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Server className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">4. System Usage Guidelines</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  The SCR Admin application is for legitimate business operations only. 
                  Any misuse or unauthorized access may result in account termination and legal action.
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-3">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Use the system only during authorized business hours
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Report any system issues or bugs immediately
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Do not attempt to bypass system security measures
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                  Log out after each session on shared devices
                </li>
              </ul>
            </motion.div>

            {/* Data Backup and Recovery */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Database className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">5. Data Integrity and Backup</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-brand-blue/5 rounded-lg p-4">
                  <span className="font-semibold text-brand-blue">Automatic Backups</span>
                  <span className="text-sm text-gray-600">System performs daily automated backups</span>
                </div>
                <div className="flex items-center justify-between bg-brand-blue/5 rounded-lg p-4">
                  <span className="font-semibold text-brand-blue">Data Retention</span>
                  <span className="text-sm text-gray-600">All actions are logged for 365 days</span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  * While we maintain regular backups, administrators should exercise caution when 
                  making significant data changes.
                </p>
              </div>
            </motion.div>

            {/* Compliance and Auditing */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Shield className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">6. Compliance and Auditing</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-2">Activity Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">All Actions Logged</p>
                    <p className="text-green-700">Complete audit trail maintained</p>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Regular Audits</p>
                    <p className="text-green-700">Monthly security reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <BookOpen className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">7. Intellectual Property</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  The SCR Admin application, including its design, code, and proprietary algorithms, 
                  is the intellectual property of SCR Agro Farms. You may not reverse engineer, 
                  decompile, or attempt to derive source code from the application.
                </p>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <AlertCircle className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">8. Limitation of Liability</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                SCR Agro Farms shall not be liable for any indirect, incidental, or consequential damages 
                arising from the use or inability to use the SCR Admin application, including but not 
                limited to data loss, business interruption, or system downtime.
              </p>
            </motion.div>

            {/* Termination */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <UserCog className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">9. Account Termination</h2>
              </div>
              <div className="bg-gray-100 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed text-center">
                  SCR Agro Farms reserves the right to suspend or terminate admin accounts 
                  for violations of these terms, security concerns, or upon employee termination. 
                  All access rights will be immediately revoked.
                </p>
              </div>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-6">
                <Clock className="h-6 w-6 text-brand-red mt-1 mr-4 flex-shrink-0" />
                <h2 className="text-2xl font-display font-bold text-gray-900">10. Changes to Terms</h2>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms of Service at any time. Continued use of the SCR Admin 
                  application after changes constitutes acceptance of the modified terms. 
                  Significant changes will be communicated to all admin users.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-12 pt-8 border-t border-gray-200"
          >
            
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
};

export default Terms;