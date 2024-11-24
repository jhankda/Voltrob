import React, { useEffect, useRef } from "react";

const ParticleSphere = () => {
    const canvasRef = useRef(null); // For accessing the canvas element
    const particlesArray = [];
    const colors = ["#FF33A5"];
    const particleCount = 200;
    const particleRadius = 1;
    const sphereRadius = 140;

    // Class definition for Particle
    class Particle {
        constructor(canvas) {
            this.theta = Math.random() * 2 * Math.PI;
            this.phi = Math.random() * 2 * Math.PI;
            this.radius = sphereRadius;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speed = 0.005 + Math.random() * 0.01;

            this.x3D = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y3D = this.radius * Math.cos(this.phi);
            this.z3D = this.radius * Math.sin(this.phi) * Math.sin(this.theta);

            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
        }

        update() {
            this.theta += this.speed;
            this.phi += this.speed / 2;

            this.x3D = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y3D = this.radius * Math.cos(this.phi);
            this.z3D = this.radius * Math.sin(this.phi) * Math.sin(this.theta);

            const perspective = this.canvas.width / (this.canvas.width + this.z3D);
            this.x2D = this.x3D * perspective + this.canvas.width / 2;
            this.y2D = this.y3D * perspective + this.canvas.height / 2;

            this.draw();
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.arc(
                this.x2D,
                this.y2D,
                particleRadius * (1 + this.z3D / sphereRadius),
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = this.color;
            this.ctx.shadowColor = this.color;
            this.ctx.shadowBlur = 20; // Glow effect
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    // Initialize and animate particles
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set the canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function initParticles() {
            particlesArray.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particlesArray.push(new Particle(canvas));
            }
        }

        function animateSphere() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach((particle) => particle.update());
            requestAnimationFrame(animateSphere);
        }

        // Initialize and animate particles
        initParticles();
        animateSphere();

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ParticleSphere;
