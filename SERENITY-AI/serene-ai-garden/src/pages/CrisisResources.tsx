import React from 'react';

const CrisisResources = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6 text-serenity-700">Crisis Resources (India)</h1>
    <p className="mb-6 text-gray-700">
      If you or someone you know is experiencing emotional distress, a mental health crisis, or suicidal thoughts, please reach out to one of the following 24/7 helplines. These services are free, confidential, and available in multiple languages. You are not alone—help is available.
    </p>
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Tele-MANAS (Govt. of India)</h2>
        <p className="text-gray-700 mb-1">National Tele Mental Health Programme</p>
        <p className="text-gray-700 mb-1">Phone: <b>14416</b></p>
        <p className="text-gray-700 mb-1">A government initiative providing 24x7 multilingual mental health support, counseling, and crisis intervention across India. Connects you to trained mental health professionals and local resources.</p>
        <a href="https://telemanas.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="text-serenity-600 underline">Learn more</a>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">KIRAN Helpline</h2>
        <p className="text-gray-700 mb-1">Phone: <b>1800-599-0019</b></p>
        <p className="text-gray-700 mb-1">A 24x7 toll-free helpline by the Ministry of Social Justice & Empowerment, offering support for mental health issues, emotional distress, and suicide prevention. Services available in 13 languages.</p>
        <a href="https://www.mosje.gov.in/schemes/kiran-mental-health-rehabilitation-helpline" target="_blank" rel="noopener noreferrer" className="text-serenity-600 underline">Learn more</a>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Vandrevala Foundation</h2>
        <p className="text-gray-700 mb-1">Phone: <b>9999-666-555</b></p>
        <p className="text-gray-700 mb-1">WhatsApp: <a href="https://api.whatsapp.com/send?phone=919999666555" target="_blank" rel="noopener noreferrer" className="underline text-serenity-600">Chat now</a></p>
        <p className="text-gray-700 mb-1">Free, anonymous, and confidential support for mental health concerns, available in major Indian languages. Offers both phone and WhatsApp support, staffed by trained counselors.</p>
        <a href="https://www.vandrevalafoundation.com/" target="_blank" rel="noopener noreferrer" className="text-serenity-600 underline">Learn more</a>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">AASRA (Mumbai)</h2>
        <p className="text-gray-700 mb-1">Phone: <b>+91-98204-66726</b></p>
        <p className="text-gray-700 mb-1">AASRA provides 24x7 crisis intervention and suicide prevention support. Their trained volunteers offer compassionate listening and guidance for anyone in distress.</p>
        <a href="https://www.aasra.info/helpline.html" target="_blank" rel="noopener noreferrer" className="text-serenity-600 underline">Learn more</a>
      </div>
    </div>
    <div className="mt-10 text-gray-600 text-sm">
      <p>If you are in immediate danger or need urgent medical attention, please call your local emergency number or visit the nearest hospital.</p>
      <p className="mt-2">For more mental health resources, visit the <a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="underline text-serenity-600">Ministry of Health & Family Welfare</a> or <a href="https://www.nimhans.ac.in/" target="_blank" rel="noopener noreferrer" className="underline text-serenity-600">NIMHANS</a>.</p>
    </div>
  </div>
);

export default CrisisResources; 