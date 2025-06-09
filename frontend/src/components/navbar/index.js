"use client";

import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Search from "./search";
import { AiOutlineSearch } from "react-icons/ai";
import { GlobalContext } from "@/context";
import AccountPopup from "./account-popup";
import CircleLoader from "../circle-loader";
import DetailsPopup from "../details-popup";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const {
    setPageLoader,
    loggedInAccount,
    setAccounts,
    accounts,
    setLoggedInAccount,
    pageLoader,
    showDetailsPopup,
    setShowDetailsPopup,
  } = useContext(GlobalContext);

  const menuItems = [
    {
      id: "home",
      title: "Home",
      path: "/browse",
    },
    {
      id: "tv",
      title: "TV",
      path: "/tv",
    },
    {
      id: "movies",
      title: "Movies",
      path: "/movies",
    },
    {
      id: "my-list",
      title: "My List",
      path:
        user?.id && loggedInAccount?._id
          ? `/my-list/${user.id}/${loggedInAccount._id}`
          : "/my-list",
    },
    {
      id: "continue-watching",
      title: "Continue Watching",
      path: loggedInAccount?._id
          ? `/watch-progress/${loggedInAccount?._id}`
          : "#",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function getAllAccounts() {
    if (!user?.id) return;
    const res = await fetch(`/api/account/get-all-accounts?id=${user.id}`);
    const data = await res.json();

    if (data?.data?.length) {
      setAccounts(data.data);
    }
    setPageLoader(false);
  }

  useEffect(() => {
    getAllAccounts();
  }, [user?.id]);

  if (pageLoader) return <CircleLoader />;

  return (
    <div className="relative">
      <header className={`header ${isScrolled ? "bg-[#141414]" : ""} hover:bg-[#141414]`}>
        <div className="flex items-center space-x-2 md:space-x-10">
          <img
            src="/breachfix logo.png"
            width={120}
            height={120}
            alt="Breachfix"
            className="hidden sm:block cursor-pointer object-contain"
            onClick={() => router.push("/browse")}
          />

          <div
            className="block sm:hidden cursor-pointer"
            onClick={() => router.push("/browse")}
          >
            <img
              src="/android-chrome-192x192.png"
              width={30}
              height={30}
              alt="BR"
              className="block cursor-pointer object-contain"
            />
          </div>

          <ul className="flex space-x-4 cursor-pointer justify-center w-full sm:justify-start sm:w-auto">
            {menuItems.map((item) => {
              const isMobileEssential =
                item.id === "tv" || item.id === "movies" || item.id === "home" || item.id === "my-list";
              const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;

              if (isMobileEssential || isDesktop) {
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      if (item.path === "#") return;
                      setPageLoader(true);
                      router.push(item.path);
                      setSearchQuery("");
                      setShowSearchBar(false);
                    }}
                    className="text-[16px] font-light text-[#e5e5e5] hover:text-[#b3b3b3] transition"
                  >
                    {item.title}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>

        <div className="font-light flex items-center space-x-4 text-sm">
          {showSearchBar ? (
            <Search
              pathName={pathName}
              router={router}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPageLoader={setPageLoader}
              setShowSearchBar={setShowSearchBar}
            />
          ) : (
            <AiOutlineSearch
  onClick={() => {
    console.log("Search icon clicked");
    setShowSearchBar(true);
  }}
  className="w-6 h-6 cursor-pointer z-50"
/>
          )}

          <div
            onClick={() => router.push("/manage-accounts")}
            className="flex items-center cursor-pointer"
          >
            <img
              src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"
              alt="Current Profile"
              className="w-[30px] h-[30px] rounded object-cover"
            />
            <p className="ml-2 truncate max-w-[120px] hidden sm:inline">
               {loggedInAccount?.name || "Unnamed"}
            </p>
          </div>
        </div>
      </header>

      <DetailsPopup show={showDetailsPopup} setShow={setShowDetailsPopup} />

      {showAccountPopup && (
        <AccountPopup
          accounts={accounts}
          setPageLoader={setPageLoader}
          signOut={handleLogout}
          loggedInAccount={loggedInAccount}
          setLoggedInAccount={setLoggedInAccount}
        />
      )}
    </div>
  );
}
