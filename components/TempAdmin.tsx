
import React, { useState } from 'react';
import { authService, profileService } from '../lib/supabase';

const TempAdmin = () => {
  const [email, setEmail] = useState('freddy.bremseth@gmail.com');
  const [password, setPassword] = useState('Astro2026');
  const [name, setName] = useState('Freddy Bremseth');
  const [credits, setCredits] = useState(200000);
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async () => {
    setMessage('Creating admin user...');
    try {
      // 1. Sign up the user
      const { user, error: signUpError } = await authService.signUp(email, password, name);
      if (signUpError) throw new Error(`Sign up error: ${signUpError.message}`);
      if (!user) throw new Error('User not created');

      setMessage('User created. Now making admin...');

      // This is a temporary and insecure way to grant admin privileges.
      // We are directly calling a supabase function that requires admin rights.
      // This will only work if Row Level Security is not prohibitive.
      const { error: adminError } = await (profileService as any).makeAdmin(user.id);
      if (adminError) throw new Error(`Admin grant error: ${adminError.message}`);
      
      setMessage('User is now admin. Setting credits...');

      // 3. Update credits
      const { error: creditsError } = await profileService.updateCredits(user.id, credits);
      if (creditsError) throw new Error(`Credits update error: ${creditsError.message}`);

      setMessage('Admin user created successfully with 200,000 credits!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid black' }}>
      <h3>Create Admin User</h3>
      <div>
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Name: </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Credits: </label>
        <input type="number" value={credits} onChange={(e) => setCredits(parseInt(e.target.value, 10))} />
      </div>
      <button onClick={handleCreateAdmin}>Create Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TempAdmin;
