import {
  FaXTwitter,
  FaInstagram,
  FaFacebookF,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaMedium,
} from "react-icons/fa6";

const platforms = [
  { name: 'x', url: 'https://x.com/NtihanirahoJack', color: '#1DA1F2', icon: <FaXTwitter /> },
  { name: 'instagram', url: 'https://www.instagram.com/breachfix/', color: '#E1306C', icon: <FaInstagram /> },
  { name: 'facebook', url: 'https://www.facebook.com/profile.php?id=61559916151082&sk=grid', color: '#1877F2', icon: <FaFacebookF /> },
  { name: 'github', url: 'https://github.com/Breachfix', color: '#181717', icon: <FaGithub /> },
  { name: 'youtube', url: 'https://www.youtube.com/@Breachfixhealth', color: '#FF0000', icon: <FaYoutube /> },
  { name: 'tiktok', url: 'https://www.tiktok.com/@breachfixhealth', color: '#010101', icon: <FaTiktok /> },
  { name: 'medium', url: 'https://medium.com/@breachfix', color: '#00AB6C', icon: <FaMedium /> },
];

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-gray-400 px-6 sm:px-10 md:px-20 lg:px-28 py-14 text-sm font-light tracking-wide font-sans">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-6">
        {/* About */}
        <div>
          <h4 className="text-white mb-4 font-medium text-base">About</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/mission" className="hover:underline">Our Mission</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Media */}
        <div>
          <h4 className="text-white mb-4 font-medium text-base">Media</h4>
          <ul className="space-y-2">
            <li><a href="/sermons" className="hover:underline">Sermons</a></li>
            <li><a href="/documentaries" className="hover:underline">Documentaries</a></li>
            <li><a href="/kids" className="hover:underline">Kids</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white mb-4 font-medium text-base">Support</h4>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/support" className="hover:underline">Support</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-white mb-4 font-medium text-base">Connect</h4>
          <div className="flex flex-wrap gap-4">
            {platforms.map((platform, index) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.name}
                className="transition-transform hover:scale-110"
                style={{ color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.color = platform.color}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
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