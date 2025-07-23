"use client";

import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import CircleLoader from "@/components/circle-loader";
import { TrashIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import AccountForm from "@/components/account-form";
import PinContainer from "@/components/pin-container";
import AuthBackground from "@/components/AuthBackground";
import RequireAuth from "@/components/RequireAuth";


const initialFormData = {
  name: "",
  pin: "",
};

export default function ManageAccounts() {
  const {
    accounts,
    setAccounts,
    pageLoader,
    setPageLoader,
    setLoggedInAccount,
    loggedInAccount,
  } = useContext(GlobalContext);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPinContainer, setShowPinContainer] = useState({ show: false, account: null });

  const { user, authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("loggedInAccount") || localStorage.getItem("loggedInAccount");
    if (stored && !loggedInAccount) {
      setLoggedInAccount(JSON.parse(stored));
      sessionStorage.setItem("loggedInAccount", stored);
    }
  }, [loggedInAccount]);

  const getAllAccounts = async () => {
    const uid =
      user?.id ||
      localStorage.getItem("userId") ||
      JSON.parse(localStorage.getItem("loggedInAccount"))?.uid;

    if (!uid || uid === "undefined") {
      console.warn("🚫 Missing UID for account fetch");
      return;
    }

    try {
      const res = await fetch(`/api/account/get-all-accounts?uid=${uid}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setAccounts(data.data);
        console.log("✅ Accounts loaded:", data.data);
      } else {
        console.warn("⚠️ No accounts found");
      }
    } catch (err) {
      console.error("❌ Error loading accounts:", err);
    } finally {
      setPageLoader(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.id) {
      getAllAccounts();
    }
  }, [authLoading, user?.id]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/account/add-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user?.id, name: formData.name, pin: formData.pin }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAccountForm(false);
        setFormData(initialFormData);
        getAllAccounts();
      } else {
        console.error("Error saving account:", data.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleRemoveAccount = async (account) => {
    try {
      const res = await fetch(`/api/account/remove-account?id=${account._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        getAllAccounts();
        setShowDeleteIcon(false);
      }
    } catch (err) {
      console.error("Error removing account:", err);
    }
  };

  const handlePinSubmit = async (pinValue) => {
    try {
      setPageLoader(true);

      const res = await fetch("/api/account/login-to-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.id,
          accountId: showPinContainer.account._id,
          pin: pinValue,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const subAccount = showPinContainer.account;
        sessionStorage.setItem("loggedInAccount", JSON.stringify(subAccount));
        localStorage.setItem("loggedInAccount", JSON.stringify(subAccount));
        setLoggedInAccount(subAccount);

        setShowPinContainer({ show: false, account: null });
        setPinError(false);
        setPin("");

        const redirectPath = pathname.includes("my-list")
          ? `/my-list/${user?.id}/${subAccount._id}`
          : "/browse";

        window.location.href = redirectPath;
      } else {
        setPinError(true);
        setPin("");
      }
    } catch (err) {
      console.error("❌ PIN verification failed:", err);
      setPinError(true);
    } finally {
      setPageLoader(false);
    }
  };

  if (pageLoader) return <CircleLoader />;

  return (
    <RequireAuth>
    <AuthBackground>
      <div className="min-h-[25vw] flex justify-center items-center px-6 py-16 relative">
        <div className="w-full max-w-4xl bg-black bg-opacity-60 p-8 rounded-lg shadow-2xl">
          <h1 className="text-white font-extrabold text-4xl md:text-5xl text-center mb-8 tracking-wide uppercase">
            Who's Watching?
          </h1>

          <ul className="flex flex-wrap justify-center gap-6">
            {accounts?.length > 0 &&
              accounts.map((item) => (
                <li
                  key={item._id}
                  onClick={() =>
                    !showDeleteIcon && setShowPinContainer({ show: true, account: item })
                  }
                  className="w-[155px] h-[155px] bg-black bg-opacity-40 border border-white rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative w-full h-[80%] overflow-hidden">
                    <img
                      src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {showDeleteIcon && (
                      <div
                        onClick={() => handleRemoveAccount(item)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                      >
                        <TrashIcon width={30} height={30} color="white" />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-white font-semibold">{item.name}</span>
                </li>
              ))}

            {accounts?.length < 4 && (
              <li
                onClick={() => setShowAccountForm(!showAccountForm)}
                className="w-[155px] h-[155px] border-2 border-dashed border-gray-400 flex items-center justify-center text-white text-5xl font-extrabold cursor-pointer hover:bg-[#e5b109] hover:text-black transition-colors duration-300 rounded-md"
              >
                +
              </li>
            )}
          </ul>

          {/* Buttons Below */}
          <div className="text-center mt-6 space-y-4">
            <button
              onClick={() => setShowDeleteIcon(!showDeleteIcon)}
              className="border border-gray-100 text-white px-6 py-2 text-sm rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {showDeleteIcon ? "Cancel" : "Manage Profiles"}
            </button>

            {/* 💡 Upgrade Button */}
            <button
              onClick={() => router.push("/subscribe")}
              className="border border-yellow-500 text-yellow-400 px-6 py-2 text-sm rounded-full hover:bg-yellow-500 hover:text-black transition-colors"
            >
              Upgrade Your Subscription
            </button>
          </div>
        </div>

        {/* Modals */}
        <PinContainer
          pin={pin}
          setPin={setPin}
          pinError={pinError}
          setPinError={setPinError}
          showPinContainer={showPinContainer.show}
          setShowPinContainer={setShowPinContainer}
          handlePinSubmit={handlePinSubmit}
        />

        <AccountForm
          handleSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          showAccountForm={showAccountForm}
        />
      </div>
    </AuthBackground>
    </RequireAuth>
  );
}