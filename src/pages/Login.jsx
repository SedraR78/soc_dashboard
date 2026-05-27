import React, { useState } from 'react';

export function Login() {
  // TODO: Create state for email (useState)
    const [email, setEmail] = useState('');
  // TODO: Create state for password (useState)
    const [password, setPassword] = useState('');

  // TODO: Create handleChange function
  // - Update email state when user types in email input
  // - Update password state when user types in password input
  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  // TODO: Create handleSubmit function
  // - Prevent default form submission
  // - Log email and password to console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  }

  // - Later: send to backend API

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* TODO: Email input field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        {/* TODO: Password input field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        {/* TODO: Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded font-bold hover:bg-blue-700"
        >
          Login
        </button>

      </form>
    </div>
  );
}
