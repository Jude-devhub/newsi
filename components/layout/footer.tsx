import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-500 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo / About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Newsi</h2>
            <p className="text-sm">
              Your source for the latest updates in Entertainment, Sports, Tech, Finance and More...
            </p>
          </div>

          {/* Column 2 - Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/entertainment" className="hover:text-yellow-400">Entertainment</Link></li>
              <li><Link href="/sports" className="hover:text-yellow-400">Sports</Link></li>
              <li><Link href="/tech" className="hover:text-yellow-400">Tech</Link></li>
              <li><Link href="/finance" className="hover:text-yellow-400">Finance</Link></li>
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-yellow-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-yellow-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-yellow-400">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm">📍 Lagos, Nigeria</p>
            <p className="text-sm">✉ judeokechukwuogbonna@gmail.com</p>
            <p className="text-sm">☎ +234 706 294 3561</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Newsi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
