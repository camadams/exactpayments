// pages/signup.tsx

import { signIn } from "next-auth/react";
import SignupForm from "./signupform";

const SignupPage = () => {
  const handleGoogleSignIn = () => {
    signIn("google")
      .then((a) => console.log(a))
      .catch((e) => console.log(e)); // Trigger Google authentication
  };

  const handleCustomSignup = (userData: FormData) => {
    // Call your custom signup API endpoint with userData.username and userData.password
    // Handle the signup logic here
    console.log({ userData });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm onSubmit={() => handleCustomSignup} />
      <button onClick={handleGoogleSignIn}>Sign Up with Google</button>
    </div>
  );
};

export default SignupPage;
