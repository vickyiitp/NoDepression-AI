import React, { useEffect, useRef } from 'react';

const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse state in pixels
    const mouse = { x: width / 2, y: height / 2, isActive: false };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    // Configuration - Performance Optimization: Fewer particles on smaller screens
    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 50 : Math.min(120, (width * height) / 9000); 
    const CONNECTION_DISTANCE = isMobile ? 120 : 180;
    const MOUSE_INFLUENCE_RADIUS = isMobile ? 150 : 250;
    const FOV = 600;

    class Particle {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      vz: number;
      color: string;
      radius: number;
      phase: number;

      constructor() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * width;
        
        // Organic movement baselines
        this.baseX = this.x;
        this.baseY = this.y;
        
        // Velocity
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.vz = Math.random() * 0.5 + 0.2; // Forward speed
        
        this.phase = Math.random() * Math.PI * 2;

        const colors = [
          '56, 189, 248',  // brand-400 (Blue)
          '168, 85, 247',  // purple-500
          '45, 212, 191'   // teal-400
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update(time: number) {
        // 1. Move forward (Z-axis data stream)
        this.z -= this.vz;

        // 2. Organic drift (Sine wave based on time)
        this.x += Math.sin(time * 0.001 + this.phase) * 0.3;
        this.y += Math.cos(time * 0.001 + this.phase) * 0.3;

        // 3. Reset if passed camera
        if (this.z <= 10) {
          this.z = width;
          this.x = (Math.random() - 0.5) * width * 1.5;
          this.y = (Math.random() - 0.5) * height * 1.5;
        }
      }

      draw(screenX: number, screenY: number, scale: number, isNearMouse: boolean) {
        const alpha = Math.min(1, (scale - 0.1) * 2.5); // Fade in/out
        if (alpha <= 0) return;

        ctx!.beginPath();
        ctx!.arc(screenX, screenY, this.radius * scale * (isNearMouse ? 1.5 : 1), 0, Math.PI * 2);
        
        // Particles glow brighter when near mouse
        const glow = isNearMouse ? 1 : 0.6;
        ctx!.fillStyle = `rgba(${this.color}, ${alpha * glow})`;
        ctx!.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 16; // Approx 60fps ms

      // Calculate projected positions first for all particles to optimize loop
      const projected = particles.map(p => {
        p.update(time);
        const scale = FOV / (FOV + p.z);
        const x2d = p.x * scale + width / 2;
        const y2d = p.y * scale + height / 2;
        return { p, x2d, y2d, scale };
      });

      // Draw Lines & Particles
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.scale < 0.1) continue;

        // Interaction Check
        const distToMouse = mouse.isActive 
            ? Math.hypot(p1.x2d - mouse.x, p1.y2d - mouse.y) 
            : Infinity;
        const isNearMouse = distToMouse < MOUSE_INFLUENCE_RADIUS;

        // Draw connections
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          
          // Optimization: Check Z-depth difference first
          if (Math.abs(p1.p.z - p2.p.z) > CONNECTION_DISTANCE * 2) continue;

          // 3D Distance check (approximate using raw coordinates for speed)
          const dx = p1.p.x - p2.p.x;
          const dy = p1.p.y - p2.p.y;
          const dz = p1.p.z - p2.p.z;
          const distSq = dx*dx + dy*dy + dz*dz;

          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
             const dist = Math.sqrt(distSq);
             const opacityBase = 1 - dist / CONNECTION_DISTANCE;
             
             // "Data Pulse" Effect: Modulate opacity with sine wave
             const pulse = Math.sin(time * 0.003 + i) * 0.3 + 0.7; 
             
             // Mouse proximity boosts connection brightness
             const interactionBoost = isNearMouse ? 0.3 : 0;

             const alpha = opacityBase * p1.scale * pulse + interactionBoost;

             if (alpha > 0.05) {
                ctx.beginPath();
                ctx.moveTo(p1.x2d, p1.y2d);
                ctx.lineTo(p2.x2d, p2.y2d);
                
                // Use a gradient for the line to look like a beam
                const gradient = ctx.createLinearGradient(p1.x2d, p1.y2d, p2.x2d, p2.y2d);
                gradient.addColorStop(0, `rgba(${p1.p.color}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${p2.p.color}, ${alpha})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = isNearMouse ? 1.5 : 0.8;
                ctx.stroke();
             }
          }
        }

        // Draw the particle on top of lines
        p1.p.draw(p1.x2d, p1.y2d, p1.scale, isNearMouse);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }} // Visible but allows text legibility
    />
  );
};

export default Background3D;