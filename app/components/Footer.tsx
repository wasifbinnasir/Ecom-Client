"use client";
import React from 'react';
import { 
  FaTwitter, 
  FaFacebookF, 
  FaInstagram, 
  FaGithub,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaGooglePay
} from 'react-icons/fa';
import Container from './Container';
import Newsletter from './NewsLetter';
import { usePathname } from 'next/navigation'; 

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return null;
  }

  const companyLinks = ['About','Features','Works','Career'];
  const helpLinks = ['Customer Support','Delivery Details','Terms & Conditions','Privacy Policy'];
  const faqLinks = ['Account','Manage Deliveries','Orders','Payments'];
  const resourceLinks = ['Free eBooks','Development Tutorial','How to - Blog','Youtube Playlist'];

  const socialIcons = [
    { icon: FaTwitter, href: '#' },
    { icon: FaFacebookF, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaGithub, href: '#' }
  ];

  const paymentIcons = [
    { icon: FaCcVisa, color: 'text-blue-600' },
    { icon: FaCcMastercard, color: 'text-red-500' },
    { icon: FaCcPaypal, color: 'text-blue-500' },
    { icon: FaCcApplePay, color: 'text-gray-800' },
    { icon: FaGooglePay, color: 'text-green-600' }
  ];

  const FooterSection = ({ title, links }: { title: string; links: string[] }) => (
    <div className="flex flex-col space-y-3">
      <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-2">
        {title}
      </h3>
      {links.map((link, index) => (
        <a 
          key={index}
          href="#" 
          className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
        >
          {link}
        </a>
      ))}
    </div>
  );

  return (
    <footer className="bg-[#F0F0F0] py-2 px-6 h-full mt-12">
      <Container>
        <Newsletter/>
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">SHOP.CO</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                We have clothes that suits your style and which you're proud to wear. From women to men.
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-200"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <FooterSection title="COMPANY" links={companyLinks} />
            <FooterSection title="HELP" links={helpLinks} />
            <FooterSection title="FAQ" links={faqLinks} />
            <FooterSection title="RESOURCES" links={resourceLinks} />
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-500 text-sm">
                Shop.co © 2000-2023, All Rights Reserved
              </div>

              {/* Payment Icons */}
              <div className="flex space-x-3">
                {paymentIcons.map((payment, index) => (
                  <div
                    key={index}
                    className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:shadow-sm transition-shadow duration-200"
                  >
                    <payment.icon size={24} className={payment.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
