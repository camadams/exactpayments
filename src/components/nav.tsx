import Link from "next/link";

const Nav = () => {
  return (
    <nav className="w-1/12 p-4 min-w-[150px]">
      <ul className="flex flex-col gap-4">
        <Link href="/" className="text-bold text-lg bg-slate-600 w-full h-full p-3 rounded-md hover:bg-slate-400">
          Sales
        </Link>
        <Link href="/products" className="text-bold text-lg bg-slate-600 w-full h-full p-3 rounded-md hover:bg-slate-400">
          Products
        </Link>
        <Link href="/customers" className="text-bold text-lg bg-slate-600 w-full h-full p-3 rounded-md hover:bg-slate-400">
          Customers
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
