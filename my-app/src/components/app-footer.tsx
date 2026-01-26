import Image from "next/image";
import React from "react";

function AppFooter() {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 w-full py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Image
              className="h-9 w-auto"
              src="/assets/logo-navbar.png"
              width={138}
              height={36}
              alt="logo"
            />
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            An emotionally-aware AI companion for self-reflection and personal
            growth. Your conversations are private, secure, and designed to help
            you understand yourself better.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} EchoWithin. Created with ❤️ by
            CODE4CHANGE
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppFooter;
