import React from 'react';
import logoUrl from "../assets/greenLogo.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      {/* Left Side */}
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <p className="text-lg font-semibold">
          Welcome to <span className="text-green">Streamly</span>
        </p>
        <p className="text-sm text-mixed-600">
          Your Gateway to Unlimited Entertainment
        </p>
        <p className="text-sm text-gray-400">
          This site does not store any files on our server,<br />
          we only link to the media<br />
          which is hosted on 3rd party services.
        </p>
        <p className="text-sm text-gray-400">
          &copy; {currentYear} <span className="font-semibold">Streamly</span>. All Rights Reserved.
        </p>
      </div>

      {/* Middle Section - Built By */}
      {/* <div className="text-center">
        <a
          href="https://www.instagram.com/supremeleader.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-green transition-colors duration-300"
        >
          Built and designed by Gambhir Poudel
        </a>
      </div> */}

      {/* Right Side - Logo */}
      <div className="text-gray-400 hover:text-green transition-colors duration-300">
        <img src={logoUrl.src} alt="Logo" className="h-8 w-12 mx-auto md:mx-0" />
      </div>
    </footer>
  );
};

export default Footer;
