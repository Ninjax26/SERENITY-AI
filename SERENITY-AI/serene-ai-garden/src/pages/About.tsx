import React from 'react';

const founders = [
  {
    name: 'Apoorv Pal',
    role: 'Co-Founder & Full Stack Developer',
    github: 'https://github.com/Ninjax26',
    linkedin: 'https://www.linkedin.com/in/apoorv-pal-1219a52bb/',
    bio: 'Apoorv is passionate about building AI-driven tools for mental wellness and loves turning random ideas into working prototypes.'
  },
  {
    name: 'Dhruv Patel',
    role: 'Co-Founder & Backend Developer',
    github: 'https://github.com/dhruv8903',
    linkedin: 'https://www.linkedin.com/in/dhruv-patel-53046b206/',
    bio: 'Dhruv specializes in backend architecture and system design, ensuring Serenity AI is robust, scalable, and secure.'
  }
];

const iconClass =
  'w-6 h-6 inline-block align-middle transition-transform duration-150 hover:scale-110 hover:text-blue-600';

const About = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">About Us</h1>
    <p className="text-gray-700 mb-6">
      Serenity AI is dedicated to supporting your mental wellness journey with innovative tools for mood tracking, journaling, AI chat, and community support.
    </p>
    <h2 className="text-2xl font-semibold mb-4">Meet the Founders</h2>
    <div className="space-y-8">
      {founders.map((founder) => (
        <div key={founder.name} className="bg-white/70 rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
            <p className="text-blue-700 font-medium mb-1">{founder.role}</p>
            <p className="text-gray-600 mb-2">{founder.bio}</p>
            <div className="flex gap-4 mt-2">
              <a
                href={founder.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub profile of ${founder.name}`}
                title="GitHub"
                className="hover:text-gray-800"
              >
                {/* GitHub SVG */}
                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn profile of ${founder.name}`}
                title="LinkedIn"
                className="hover:text-blue-700"
              >
                {/* LinkedIn SVG */}
                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default About; 
