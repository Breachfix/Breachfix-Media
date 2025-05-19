import { FaXTwitter, FaInstagram, FaFacebookF, FaGithub, FaYoutube, FaTiktok, FaMedium } from "react-icons/fa6";

const platforms = [
  { name: 'x', url: 'https://x.com/NtihanirahoJack', color: '#ffffff', icon: <FaXTwitter /> },
  { name: 'instagram', url: 'https://www.instagram.com/breachfix/', color: '#ffffff', icon: <FaInstagram /> },
  { name: 'facebook', url: 'https://www.facebook.com/profile.php?id=61559916151082&sk=grid', color: '#ffffff', icon: <FaFacebookF /> },
  { name: 'github', url: 'https://github.com/Breachfix', color: '#ffffff', icon: <FaGithub /> },
  { name: 'youtube', url: 'https://www.youtube.com/@Breachfixhealth', color: '#ffffff', icon: <FaYoutube /> },
  { name: 'tiktok', url: 'https://www.tiktok.com/@breachfixhealth', color: '#ffffff', icon: <FaTiktok /> },
  { name: 'medium', url: 'https://medium.com/@breachfix', color: '#ffffff', icon: <FaMedium /> },
];

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 sm:px-10 md:px-20 lg:px-28 py-10 text-sm font-light tracking-wide font-sans">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
        <div>
          <h4 className="text-white mb-4 font-medium text-base">About</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/mission" className="hover:underline">Our Mission</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-4 font-medium text-base">Media</h4>
          <ul className="space-y-2">
            <li><a href="/sermons" className="hover:underline">Sermons</a></li>
            <li><a href="/documentaries" className="hover:underline">Documentaries</a></li>
            <li><a href="/kids" className="hover:underline">Kids</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-4 font-medium text-base">Support</h4>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/support" className="hover:underline">Support</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-4 font-medium text-base">Connect</h4>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform, index) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:scale-110 transition-transform duration-200"
                style={{ color: platform.color }}
                aria-label={platform.name}
              >
                <span className="text-2xl">{platform.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} BreachFix Media. All rights reserved.
      </div>
    </footer>
  );
}