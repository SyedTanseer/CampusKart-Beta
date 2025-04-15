import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getImageUrl, api } from '@/lib/api';

const ProfilePage = () => {
  const { user, isLoading: authLoading, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profile_picture: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDirectUpload, setIsDirectUpload] = useState(true);

  useEffect(() => {
    // Only navigate away if authentication check is complete and user is not logged in
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      console.log("User data from context:", user);
      console.log("User phone value:", user.phone, typeof user.phone);
      console.log("User bio value:", user.bio, typeof user.bio);
      
      const localStorageUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("User data from localStorage:", localStorageUser);

      // Initialize form data with user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profile_picture: null
      });

      // Handle profile picture
      if (user.profile_picture) {
        console.log("Profile picture path:", user.profile_picture);
        
        const imageUrl = getImageUrl(user.profile_picture);
        console.log("Setting profile picture URL to:", imageUrl);
        setPreviewUrl(imageUrl);
      } else {
        console.log("No profile picture found in user data");
        setPreviewUrl(null);
      }
    }
  }, [user, navigate, authLoading, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_picture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Function to upload image directly to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      console.log('Uploading image directly to Cloudinary');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'campuskart');
      formData.append('folder', 'campuskart/profiles');

      const cloudName = 'dvs5ngrt5';
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary upload failed:', errorData);
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Cloudinary upload result:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let profilePictureUrl = null;
      
      // If there's a profile picture and we're using direct upload, upload it to Cloudinary first
      if (formData.profile_picture && isDirectUpload) {
        try {
          profilePictureUrl = await uploadImageToCloudinary(formData.profile_picture);
          console.log('Image uploaded to Cloudinary:', profilePictureUrl);
        } catch (uploadError) {
          console.error('Cloudinary upload failed, falling back to server upload', uploadError);
          setIsDirectUpload(false); // Fall back to server-side upload
        }
      }

      // Update profile information first (without the profile picture)
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
      };
      
      // Update basic profile info
      const profileResponse = await api.put('/users/profile', profileData);
      console.log('Profile update response:', profileResponse.data);
      
      // Handle profile picture separately based on upload method
      let pictureResponse = profileResponse;
      
      if (formData.profile_picture) {
        if (isDirectUpload && profilePictureUrl) {
          // If we successfully uploaded to Cloudinary directly, send the URL
          pictureResponse = await api.put('/users/profile-picture', {
            profile_picture_url: profilePictureUrl
          });
          console.log('Profile picture update response (direct):', pictureResponse.data);
        } else {
          // Otherwise use the server-side upload with multipart form
          const pictureFormData = new FormData();
          pictureFormData.append('profile_picture', formData.profile_picture);
          
          pictureResponse = await api.put('/users/profile-picture', pictureFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Profile picture update response (server):', pictureResponse.data);
        }
      }
      
      // Get the final user data
      const finalUserData = pictureResponse.data.user || profileResponse.data.user || profileResponse.data;
      
      // Ensure user data is complete before updating
      const updatedUser = {
        ...finalUserData,
        phone: finalUserData.phone || '',
        bio: finalUserData.bio || ''
      };
      
      // Update user in context
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
      
      // Handle profile picture preview update
      if (formData.profile_picture) {
        if (profilePictureUrl) {
          // If we uploaded directly to Cloudinary, use that URL
          console.log('Setting directly uploaded profile picture URL:', profilePictureUrl);
          setPreviewUrl(profilePictureUrl);
        } else if (finalUserData.profile_picture) {
          // Otherwise use the returned profile picture path from the server
          const imageUrl = getImageUrl(finalUserData.profile_picture);
          console.log('Setting new profile picture URL after server upload:', imageUrl);
          setPreviewUrl(imageUrl);
        }
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  // If not loading and no user is found, don't render anything
  // (the useEffect will handle the navigation)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading image from:", previewUrl);
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23cccccc'/%3E%3Cpath d='M100,50 C83.4315,50 70,63.4315 70,80 C70,96.5685 83.4315,110 100,110 C116.569,110 130,96.5685 130,80 C130,63.4315 116.569,50 100,50 Z M55,150 L55,150 L145,150 C145,129.543 124.457,110 100,110 C75.5425,110 55,129.543 55,150 Z' fill='%23ffffff'/%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: Square image, at least 200x200 pixels
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 