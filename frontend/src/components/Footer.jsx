import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Facebook, Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LehrKI
              </span>
            </div>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Empowering educators with AI-driven tools for creating engaging quizzes, 
              personalized parent communications, and comprehensive student assessments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/quiz-creator" className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                  Quiz Creator
                </Link>
              </li>
              <li>
                <Link to="/parent-letters" className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                  Parent Letters
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                support@lehrki.com
              </li>
              <li className="flex items-center text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-medium">
            © 2024 LehrKI. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
