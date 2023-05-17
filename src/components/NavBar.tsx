import React from "react";

const NavBar = () => {
  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="px-6">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              {/* <!-- Website Name --> */}
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">
                    Teachable
                  </span>
                </a>
              </div>
              {/* <!-- Navbar items --> */}
              <div className="hidden md:flex items-center space-x-1">
                <a
                  href=""
                  className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold "
                >
                  Home
                </a>
                <a
                  href=""
                  className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                >
                  Services
                </a>
                <a
                  href=""
                  className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                >
                  About
                </a>
                <a
                  href=""
                  className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
