import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { usePro } from "@/contexts/ProContext";
import { triggerCelebration } from "@/lib/confetti";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";

const Success = () => {
    const { planType, refreshProStatus } = usePro();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const planFromUrl = searchParams.get("plan") || "pro";
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            // Force refresh to catch the webhook update
            await refreshProStatus();
            setIsVerifying(false);
            triggerCelebration();
        };

        verifyPayment();
    }, [refreshProStatus]);

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse font-serif italic">Validating Identity...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
            {/* Cinematic Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cobalt/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />

            <div className="max-w-2xl w-full z-10 text-center space-y-12">
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-serif tracking-tight text-foreground"
                    >
                        Identity, Engineered.
                    </motion.h1>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <motion.path
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-cobalt"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
                            />
                        </svg>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.7 }}
                    className="space-y-4"
                >
                    <p className="text-xl md:text-2xl font-light text-muted-foreground">
                        {planFromUrl === "pro" ? "Welcome to the Pro Tier" : "Welcome to the Basic Tier"}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Button
                            asChild
                            size="lg"
                            className="bg-cobalt hover:bg-cobalt/90 text-white px-8 h-14 rounded-full text-lg font-medium group transition-all duration-300"
                        >
                            <Link to="/dashboard">
                                Start Building Your Story
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Link
                            to="/dashboard?tab=templates"
                            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group underline-offset-4 hover:underline"
                        >
                            <LayoutTemplate className="w-4 h-4" />
                            View 19+ Cinematic Templates
                        </Link>
                    </div>
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="pt-24 text-sm text-muted-foreground font-light tracking-wide"
                >
                    Having trouble? Reach our engineering lead at{" "}
                    <a href="mailto:admin@foliogen.in" className="text-foreground hover:text-cobalt transition-colors">
                        admin@foliogen.in
                    </a>
                </motion.footer>
            </div>
        </div>
    );
};

export default Success;
