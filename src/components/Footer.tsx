import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#001f4d] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Bivo Health</h3>
          <p className="text-gray-300">
            Secure, blockchain-powered medical data management with NFC card access on BlockDAG network.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
            <li><Link href="/providers" className="text-gray-300 hover:text-white">For Providers</Link></li>
           </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><Link href="/features" className="text-gray-300 hover:text-white">Medical Records</Link></li>
            <li><Link href="/features" className="text-gray-300 hover:text-white">NFC Card Access</Link></li>
            <li><Link href="/features" className="text-gray-300 hover:text-white">Provider Integration</Link></li>
            <li><Link href="/features" className="text-gray-300 hover:text-white">Blockchain Security</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Email: support@bivohealth.com</li>
            <li>Phone: +1(555)BIVO-HEALTH</li>
            <li>Emergency: 24/7 Support</li>
           </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} Bivo Health. All rights reserved. Built on BlockDAG blockchain.</p>
      </div>
    </footer>
  );
};

export default Footer;