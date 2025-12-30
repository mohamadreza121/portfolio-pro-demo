import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  }
};

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  revealDelay = 0,
  revealKey,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  // Count only revealable (non-space) characters
  const revealableCount = useRef(
    text.split('').filter(char => char !== ' ').length
  );

  /* =====================================================
     SCRAMBLE / REVEAL ENGINE (UNCHANGED)
     ===================================================== */
  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          for (let i = 0; i < textLength; i++)
            if (!revealedSet.has(i) && text[i] !== ' ') return i;
          return null;

        case 'end':
          for (let i = textLength - 1; i >= 0; i--)
            if (!revealedSet.has(i) && text[i] !== ' ') return i;
          return null;

        case 'center': {
          const middle = Math.floor(textLength / 2);
          for (let offset = 0; offset <= middle; offset++) {
            const i1 = middle + offset;
            const i2 = middle - offset;
            if (i1 < textLength && !revealedSet.has(i1) && text[i1] !== ' ')
              return i1;
            if (i2 >= 0 && !revealedSet.has(i2) && text[i2] !== ' ')
              return i2;
          }
          return null;
        }

        default:
          return null;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) =>
      originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');

    if (isHovering) {
      setIsScrambling(true);

      interval = setInterval(() => {
        setRevealedIndices(prevRevealed => {
          const nextSet = new Set(prevRevealed);

          if (sequential) {
            if (nextSet.size < revealableCount.current) {
              const nextIndex = getNextIndex(nextSet);
              if (nextIndex !== null) nextSet.add(nextIndex);
              setDisplayText(shuffleText(text, nextSet));
              return nextSet;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
              setIsHovering(false);
              return nextSet;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly
  ]);

  /* =====================================================
     🔑 EXPLICIT REVEAL (AFTER CURTAINS)
     ===================================================== */
  useEffect(() => {
    if (!revealKey) return;

    setHasAnimated(true);
    setRevealedIndices(new Set());
    setDisplayText(text);

    const timer = setTimeout(() => {
      setIsHovering(true);
    }, revealDelay);

    return () => clearTimeout(timer);
  }, [revealKey, revealDelay, text]);

  /* =====================================================
     VIEW-BASED REVEAL (ONLY IF revealKey IS NOT USED)
     ===================================================== */
  useEffect(() => {
    if (revealKey) return;
    if (animateOn !== 'view' && animateOn !== 'both') return;

    // JSDOM (and some older browsers) may not implement IntersectionObserver.
    // In those cases, fall back to an immediate reveal.
    if (typeof IntersectionObserver === 'undefined') {
      if (!hasAnimated) {
        setHasAnimated(true);
        const t = setTimeout(() => {
          setRevealedIndices(new Set());
          setDisplayText(text);
          setIsHovering(true);
        }, revealDelay);
        return () => clearTimeout(t);
      }
      return;
    }

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          setTimeout(() => {
            setRevealedIndices(new Set());
            setDisplayText(text);
            setIsHovering(true);
          }, revealDelay);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, text, revealDelay, revealKey]);

  /* =====================================================
     HOVER SUPPORT (UNCHANGED)
     ===================================================== */
  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false)
        }
      : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...hoverProps}
      {...props}
    >
      <span style={styles.srOnly}>{displayText}</span>

      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span
              key={index}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
