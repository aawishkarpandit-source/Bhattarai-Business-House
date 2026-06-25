import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Shield, Award, Truck, Headphones } from 'lucide-react';
import { companyService } from '@/services/company.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { cn } from '@/utils/cn';

const ICON_MAP = {
  shield: Shield,
  award: Award,
  truck: Truck,
  headphones: Headphones,
} as const;

interface WhyChooseFeature {
  icon: string;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: WhyChooseFeature[] = [
  {
    icon: 'shield',
    title: 'Authorized Distributor',
    description:
      'Official authorized distributor for world-class automotive and consumer brands across Nepal.',
  },
  {
    icon: 'award',
    title: 'Trusted Legacy',
    description:
      'Over 35 years of proven excellence in delivering quality products and exceptional service.',
  },
  {
    icon: 'truck',
    title: 'Nationwide Coverage',
    description:
      'Extensive distribution network ensuring our products reach every corner of the country.',
  },
  {
    icon: 'headphones',
    title: 'Dedicated Support',
    description:
      'Round-the-clock customer support with dedicated service centers and expert technicians.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
};

export default function WhyChooseUs() {
  const { data: rawData } = useQuery({
    queryKey: ['why-choose-us'],
    queryFn: () => companyService.get('why_choose_us_data'),
  });

  let features: WhyChooseFeature[] = DEFAULT_FEATURES;

  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        features = parsed;
      }
    } catch {
      // Use defaults
    }
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoMnptMCw0djJoLTJ2LTJoIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Us"
          title="Why Choose Bhattarai Business House"
          description="We combine decades of expertise with an unwavering commitment to quality, making us the preferred partner for leading brands."
          centered
          light
        />

        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent =
              ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Shield;
            return (
              <motion.div
                key={`${feature.title}-${index}`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 shadow-lg shadow-accent-500/30 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
