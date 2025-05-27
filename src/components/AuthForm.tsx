
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, User, UserCheck, Crown } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'govt_admin'>('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const roles = [
    { value: 'user', label: 'User', icon: User, description: 'Regular safety app user' },
    { value: 'admin', label: 'Admin', icon: UserCheck, description: 'Safety administrator' },
    { value: 'govt_admin', label: 'Government Admin', icon: Crown, description: 'Government official' }
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        onAuthSuccess();
      } else {
        // Sign up the user first
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
            }
          }
        });
        
        if (error) throw error;
        
        // If user is created, update their profile with the selected role
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              role: selectedRole,
              full_name: fullName,
              phone_number: phoneNumber 
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                full_name: fullName,
                phone_number: phoneNumber,
                role: selectedRole,
              });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
            }
          }
        }
        
        toast({
          title: "Account created!",
          description: `Your SafeGuard ${selectedRole} account has been created successfully.`,
        });
        onAuthSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-emergency-600" />
            <h1 className="text-2xl font-bold text-gray-900">SafeGuard</h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your safety account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <label
                        key={role.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedRole === role.value
                            ? 'border-emergency-500 bg-emergency-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selectedRole === role.value}
                          onChange={(e) => setSelectedRole(e.target.value as any)}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{role.label}</div>
                          <div className="text-sm text-gray-600">{role.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emergency-600 hover:bg-emergency-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emergency-600 hover:text-emergency-700 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
