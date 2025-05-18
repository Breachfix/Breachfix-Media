"use client";

import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import CircleLoader from "@/components/circle-loader";
import { TrashIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import AccountForm from "@/components/account-form";
import PinContainer from "@/components/pin-container";

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
  } = useContext(GlobalContext);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPinContainer, setShowPinContainer] = useState({
    show: false,
    account: null,
  });

  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function getAllAccounts() {
    try {
      console.log("Fetching accounts for user ID:", user?.id);
      const res = await fetch(`/api/account/get-all-accounts?id=${user?.id}`);
      const data = await res.json();
      console.log("GET accounts response:", data);

      if (data?.data?.length) {
        setAccounts(data.data);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setPageLoader(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getAllAccounts();
    } else {
      console.warn("User ID not found during useEffect.");
    }
  }, [user?.id]);
  
  useEffect(() => {
  if (user) {
    console.log("✅ Authenticated User:", user);
  } else {
    console.warn("⚠️ No user found in context");
  }
}, [user]);

  async function handleSave() {
    console.log("Saving account with form data:", formData);
    console.log("Using UID:", user?.id);

    try {
      const res = await fetch("/api/account/add-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user?.id,
          name: formData.name,
          pin: formData.pin,
        }),
      });

      const data = await res.json();
      console.log("POST add-account response:", data);

      if (data.success) {
        setShowAccountForm(false);
        setFormData({ name: "", pin: "" });
        getAllAccounts();
      } else {
        console.error("Error saving account:", data.message);
      }
    } catch (err) {
      console.error("Unexpected error saving account:", err);
    }
  }

  async function handleRemoveAccount(getItem) {
    console.log("Removing account:", getItem);
    try {
      const res = await fetch(`/api/account/remove-account?id=${getItem._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("DELETE remove-account response:", data);

      if (data.success) {
        getAllAccounts();
        setShowDeleteIcon(false);
      }
    } catch (err) {
      console.error("Error removing account:", err);
    }
  }

async function handlePinSubmit(pinValue) {
  try {
    setPageLoader(true);

    const response = await fetch("/api/account/login-to-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user?.id,
        accountId: showPinContainer.account._id,
        pin: pinValue,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Save the logged in account
      setLoggedInAccount(showPinContainer.account);
      sessionStorage.setItem(
        "loggedInAccount",
        JSON.stringify(showPinContainer.account)
      );

      // ✅ Close the PIN container
      setShowPinContainer({ show: false, account: null });
      setPin("");
      setPinError(false);

      // ✅ Redirect the user
      if (pathname.includes("my-list")) {
        router.push(`/my-list/${user?.id}/${showPinContainer.account._id}`);
      } else {
        router.push("/browse"); // Or whatever page you want to load
      }
    } else {
      // ❌ Wrong PIN
      setPinError(true);
      setPin("");
    }
  } catch (error) {
    console.error("Error submitting PIN:", error);
    setPinError(true);
  } finally {
    setPageLoader(false);
  }
}

  if (pageLoader) return <CircleLoader />;

  return (
    <div className="min-h-screen flex justify-center flex-col items-center relative">
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-white font-bold text-[54px] my-[36px]">Who's Watching?</h1>
        <ul className="flex p-0 my-[25px] flex-wrap justify-center gap-4">
          {accounts?.length > 0 &&
            accounts.map((item) => (
              <li
                key={item._id}
                onClick={
                  showDeleteIcon
                    ? null
                    : () => setShowPinContainer({ show: true, account: item })
                }
                className="max-w-[200px] w-[155px] cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <img
                    src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"
                    alt={item.name}
                    className="rounded object-cover w-[155px] h-[155px]"
                  />
                  {showDeleteIcon && (
                    <div
                      onClick={() => handleRemoveAccount(item)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                    >
                      <TrashIcon width={30} height={30} color="black" />
                    </div>
                  )}
                </div>
                <span className="mb-4 text-white">{item.name}</span>
              </li>
            ))}

          {accounts?.length < 4 && (
            <li
              onClick={() => setShowAccountForm(!showAccountForm)}
              className="border text-black bg-[#e5b109] font-bold text-lg border-black rounded w-[155px] h-[155px] flex justify-center items-center cursor-pointer"
            >
              Add Account
            </li>
          )}
        </ul>

        <div className="text-center">
          <button
            onClick={() => setShowDeleteIcon(!showDeleteIcon)}
            className="border border-gray-100 text-white px-6 py-2 text-sm"
          >
            Manage Profiles
          </button>
        </div>
      </div>

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
  );
}