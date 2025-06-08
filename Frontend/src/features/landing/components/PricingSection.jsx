import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

function PricingSection({ id }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore.getState();
  const handleProPayment = async () => {
    // Load Razorpay script

    if (!isLoggedIn || !user) {
      toast.warning("Please login to purchase the Pro plan.");
      navigate("/login");
      return;
    }
    const loadRazorpayScript = () =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast({ title: "Error", description: "Failed to load Razorpay SDK." });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 749 }), // ₹749
        }
      );

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, //Test Key
        amount: data.amount,
        currency: data.currency,
        name: "CodeRise",
        description: "Pro Plan - ₹749",
        image: "/coderise-logo.svg", // Optional logo
        order_id: data.id,
        handler: function (response) {
          toast({
            title: "🎉 Payment Successful",
            description: "You've successfully unlocked the Pro Plan!",
          });

          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
        },
        prefill: {
          name: "CodeRise User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <section
      id={id}
      className="py-12 md:py-16 text-foreground relative overflow-hidden"
    >
      {/* Background styles */}
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          background:
            "linear-gradient(to bottom, var(--site-gradient-start), var(--site-gradient-end))",
          backgroundAttachment: "fixed",
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          background:
            "radial-gradient(circle at top, var(--tw-color-cyan-500)/0.15, transparent 30%), radial-gradient(circle at bottom, var(--tw-color-emerald-500)/0.15, transparent 30%)",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 leading-tight">
          Simple & Transparent{" "}
          <span className="text-purple-600 dark:text-purple-400">Pricing</span>
          <p className="text-base md:text-lg text-muted-foreground mt-3 font-normal max-w-3xl mx-auto">
            Choose the plan that best fits your coding journey. No hidden fees,
            just clear benefits.
          </p>
        </h2>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="p-6 rounded-2xl shadow-xl flex flex-col items-center border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.1)] backdrop-blur-xl dark:border-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-bold mb-3 text-primary">Basic</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $0<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Start your coding adventure
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Access to 50
                Problems
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Basic Editor
                Features
              </li>
              <li className="flex items-center gap-1.5">
                <XCircle className="text-destructive w-4 h-4" /> No Premium
                Content
              </li>
            </ul>
            <Link to="/problems">
              <button className="px-6 py-2 text-base bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105 mt-auto cursor-pointer">
                Get Started - Free
              </button>
            </Link>
          </div>

          {/* Pro Plan - Razorpay enabled */}
          <div className="p-6 rounded-2xl shadow-2xl flex flex-col items-center relative overflow-hidden transform scale-105 border-2 border-primary bg-[rgba(255,255,255,0.2)] backdrop-blur-xl dark:border-2 dark:border-primary dark:bg-[rgba(0,0,0,0.4)]">
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg">
              Most Popular
            </span>
            <h3 className="text-2xl font-bold mb-3 text-primary">Pro</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $9<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Unlock your full potential
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Unlimited
                Problems
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Advanced
                Editor Features
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Premium
                Content & Editorials
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Community
                Access
              </li>
            </ul>
            <button
              onClick={handleProPayment}
              className="px-6 py-2 text-base bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105 mt-auto cursor-pointer"
            >
              Choose Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl shadow-xl flex flex-col items-center border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.1)] backdrop-blur-xl dark:border-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-bold mb-3 text-primary">Legendary</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $49<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Tailored for teams
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> All Pro
                Features
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Team
                Management
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Dedicated
                Support
              </li>
            </ul>
            <button
              onClick={handleProPayment}
              className="px-6 py-2 text-base bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105 mt-auto cursor-pointer"
            >
              Choose Legendary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
