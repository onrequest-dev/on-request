// components/ui/onrequest-hero.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { motion, Variants, Easing } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

const OnRequestHero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: null as number | null, y: null as number | null, radius: 200 };

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (!canvas) return;
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 5;
                        this.y -= forceDirectionY * force * 5;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            if (!canvas) return;
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = (Math.random() * 2) + 1;
                const x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                const y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = 'rgba(191, 128, 255, 0.8)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const connect = () => {
            if (!ctx || !canvas) return;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        const opacityValue = 1 - (distance / 20000);
                        
                        const dxMouseA = particles[a].x - (mouse.x || 0);
                        const dyMouseA = particles[a].y - (mouse.y || 0);
                        const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);

                        if (mouse.x && distanceMouseA < mouse.radius) {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                        } else {
                            ctx.strokeStyle = `rgba(200, 150, 255, ${opacityValue})`;
                        }
                        
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            animationFrameId = requestAnimationFrame(animate);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // ✅ تم تصحيح النوع ليكون متوافقاً مع TypeScript
    const fadeUpVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 20 
        },
        visible: (i: number = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2 + 0.3,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1] as Easing, // cubic-bezier بدلاً من string
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden" dir="rtl">
            {/* Canvas Background */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            
            {/* Main Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-12 lg:py-0">
                    
{/* Left Side - Image */}
<motion.div
    custom={0}
    variants={fadeUpVariants}
    initial="hidden"
    animate="visible"
    className="flex justify-center lg:justify-end order-2 lg:order-1"
>
    <motion.div 
        className="relative group"
        animate={{
            y: [0, -15, 0], // حركة لأعلى وأسفل
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    >
        {/* تأثير glow خارجي مع نبض */}
        <motion.div 
            className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
        
        {/* الصورة مع حركة دوران بسيطة */}
        <motion.img 
            src="/img/onrequs.png" 
            alt="OnRequest Logo" 
            className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain mx-auto cursor-pointer"
            animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, 0, -2, 0], // تأرجح بسيط
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{
                scale: 1.1,
                rotate: 0,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
        />
    </motion.div>
</motion.div>

                    {/* Right Side - Text Content */}
                    <div className="text-center lg:text-right order-1 lg:order-2">
                        <motion.div
                            custom={0}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 lg:mb-8 backdrop-blur-sm"
                        >
                            <TrendingUp className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-gray-200">
                                استثمارات رقمية ذكية
                            </span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 lg:mb-6 tracking-tight"
                            style={{ fontFamily: 'Somar Medium, sans-serif' }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                                OnRequest
                            </span>
                        </motion.h1>

                        <motion.h2
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 text-gray-300"
                            style={{ fontFamily: 'Somar Medium, sans-serif' }}
                        >
                            استثمارات رقمية
                        </motion.h2>

                        <motion.p
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-400 mb-8 lg:mb-10 leading-relaxed"
                        >
                            نقدم حلولاً استثمارية رقمية مبتكرة تجمع بين التكنولوجيا المتطورة والفرص الاستثمارية الواعدة لتحقيق نمو مستدام ومربح.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnRequestHero;