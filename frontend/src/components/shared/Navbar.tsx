import { Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-white backdrop-blur z-50 border-b px-24">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-green-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold">
              Rajput G<span className="text-[16px]">&</span>S
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/products"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Products
            </Link>
            <Link
              to="/services"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Link to="/signin">
              <Button className="cursor-pointer" variant={"ghost"}>
                Sign In
              </Button>
            </Link>
            <Link to="/get-started">
              <Button className="bg-green-600 hover:bg-green-700/95 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
