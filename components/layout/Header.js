import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const Header = () => {
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">
              <Link href="/"> Clipboard Manager </Link>
            </h1>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2">
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Links for Larger Devices */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>
            {data?.user && (
              <span className="text-blue-600">
                {data.user.email?.split("@")[0]}
              </span>
            )}
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="bg-white shadow-lg py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                {data?.user && (
                  <li>
                    <span className="block px-4 py-2 text-blue-600">
                      {data.user.email?.split("@")[0]}
                    </span>
                  </li>
                )}
                <li>
                  <Button
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2"
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
