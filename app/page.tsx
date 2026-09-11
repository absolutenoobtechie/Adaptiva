import {
  Brain,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Languages,
  Mic,
  PlaySquare,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { AdaptivaPipeline } from "@/components/landing/adaptiva-pipeline";
import { DemoJourney } from "@/components/landing/demo-journey";
import { Hero3dIllustration } from "@/components/landing/hero-3d-illustration";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { ReadingModeShowcase } from "@/components/reading/reading-mode-showcase";
import { Button } from "@/components/ui/button";
import { Badge, Panel, SectionHeader } from "@/components/ui/panel";

const barriers = [
  "Long paragraphs",
  "Complex vocabulary",
  "Information overload",
  "Fast lectures",
  "Language barriers",
  "Difficult navigation",
  "Lack of personalization"
];

const steps = [
  { title: "Input", body: "PDF, text, lecture, video, or image.", icon: FileText },
  { title: "Understand", body: "AI analyzes structure, concepts, language, and difficulty.", icon: Brain },
  { title: "Adapt", body: "Accessibility profile determines how content should be presented.", icon: Sparkles },
  { title: "Experience", body: "The learner receives personalized accessible content.", icon: CheckCircle2 }
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            {/* Hero illustration */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <Hero3dIllustration />
            </div>
            <Badge>Accessibility & Inclusive Technology</Badge>
            <h1 className="mt-5 text-balance text-6xl font-black leading-[1.02] text-ink sm:text-7xl lg:text-8xl">ADAPTIVA</h1>
            <p className="mt-6 max-w-2xl text-2xl font-black leading-tight text-moss">Technology that adapts to the way you learn.</p>
            <p className="mt-5 max-w-2xl text-xl leading-9 text-graphite">An AI-powered accessibility layer that transforms lectures, documents, videos and learning material into experiences designed around individual needs.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link href="/onboarding">Try Adaptiva</Link></Button>
              <Button size="lg" variant="secondary" asChild><Link href="#how-it-works">See how it works</Link></Button>
            </div>
            <p className="mt-6 text-lg font-black text-ink">Same knowledge. A learning experience built for you.</p>
          </div>
          <div className="grid gap-5">
            <ReadingModeShowcase />
            <Panel className="bg-white/92">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Learner Profile</p><h2 className="mt-2 text-2xl font-black text-ink">Adaptive supports active</h2></div><span className="rounded-card bg-mint/14 px-3 py-2 text-xs font-black text-moss">Demo Mode</span></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{["Dyslexia Support", "Focus Support", "Audio Support", "Simplified Language"].map((item) => (<span key={item} className="flex items-center gap-2 rounded-card bg-paper px-3 py-3 font-black text-ink"><CheckCircle2 aria-hidden="true" className="text-moss" size={18} />{item}</span>))}</div>
            </Panel>
            <ProductShowcase />
          </div>
        </div>
      </section>
      <AdaptivaPipeline />
      <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow="Problem" title="Digital education assumes everyone learns the same way." body="Most platforms are designed for an average learner. Adaptiva removes the barrier between information and understanding." /><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{barriers.map((barrier) => (<div key={barrier} className="rounded-card border border-ink/10 bg-paper p-4 text-lg font-black text-ink">{barrier}</div>))}</div></div></section>
      <section id="how-it-works" className="bg-paper py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow="How Adaptiva Works" title="From ordinary content to a personalized accessibility experience." /><div className="mt-10 grid gap-5 lg:grid-cols-4">{steps.map((step, index) => { const Icon = step.icon; return (<Panel key={step.title} className="relative min-h-56"><Icon aria-hidden="true" className="text-moss" size={32} /><p className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-moss">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-2xl font-black text-ink">{step.title}</h3><p className="mt-3 text-sm leading-7 text-graphite">{step.body}</p></Panel>); })}</div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[{ label: "PDF/document", icon: FileText }, { label: "Live microphone", icon: Mic }, { label: "Recorded video", icon: PlaySquare }, { label: "Image scan", icon: ImageIcon }, { label: "Language mode", icon: Languages }].map((item) => { const Icon = item.icon; return (<span key={item.label} className="flex min-h-16 items-center gap-3 rounded-card bg-white px-4 font-black text-ink shadow-sm"><Icon aria-hidden="true" className="text-moss" size={20} />{item.label}</span>); })}</div></div></section>
      <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><DemoJourney /></div></section>
      <section className="bg-ink py-16 text-white"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"><p className="text-4xl font-black leading-tight sm:text-5xl">Learning is not one-size-fits-all.</p><p className="mt-4 text-4xl font-black leading-tight text-mint sm:text-5xl">Neither should technology be.</p><h2 className="mt-8 text-5xl font-black tracking-[0.12em]">ADAPTIVA</h2><p className="mt-4 text-xl font-bold text-white/80">Technology that adapts to the way you learn.</p><Button className="mt-8 bg-white text-ink hover:bg-cloud" asChild><Link href="/onboarding">Experience Adaptive Learning</Link></Button></div></section>
    </>
  );
}
