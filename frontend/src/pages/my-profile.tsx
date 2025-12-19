import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import api from '../services/api';

interface ProfileForm {
  firstName: string;
  lastName: string;
  profileImage: FileList;
}

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileForm>();
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      if (user.profileImage) {
        setPreview(`http://localhost:5000${user.profileImage}`);
      }
    }
  }, [user, setValue]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    if (data.profileImage?.[0]) {
      formData.append('profileImage', data.profileImage[0]);
    }

    try {
      const response = await api.put('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(response.data.user);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          ← Back to Dashboard
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex justify-between items-start -mt-16 mb-6">
              <div className="flex items-end">
                <img
                  src={preview || 'https://via.placeholder.com/150'}
                  alt={user.firstName}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover"
                />
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-20 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input type="file" accept="image/*"
                    {...register('profileImage')}
                    onChange={onImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <button type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
