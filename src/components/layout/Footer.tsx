"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import { Settings } from "@/lib/db"

interface FooterProps {
    settings?: Settings
}

export function Footer({ settings }: FooterProps) {
    const pathname = usePathname()

    // Hide footer on admin pages
    if (pathname?.startsWith('/admin')) {
        return null
    }

    const SocialIcon = ({ platform }: { platform: string }) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return <Facebook className="h-5 w-5" />
            case 'instagram': return <Instagram className="h-5 w-5" />
            case 'twitter': return <Twitter className="h-5 w-5" />
            case 'linkedin': return <Linkedin className="h-5 w-5" />
            case 'youtube': return <Youtube className="h-5 w-5" />
            default: return <Twitter className="h-5 w-5" />
        }
    }

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight text-secondary">
                            SACHDEVA WATCHES
                        </h3>
                        <p className="text-sm text-gray-400">
                            Premium timepieces for the modern gentleman. Quality, elegance, and
                            precision in every tick.
                        </p>
                        <div className="flex space-x-4">
                            {settings?.footerSocialLinks?.map((link, index) => (
                                link.url && link.url !== '#' && (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-secondary"
                                    >
                                        <SocialIcon platform={link.platform} />
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Shop
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {settings?.footerShopLinks?.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.url} className="hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Company
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {settings?.footerCompanyLinks?.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.url} className="hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Contact
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {settings?.footerAddress && (
                                <li className="whitespace-pre-line">{settings.footerAddress}</li>
                            )}
                            {settings?.footerPhone && (
                                <li>{settings.footerPhone}</li>
                            )}
                            {settings?.footerEmail && (
                                <li>{settings.footerEmail}</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} Sachdeva Watches. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
