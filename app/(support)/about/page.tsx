// app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Newsi</h1>
      <p className="mb-4 text-lg text-gray-700">
        Welcome to <span className="font-semibold">Newsi</span> – your trusted
        source for credible, real-time news. Our mission is to keep you informed
        with the latest stories from around the world, delivered in a fast,
        reliable, and accessible way.
      </p>

      <p className="mb-4 text-lg text-gray-700">
        Powered by the <a href="https://newsapi.org" className="text-blue-600 underline">NewsAPI</a>, 
        Newsi aggregates breaking news across categories such as Finance,
        Entertainment, Local, Sports, Tech, and World. We combine this with
        country detection so you can stay updated on news that matters most to
        you.
      </p>

      <p className="mb-4 text-lg text-gray-700">
        Whether you're checking headlines on your morning commute, catching up
        during lunch, or browsing at home, Newsi ensures you have access to
        accurate and up-to-date information — anytime, anywhere.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Our Values</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>✅ Credibility – we source news from trusted providers.</li>
        <li>⚡ Speed – real-time updates as they happen.</li>
        <li>🌍 Accessibility – localized news based on your region.</li>
        <li>📱 Simplicity – a clean, user-friendly reading experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
      <p className="text-lg text-gray-700">
        Have feedback, suggestions, or partnership inquiries? Reach out to us at: <br />
        <a href="mailto:judeokechukwuogbonna@gmail.com" className="text-blue-600 underline">
          judeokechukwuogbonna@gmail.com
        </a>
      </p>

      <p className="text-lg text-gray-700 mt-2 ">
        Design and Develop by Jude Okechukwu Ogbonna
      </p>
      <p className="text-lg text-gray-700 mt-2">
        Phone: +234 706 294 3561
      </p>

        <p className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Newsi. All rights reserved.
      </p>
    </main>
  );
}
