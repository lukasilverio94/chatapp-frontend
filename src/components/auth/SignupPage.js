import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignupForm from './SignupForm'; // Ensure correct path

const SignupPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Example selector, adjust as needed

  return (
    <div>
      <h2>Signup Page</h2>
      <SignupForm />
      {/* Additional content here */}
    </div>
  );
};

export default SignupPage;
