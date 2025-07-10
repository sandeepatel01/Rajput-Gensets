import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-[#FFE5D0] via-[#FAFAFA] to-[#D4F5EE] text-zinc-800 z-50 shadow-lg border-b border-amber-300 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex justify-between items-center py-3">
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="relative flex items-center justify-center bg-white/90 group-hover:bg-white transition-all rounded-lg p-1.5 border-2 border-amber-400 shadow-lg">
              <img
                src="/assets/logo.png"
                width={42}
                height={42}
                alt="Rajput G&S"
                className="object-contain"
              />
              <div
                className="absolute -bottom-2 -right-2 bg-[#56b398] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm font-[cursive] tracking-tighter leading-none"
                style={{ fontFamily: '"Cinzel Decorative", serif' }}
              >
                RG
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-[#56b398] leading-tight tracking-tight">
                RAJPUT
              </h1>
              <p className="text-xs text-[#d87852] font-medium uppercase tracking-wider mt-0.5">
                Genset & Solar
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 mx-4">
            <Link
              to="/products"
              className="px-4 py-2 text-sm font-medium text-[#18181b] hover:text-black transition-all rounded-md hover:bg-amber-100/70 flex items-center gap-1.5 group relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all hover:after:w-3/5"
            >
              Products
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 text-sm font-medium text-[#18181b] hover:text-black transition-all rounded-md hover:bg-amber-100/70 flex items-center gap-1.5 group relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all hover:after:w-3/5"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-sm font-medium text-[#18181b] hover:text-black transition-all rounded-md hover:bg-amber-100/70 flex items-center gap-1.5 group relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all hover:after:w-3/5"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/signin">
              <Button
                className="cursor-pointer bg-[#56b398] hover:bg-amber-100/60 border border-amber-400/50 text-[#18181b] hover:text-black font-medium px-5 transition-all hover:border-amber-400 shadow-sm"
                variant={"ghost"}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className="cursor-pointer bg-transparent hover:bg-amber-100/60 border border-amber-400/50 text-[#d87852] hover:text-black font-medium px-5 transition-all hover:border-amber-400 shadow-sm"
                variant={"ghost"}
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
