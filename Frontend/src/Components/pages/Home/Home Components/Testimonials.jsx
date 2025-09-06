import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { testimonials } from "../../../../temp/data.js";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-[42px] font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-[14px] text-gray-600 max-w-xl mx-auto">
            Join thousands of professionals who found their dream careers
            and built lasting success with JobPortal.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-300">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <FiStar
                      key={i}
                      className="h-6 w-6 text-yellow-400 fill-current"
                    />
                  )
                )}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* User Info */}
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={
                    testimonials[currentTestimonial].image || "/placeholder.svg"
                  }
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <div className="text-center md:text-left">
                  <h4 className="text-base font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-[14px] text-gray-600">
                    {testimonials[currentTestimonial].role} at{" "}
                    {testimonials[currentTestimonial].company}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-md hover:shadow-xl transition-all duration-200"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-md hover:shadow-xl transition-all duration-200"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentTestimonial
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-[28px] font-bold text-blue-600 mb-2">98%</div>
            <p className="text-[14px] text-gray-600">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-[28px] font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-[14px] text-gray-600">Happy Users</p>
          </div>
          <div className="text-center">
            <div className="text-[28px] font-bold text-blue-600 mb-2">4.9/5</div>
            <p className="text-[14px] text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
