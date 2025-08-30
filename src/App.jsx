import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { connectWallet, getCurrentWallet } from './contract/interact.js';
import { unlockContent, checkAccess } from "./contract/interact.js";
import './App.css';

export default function App() {
  const [account, setAccount] = useState(null);
  const [unlockedContent, setUnlockedContent] = useState({});
  const [loadingContent, setLoadingContent] = useState({});

  const contentList = [
    { id: "article-1", title: "Exclusive Article", price: "0.001 SHM" },
    { id: "video-1", title: "Secret Video", price: "0.002 SHM" },
    { id: "podcast-1", title: "Private Podcast", price: "0.0015 SHM" },
  ];

  const lockIcon = "https://img.icons8.com/ios-filled/100/ffffff/lock--v1.png";
  const unlockIcon = "https://img.icons8.com/ios-filled/100/000000/unlock-2.png";

  // Wallet connect
  const handleConnect = async () => {
    const selectedAccount = await connectWallet();
    setAccount(selectedAccount);
  };

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const currentAccount = await getCurrentWallet();
        setAccount(currentAccount);
      } catch (error) {
        console.error("Error in fetching wallet:", error);
      }
    };
    fetchWallet();
  }, []);

  // Unlock
  const handleUnlock = async (contentId) => {
    if (!account) return alert("Connect Wallet");
    setLoadingContent((prev) => ({ ...prev, [contentId]: true }));

    try {
      const result = await unlockContent(contentId);
      if (result.success) {
        const has = await checkAccess(account, contentId);
        if (has) {
          setUnlockedContent((prev) => ({ ...prev, [contentId]: true }));
        }
      } else {
        alert("Unlock failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContent((prev) => ({ ...prev, [contentId]: false }));
    }
  };

  // Check access
  const handleCheckAccess = async (contentId) => {
    if (!account) return alert("Connect Wallet");
    const has = await checkAccess(account, contentId);
    setUnlockedContent((prev) => ({ ...prev, [contentId]: has }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 px-12">
        <div className="flex items-center gap-2">
          <img
            src="https://img.icons8.com/fluency/48/unlock.png"
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-3xl font-bold text-yellow-400">AccessFi</h1>
        </div>

        {account ? (
          <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition"
          >
            Connect Wallet
          </button>
        )}
      </header>


      {/* Hero Section */}
      <section className="text-center py-16 px-6 h-screen flex flex-col items-center justify-center">
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold mb-4 text-yellow-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Unlock Premium Content with Shardeum
        </motion.h2>
        <motion.p
          className="text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Pay only for what you want. No subscriptions. No middlemen.
          Own your access with instant blockchain payments.
        </motion.p>
        <motion.button
          onClick={handleConnect}
          whileTap={{ scale: 0.9 }}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300"
        >
          Get Started
        </motion.button>
      </section>

      {/* Content Grid */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {contentList.map((item) => {
            const isUnlocked = !!unlockedContent[item.id];
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-40">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(item.id)}/400/250`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <img src={lockIcon} alt="locked" className="w-12 h-12" />
                    </div>
                  )}
                  {isUnlocked && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded flex items-center gap-2 text-xs font-semibold">
                      <img src={unlockIcon} alt="unlocked" className="w-4 h-4" />
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 justify-between p-4">
                  <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                  {isUnlocked ? (
                    <p className="text-sm text-gray-300 mb-3">
                      🔓 You’ve unlocked this item — enjoy your access!
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm mb-3">
                      Locked. Unlock for {item.price}.
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    {isUnlocked ? (
                      <button className="border border-gray-700 text-sm px-3 py-2 rounded-md hover:bg-gray-800">
                        View
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlock(item.id)}
                        disabled={!account || loadingContent[item.id]}
                        className="bg-yellow-400 text-black px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 flex items-center justify-center"
                      >
                        {loadingContent[item.id] ? (
                          <svg
                            className="animate-spin h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : (
                          "Unlock Now"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        Built on Shardeum • AccessFi © 2025 •{" "}
        <a href="https://github.com" className="hover:underline">
          GitHub
        </a>
      </footer>
    </div>
  );
}
