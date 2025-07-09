import React from 'react';

const Contact = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
    <p className="text-gray-700 mb-6">Have questions or need support? Reach out to the Serenity AI team using the form below.</p>
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
  </div>
);

export default Contact; 