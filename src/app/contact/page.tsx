import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Contact Us</h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    We'd love to hear from you. Visit our showroom or get in touch.
                </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">Visit Our Showroom</h3>
                                <p className="text-muted-foreground">
                                    123 Watch Street, Connaught Place<br />
                                    New Delhi, India 110001
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">Call Us</h3>
                                <p className="text-muted-foreground">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">Email Us</h3>
                                <p className="text-muted-foreground">support@sachdevawatches.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Clock className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">Opening Hours</h3>
                                <p className="text-muted-foreground">
                                    Mon - Sat: 10:00 AM - 8:00 PM<br />
                                    Sun: 11:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Map Integration Placeholder
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-xl border bg-card p-8 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold">Send us a Message</h2>
                    <form className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                                Subject
                            </label>
                            <input
                                id="subject"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Inquiry about..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message
                            </label>
                            <textarea
                                id="message"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="How can we help you?"
                            />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
