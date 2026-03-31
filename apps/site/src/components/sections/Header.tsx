"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { RocketmindMenu } from "./RocketmindMenu";

export function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [isVisible, setIsVisible] = useState(!isHome);

    useEffect(() => {
        if (!isHome) {
            setIsVisible(true);
            return;
        }

        const handleScroll = () => {
            const heroMidpoint = window.innerHeight / 2;
            setIsVisible(window.scrollY > heroMidpoint);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full h-16 bg-background border-b border-border flex items-center transition-all duration-300",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}
        >
            <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/text_logo_dark_background_en.svg"
                        alt="Rocketmind"
                        width={144}
                        height={24}
                        className="h-auto w-[120px] md:w-[144px]"
                    />
                </Link>

                <RocketmindMenu
                    className="hero-menu-desktop ml-auto flex-1 items-center justify-end gap-5 lg:gap-7"
                    itemClassName="!text-[18px]"
                    showDropdowns={true}
                />

                <MobileNav className="ml-auto" />
            </div>
        </header>
    );
}
