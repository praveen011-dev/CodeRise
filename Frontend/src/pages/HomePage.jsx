import React from "react";
import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-emerald-500">
        Welcome to Chintu's LeetCode Clone!
      </h1>
      <p className="mt-4">
        This is the homepage. Problems will be listed here soon.
      </p>
      <Button variant="outline" className="mt-4">
        Test Shadcn Button
      </Button>
      <div className="bg-sky-200 p-4 mt-4">
        Tailwind test div - sky blue background.
      </div>
    </div>
  );
}
export default HomePage;
