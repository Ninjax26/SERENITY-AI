import React from 'react';

const HelpCenter = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6">Help Center</h1>
    <p className="text-gray-700 mb-6">Welcome to the Serenity AI Help Center. Find answers to common questions, tips for getting started, and ways to contact support.</p>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>Explore the Features section in the footer to access all tools.</li>
        <li>Use the AI Companion for chat-based support and guidance.</li>
        <li>Track your mood and journal your thoughts for better insights.</li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions (FAQs)</h2>
      <ul className="space-y-4">
        <li>
          <strong>Is my data private?</strong>
          <p className="text-gray-600">Yes, your conversations and data are private and secure. See our Privacy Policy for details.</p>
        </li>
        <li>
          <strong>How do I use the AI Companion?</strong>
          <p className="text-gray-600">Click on "AI Companion" in the Features section or navigation to start chatting with your AI support.</p>
        </li>
        <li>
          <strong>Can I access Serenity AI on mobile?</strong>
          <p className="text-gray-600">Yes, Serenity AI is mobile-friendly and works on most devices.</p>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
      <p className="text-gray-600 mb-2">If you have further questions or need support, please <a href="/contact" className="text-serenity-600 underline">contact us</a>.</p>
    </section>

    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-serenity-400 focus:ring-serenity-400" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-serenity-400 focus:ring-serenity-400" placeholder="you@email.com" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-serenity-400 focus:ring-serenity-400" placeholder="How can we help you?" />
        </div>
        <button type="submit" className="bg-serenity-500 hover:bg-serenity-600 text-white font-semibold px-6 py-2 rounded-md transition">Send Message</button>
      </form>
    </section>
  </div>
);

export default HelpCenter; 