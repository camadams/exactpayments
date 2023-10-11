// pages/auth/signin.tsx
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function SignIn() {
  const router = useRouter();

  const handleSignIn = () => {
    signIn("credentials", { callbackUrl: "/" })
      .then((a) => console.log(a))
      .catch((e) => console.log(e));
  };

  const handleSignUp = () => {
    router
      .push("/auth/signup")
      .then((a) => console.log(a))
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => handleSignIn()}>Sign in with Credentials</button>
      <button onClick={() => handleSignUp()}>SSSSSign Up</button>
    </div>
  );
}

export default SignIn;
