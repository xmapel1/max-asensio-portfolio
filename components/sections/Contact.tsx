"use client";

import { motion, useTransform } from "motion/react";
import { Mail } from "lucide-react";
import { SiGithub } from 'react-icons/si'
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";

const LinkedInIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const contactLinks = [
  {
    label: "Email",
    href: "mailto:max.asensio13@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/xmapel1",
    icon: SiGithub,
  },
  {
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/max-asensio-327662224/",
  icon: LinkedInIcon,
},

] as const;

function Contact() {
  const { entryProgress, exitProgress } = useSectionProgress("contact");
  const entryScale = useTransform(
    entryProgress,
    [0, 1],
    [PARALLAX.entryScale, 1],
  );
  const exitScale = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitScale]);
  const scale = useTransform(
    [exitProgress, entryScale, exitScale],
    (values: number[]) => {
      const [exitPhase, entry, exit] = values;
      return exitPhase > 0 ? exit : entry;
    },
  );
  const entryOpacity = useTransform(
    entryProgress,
    [0, 1],
    [PARALLAX.entryOpacity, 1],
  );
  const exitOpacity = useTransform(
    exitProgress,
    [0, 1],
    [1, PARALLAX.exitOpacity],
  );
  const opacity = useTransform(
    [exitProgress, entryOpacity, exitOpacity],
    (values: number[]) => {
      const [exitPhase, enterOpacity, leaveOpacity] = values;
      return exitPhase > 0 ? leaveOpacity : enterOpacity;
    },
  );

  return (
    <section
      id="contact"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6 py-12"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="pointer-events-auto transform-gpu w-full max-w-2xl rounded-xl border border-white/10 bg-white/4 p-8 text-center backdrop-blur-sm sm:p-10"
      >
        <h2 className="text-[clamp(4rem,10vw,8rem)] font-shatoze text-white">rEach oUT!</h2>
        <p className=" font-bebas-neue text-[clamp(1.5rem,2.5vw,2.5rem)] mx-auto mt-4 text-white/70">
          Open to freelance, collabs, and curious conversations
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
          {contactLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              aria-label={label}
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/12 hover:text-white"
            >
              <Icon size={30} strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
