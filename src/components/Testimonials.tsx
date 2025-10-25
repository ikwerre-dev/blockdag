"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Martinez",
    role: "Emergency Room Physician",
    content: "Bivo Health has revolutionized how we access patient records during emergencies. The NFC card system provides instant access to critical medical information, potentially saving lives.",
    rating: 5
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Chronic Disease Patient",
    content: "Having my complete medical history on the blockchain gives me peace of mind. I can share my records with any specialist instantly, and I always have control over my data.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Lisa Chen",
    role: "Family Medicine Practitioner",
    content: "The integration with our hospital systems is seamless. Patients love the convenience of the NFC cards, and we get comprehensive medical histories instantly.",
    rating: 5
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    role: "Elderly Care Patient",
    content: "My family can access my medical information when needed, and the NFC card is so simple to use. It's given us all confidence in managing my healthcare.",
    rating: 4
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => { 
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }; 

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
 
  return (
    <section className="py-16  px-4 sm:px-6 lg:px-8 bg-[#f0f8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#194dbe] text-center mb-8">What our users say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Hear from patients and healthcare providers who trust Bivo Health to manage their medical data securely on the blockchain.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#194dbe]" />
                ))}
              </div>
            </div>
            
            <blockquote className="text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed">
              &quot;{testimonials[currentIndex].content}&quot;
            </blockquote>
            
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-lg">{testimonials[currentIndex].name}</p>
              <p className="text-[#194dbe] font-medium">{testimonials[currentIndex].role}</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-[#194dbe]" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronRight className="w-6 h-6 text-[#194dbe]" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-[#194dbe]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;