'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Children, cloneElement, useEffect, useRef, useState } from 'react';

import './Dock.css';
import './TargetCursor'

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, isActive }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);
  


  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent"
      }}
      onTouchStart={() => isHovered.set(1)}
      onTouchEnd={() => isHovered.set(0)}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`dock-item cursor-target ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-current={isActive ? "true" : undefined}
    >
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  baseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  // In test/SSR environments, `window.matchMedia` may be undefined.
  // Default to desktop behavior to preserve visuals and interactions.
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(max-width: 480px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mq = window.matchMedia("(max-width: 480px)");
    const handler = (e) => setIsMobile(e.matches);

    // Older Safari uses `addListener`/`removeListener`.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    mq.addListener?.(handler);
    return () => mq.removeListener?.(handler);
  }, []);

  // NOTE: `height` was previously computed but not used. We intentionally
  // keep the dock height fixed at `panelHeight` to avoid changing visuals.

  return (
    <motion.div
      style={{ height: panelHeight, overflow: 'visible', scrollbarWidth: 'none' }}
      className="dock-outer"
    >
    <motion.div
      onMouseMove={
        !isMobile
          ? ({ pageX }) => {
              isHovered.set(1);
              mouseX.set(pageX);
            }
          : undefined
      }
      onMouseLeave={
        !isMobile
          ? () => {
              isHovered.set(0);
              mouseX.set(Infinity);
            }
          : undefined
      }
      className={`dock-panel ${className}`}
      style={{ height: panelHeight }}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          onClick={item.onClick}
          isActive={item.isActive}
          className={item.isActive ? "active" : ""}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
        >
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
      </motion.div>
    </motion.div>
  );
}
