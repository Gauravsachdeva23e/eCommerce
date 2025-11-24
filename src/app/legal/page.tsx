export default function LegalPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Legal Information</h1>
                    <p className="mt-4 text-muted-foreground">
                        Transparency and trust are at the core of our business.
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Privacy Policy</h2>
                    <p className="text-muted-foreground">
                        At Sachdeva Watches, we take your privacy seriously. We collect only the information necessary to process your orders and improve your shopping experience. We do not sell or share your personal data with third parties for marketing purposes.
                    </p>
                    <p className="text-muted-foreground">
                        We use secure encryption (SSL) to protect your payment information during transmission. Your credit card details are never stored on our servers.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Terms & Conditions</h2>
                    <p className="text-muted-foreground">
                        By accessing and using this website, you agree to be bound by these terms and conditions. All content on this site, including images and text, is the property of Sachdeva Watches.
                    </p>
                    <p className="text-muted-foreground">
                        We reserve the right to modify prices and product availability at any time without prior notice. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Refund Policy</h2>
                    <p className="text-muted-foreground">
                        We want you to be completely satisfied with your purchase. If for any reason you are not, you may return your watch within 7 days of delivery for a full refund or exchange.
                    </p>
                    <p className="text-muted-foreground">
                        To be eligible for a return, the watch must be unworn, in its original packaging, and accompanied by the receipt or proof of purchase. Customized or engraved items are not eligible for return.
                    </p>
                </section>
            </div>
        </div>
    )
}
