import React from "react";

function Navbar() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">LeetCode Clone</div>
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
