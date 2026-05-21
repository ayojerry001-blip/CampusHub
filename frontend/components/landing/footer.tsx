import { Award } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-fountain-dark text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-fountain-green-500" />
            <span className="text-xl font-bold text-white">Fountain Events</span>
          </div>
          <p className="text-sm">
            Comprehensive campus event management system designed specifically for Fountain University's diverse
            academic community and institutional excellence.
          </p>
          <p className="text-xs text-gray-500">FU</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Venues
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Resources
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <address className="not-italic text-sm space-y-2">
            <p>Fountain University</p>
            <p>Osgbo, Osun State</p>
            <p>Nigeria</p>
            <p>
              <a href="mailto:events@fountain.edu.ng" className="hover:text-white transition-colors">
                events@fountain.edu.ng
              </a>
            </p>
            <p>+234 (0) 803 123 4567</p>
          </address>
        </div>

        <div className="md:col-span-1 flex flex-col items-start md:items-end">
          <div className="flex space-x-4 text-sm mt-auto">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>&copy; 2024 Fountain University. All rights reserved.</p>
      </div>
    </footer>
  )
}
