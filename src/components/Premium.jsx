import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import SuccessPage from "./SuccessPage";
import Loader from "./Loader";

const Premium = () => {
  const [premium, setPremium] = useState(false);
  const [membershipType, setMembershipType] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyPremium = async () => {
    try {
      const response = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      if (response.data.isPremium) {
        setPremium(true);
        setMembershipType(response.data.membershipType);
      }
    } catch (error) {
      console.error("Error verifying premium:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPremium();
  }, []);

  const handleClick = async (type) => {
    if (premium) return;
    setLoading(true);
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;
      var options = {
        key: keyId,
        amount,
        currency,
        name: "DevWorld",
        description: "Transaction",
        order_id: orderId,
        prefill: { name: notes.name, email: notes.email },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#6366f1" },
        handler: verifyPremium,
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (premium) return <SuccessPage membershipType={membershipType} />;

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 sm:p-6 pt-20">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-0 max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-2">Upgrade</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Choose Your <span className="gradient-text-warm">Plan</span></h1>
        </div>

        {/* Note */}
        <div className="glass-card border-amber-500/20 text-amber-300 px-5 py-4 rounded-xl text-center text-sm max-w-2xl mx-auto">
          ⚠️ Note: Premium feature purchases are currently available for testing only and accept dummy money.
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Silver Plan */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-lg">🥈</div>
              <h2 className="text-xl font-bold text-white">Silver Plan</h2>
            </div>
            <p className="text-[#94a3b8] text-sm mb-5">Basic access with essential features.</p>
            <p className="text-3xl font-bold text-white mb-1">$0.1<span className="text-sm font-normal text-[#64748b]">/month</span></p>

            <ul className="mt-5 space-y-3 text-sm text-[#94a3b8] flex-grow">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Access to standard features</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Get a Blue Tick</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Monthly updates</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Unlimited Chat With Connection</li>
            </ul>

            <button
              onClick={() => handleClick("silver")}
              className="mt-6 w-full py-3.5 bg-white/[0.06] border border-white/[0.1] text-white rounded-xl font-semibold hover:bg-indigo-500/15 hover:border-indigo-500/30 transition-all duration-300"
            >
              Choose Silver
            </button>
          </div>

          {/* Gold Plan */}
          <div className="relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))' }}>
            <div className="absolute inset-0 border border-amber-500/30 rounded-2xl pointer-events-none"></div>
            {/* Popular badge */}
            <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Popular</div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg">👑</div>
              <h2 className="text-xl font-bold text-white">Gold Plan</h2>
            </div>
            <p className="text-[#94a3b8] text-sm mb-5">Premium access with exclusive features.</p>
            <p className="text-3xl font-bold text-white mb-1">$0.5<span className="text-sm font-normal text-[#64748b]">/month</span></p>

            <ul className="mt-5 space-y-3 text-sm text-[#94a3b8] flex-grow">
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> All Silver Plan benefits</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Unlimited Chat With Connection</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Unlimited Call With Connection</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Early access to new features</li>
            </ul>

            <button
              onClick={() => handleClick("gold")}
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300"
            >
              Choose Gold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
