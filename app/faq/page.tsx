import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ | Tiffinly Foods",
  description:
    "Find answers to common questions about Tiffinly Foods, subscriptions, pickup locations, cancellations, and support.",
};

const faqs = [
  {
    question: "How do I sign up?",
    answer:
      "Download the Tiffinly app, create an account with your email or phone number, and choose a plan that fits your schedule. You can start with the weekly plan or jump right into the monthly plan for best value.",
  },
  {
    question: "Can I upgrade to monthly plan anytime?",
    answer:
      "Absolutely. You upgrade to monthly plan without any extra cost. If you are on a weekly plan, simply go to the subscription section in the app and select the monthly plan.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "You can cancel your subscription from the app at any time. Changes take effect on your next billing cycle.",
  },
  {
    question: "Where can I pick up my orders?",
    answer:
      "You can pick up your meals from any of our partner stores in Jersey City, Hoboken, and Iselin. The app shows real-time pickup availability and lets you choose the most convenient location each day.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Yes, every plan includes free scheduled home delivery. Simply set your preferred delivery window in the app and we will take care of the rest.",
  },
  {
    question: "When should I place my order and what delivery windows can I choose?",
    answer:
      "Place or update your order in the app by 6 pm a day before. You can select a morning or evening delivery window, or opt for pickup at any store during its business hours. We will send reminders so you never miss the cutoff.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Reach us directly in the app via live chat or email us at support@tiffinlyfoods.com. Our concierge team is available 7 days a week from 8 AM – 9 PM ET.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 pb-20 pt-14 sm:pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              Need a quick answer?
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Everything you need to know about subscriptions, pickups, and support. Still stuck?{" "}
              <Link href="mailto:support@tiffinlyfoods.com" className="text-orange-600 hover:text-orange-500 font-medium">
                Email our team
              </Link>
              .
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-2xl border border-gray-200 bg-white px-4 sm:px-6"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-gray-900 hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-10 sm:px-10 sm:py-16 text-center text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold">Still have questions?</h2>
            <p className="mt-3 text-sm sm:text-base text-white/90">
              Our team is happy to help you customize your plan, choose pickup locations, or anything else you need.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="mailto:support@tiffinlyfoods.com"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow hover:bg-white/90"
              >
                Email support@tiffinlyfoods.com
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
