import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-base)] py-16 px-8 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-heading italic text-2xl text-[var(--text-primary)] mb-4">Carelo</h3>
          <p className="font-body font-light text-[var(--text-muted)] max-w-sm mb-6">
            The AI-first agency partner. Scaling capture, conversion, and operations with intelligent voice and automated workflows.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Twitter</a>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">LinkedIn</a>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Instagram</a>
          </div>
        </div>
        
        <div>
          <h4 className="font-body font-medium text-sm text-[var(--text-primary)] uppercase tracking-wider mb-6">Solution</h4>
          <ul className="space-y-4 font-body text-sm font-light text-[var(--text-muted)]">
            <li><a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors text-sm">How it works</a></li>
            <li><a href="#industries" className="hover:text-[var(--text-primary)] transition-colors text-sm">Industries</a></li>
            <li><a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors text-sm">Pricing</a></li>
            <li><a href="#live-demo" className="hover:text-[var(--text-primary)] transition-colors text-sm">Live Demo</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-body font-medium text-sm text-[var(--text-primary)] uppercase tracking-wider mb-6">Company</h4>
          <ul className="space-y-4 font-body text-sm font-light text-[var(--text-muted)]">
            <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors text-sm">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors text-sm">Terms of Service</a></li>
            <li><a href="#contact" className="hover:text-[var(--text-primary)] transition-colors text-sm">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} Carelo AI. All rights reserved.
        </p>
        <p className="font-body text-xs text-[var(--text-muted)] italic">
          Built for the next generation of agencies.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
