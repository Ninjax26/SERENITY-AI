import React from 'react';
import { Heart, Shield, Sparkles, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Serenity AI?",
    answer: "Serenity AI is your compassionate AI companion, designed to support your emotional well-being and mental health through conversation, journaling, and mindfulness tools."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Your data is encrypted and stored securely. Serenity AI is privacy-first and never shares your information without your consent."
  },
  {
    question: "Can I talk to an AI companion?",
    answer: "Absolutely! You can chat with our AI companion anytime for support, reflection, or just to talk."
  },
  {
    question: "Do I need an account to journal?",
    answer: "You can explore some features without an account, but creating one lets you save your journal entries and track your progress securely."
  },
  {
    question: "How is my mood tracked?",
    answer: "You can log your mood daily. Serenity AI helps you visualize trends and gain insights into your emotional journey."
  }
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <section aria-label="Frequently Asked Questions" className="max-w-3xl mx-auto mb-10">
      <h3 className="text-lg font-semibold text-serenity-700 mb-4 text-center">FAQs</h3>
      <ul className="space-y-3">
        {faqs.map((faq, idx) => (
          <li key={faq.question} className="bg-serenity-50/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-serenity-300 transition"
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            <div
              id={`faq-panel-${idx}`}
              role="region"
              aria-hidden={openIndex !== idx}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 py-2 px-4' : 'max-h-0 py-0 px-4'}`}
            >
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/serenity-logo.png" alt="Serenity AI Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
                Serenity AI
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Your compassionate AI companion for emotional well-being and mental health support.
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-wellness-500" />
              <span className="text-sm text-gray-600">Privacy First • Secure • Confidential</span>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?chat">AI Companion</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/moodtracking">Mood Tracking</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?smartjournaling">Smart Journaling</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?wellnessinsights">Wellness Insights</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/mindfulnesstools">Mindfulness Tools</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/helpcenter">Help Center</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/contact">Contact Us</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/privacypolicy">Privacy Policy</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/terms">Terms and Conditions</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/crisis-resources">Crisis Resources</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/about">About Us</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/careers">Careers</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/press">Press</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/blog">Blog</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/community">Community</a></li>
            </ul>
          </div>
        </div>
        {/* FAQAccordion removed */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Serenity AI. Made with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> for mental wellness.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            Remember: You matter, and support is always within reach. Take a moment for yourself today.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
