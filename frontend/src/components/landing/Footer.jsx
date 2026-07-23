export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div>
            <h2 className="text-3xl font-bold text-[#C9A961]">
              FounderOS
            </h2>

            <p className="text-gray-400 mt-6">
              The all-in-one AI platform helping founders build better startups.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Product</h3>

            <ul className="space-y-3 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Dashboard</li>
              <li>AI Assistant</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Resources</h3>

            <ul className="space-y-3 text-gray-400">
              <li>Blog</li>
              <li>Documentation</li>
              <li>Community</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>About</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>

        </div>

        <hr className="my-10 border-gray-700" />

        <p className="text-center text-gray-500">
          © 2026 FounderOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}