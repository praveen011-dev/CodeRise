import React from "react";

function Navbar() {
  return (
    <header className="bg-gradient-to-l from-green-600 via-slate-900 to-black text-white p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold border p-2 rounded">CodeRise</div>
        {/* You can add navigation links here later */}
        <div>
          <span className="mr-4 hover:text-slate-300 cursor-pointer">
            Problems
          </span>
          <span className="hover:text-slate-300 cursor-pointer">Login</span>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
