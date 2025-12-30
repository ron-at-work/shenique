"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

interface Address {
  id: string;
  type: "billing" | "shipping";
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders" | "wishlist">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "shipping" as "billing" | "shipping",
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "",
        dateOfBirth: "",
        gender: "",
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (editingAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id
              ? { ...addressForm, id: addr.id }
              : addressForm.isDefault && addr.type === addressForm.type
              ? { ...addr, isDefault: false }
              : addr
          )
        );
      } else {
        // Add new address
        const newAddress: Address = {
          ...addressForm,
          id: Date.now().toString(),
        };
        setAddresses((prev) => {
          const updated = addressForm.isDefault
            ? prev.map((addr) =>
                addr.type === addressForm.type ? { ...addr, isDefault: false } : addr
              )
            : prev;
          return [...updated, newAddress];
        });
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
      setMessage({ type: "success", text: "Address saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save address." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    setMessage({ type: "success", text: "Address deleted successfully!" });
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "shipping",
      firstName: "",
      lastName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B1E3A]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "addresses", label: "Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
    { id: "orders", label: "Orders", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "wishlist", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-white">
                {user.displayName || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Welcome"}
              </h1>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <nav className="divide-y divide-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#F5F0E6] text-[#7B1E3A] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#7B1E3A] hover:underline font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profileForm.firstName || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profileForm.lastName || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-gray-900 py-3">{profileForm.email}</p>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profileForm.phone || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileForm.dateOfBirth}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profileForm.dateOfBirth || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profileForm.gender}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                      >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="prefer-not">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-3 capitalize">{profileForm.gender || "—"}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                    className="px-4 py-2 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="mb-6 p-6 bg-[#F5F0E6] rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                          name="type"
                          value={addressForm.type}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        >
                          <option value="shipping">Shipping Address</option>
                          <option value="billing">Billing Address</option>
                        </select>
                      </div>
                      <div></div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={addressForm.firstName}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={addressForm.lastName}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input
                          type="text"
                          name="address1"
                          value={addressForm.address1}
                          onChange={handleAddressChange}
                          required
                          placeholder="House/Flat No., Building Name, Street"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          name="address2"
                          value={addressForm.address2}
                          onChange={handleAddressChange}
                          placeholder="Landmark, Area (Optional)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <select
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        >
                          <option value="">Select State</option>
                          {indianStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          required
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A]"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                            className="w-4 h-4 text-[#7B1E3A] rounded focus:ring-[#7B1E3A]"
                          />
                          <span className="text-sm text-gray-700">Set as default address</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleSaveAddress}
                        disabled={isSaving}
                        className="px-6 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Address"}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600 mb-4">Add an address for faster checkout</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-gray-200 rounded-xl p-4 relative"
                      >
                        {address.isDefault && (
                          <span className="absolute top-3 right-3 px-2 py-1 bg-[#C9A14A] text-white text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                        <p className="font-medium text-gray-900 mb-1 capitalize">
                          {address.type} Address
                        </p>
                        <p className="text-gray-700">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.address1}
                          {address.address2 && `, ${address.address2}`}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-[#7B1E3A] hover:underline text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:underline text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-4">View all your orders and track their status</p>
                  <Link
                    href="/orders"
                    className="inline-block px-6 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-4">Save your favorite items here for later</p>
                  <Link
                    href="/kurti"
                    className="inline-block px-6 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

