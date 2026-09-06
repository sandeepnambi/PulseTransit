import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { Bus, MapPin, Clock, Shield, Users, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { setIsAuthModalOpen } = useTransit();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">PulseTransit</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Real-Time Transit Tracking</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Track Tamil Nadu
              <span className="text-primary-600"> Buses</span> Live
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Get real-time updates on MTC, TNSTC, and SETC buses across Tamil Nadu. 
              Plan your journey with accurate ETAs, live bus tracking, and multilingual support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-16 h-16 text-primary-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">102K - On Time (4 min)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">21G - Delayed (7 min)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">29C - On Time (12 min)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed for seamless transit experience across Tamil Nadu
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Tracking</h3>
              <p className="text-slate-600">Real-time bus locations with GPS accuracy</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accurate ETAs</h3>
              <p className="text-slate-600">Predict arrival times with precision</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Emergency SOS</h3>
              <p className="text-slate-600">Quick emergency alerts with SMS</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Multilingual</h3>
              <p className="text-slate-600">English & Tamil language support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Track Your Journey?</h2>
          <p className="text-lg text-primary-100 mb-8">
            Join thousands of commuters across Tamil Nadu using PulseTransit
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2024 PulseTransit. Real-time transit tracking for Tamil Nadu.</p>
        </div>
      </footer>
    </div>
  );
}
