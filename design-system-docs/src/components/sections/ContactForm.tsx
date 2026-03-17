"use client";

import React from 'react';

export function ContactForm() {
    return (
        <section className="py-24 lg:py-32 bg-background relative overflow-hidden" id="contact">
            {/* Ambient Background Glow for dark areas if needed, assuming bg-background here */}
            <div className="container mx-auto px-5 lg:px-20 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col gap-10 rounded-xl border border-border bg-card p-6 md:p-12 bracket md:shadow-glow-subtle">
                        <div className="text-center">
                            <h2 className="font-heading font-bold text-[32px] md:text-[40px] uppercase text-foreground tracking-[-0.01em] mb-4">
                                Связаться с нами
                            </h2>
                            <p className="font-body text-[length:var(--text-16)] lg:text-[length:var(--text-19)] text-muted-foreground leading-[1.618]">
                                Заполните форму и отправьте заявку, мы свяжемся с вами в течение 1 рабочего дня.
                            </p>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="name" className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full h-10 px-4 rounded-sm border border-border bg-background text-foreground font-body text-[length:var(--text-16)] placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring focus:shadow-glow-yellow disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted"
                                        placeholder="Ваше имя"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="phone" className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Телефон</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full h-10 px-4 rounded-sm border border-border bg-background text-foreground font-body text-[length:var(--text-16)] placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring focus:shadow-glow-yellow disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted"
                                        placeholder="+7 (999) 000-00-00"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full h-10 px-4 rounded-sm border border-border bg-background text-foreground font-body text-[length:var(--text-16)] placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring focus:shadow-glow-yellow disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted"
                                    placeholder="mail@example.com"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-border mt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-border text-[var(--rm-yellow-100)] focus:ring-[var(--rm-yellow-100)]/50" defaultChecked />
                                    <span className="font-body text-[length:var(--text-14)] text-muted-foreground group-hover:text-foreground transition-colors max-w-[250px] leading-[1.618]">
                                        Cогласен на обработку персональных данных
                                    </span>
                                </label>

                                <button type="submit" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] hover:shadow-glow-yellow focus-visible:outline-none focus-visible:shadow-glow-yellow active:bg-[var(--rm-yellow-500)] w-full sm:w-auto">
                                    Отправить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
