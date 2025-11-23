import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Send, Clock, Users, CheckCircle, Shield, Server, HelpCircle, Key, UserCog } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-brand-blue to-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Admin Support
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Get technical support and assistance for SCR Admin management system
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 md:py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-4">
                  Technical Support
                </h2>
                
                <div className="space-y-6">
                  <div className="group bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-500 p-3 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
                        <PhoneCall className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Admin Support</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-600 mb-1">Technical Support</p>
                            <a href="tel:+919868220018" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 text-lg">
                              +91 9868220018
                            </a>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">System Administrator</p>
                            <a href="tel:+919701039748" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 text-lg">
                              +91 9701039748
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-indigo-500 p-3 rounded-full group-hover:bg-indigo-600 transition-colors duration-300">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Email Support</h3>
                        <a href="mailto:scragro79@gmail.com" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 text-lg block mb-2">
                          scragro79@gmail.com
                        </a>
                        <p className="text-sm text-gray-600">Technical support & system issues</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-purple-500 p-3 rounded-full group-hover:bg-purple-600 transition-colors duration-300">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-lg mb-3 text-gray-800">System Status</h3>
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-600 font-medium">All Systems Operational</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">SCR Admin v1.0</p>
                        <Link 
                          to="/system-status" 
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                        >
                          View Detailed Status
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-brand-blue to-brand-red text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 mr-3" />
                    <h3 className="font-bold text-lg">Support Hours</h3>
                  </div>
                  <div className="space-y-2 text-blue-100">
                    <p>Monday - Saturday: 8am - 8pm</p>
                    <p>Sunday: 9am - 6pm</p>
                    <p className="text-sm mt-2">Emergency support available for critical system issues</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-4">
                  Technical Support Request
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Support Request Sent!</h3>
                    <p className="text-gray-600">We've received your support request and will get back to you soon.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                          Your Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-bold text-gray-700">
                        Issue Type *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      >
                        <option value="">Select issue type</option>
                        <option value="login-issues">Login & Authentication Issues</option>
                        <option value="data-management">Data Management Problems</option>
                        <option value="order-processing">Order Processing Errors</option>
                        <option value="inventory-management">Inventory Management</option>
                        <option value="reporting-issues">Reporting & Analytics</option>
                        <option value="system-performance">System Performance</option>
                        <option value="feature-request">Feature Request</option>
                        <option value="other">Other Technical Issue</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-bold text-gray-700">
                        Detailed Description *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe the issue in detail, including any error messages and steps to reproduce..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                      />
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-brand-red to-brand-blue hover:from-brand-red/90 hover:to-brand-blue/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Submit Support Request
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Updated for Admin Application */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Admin System FAQs
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Common questions about SCR Admin management system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <UserCog className="h-6 w-6" />,
                question: "How do I reset my admin password?",
                answer: "Use the 'Forgot Password' feature on the login page. If you're still having issues, contact technical support for immediate assistance."
              },
              {
                icon: <Shield className="h-6 w-6" />,
                question: "What should I do if I see 'Access Denied'?",
                answer: "This usually means your account permissions need updating. Contact the system administrator to verify your role and access levels."
              },
              {
                icon: <Server className="h-6 w-6" />,
                question: "The system is running slow. What can I do?",
                answer: "First, try refreshing the page and clearing your browser cache. If the issue persists, check the system status page or contact support for performance issues."
              },
              {
                icon: <Key className="h-6 w-6" />,
                question: "How do I manage user permissions?",
                answer: "User permissions can be managed through the Admin Settings panel. Only users with 'Super Admin' privileges can modify user roles and permissions."
              },
              {
                icon: <HelpCircle className="h-6 w-6" />,
                question: "Can I export data from the system?",
                answer: "Yes, most data can be exported in CSV format. Use the export features available in the Analytics and Reports sections. For bulk exports, contact support."
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                question: "How often is the data backed up?",
                answer: "System data is automatically backed up daily. All critical data is secured with multiple redundancy measures to prevent data loss."
              },
              {
                icon: <Users className="h-6 w-6" />,
                question: "Can multiple admins use the system simultaneously?",
                answer: "Yes, multiple admin users can access the system concurrently. However, be cautious when multiple users are editing the same data to avoid conflicts."
              },
              {
                icon: <Clock className="h-6 w-6" />,
                question: "What's the process for system updates?",
                answer: "System updates are typically performed during off-peak hours. You'll receive advance notice for scheduled maintenance. Most updates require no action from users."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <div className="text-brand-red group-hover:text-brand-blue transition-colors duration-200 mr-3">
                    {faq.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-brand-red transition-colors duration-200">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;