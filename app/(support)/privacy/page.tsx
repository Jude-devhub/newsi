import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Privacy Policy</h1>
        <p className="text-sm text-slate-600">Last updated: October 12, 2025</p>
      </header>

      <section className="space-y-6 text-slate-700 leading-relaxed">
        <p>
          This Privacy Policy explains how we collect, use, and protect your information when you use our website or services. By using our site, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, and message details when you contact us or use our services. We also collect non-personal information such as browser type and usage statistics.
        </p>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p>
          Your information is used to provide and improve our services, respond to inquiries, send updates, and enhance user experience. We will never sell or share your personal data without your consent, except as required by law.
        </p>

        <h2 className="text-xl font-semibold">3. Data Security</h2>
        <p>
          We use appropriate security measures to protect your personal information. However, please note that no method of transmission over the Internet is completely secure.
        </p>

        <h2 className="text-xl font-semibold">4. Cookies</h2>
        <p>
          Our website may use cookies to improve your browsing experience. You can choose to disable cookies through your browser settings, but some parts of the website may not function properly as a result.
        </p>

        <h2 className="text-xl font-semibold">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data. If you wish to exercise these rights, please contact us using the information provided below.
        </p>

        <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date.
        </p>

        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul className="list-disc list-inside">
          <li>Email: judeokechukwuogbonna@gmail.com</li>
          <li>Phone: +234 706 294 3561</li>
        </ul>
      </section>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <Link href="/terms" className="underline hover:text-slate-700">View our Terms of Use</Link>
      </footer>
    </main>
  );
}
