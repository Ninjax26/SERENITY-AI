import React from 'react';

const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p className="text-gray-700 mb-6">Your privacy is important to us. This policy explains how Serenity AI collects, uses, and protects your information.</p>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">1. Data Collection</h2>
      <p className="text-gray-600">We collect only the information you provide directly, such as messages you send to the AI, journal entries, and mood tracking data. We do not collect unnecessary personal information.</p>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">2. Data Usage</h2>
      <p className="text-gray-600">Your data is used solely to provide and improve your experience with Serenity AI. We do not sell or share your data with third parties for marketing purposes.</p>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
      <p className="text-gray-600">We use industry-standard security measures to protect your information. All conversations and entries are stored securely and are accessible only to you.</p>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">4. Your Choices</h2>
      <p className="text-gray-600">You can request deletion of your data at any time by contacting us. We respect your right to privacy and control over your information.</p>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-2">5. Contact Information</h2>
      <p className="text-gray-600">If you have questions or concerns about your privacy, please <a href="/contact" className="text-serenity-600 underline">contact us</a>.</p>
    </section>
  </div>
);

export default PrivacyPolicy; 