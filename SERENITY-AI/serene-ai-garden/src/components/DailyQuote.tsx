import React, { useEffect, useState } from 'react';

const fallbackQuote = {
  content: "Keep going. Everything you need will come to you at the perfect time.",
  author: "Unknown"
};

const DailyQuote = () => {
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then((res) => {
        if (!res.ok) throw new Error('Quotable API error');
        return res.json();
      })
      .then((data) => setQuote(data))
      .catch(() => {
        // Try zenquotes.io as fallback
        fetch('https://zenquotes.io/api/random')
          .then((res) => {
            if (!res.ok) throw new Error('ZenQuotes API error');
            return res.json();
          })
          .then((data) => {
            if (Array.isArray(data) && data[0]) {
              setQuote({ content: data[0].q, author: data[0].a });
            } else {
              setQuote(fallbackQuote);
            }
          })
          .catch(() => setQuote(fallbackQuote));
      });
  }, []);

  return (
    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mb-6 text-center animate-fadeIn">
      {quote ? (
        <>
          <p className="text-lg text-gray-700 dark:text-gray-300 italic flex items-center justify-center gap-2">
            <span role="img" aria-label="quote">📜</span>“{quote.content}”
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">– {quote.author}</p>
        </>
      ) : (
        <p className="text-gray-400">Loading something inspiring...</p>
      )}
    </div>
  );
};

export default DailyQuote; 