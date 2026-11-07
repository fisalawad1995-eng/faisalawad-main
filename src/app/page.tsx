"use client";

import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { CyberNoodlesViewer } from "@/components/ui/cyber-noodles-canvas";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  FileText,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Award,
  Network,
  Code,
  Layers,
  Phone,
  Check,
  Copy,
  Sparkles,
  MapPin,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Cpu,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Server
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LinkedinIcon = ({ size = 24, className = "", strokeWidth = 1.5 }: { size?: number; className?: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Home() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<"all" | "telecom" | "software" | "consulting">("all");
  const [showDirectContacts, setShowDirectContacts] = useState(false);
  const headerContactRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  // Close direct contacts header dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerContactRef.current && !headerContactRef.current.contains(e.target as Node)) {
        setShowDirectContacts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const experiences = [
    {
      role: "ERP Specialist",
      company: "E2NEXT",
      location: "Baghdad, Iraq",
      period: "Jan 2026 – Present",
      type: "Full-Time",
      coreSummary: "Leading enterprise ERP system architecture, database modeling, and full-stack software development from concept through live client deployment and digital transformation.",
      responsibilities: [
        {
          title: "System Architecture & Data Modeling",
          desc: "Architected and built end-to-end ERP systems from the ground up, designing data models, business logic, and modular operational workflows."
        },
        {
          title: "Scalable Back-End Services",
          desc: "Engineered scalable back-end services using Python and Next.js, powering high-performance ERP functionality across multi-client deployments."
        },
        {
          title: "Modern Front-End Interfaces",
          desc: "Built responsive, user-centric front-end interfaces with HTML, CSS, JavaScript, and Next.js, accelerating user adoption and system usability."
        },
        {
          title: "Client Onboarding & Training",
          desc: "Delivered hands-on client onboarding and training on custom ERP modules, cutting go-live timelines and post-launch support requests."
        },
        {
          title: "Digital Transformation Leadership",
          desc: "Served as lead technical consultant guiding client organizations through digital transformation roadmaps and ongoing system optimization."
        }
      ],
      competencyGroups: [
        {
          category: "Software & ERP Stack",
          items: ["Python", "Next.js", "HTML", "CSS", "JavaScript", "ERP Architecture", "RESTful APIs", "Database Modeling"]
        },
        {
          category: "Consulting & Operations",
          items: ["Digital Transformation Consulting", "Client Onboarding & Training", "Change Management", "System Deployment"]
        }
      ]
    },
    {
      role: "Customer Care Back Office Engineer",
      company: "Earthlink Telecommunications",
      location: "Baghdad, Iraq",
      period: "Sep 2024 – Dec 2025",
      type: "Full-Time",
      coreSummary: "Technical back-office engineer specializing in managing tier-2/tier-3 escalations, resolving complex ISP and broadband network issues, and bridging customer care operations with core network infrastructure teams to maintain high service reliability and SLA compliance.",
      responsibilities: [
        {
          title: "Escalation & Incident Management",
          desc: "Handled complex, escalated technical support tickets from front-line customer care agents regarding broadband, FTTH, and enterprise internet connectivity faults."
        },
        {
          title: "Cross-Functional Coordination",
          desc: "Served as the primary technical bridge between customer service operations and core network/engineering departments to diagnose and isolate widespread or persistent subscriber outages."
        },
        {
          title: "SLA & KPI Tracking",
          desc: "Monitored and enforced internal Service Level Agreements (SLAs), resolution timeframes, and performance metrics to ensure rapid ticket turnaround and high customer satisfaction."
        },
        {
          title: "System Provisioning & Auditing",
          desc: "Managed back-office subscriber configurations, network provisioning updates, profile audits, and billing/CRM database synchronizations."
        },
        {
          title: "Root Cause Analysis & Documentation",
          desc: "Analyzed recurring technical tickets and network glitches to identify systemic issues, documenting troubleshooting workflows and updating internal knowledge bases to streamline future resolutions."
        },
        {
          title: "Quality Assurance",
          desc: "Ensured adherence to corporate technical support policies, data security guidelines, and internal communication standards."
        },
        {
          title: "Queue Resolution & Uptime",
          desc: "Resolved critical daily ticket queues across enterprise telecom and FTTH service operations, minimizing customer downtime while maintaining strict SLA compliance."
        },
        {
          title: "FTTH Operational Systems",
          desc: "Maintained in-depth technical operational knowledge of FTTH infrastructure and back-office OSS/BSS systems."
        }
      ],
      competencyGroups: [
        {
          category: "Telecom & Networking",
          items: ["FTTH", "Broadband Provisioning", "IP Routing & Subnetting", "DNS/DHCP Troubleshooting", "ISP Infrastructure"]
        },
        {
          category: "Systems & Tools",
          items: ["Advanced CRM Platforms", "Enterprise Ticketing & Helpdesk Systems (Jira, ServiceNow, custom ERP/Billing)", "Data Logging Utilities"]
        },
        {
          category: "Operational Skills",
          items: ["Tier-2/Tier-3 Technical Support", "Incident Escalation Management", "SLA/KPI Monitoring", "Root Cause Analysis", "Cross-Functional Communication"]
        }
      ]
    },
    {
      role: "Contact Center Representative Engineer",
      company: "Earthlink Telecommunications",
      location: "Baghdad, Iraq",
      period: "Nov 2023 – Sep 2024",
      type: "Full-Time",
      coreSummary: "Technical support professional bridging customer-facing communication with core telecommunications troubleshooting, delivering rapid first-line resolution for subscriber connectivity issues, FTTH services, and internet routing faults.",
      responsibilities: [
        {
          title: "Technical Troubleshooting & Diagnostics",
          desc: "Provided front-line technical support for broadband, wireless, and FTTH subscribers, diagnosing issues related to link drops, slow speeds, high ping, and CPE (modem/router) configurations."
        },
        {
          title: "First-Contact Resolution (FCR)",
          desc: "Efficiently investigated and resolved technical inquiries and connection failures during initial customer interactions, maximizing first-contact resolution rates."
        },
        {
          title: "Ticket Management & Escalation",
          desc: "Logged, tracked, and managed support tickets using enterprise CRM and helpdesk systems, accurately documenting network faults and escalating complex tier-2/tier-3 issues to back-office engineering teams."
        },
        {
          title: "Customer Guidance & Education",
          desc: "Walked non-technical subscribers through step-by-step troubleshooting procedures, Wi-Fi channel optimization, and device reconfigurations."
        },
        {
          title: "SLA & Performance Tracking",
          desc: "Met or exceeded internal Key Performance Indicators (KPIs), including average handling time (AHT), first-response time, and customer satisfaction (CSAT) benchmarks."
        },
        {
          title: "Network Monitoring & Coordination",
          desc: "Collaborated closely with Network Operations Center (NOC) and provisioning teams to report regional outages, fiber cuts, and service degradations in real time."
        },
        {
          title: "Tool & Hardware Utilization",
          desc: "Diagnosed and resolved complex customer-reported network and connectivity issues using Nokia AMS, Huawei iMaster NCE, QGIS, and Cisco Systems."
        },
        {
          title: "Last-Mile Optical Analysis",
          desc: "Applied hands-on FTTH engineering principles to pinpoint and fix last-mile optical signal degradation and connectivity bottlenecks."
        },
        {
          title: "API & Service Validation",
          desc: "Utilized Postman for API testing and validation of backend service endpoints."
        }
      ],
      competencyGroups: [
        {
          category: "Telecom & Networking",
          items: ["FTTH", "Wi-Fi Troubleshooting", "CPE Configuration (Modems/Routers)", "IP Addressing", "Basic DNS & DHCP"]
        },
        {
          category: "Systems & Software",
          items: ["Enterprise CRM Platforms", "Ticketing & Helpdesk Software", "Remote Diagnostic Tools", "Postman", "Nokia AMS", "Huawei iMaster NCE"]
        },
        {
          category: "Operational Skills",
          items: ["First-Contact Resolution (FCR)", "Technical Communication", "Incident Escalation", "SLA Compliance", "Cross-Functional Collaboration"]
        }
      ]
    },
    {
      role: "Medical Equipment Engineer (Part-Time)",
      company: "Al-Ittihad Medical Equipment Maintenance",
      location: "Baghdad, Iraq",
      period: "2019 – 2022",
      type: "Engineering Specialist",
      coreSummary: "Clinical equipment diagnostics and electro-mechanical hardware maintenance across hospital diagnostic imaging centers.",
      responsibilities: [
        {
          title: "Hardware Maintenance & Diagnostic Imaging",
          desc: "Maintained and repaired MRI, CT scan, and X-ray systems, ensuring stringent safety compliance and high operational uptime."
        },
        {
          title: "Precision Calibration",
          desc: "Performed calibrated diagnostic testing, power supply tuning, and preventive maintenance on high-voltage clinical hardware."
        }
      ],
      competencyGroups: [
        {
          category: "Biomedical Systems",
          items: ["MRI Systems", "CT Scanners", "X-Ray Hardware", "Preventive Maintenance", "Clinical Safety Standards"]
        }
      ]
    }
  ];

  const skillCategories = [
    {
      id: "telecom",
      label: "Telecom & Networking",
      icon: Network,
      skills: [
        { name: "FTTH Network Engineering", level: "Advanced", desc: "Fiber-to-the-home architecture, optical distribution & last-mile fiber connectivity" },
        { name: "Cisco Systems (CCNA)", level: "Certified", desc: "Routing, switching, VLANs, subnetting, enterprise network security" },
        { name: "Nokia AMS", level: "Proficient", desc: "Access Management System for fiber optical line terminals (OLT)" },
        { name: "Huawei iMaster NCE", level: "Proficient", desc: "Network Cloud Engine for automated telecom service provisioning" },
        { name: "QGIS Geomatics", level: "Proficient", desc: "Geographic spatial mapping of fiber cables and splitters" },
        { name: "Network Diagnostics", level: "Expert", desc: "Signal loss, OTDR troubleshooting, packet inspection, last-mile fixes" },
        { name: "Postman & API Testing", level: "Proficient", desc: "Automated test collections, endpoint latency checks, payload verification" }
      ]
    },
    {
      id: "software",
      label: "Software & ERP Development",
      icon: Code,
      skills: [
        { name: "Python", level: "Advanced", desc: "Backend business logic, data processing scripts, ERP automation services" },
        { name: "Next.js & React 19", level: "Advanced", desc: "Server components, modern SSR/SSG web applications, state management" },
        { name: "HTML5, CSS3 & JavaScript", level: "Advanced", desc: "Responsive user interfaces, cross-browser compatibility, DOM scripting" },
        { name: "ERP System Architecture", level: "Advanced", desc: "Modular design: inventory, invoicing, CRM, roles & permissions" },
        { name: "RESTful API Engineering", level: "Advanced", desc: "Design, schema definitions, authentication, database querying" },
        { name: "Tailwind CSS & UI/UX", level: "Advanced", desc: "Responsive design, micro-animations, accessible modern web layouts" }
      ]
    },
    {
      id: "consulting",
      label: "Consulting & Operations",
      icon: Layers,
      skills: [
        { name: "Tier-2/Tier-3 Escalation Management", level: "Expert", desc: "Resolving complex ISP, broadband, and FTTH connectivity faults" },
        { name: "Digital Transformation Consulting", level: "Specialist", desc: "Transitioning manual business operations into structured ERP workflows" },
        { name: "Client Onboarding & Training", level: "Expert", desc: "User training workshops, system documentation, rapid adoption programs" },
        { name: "SLA & KPI Tracking", level: "Proficient", desc: "Enforcing internal Service Level Agreements, turnaround timeframes & metrics" },
        { name: "Cross-Functional Collaboration", level: "Expert", desc: "Uniting field technicians, network engineers, software developers, and executive stakeholders" }
      ]
    }
  ];

  const filteredSkills = selectedSkillCategory === "all" 
    ? skillCategories.flatMap(c => c.skills.map(s => ({ ...s, category: c.label })))
    : skillCategories.find(c => c.id === selectedSkillCategory)?.skills.map(s => ({ ...s, category: selectedSkillCategory })) || [];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Procedural Smoke Shader */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
        <SmokeBackground smokeColor="#06b6d4" />
      </div>

      {/* Floating Glass Navigation Header */}
      <header className="sticky top-4 z-50 w-full max-w-5xl px-3 sm:px-4">
        <div className="relative flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
          <a href="#" className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm group shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold tracking-wide group-hover:text-cyan-400 transition-colors">FAISAL AWAD</span>
          </a>

          <nav className="hidden lg:flex items-center gap-5 text-xs text-slate-300 font-medium">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#simulation" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="text-sm">🍜</span>
              <span>3D Noodles</span>
            </a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#education" className="hover:text-cyan-400 transition-colors">Education & CCNA</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-2 sm:gap-2.5" ref={headerContactRef}>
            {/* DIRECT CONTACTS DROPDOWN / BUTTON IN HEADER */}
            <div className="relative">
              <button
                onClick={() => setShowDirectContacts(!showDirectContacts)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  showDirectContacts
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/50"
                }`}
                aria-label="Direct Contacts"
              >
                <Phone size={13} className={showDirectContacts ? "text-slate-950" : "text-cyan-400"} />
                <span className="hidden xs:inline sm:inline">Direct Contacts</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${showDirectContacts ? "rotate-180" : ""}`} />
              </button>

              {/* Direct Contacts Popover Panel */}
              <AnimatePresence>
                {showDirectContacts && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-3 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={12} className="text-cyan-400" /> Direct Contacts
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Online / Available
                      </span>
                    </div>

                    {/* Email item */}
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-800/70 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Email</div>
                          <a
                            href="mailto:faisal.awad.1995@gmail.com"
                            className="text-xs font-medium text-slate-200 hover:text-cyan-400 truncate block"
                          >
                            faisal.awad.1995@gmail.com
                          </a>
                        </div>
                        <button
                          onClick={() => copyToClipboard("faisal.awad.1995@gmail.com", "header-email")}
                          className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1 shrink-0 transition-colors"
                          title="Copy Email"
                        >
                          {copiedType === "header-email" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span className="text-[11px]">{copiedType === "header-email" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Phone item */}
                      <div className="p-2.5 rounded-xl bg-slate-800/70 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Phone</div>
                          <a
                            href="tel:+9647749737772"
                            className="text-xs font-medium text-slate-200 hover:text-cyan-400 truncate block"
                          >
                            +964 774 973 7772
                          </a>
                        </div>
                        <button
                          onClick={() => copyToClipboard("+9647749737772", "header-phone")}
                          className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1 shrink-0 transition-colors"
                          title="Copy Phone"
                        >
                          {copiedType === "header-phone" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span className="text-[11px]">{copiedType === "header-phone" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Direct WhatsApp Action */}
                      <a
                        href="https://wa.me/9647749737772"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <MessageCircle size={14} className="text-emerald-400" />
                        <span>Chat on WhatsApp Directly</span>
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resume button */}
            <a
              href="/Faisal_Awad_Resume.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <FileText size={13} />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* WhatsApp button */}
            <a
              href="https://wa.me/9647749737772"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle size={13} />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 w-full max-w-5xl py-12 md:py-16 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center flex flex-col items-center pt-8 md:pt-12 w-full">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs md:text-sm font-medium mb-6 shadow-lg shadow-cyan-950/40"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>ERP Architect & Telecommunications Engineer</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif bg-gradient-to-b from-white via-slate-100 to-slate-400 py-2 bg-clip-text text-transparent font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase drop-shadow-md"
          >
            FAISAL AWAD ISAM
          </motion.h1>

          {/* Requested Tagline Change */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 font-sans font-medium text-slate-300 text-base sm:text-lg md:text-2xl max-w-3xl leading-relaxed"
          >
            Bridging infrastructure-grade <span className="text-cyan-400 font-semibold">FTTH Telecom Networks</span> and scalable <span className="text-violet-400 font-semibold">Enterprise ERP</span>.
          </motion.p>

          {/* Location & Quick Contact Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-slate-400"
          >
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-white/5">
              <MapPin size={13} className="text-cyan-400" /> Baghdad, Iraq
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-white/5">
              <ShieldCheck size={13} className="text-emerald-400" /> Cisco CCNA Certified
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-white/5">
              <Award size={13} className="text-violet-400" /> Bachelor of Engineering
            </span>
          </motion.div>

          {/* Metric Highlights: Updated with Full ERP (Python & Next.js, HTML, CSS, and JavaScript) and FTTH (GPON removed) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            {[
              { label: "Engineering Practice", value: "4+ Years", sub: "Telecom & Software" },
              { label: "Cisco Certified", value: "CCNA", sub: "Routing & Switching" },
              { label: "Systems Architecture", value: "Full ERP", sub: "Python & Next.js, HTML, CSS, and JavaScript" },
              { label: "Network Operations", value: "FTTH", sub: "Nokia & Huawei" }
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/5 text-center hover:border-cyan-500/30 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">{stat.label}</div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 leading-snug">{stat.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#experience"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Briefcase size={16} />
              <span>Explore Experience</span>
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Contact & Connect</span>
            </a>
          </motion.div>
        </section>

        {/* SECTION: INTERACTIVE 3D NOODLE BOWL SHOWCASE */}
        <section id="simulation" className="w-full scroll-mt-24 flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3 shadow-lg shadow-amber-950/30">
              <span className="text-sm">🍜</span>
              <span>Real-Time 3D Culinary Simulation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Interactive 3D Noodle Bowl: Ramen & Pasta
            </h2>
            <p className="mt-2.5 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              A delicious 3D bowl of freshly cooked noodles with ceramic donburi, shimmering savory broth, and wooden chopsticks. Use the on-screen dock to lift noodles out of the bowl, toggle soft-boiled egg, nori, narutomaki, and scallions, adjust hot rising steam, and orbit in full 360°.
            </p>
          </div>

          <div className="w-full">
            <CyberNoodlesViewer />
          </div>
        </section>

        {/* SECTION: ABOUT / PROFESSIONAL SUMMARY */}
        <section id="about" className="w-full scroll-mt-28">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>Executive Summary</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
                Dual-Discipline Engineering: Telecom Networks Meets Enterprise Software
              </h2>

              <p className="text-slate-300 leading-relaxed font-light text-base sm:text-lg mb-8">
                Computer Technology Engineer with parallel, equally deep expertise in telecommunications network engineering and ERP / full-stack software development. Engineered and supported FTTH network infrastructure using industry tools such as Cisco Systems, QGIS, Nokia AMS, and Huawei iMaster NCE, while also architecting end-to-end ERP systems with Python, JavaScript, and Next.js.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                    <Network size={18} />
                    <span>Telecom Infrastructure</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                    Deep proficiency in FTTH optical topologies, Nokia OLTs, Huawei NCE, last-mile diagnostics, and high-availability transmission continuity.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm">
                    <Code size={18} />
                    <span>ERP & Full-Stack</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                    End-to-end enterprise architectures, Python backends, Next.js, HTML, CSS, JavaScript front-ends, and robust RESTful API microservices.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <Layers size={18} />
                    <span>Digital Transformation</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                    Guiding businesses through operational modernization, customized user training, tier-2/tier-3 escalation resolution, and technical leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: EXPERIENCE TIMELINE */}
        <section id="experience" className="w-full scroll-mt-28 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Briefcase size={14} />
              <span>Career Trajectory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Professional Experience
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Demonstrated track record across telecommunications back-office systems, live network diagnostics, and full-scale ERP deployments.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-12 pl-6 md:pl-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline Node Dot */}
                <span className="absolute -left-[31px] md:-left-[47px] top-1.5 h-4 w-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_10px_#06b6d4]" />

                {/* Card Container */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 transition-all shadow-xl group-hover:shadow-cyan-950/20 space-y-6">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-block mb-2">
                        {exp.type}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-medium text-slate-300 flex items-center gap-2 mt-1">
                        <span className="text-violet-400 font-semibold">{exp.company}</span>
                        <span>•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-white/5 self-start sm:self-center">
                      <Calendar size={13} className="text-cyan-400" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Core Professional Summary Callout */}
                  <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                    <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles size={12} /> Core Professional Summary
                    </div>
                    <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed">
                      {exp.coreSummary}
                    </p>
                  </div>

                  {/* Key Responsibilities & Achievements */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-cyan-400" /> Key Responsibilities & Achievements
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {exp.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-white/[0.03]">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_6px_#22d3ee]" />
                          <div>
                            <strong className="font-semibold text-slate-100">{resp.title}: </strong>
                            <span className="text-slate-300">{resp.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categorized Skills & Competencies */}
                  {exp.competencyGroups && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Terminal size={13} className="text-violet-400" /> Key Skills & Competencies
                      </h4>
                      <div className="space-y-2">
                        {exp.competencyGroups.map((grp, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                            <span className="font-semibold text-cyan-300/90 min-w-[160px] text-[11px] uppercase tracking-wide">
                              {grp.category}:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {grp.items.map((skill, si) => (
                                <span
                                  key={si}
                                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-white/5"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION: TECHNICAL SKILLS MATRIX */}
        <section id="skills" className="w-full scroll-mt-28 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Code size={14} />
              <span>Technical Repertoire</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Skills & Engineering Stack
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Comprehensive technical toolkit spanning optical telecommunications hardware, network operating systems, and enterprise full-stack development.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center flex-wrap gap-2">
            {[
              { id: "all", label: "All Technologies" },
              { id: "telecom", label: "Telecom & Networking" },
              { id: "software", label: "Software & ERP" },
              { id: "consulting", label: "Consulting & Operations" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSkillCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedSkillCategory === tab.id
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25"
                    : "bg-slate-900/60 text-slate-300 hover:text-white border border-white/5 hover:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="p-5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/5 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {skill.desc}
                  </p>
                </div>
                {"category" in skill && (
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 uppercase tracking-wider">
                    {skill.category}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION: EDUCATION & CERTIFICATIONS */}
        <section id="education" className="w-full scroll-mt-28 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap size={14} />
              <span>Academic & Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Education & Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Degree Card */}
            <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap size={120} className="text-cyan-400" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-inner">
                  <GraduationCap size={24} />
                </div>
                <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  Bachelor of Engineering
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                  Computer Technology Engineering
                </h3>
                <p className="text-violet-400 font-medium text-sm">
                  Al-Turath University
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> 2019 – 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> Baghdad, Iraq
                  </span>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Comprehensive studies in computer systems, telecommunications networks, database design, and software engineering.
                </p>
              </div>
            </div>

            {/* Certification Card */}
            <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award size={120} className="text-violet-400" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 shadow-inner">
                  <Award size={24} />
                </div>
                <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                  Industry Certification
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                  Cisco Certified Network Associate (CCNA)
                </h3>
                <p className="text-cyan-400 font-medium text-sm">
                  Cisco Systems
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-400" /> Validated Credential
                  </span>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Certified competency across network fundamentals, network access, IP connectivity (routing protocols), IP services, security fundamentals, and network automation.
                </p>
              </div>
            </div>
          </div>

          {/* Languages & Core Strengths Bar */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Terminal size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Language Proficiencies</h4>
                <p className="text-xs text-slate-400">Ready for regional & international enterprise environments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-200">
                <strong className="text-cyan-400">Arabic:</strong> Native / Fluent
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-200">
                <strong className="text-violet-400">English:</strong> Professional / Fluent
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACT & CONNECT */}
        <section id="contact" className="w-full scroll-mt-28 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Mail size={14} />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Connect & Collaborate
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Feel free to reach out via WhatsApp, Email, or connect directly through LinkedIn.
            </p>
          </div>

          {/* 4 Interactive Spotlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center w-full">
            {/* WhatsApp Card */}
            <a href="https://wa.me/9647749737772" target="_blank" rel="noopener noreferrer" className="w-full outline-none group">
              <GlowCard customSize={true} glowColor="green" className="cursor-pointer w-full h-64 hover:border-emerald-500/50 transition-all">
                <div className="flex flex-col items-center justify-center h-full w-full text-slate-200 group-hover:text-white transition-colors">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle size={44} className="text-emerald-400 drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-center">WhatsApp</h3>
                  <p className="text-slate-400 font-light mt-1 text-center text-xs">+964 774 973 7772</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    Chat Directly <ArrowUpRight size={13} />
                  </span>
                </div>
              </GlowCard>
            </a>

            {/* CV Card */}
            <a href="/Faisal_Awad_Resume.docx" target="_blank" rel="noopener noreferrer" className="w-full outline-none group">
              <GlowCard customSize={true} glowColor="purple" className="cursor-pointer w-full h-64 hover:border-violet-500/50 transition-all">
                <div className="flex flex-col items-center justify-center h-full w-full text-slate-200 group-hover:text-white transition-colors">
                  <div className="p-3 rounded-2xl bg-violet-500/10 mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={44} className="text-violet-400 drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-center">My Resume</h3>
                  <p className="text-slate-400 font-light mt-1 text-center text-xs">Faisal_Awad_Resume.docx</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-violet-400 font-medium">
                    Download File <ArrowUpRight size={13} />
                  </span>
                </div>
              </GlowCard>
            </a>

            {/* Email Card */}
            <a href="mailto:faisal.awad.1995@gmail.com" className="w-full outline-none group">
              <GlowCard customSize={true} glowColor="blue" className="cursor-pointer w-full h-64 hover:border-blue-500/50 transition-all">
                <div className="flex flex-col items-center justify-center h-full w-full text-slate-200 group-hover:text-white transition-colors">
                  <div className="p-3 rounded-2xl bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
                    <Mail size={44} className="text-blue-400 drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-center">Email</h3>
                  <p className="text-slate-400 font-light mt-1 text-center text-xs truncate max-w-[180px]">faisal.awad.1995@gmail.com</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-blue-400 font-medium">
                    Send Message <ArrowUpRight size={13} />
                  </span>
                </div>
              </GlowCard>
            </a>

            {/* LinkedIn Card */}
            <a href="https://www.linkedin.com/in/faisal-awad-4b9a4b1b1" target="_blank" rel="noopener noreferrer" className="w-full outline-none group">
              <GlowCard customSize={true} glowColor="blue" className="cursor-pointer w-full h-64 hover:border-sky-500/50 transition-all">
                <div className="flex flex-col items-center justify-center h-full w-full text-slate-200 group-hover:text-white transition-colors">
                  <div className="p-3 rounded-2xl bg-sky-500/10 mb-4 group-hover:scale-110 transition-transform">
                    <LinkedinIcon size={44} className="text-sky-400 drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-center">LinkedIn</h3>
                  <p className="text-slate-400 font-light mt-1 text-center text-xs">in/faisal-awad-4b9a4b1b1</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-sky-400 font-medium">
                    Connect Profile <ArrowUpRight size={13} />
                  </span>
                </div>
              </GlowCard>
            </a>
          </div>


        </section>

        {/* FOOTER */}
        <footer className="w-full pt-8 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
          <p>© {new Date().getFullYear()} Faisal Awad Isam • Computer Technology Engineer</p>
          <p className="text-[11px] text-slate-600">Built with Next.js, Framer Motion & Tailwind CSS</p>
        </footer>

      </div>
    </main>
  );
}
