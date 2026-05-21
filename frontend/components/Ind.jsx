'use client'

import React from 'react'
import {
  Award,
  CalendarDays,
  Users,
  Zap,
  BarChart3,
  Shield,
  GraduationCap,
  ArrowRight,
  Calendar,
  MessageCircle,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  Building2,
  CheckCircle,
} from 'lucide-react'

export default function IndependentLandingPage() {
  const handleSignIn = () => {
    window.location.href = '/login'
  }

  const handleGetStarted = () => {
    window.location.href = '/register '
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">CampusHub</span>
              <span className="text-sm text-gray-600">Event & Venue Management</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSignIn}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={handleGetStarted}
              className="bg-sky-500 text-white px-5 py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Pattern */}
      <section className="relative px-6 py-24 text-center overflow-hidden bg-gradient-to-b from-blue-50 via-sky-50 to-white">
        {/* Grid pattern background */}
        <div className="absolute inset-0 -z-10">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="none" stroke="#7dd3fc" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative blurred circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 -z-10"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 mb-8 border border-gray-300">
            <Award className="h-4 w-4 text-sky-500" />
            Smart Campus Event Management & Venue Booking
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-8">
            Transform Your <span className="text-sky-500">Campus Experience</span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            The comprehensive event management and venue booking platform for modern campuses. From planning to execution, streamline every aspect of your events with intelligent automation and seamless collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-sky-500 text-white px-8 py-3 rounded-lg hover:bg-sky-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Start Managing Events
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={handleSignIn}
              className="border-2 border-sky-500 text-sky-500 px-8 py-3 rounded-lg hover:bg-sky-50 transition-colors font-semibold"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Event Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From students to administrators, our platform provides comprehensive tools for efficient event and venue management across your entire campus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: CalendarDays,
                title: "Smart Event Planning",
                description:
                  "Streamlined event creation with intelligent scheduling, automated conflict detection, and smart recommendations.",
              },
              {
                icon: Users,
                title: "Community Engagement",
                description:
                  "Connect attendees through seamless registration, networking features, and anonymous feedback systems.",
              },
              {
                icon: Building2,
                title: "Venue Management",
                description:
                  "Comprehensive venue booking system with real-time availability and resource allocation optimization.",
              },
              {
                icon: CheckCircle,
                title: "Secure Approvals",
                description:
                  "Multi-level approval workflows ensuring proper authorization and maintaining institutional governance.",
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <div key={idx} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-sky-200 transition-all border border-gray-200 hover:-translate-y-1">
                  <div className="inline-block p-4 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-7 w-7 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-24 px-6 bg-white relative">
        <div className="absolute inset-0 -z-10 opacity-30">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="#e0f2fe"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Intelligent Campus Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Beyond basic event management. Our advanced features are designed to enhance your campus experience through smart technology, seamless venue booking, and community-driven features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Schedule Clash Detection',
                description:
                  'Intelligent alerts when events conflict with your calendar, classes, exams, or other registered commitments. Never double-book again.',
                highlights: ['Real-time notifications', 'Calendar sync', 'Conflict detection'],
              },
              {
                icon: Users,
                title: 'Course-Based Networking',
                description:
                  'Connect with peers from your course attending the same events. Build study circles and meaningful relationships within your academic community.',
                highlights: ['Find peers instantly', 'Study group creation', 'Community connections'],
              },
              {
                icon: MessageCircle,
                title: 'Anonymous Q&A System',
                description:
                  'Ask questions and provide feedback anonymously during events without worrying about judgment or visibility of your identity.',
                highlights: ['Complete privacy', 'Instant engagement', 'Honest feedback'],
              },
              {
                icon: Sparkles,
                title: 'Smart Event Recommendations',
                description:
                  'Discover events tailored to your interests and profile with our AI-powered intelligent suggestion engine.',
                highlights: ['Personalized picks', 'Interest matching', 'Never miss relevant events'],
              },
              {
                icon: MapPin,
                title: 'Integrated Venue Booking',
                description:
                  'Seamlessly reserve spaces and venues for your events with real-time availability, capacity management, and easy coordination.',
                highlights: ['One-click booking', 'Availability tracking', 'Capacity management'],
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <div key={idx} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-sky-300 hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="inline-block p-4 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {feature.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center text-sm text-gray-700 font-medium">
                        <span className="inline-block w-2 h-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mr-3"></span>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-sky-50 to-blue-50 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-sky-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Trusted by Campus Communities <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Worldwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real numbers that showcase our impact on event management, venue booking, and community engagement.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '500+', label: 'Events Organized', sublabel: 'Successful campus events' },
              { stat: '11', label: 'Venues Available', sublabel: 'Across all colleges' },
              { stat: '2,000+', label: 'Active Users', sublabel: 'Students, staff, and faculty' },
              { stat: '98%', label: 'Success Rate', sublabel: 'Streamlined processes' },
            ].map((item, idx) => (
              <div key={idx} className="group bg-white backdrop-blur-sm rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all border border-white/50 hover:border-sky-200 hover:-translate-y-2">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">{item.stat}</div>
                <p className="text-base font-semibold text-gray-900 mb-1">{item.label}</p>
                <p className="text-sm text-gray-600">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 60 60 M 60 0 L 0 60" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">Ready to Revolutionize Your Campus?</h2>
          <p className="text-xl mb-12 opacity-95 leading-relaxed">
            Join thousands of institutions transforming campus event management and venue booking with our comprehensive,
            intelligent platform designed for modern campuses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-sky-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg group"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleSignIn}
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">CampusHub</span>
              </div>
              <p className="text-sm leading-relaxed">
                Comprehensive campus event management and venue booking system designed to streamline events and foster community engagement across institutions.
              </p>
              <p className="text-xs text-gray-500 font-medium">© 2024 CampusHub. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition-colors font-medium">Events</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors font-medium">Venues</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors font-medium">Resources</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors font-medium">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Contact</h3>
              <address className="not-italic text-sm space-y-4">
                <p className="font-medium text-white">CampusHub Support</p>
                <p>
                  <a href="mailto:support@campushub.io" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    support@campushub.io
                  </a>
                </p>
                <p>
                  <a href="tel:+1234567890" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +1 (234) 567-8900
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-sm text-gray-500 font-medium">
              Privacy Policy · Terms of Service · Cookie Settings
            </p>
            <div className="flex gap-6">
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors group">
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors group">
                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors group">
                <Github className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors group">
                <Mail className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
