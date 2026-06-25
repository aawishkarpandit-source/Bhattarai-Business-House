import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, CalendarCheck } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-20 lg:py-28">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDE0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
          >
            Get Started Today
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Ready to Experience Excellence?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-5 max-w-xl text-base text-gray-300 sm:text-lg"
          >
            Whether you're looking for your next vehicle or need expert consultation, we're here to make your experience exceptional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/test-drive"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-primary-800 shadow-xl shadow-black/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <CalendarCheck className="h-5 w-5 text-primary-600" />
              Book a Test Drive
            </Link>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
