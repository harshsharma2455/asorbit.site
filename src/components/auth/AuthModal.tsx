import React, { useState } from 'react';
import Modal from '../ui/Modal';
import InteractiveButton from '../ui/InteractiveButton';
import type { UserProfile, NotificationFunction } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onAuthSuccess: (user: UserProfile) => void;
  addNotification: NotificationFunction;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onAuthSuccess,
  addNotification
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create mock user profile
      const user: UserProfile = {
        id: crypto.randomUUID(),
        email: formData.email,
        name: mode === 'signup' ? formData.name : formData.email.split('@')[0],
        subscription: 'free',
        usageStats: {
          questionsGenerated: 0,
          diagramsCreated: 0,
          doubtsResolved: 0,
          papersCreated: 0,
          lastReset: new Date()
        },
        preferences: {
          notificationsEnabled: true,
          theme: 'light'
        }
      };

      onAuthSuccess(user);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Please try again later.',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: UserProfile = {
        id: crypto.randomUUID(),
        email: 'user@gmail.com',
        name: 'Google User',
        subscription: 'free',
        usageStats: {
          questionsGenerated: 0,
          diagramsCreated: 0,
          doubtsResolved: 0,
          papersCreated: 0,
          lastReset: new Date()
        },
        preferences: {
          notificationsEnabled: true,
          theme: 'light'
        }
      };

      onAuthSuccess(user);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Google Sign-in Failed',
        message: 'Please try again later.',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In to ASORBIT' : 'Create Your ASORBIT Account'}
      size="md"
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => onModeChange('signin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'signin'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onModeChange('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Google Sign In */}
        <InteractiveButton
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </InteractiveButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`interactive-input w-full p-3 border-2 rounded-xl focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`interactive-input w-full p-3 border-2 rounded-xl focus:border-primary-500 ${
                errors.email ? 'border-red-300' : 'border-slate-200'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`interactive-input w-full p-3 border-2 rounded-xl focus:border-primary-500 ${
                errors.password ? 'border-red-300' : 'border-slate-200'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`interactive-input w-full p-3 border-2 rounded-xl focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <InteractiveButton
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            className="w-full"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </InteractiveButton>
        </form>

        {/* Terms and Privacy */}
        {mode === 'signup' && (
          <p className="text-xs text-slate-500 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;