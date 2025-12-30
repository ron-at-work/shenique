import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">About Shenique</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Celebrating 35+ Years of Crafting Elegance
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&h=600&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-serif text-[#7B1E3A] text-center mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="mb-6">
              Shenique was born out of a passion for creating beautiful, comfortable, and affordable ethnic wear for women. 
              With over 35 years of experience in the fashion industry, we have established ourselves as a trusted name 
              in women's kurtis and woolen kurtis.
            </p>
            <p className="mb-6">
              Our journey began with a small workshop and a dream to bring the finest quality kurtis to every Indian woman. 
              Today, we have grown into a beloved brand with customers across the country, but our core values remain the same – 
              quality, comfort, and style at affordable prices.
            </p>
            <p>
              Every piece at Shenique is crafted with love and attention to detail. From selecting the finest fabrics to 
              ensuring perfect stitching, we take pride in delivering products that make our customers feel beautiful and confident.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif text-[#7B1E3A] text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-[#F5F0E6] rounded-2xl">
              <div className="w-16 h-16 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every fabric is carefully selected and every stitch is perfected.
              </p>
            </div>
            <div className="text-center p-8 bg-[#F5F0E6] rounded-2xl">
              <div className="w-16 h-16 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Love</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. Your satisfaction is our greatest reward.
              </p>
            </div>
            <div className="text-center p-8 bg-[#F5F0E6] rounded-2xl">
              <div className="w-16 h-16 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Affordable Elegance</h3>
              <p className="text-gray-600">
                Beautiful fashion shouldn't break the bank. We offer premium quality at prices everyone can afford.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-[#F5F0E6] rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-serif text-[#7B1E3A] text-center mb-8">Why Choose Shenique?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">35+ Years of Experience</h4>
                <p className="text-gray-600 text-sm">Decades of expertise in ethnic fashion</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium Quality Fabrics</h4>
                <p className="text-gray-600 text-sm">Only the finest materials for our customers</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pan-India Delivery</h4>
                <p className="text-gray-600 text-sm">We deliver to every corner of India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                <p className="text-gray-600 text-sm">Hassle-free return and exchange policy</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure Payments</h4>
                <p className="text-gray-600 text-sm">100% secure payment gateway</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">24/7 Support</h4>
                <p className="text-gray-600 text-sm">Always here to help you</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Ready to Experience Shenique?</h2>
          <p className="text-gray-600 mb-8">Explore our latest collection of beautiful kurtis</p>
          <Link 
            href="/kurti" 
            className="inline-block px-8 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
          >
            Shop Now
          </Link>
        </section>
      </main>
    </div>
  );
}

