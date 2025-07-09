import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    <section aria-label="Frequently Asked Questions" className="max-w-3xl mx-auto my-12">
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

const Blog = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">Blog</h1>
    <p className="text-gray-700 mb-2">Read the latest articles and updates from Serenity AI.</p>
    <p className="text-gray-600">This is a placeholder Blog page. Posts will appear here soon.</p>
    <FAQAccordion />
  </div>
);

export default Blog; 