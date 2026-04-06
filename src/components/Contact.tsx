import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", agency: "", volume: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4">
            LET'S BUILD
          </span>
          <h2 className="font-heading italic text-3xl md:text-4xl text-[var(--text-primary)] mb-6 leading-tight">
            Your first captured call costs nothing. Your first missed call costs everything.
          </h2>
          <p className="font-body font-light text-[var(--text-muted)] mb-8">
            Tell us about your agency. We'll show you exactly what Carelo can do for you.
          </p>
          <div className="font-body text-sm text-white/70 space-y-1 mb-6">
            <p>hello@carelo.ai</p>
            <p>WhatsApp: +1 (555) 000-0000</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse" />
            <span className="font-body font-medium text-sm text-[var(--text-primary)]">
              Join Now
            </span>
          </div>
        </motion.div>

        <motion.form
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]" />
          <input name="agency" placeholder="Agency Name" value={formData.agency} onChange={handleChange}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]" />
          <select name="volume" value={formData.volume} onChange={handleChange}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-body text-sm focus:outline-none focus:border-[var(--border-bright)] appearance-none">
            <option value="" className="text-white/30">Monthly Call Volume</option>
            <option value="0-50">0–50</option>
            <option value="50-200">50–200</option>
            <option value="200-500">200–500</option>
            <option value="500+">500+</option>
          </select>
          <textarea name="message" placeholder="Message" rows={4} value={formData.message} onChange={handleChange}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)] resize-none" />
          <motion.button type="submit"
            className="w-full bg-[var(--red)] hover:bg-[#00c988] text-[#0a0f0a] rounded-xl py-3 font-body font-semibold text-sm transition-colors"
            whileHover={{ x: 4 }}>
            Send Message →
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
