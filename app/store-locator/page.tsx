"use client";

import { useState } from "react";

const stores = [
  {
    id: 1,
    name: "Shenique - Lajpat Nagar",
    address: "Shop No. 45, Central Market, Lajpat Nagar II",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110024",
    phone: "+91 8799718988",
    hours: "10:00 AM - 8:00 PM",
    days: "Monday to Sunday",
    mapUrl: "https://maps.google.com/?q=Lajpat+Nagar+Central+Market+Delhi",
  },
  {
    id: 2,
    name: "Shenique - Karol Bagh",
    address: "23/A, Ajmal Khan Road, Near Metro Station",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110005",
    phone: "+91 9315729367",
    hours: "10:00 AM - 8:00 PM",
    days: "Monday to Sunday",
    mapUrl: "https://maps.google.com/?q=Karol+Bagh+Ajmal+Khan+Road+Delhi",
  },
  {
    id: 3,
    name: "Shenique - Chandni Chowk",
    address: "1234, Katra Neel, Near Fatehpuri Masjid",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110006",
    phone: "+91 8799718988",
    hours: "10:30 AM - 7:30 PM",
    days: "Monday to Saturday (Closed on Sunday)",
    mapUrl: "https://maps.google.com/?q=Chandni+Chowk+Delhi",
  },
];

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStores(stores);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchLower) ||
        store.address.toLowerCase().includes(searchLower) ||
        store.city.toLowerCase().includes(searchLower) ||
        store.pincode.includes(query)
    );
    setFilteredStores(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Store Locator</h1>
          <p className="text-gray-200">Visit our stores for an exclusive shopping experience</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by city, area, or pincode..."
              className="w-full px-5 py-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E3A] focus:border-transparent text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Store Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-[#7B1E3A]">{filteredStores.length}</span> store{filteredStores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stores Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Store Header */}
                <div className="bg-[#7B1E3A] text-white p-4">
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                </div>

                {/* Store Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A14A] shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-700">{store.address}</p>
                      <p className="text-gray-600">{store.city}, {store.state} - {store.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C9A14A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${store.phone}`} className="text-[#7B1E3A] hover:underline">
                      {store.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A14A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-700">{store.hours}</p>
                      <p className="text-gray-500 text-sm">{store.days}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex gap-3">
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-4 bg-[#7B1E3A] text-white text-center rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
                    >
                      Get Directions
                    </a>
                    <a
                      href={`tel:${store.phone}`}
                      className="py-2 px-4 border border-[#7B1E3A] text-[#7B1E3A] rounded-lg font-medium hover:bg-[#F5F0E6] transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try searching with a different city or pincode</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-[#F5F0E6] rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-[#7B1E3A] mb-4">Can't Find a Store Near You?</h2>
          <p className="text-gray-600 mb-6">
            Shop from our online store and get your favorite kurtis delivered to your doorstep!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kurti"
              className="px-6 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
            >
              Shop Online
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-[#7B1E3A] text-[#7B1E3A] rounded-lg font-medium hover:bg-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

