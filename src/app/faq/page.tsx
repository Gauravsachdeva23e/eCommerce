export default function FAQPage() {
    const faqs = [
        {
            question: "Are your watches authentic?",
            answer: "Yes, absolutely. We are authorized retailers for all the brands we carry. Every watch comes with the original manufacturer's warranty and certificate of authenticity.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 7-day return policy for unworn watches in their original condition with all tags and packaging intact. Please contact our support team to initiate a return.",
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we ship primarily within India. For international orders, please contact us directly to discuss shipping options and rates.",
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 3-5 business days. Express shipping options are available at checkout for 1-2 day delivery in major cities.",
        },
        {
            question: "Do you provide watch servicing?",
            answer: "Yes, we have a dedicated service center with certified watchmakers. We handle battery replacements, strap adjustments, and full mechanical servicing.",
        },
    ]

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-primary">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-lg border bg-card p-4">
                            <details className="group">
                                <summary className="flex cursor-pointer items-center justify-between font-medium list-none">
                                    <span>{faq.question}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg
                                            fill="none"
                                            height="24"
                                            shapeRendering="geometricPrecision"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path d="M6 9l6 6 6-6"></path>
                                        </svg>
                                    </span>
                                </summary>
                                <p className="group-open:animate-fadeIn mt-3 text-muted-foreground">
                                    {faq.answer}
                                </p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
