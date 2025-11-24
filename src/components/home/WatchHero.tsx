"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./WatchHero.module.css"

export function WatchHero() {
    const [timeString, setTimeString] = useState("--:--")
    const hourHandRef = useRef<SVGLineElement>(null)
    const minuteHandRef = useRef<SVGLineElement>(null)
    const secondHandRef = useRef<SVGLineElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number | null>(null)

    useEffect(() => {
        const updateClock = () => {
            const now = new Date()

            // Update accessible text
            setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

            // Calculate angles
            const seconds = now.getSeconds()
            const milliseconds = now.getMilliseconds()
            const minutes = now.getMinutes()
            const hours = now.getHours()

            // Smooth continuous movement for seconds
            // (seconds * 6) + (milliseconds * 0.006)
            const secondAngle = (seconds * 6) + (milliseconds * 0.006)

            // Smooth movement for minutes
            // (minutes * 6) + (seconds * 0.1)
            const minuteAngle = (minutes * 6) + (seconds * 0.1)

            // Smooth movement for hours
            // (hours % 12 * 30) + (minutes * 0.5)
            const hourAngle = ((hours % 12) * 30) + (minutes * 0.5)

            // Apply transforms
            if (secondHandRef.current) {
                secondHandRef.current.style.transform = `rotate(${secondAngle}deg)`
            }
            if (minuteHandRef.current) {
                minuteHandRef.current.style.transform = `rotate(${minuteAngle}deg)`
            }
            if (hourHandRef.current) {
                hourHandRef.current.style.transform = `rotate(${hourAngle}deg)`
            }

            requestRef.current = requestAnimationFrame(updateClock)
        }

        requestRef.current = requestAnimationFrame(updateClock)

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [])

    // Parallax Effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window

            const x = (clientX - innerWidth / 2) / innerWidth
            const y = (clientY - innerHeight / 2) / innerHeight

            const moveX = x * 20 // Max 20px movement
            const moveY = y * 20

            containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <section className={styles.heroSection} id="hero">
            <div className={styles.heroBackground}>
                <div className={styles.spotlight}></div>
            </div>

            <div className={styles.heroContainer}>
                {/* Watch Visuals */}
                <div className={styles.watchVisualContainer} ref={containerRef}>
                    {/* Static Watch Image */}
                    <Image
                        src="/watch-hero.png"
                        alt="Sachdeva Luxury Watch Face"
                        width={600}
                        height={800}
                        className={styles.watchBase}
                        priority
                        loading="eager"
                    />

                    {/* Analog Hands Overlay */}
                    <svg className={styles.watchHandsOverlay} viewBox="0 0 600 800" aria-hidden="true">
                        {/* Pivot Point (Center: 300, 315) */}
                        <circle cx="300" cy="315" r="8" className={styles.handPivot} />

                        {/* Hour Hand */}
                        <line
                            ref={hourHandRef}
                            x1="300" y1="315" x2="300" y2="210"
                            className={`${styles.hand} ${styles.handHour}`}
                        />

                        {/* Minute Hand */}
                        <line
                            ref={minuteHandRef}
                            x1="300" y1="315" x2="300" y2="150"
                            className={`${styles.hand} ${styles.handMinute}`}
                        />

                        {/* Second Hand */}
                        <line
                            ref={secondHandRef}
                            x1="300" y1="355" x2="300" y2="130"
                            className={`${styles.hand} ${styles.handSecond}`}
                        />
                    </svg>
                </div>

                {/* Text Content */}
                <div className={styles.heroContent}>
                    <h1 className={styles.heroHeadline}>Timeless Craftsmanship</h1>
                    <p className={styles.heroSubtext}>Precision engineering meets elegant design. Discover the new collection.</p>
                    <Link href="/shop" className={styles.ctaButton}>
                        Explore Collection
                    </Link>
                </div>
            </div>

            {/* Accessible Live Time */}
            <div className={styles.srOnly} aria-live="polite">
                Current local time: <span>{timeString}</span>
            </div>
        </section>
    )
}
