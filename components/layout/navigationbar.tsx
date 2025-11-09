// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Menu } from "lucide-react";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import AuthButtons from "../ui/authButtons";
// import SearchBox from "../ui/searchBox";

// export default function NavigationBar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();
//   const [routeKey, setRouteKey] = useState(pathname);
//   const [scrolled, setScrolled] = useState(false);

//   // 🔁 Animate when route changes
//   useEffect(() => {
//     setRouteKey(pathname);
//   }, [pathname]);

//   // 📜 Detect scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 🧭 Smooth scroll-based scale and blur
//   const { scrollY } = useScroll();
//   const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);
//   const blurOpacity = useTransform(scrollY, [0, 100], [0.4, 0.8]);

//   const links = [
//     { name: "Dashboard", href: "/dashboard" },
//     { name: "News", href: "/news" },
//     { name: "Weather", href: "/weather" },
//     { name: "Live Matches", href: "/liveMatches" },
//     { name: "Entertainment", href: "/entertainment" },
//     { name: "Sports", href: "/sports" },
//     { name: "Tech", href: "/tech" },
//     { name: "Finance", href: "/finance" },
//     { name: "Science", href: "/science" },
//     { name: "Health", href: "/health" },
//     { name: "World", href: "/world" },
//   ];

//   return (
//     <AnimatePresence mode="wait">
//       <motion.nav
//         key={routeKey}
//         initial={{ y: -40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: -20, opacity: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className={`
//           sticky top-0 left-0 right-0 z-50
//           transition-all duration-500 ease-in-out
//           backdrop-blur-md
//           ${scrolled ? "bg-white/70 shadow-md py-2" : "bg-white/40 shadow-sm py-4"}
//         `}
//       >
//         {/* Top Bar */}
//         <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 md:h-16">
//           {/* Left: Menu + Search */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="md:hidden p-2"
//               aria-label="Toggle Menu"
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//             <SearchBox />
//           </div>

//           {/* Logo */}
//           <motion.div style={{ scale: logoScale }} className="flex items-center">
//             <Link
//               href="/"
//               className="flex items-center font-extrabold text-xl md:text-2xl text-black"
//             >
//               <span>Newsi</span>
//               <span className="text-red-600">.</span>
//               <span>com</span>
//             </Link>
//           </motion.div>

//           {/* Auth Buttons */}
//           <AuthButtons />
//         </div>

//         {/* Desktop Navigation */}
//         <motion.div
//           style={{ opacity: blurOpacity }}
//           className="hidden md:flex justify-center gap-4 px-6 py-2 border-t border-white/30 overflow-x-auto whitespace-nowrap"
//         >
//           {links.map(({ name, href }) => {
//             const isActive = pathname === href;
//             return (
//               <Link
//                 key={name}
//                 href={href}
//                 className={`pb-1 text-sm font-semibold transition-colors ${
//                   isActive
//                     ? "border-b-2 border-black text-black"
//                     : "text-gray-700 hover:text-black"
//                 }`}
//               >
//                 {name}
//               </Link>
//             );
//           })}
//         </motion.div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               key="mobile-menu"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.3 }}
//               className="md:hidden bg-white/80 backdrop-blur-md px-4 pb-4 space-y-2 border-t border-white/30"
//             >
//               {links.map(({ name, href }) => {
//                 const isActive = pathname === href;
//                 return (
//                   <Link
//                     key={name}
//                     href={href}
//                     className={`block text-sm font-medium transition ${
//                       isActive
//                         ? "text-black font-semibold"
//                         : "text-gray-800 hover:text-black"
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {name}
//                   </Link>
//                 );
//               })}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>
//     </AnimatePresence>
//   );
// }



"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import AuthButtons from "../ui/authButtons";
import SearchBox from "../ui/searchBox";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [routeKey, setRouteKey] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  // 🔁 Animate when route changes
  useEffect(() => {
    setRouteKey(pathname);
  }, [pathname]);

  // 📜 Detect scroll for style changes and visibility
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);

      // Hide on scroll down (after threshold), show on scroll up or at top
      if (current === 0) {
        setIsVisible(true);
      } else if (current > prevScrollY && current > 100) {
        setIsVisible(false);
        setIsOpen(false); // Close mobile menu when hiding
      } else if (current < prevScrollY) {
        setIsVisible(true);
      }

      setPrevScrollY(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  // 🧭 Smooth scroll-based scale and blur
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);
  const blurOpacity = useTransform(scrollY, [0, 100], [0.4, 0.8]);

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "News", href: "/news" },
    { name: "Weather", href: "/weather" },
    { name: "Live Matches", href: "/liveMatches" },
    { name: "Entertainment", href: "/entertainment" },
    { name: "Sports", href: "/sports" },
    { name: "Tech", href: "/tech" },
    { name: "Finance", href: "/finance" },
    { name: "Science", href: "/science" },
    { name: "Health", href: "/health" },
    { name: "World", href: "/world" },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key={routeKey}
        initial={{ y: -40, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          sticky top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          backdrop-blur-md
          ${scrolled ? "bg-white/70 shadow-md py-2" : "bg-white/40 shadow-sm py-4"}
        `}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 md:h-16">
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <SearchBox />
          </div>

          {/* Logo */}
          <motion.div style={{ scale: logoScale }} className="flex items-center">
            <Link
              href="/"
              className="flex items-center font-extrabold text-xl md:text-2xl text-black"
            >
              <span>Newsi</span>
              <span className="text-red-600">.</span>
              <span>com</span>
            </Link>
          </motion.div>

          {/* Auth Buttons */}
          <AuthButtons />
        </div>

        {/* Desktop Navigation */}
        <motion.div
          style={{ opacity: blurOpacity }}
          className="hidden md:flex justify-center gap-4 px-6 py-2 border-t border-white/30 overflow-x-auto whitespace-nowrap"
        >
          {links.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`pb-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-b-2 border-black text-black"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </motion.div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/80 backdrop-blur-md px-4 pb-4 space-y-2 border-t border-white/30"
            >
              {links.map(({ name, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`block text-sm font-medium transition ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-gray-800 hover:text-black"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {name}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
}