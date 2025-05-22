import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-2">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Go to Homepage
      </Link>
    </div>
  );
}
export default NotFoundPage;
