import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Foliogen?',
    answer:
      'Foliogen is an AI-powered career strategist and portfolio builder designed to replace boring PDF resumes with cinematic, interactive portfolios that make recruiters remember you.',
  },
  {
    question: 'Is Foliogen free?',
    answer:
      'Yes! We offer a generous free tier so you can get started immediately. For access to cinematic templates and advanced AI tools, we offer Pro plans starting at ₹199 and ₹999.',
  },
  {
    question: 'What is Portfolio Strength?',
    answer:
      'Portfolio Strength is our proprietary AI scoring engine that benchmarks your profile against industry standards — analyzing completeness, keyword density, and presentation quality to give you an actionable score.',
  },
  {
    question: 'How is my data protected?',
    answer:
      'We use Row-Level Security (RLS) protected profiles and Security Invoker logic to ensure your private data never leaks. Your information is encrypted and only accessible by you.',
  },
  {
    question: 'Are the portfolios ATS-friendly?',
    answer:
      'Absolutely. Every template is optimized for Applicant Tracking System parsing, so your portfolio looks stunning to humans and scores high with automated screening tools.',
  },
  {
    question: 'Can I track my job applications?',
    answer:
      'Yes! Your integrated Job Command Centre lets you manage applications with a Kanban board, AI-powered interview prep, and real-time status tracking — all in one place.',
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to know about Foliogen.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/40 rounded-xl px-6 bg-card/30 backdrop-blur-sm data-[state=open]:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
