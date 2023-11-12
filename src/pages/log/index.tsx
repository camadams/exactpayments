import { useSession } from "next-auth/react";
import { AuthShowcase } from "~/components/AuthShowcase";

export default function Logg() {
  const { data, status } = useSession();
  return (
    <>
      <AuthShowcase />
      <div>{data?.user.name}</div>
      <div>{status}</div>
    </>
  );
}
