import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Instagram, Facebook, Twitter, HelpCircle, Server, Shield, LogOut } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-brand-blue/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <PhoneCall className="h-5 w-5 text-brand-red mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Mrs. Sarika Reddy</p>
                  <p className="text-sm">+91 9868220018</p>
                  <p className="text-sm font-medium mt-2">S. Chandrasheker Reddy</p>
                  <p className="text-sm">+91 9701039748</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-brand-red mt-0.5 mr-2" />
                <p className="text-sm">scragro79@gmail.com</p>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-red mt-0.5 mr-2" />
                <p className="text-sm">SCR Agrofarms, NH-40, Gyrampalli, Annamaya Dist, AP-517213</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-brand-red transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-brand-red transition-colors">About us</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-brand-red transition-colors">Terms & Conditions</Link>
              </li>
              
              <li>
                <Link to="/contact" className="text-sm hover:text-brand-red transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Operating Hours</h3>
            <div className="space-y-2">
              <p className="text-sm">Mon - Sat: 8am - 8pm</p>
              <p className="text-sm">Sunday: 9am - 6pm</p>
            </div>
            <div className="pt-2">
              <h4 className="text-md font-semibold">Connect With Us</h4>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-gray-600 hover:text-brand-red transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-brand-red transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-brand-red transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* System & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">System </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Server className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span className="text-sm">🟢 All Systems Operational</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-brand-red mt-0.5 mr-2" />
                <span className="text-sm">SCR Admin v1.0</span>
              </div>
              <div className="pt-2 space-y-2">
                
    
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SCR Agro Farms. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Logged in as: Admin</span>
              <span>•</span>
              <span>Last sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;