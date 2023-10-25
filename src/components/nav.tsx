import Link from "next/link";

const Nav = () => {
  return (
    <nav className="w-1/12 p-4 min-w-[150px]">
      <ul className="flex flex-col gap-4">
        <Link href="/test" className="w-full h-full p-3 text-lg rounded-md text-bold bg-slate-600 hover:bg-slate-400">
          Sales
        </Link>
        <Link href="/products" className="w-full h-full p-3 text-lg rounded-md text-bold bg-slate-600 hover:bg-slate-400">
          Products
        </Link>
        <Link href="/customers" className="w-full h-full p-3 text-lg rounded-md text-bold bg-slate-600 hover:bg-slate-400">
          Customers
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
