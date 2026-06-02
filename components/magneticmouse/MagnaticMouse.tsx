"use client";

import React, { useEffect } from "react";

interface FollowCursorProps {
  color?: string;
  zIndex?: number;
}

const FollowCursor: React.FC<FollowCursorProps> = ({
  color = "#C3392C",
  zIndex,
}) => {
  useEffect(() => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let animationFrame: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const cursor = { x: width / 2, y: height / 2 };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Check if user prefers reduced motion
    if (prefersReducedMotion.matches) {
      return;
    }

    class Dot {
      position: { x: number; y: number };
      width: number;
      lag: number;

      constructor(x: number, y: number, width: number, lag: number) {
        this.position = { x, y };
        this.width = width;
        this.lag = lag;
      }

      moveTowards(x: number, y: number, context: CanvasRenderingContext2D) {
        this.position.x += (x - this.position.x) / this.lag;
        this.position.y += (y - this.position.y) / this.lag;
        context.fillStyle = color;
        context.beginPath();
        context.arc(
          this.position.x,
          this.position.y,
          this.width,
          0,
          2 * Math.PI
        );
        context.fill();
        context.closePath();
      }
    }

    const dot = new Dot(width / 2, height / 2, 10, 10);
    let lastX = width / 2;
    let lastY = height / 2;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      isMoving = true;

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    const onWindowResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const updateDot = () => {
      if (context && isMoving) {
        const dx = cursor.x - lastX;
        const dy = cursor.y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0.5) {
          context.clearRect(0, 0, width, height);
          dot.moveTowards(cursor.x, cursor.y, context);
          lastX = dot.position.x;
          lastY = dot.position.y;
        }
      }
    };

    const loop = () => {
      updateDot();
      animationFrame = requestAnimationFrame(loop);
    };

    const init = () => {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d", { alpha: true });
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.width = width;
      canvas.height = height;
      canvas.style.zIndex = zIndex ? zIndex.toString() : "";
      document.body.appendChild(canvas);

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("resize", onWindowResize, { passive: true });
      loop();
    };

    const destroy = () => {
      if (canvas) canvas.remove();
      cancelAnimationFrame(animationFrame);
      clearTimeout(moveTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
    };

    prefersReducedMotion.addEventListener("change", () => {
      if (prefersReducedMotion.matches) {
        destroy();
      } else {
        init();
      }
    });

    init();

    return () => {
      destroy();
    };
  }, [color, zIndex]);

  return null;
};

export default FollowCursor;
