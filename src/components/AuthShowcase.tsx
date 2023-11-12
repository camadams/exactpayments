import { signIn, signOut, useSession } from "next-auth/react";

export function AuthShowcase() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-2xl text-center">{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
      <button
        className="p-3 font-semibold no-underline transition rounded-full bg-white/10 hover:bg-slate-300/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
