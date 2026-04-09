import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmName: '',
    farmSize: '',
    location: '',
    farmType: '',
    experience: '',
    specialization: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    // Load user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setProfileData(prev => ({
        ...prev,
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        farmName: parsedUser.farmName || '',
        farmSize: parsedUser.farmSize || '',
        location: parsedUser.location || '',
        farmType: parsedUser.farmType || '',
        experience: parsedUser.experience || '',
        specialization: parsedUser.specialization || '',
        bio: parsedUser.bio || '',
        avatar: parsedUser.avatar || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage
      const updatedUser = {
        ...user,
        ...profileData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setProfileData(prev => ({
        ...prev,
        ...parsedUser
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 sm:px-12 py-10 sm:py-16 text-white relative overflow-hidden">
              {/* Subtle decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
              
              <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/20 rounded-[2.5rem] flex items-center justify-center text-3xl font-black backdrop-blur-md border-4 border-white/30 shadow-2xl overflow-hidden transform hover:rotate-3 transition-transform duration-500">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{getInitials(profileData.firstName, profileData.lastName) || '👤'}</span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
                    {profileData.firstName && profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : profileData.email?.split('@')[0] || 'Member Profile'
                    }
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 opacity-90">
                    {profileData.farmName && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm font-bold border border-white/20">
                        🚜 {profileData.farmName}
                      </span>
                    )}
                    <span className="text-sm font-medium opacity-80">{profileData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Details</h2>
                <div className="flex w-full sm:w-auto gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition duration-300 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex w-full sm:w-auto gap-3">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition duration-300 border-2 border-transparent hover:border-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.lastName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.email || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State/Province, Country"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.location || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Farm Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    Farm Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="farmName"
                        value={profileData.farmName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your farm name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.farmName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Size (acres/hectares)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="farmSize"
                        value={profileData.farmSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 50 acres, 20 hectares"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.farmSize || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Type
                    </label>
                    {isEditing ? (
                      <select
                        name="farmType"
                        value={profileData.farmType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select farm type</option>
                        <option value="crop">Crop Farming</option>
                        <option value="livestock">Livestock</option>
                        <option value="mixed">Mixed Farming</option>
                        <option value="organic">Organic Farming</option>
                        <option value="hydroponic">Hydroponic</option>
                        <option value="greenhouse">Greenhouse</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.farmType || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farming Experience
                    </label>
                    {isEditing ? (
                      <select
                        name="experience"
                        value={profileData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner (0-2 years)</option>
                        <option value="intermediate">Intermediate (3-5 years)</option>
                        <option value="experienced">Experienced (6-10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.experience || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Rice cultivation, Vegetable farming"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.specialization || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Bio Section - Full Width */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    About You
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio / Description
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself, your farming goals, and interests..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2 whitespace-pre-wrap">
                        {profileData.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                    Change Password
                  </button>
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
                    Download Data
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;