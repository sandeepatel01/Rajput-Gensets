import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto text-zinc-100 border-t border-zinc-400 py-4">
      <div className="flex items-center justify-center gap-1">
        <span className="block">
          Made with <Heart className="inline border-none text-red-500" /> by
        </span>
        <span className="block cursor-pointer hover:text-zinc-50 hover:underline">
          Rajput Genset & Solar Services
        </span>
      </div>
    </footer>
  );
};

export default Footer;
