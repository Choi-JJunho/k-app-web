"use client";

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  activeIcon?: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: "🍱",
    activeIcon: "🍱",
    label: "식단",
  },
  {
    href: "/nutrition",
    icon: "📊",
    activeIcon: "📊",
    label: "영양정보",
  },
  {
    href: "/profile",
    icon: "👤",
    activeIcon: "👤",
    label: "프로필",
  },
];

export default function BottomNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              <span className="text-xl mb-1">
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
