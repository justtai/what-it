import { gsap } from 'gsap';

export const prizeAnimations = {
    "An inflatable dragon the size of a car": (el) => {
        gsap.to(el, {
            scale: 1.1,
            repeat: -1,
            yoyo: true,
            duration: 3,
            ease: 'power1.inOut'
        });
    },
    "A thousand invisible frogs": (el) => {
        gsap.fromTo(el, {y: 0}, {
            y: -10,
            repeat: -1,
            yoyo: true,
            duration: 0.2,
            ease: 'power1.inOut'
        });
    },
    "The Infinite Burrito Coupon": (el) => {
        gsap.to(el, {
            textShadow: '0 0 10px #fff, 0 0 20px var(--neon-pink), 0 0 30px var(--neon-pink)',
            repeat: -1,
            yoyo: true,
            duration: 1,
            ease: 'power1.inOut'
        });
    },
    "A golden rat statue": (el) => {
        gsap.to(el, {
            color: 'gold',
            textShadow: '0 0 10px gold, 0 0 20px gold',
            repeat: -1,
            yoyo: true,
            duration: 1,
            ease: 'power1.inOut'
        });
    },
    "A crystal that shows you what you've missed": (el) => {
        gsap.to(el, {
            filter: 'hue-rotate(360deg) saturate(2)',
            repeat: -1,
            duration: 4,
            ease: 'none'
        });
    },
    "A self-rocking rocking chair": (el) => {
        gsap.fromTo(el, {rotation: -5}, {
            rotation: 5,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'power2.inOut'
        });
    },
    "A portable black hole (for small trash only)": (el) => {
        gsap.to(el, {
            scale: 0.1,
            opacity: 0,
            rotation: 360,
            repeat: -1,
            yoyo: true,
            duration: 4,
            ease: 'power1.in'
        });
    },
    "A banana that is also a phone": (el) => {
        gsap.fromTo(el, {x: 0}, {
            x: (Math.random() > 0.5 ? 2 : -2), 
            repeat: 15,
            yoyo: true,
            duration: 0.08,
            ease: 'power1.inOut'
        });
    },
    "Time-share on the Moon": (el) => {
        gsap.to(el, {
            textShadow: '0 0 20px #fff, 0 0 30px var(--neon-cyan), 0 0 40px var(--neon-cyan)',
            y: -10,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'power1.inOut'
        });
    },
    "A perpetually warm pizza slice": (el) => {
        gsap.fromTo(el, {rotation: 0}, {
            rotation: 5,
            repeat: -1,
            yoyo: true,
            duration: 0.5,
            ease: 'power1.inOut'
        });
    },
    "A sock that always matches": (el) => {
        gsap.fromTo(el, {scaleX: 1}, {
            scaleX: 1.05,
            repeat: -1,
            yoyo: true,
            duration: 0.7,
            ease: 'power1.inOut'
        });
    },
    "The ability to talk to house plants": (el) => {
        gsap.to(el, {
            color: 'lightgreen',
            textShadow: '0 0 10px lightgreen, 0 0 20px lightgreen',
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'power1.inOut'
        });
    },
    "A self-stirring coffee mug": (el) => {
        gsap.fromTo(el, {rotation: 0}, {
            rotation: -3,
            repeat: -1,
            yoyo: true,
            duration: 0.2,
            ease: 'power1.inOut'
        });
    },
    "A pet rock that occasionally winks": (el) => {
        gsap.to(el, {
            opacity: 0.8,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: 'power1.inOut'
        });
    },
    "A universal remote that only works on dreams": (el) => {
        gsap.to(el, {
            filter: 'hue-rotate(360deg)',
            repeat: -1,
            duration: 5,
            ease: 'none'
        });
    },
    "Your inner monologue is now Gilbert Gottfried": (el) => {
        gsap.fromTo(el, {scale: 1, skewX: 0}, {
            scale: () => 1 + (Math.random() * 0.1),
            skewX: () => (Math.random() - 0.5) * 5,
            duration: 0.1,
            repeat: -1,
        });
    },
    "You have to manually breathe": (el) => {
        gsap.to(el, {
            scaleY: 1.1,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'power1.inOut'
        });
    },
    "defaultPrize": (el) => {
         gsap.fromTo(el, {scale: 1}, {
            scale: 1.05,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'power1.inOut'
        });
    }
};

export const curseAnimations = {
    "Endless loop of elevator music in your mind": (el) => {
        gsap.to(el, {
            x: '+=20',
            repeat: -1,
            yoyo: true,
            duration: 5,
            ease: 'sine.inOut'
        });
    },
    "You become slightly more awkward in every social interaction": (el) => {
        gsap.fromTo(el, {x: 0}, {
            x: () => (Math.random() - 0.5) * 5,
            y: () => (Math.random() - 0.5) * 5,
            duration: 0.1,
            repeat: -1,
        });
    },
    "Everyone thinks your name is Chad now": (el) => {
        gsap.to(el, {
            fontWeight: 'bold',
            color: 'var(--neon-pink)',
            opacity: 0.5,
            repeat: -1,
            yoyo: true,
            duration: 0.3,
            ease: 'steps(1)'
        });
    },
    "You can only whisper": (el) => {
        gsap.to(el, {
            fontSize: '1rem',
            opacity: 0.7,
            color: '#aaa',
            repeat: -1,
            yoyo: true,
            duration: 2
        });
    },
    "You sweat mayonnaise": (el) => {
        gsap.to(el, {
            color: '#FFFFF0', // Ivory color
            textShadow: '0 0 5px #FFFFF0',
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 3,
            ease: 'power1.in'
        });
    },
    "You are perpetually followed by a single, lazy fly": (el) => {
        const tl = gsap.timeline({repeat: -1});
        tl.to(el, {x: 10, y: 5, duration: 2, ease: 'sine.inOut'})
          .to(el, {x: -5, y: -5, duration: 1.5, ease: 'sine.inOut'})
          .to(el, {x: 0, y: 0, duration: 2.5, ease: 'sine.inOut'});
    },
    "You now smell like wet pennies forever": (el) => {
        gsap.to(el, {
            filter: 'blur(1px)',
            repeat: -1,
            yoyo: true,
            duration: 1
        });
    },
    "Your phone charger always falls out": (el) => {
        gsap.to(el, {
            y: 5,
            repeat: -1,
            yoyo: true,
            duration: 0.2,
            ease: 'steps(2)'
        });
    },
    "Every song is slightly out of tune for you": (el) => {
        gsap.to(el, {
            skewX: 2,
            repeat: -1,
            yoyo: true,
            duration: 0.3,
            ease: 'power1.inOut'
        });
    },
    "You always step on Lego": (el) => {
        gsap.fromTo(el, {scaleY: 1}, {
            scaleY: 0.95,
            repeat: -1,
            yoyo: true,
            duration: 0.1,
            ease: 'power1.inOut'
        });
    },
    "Your shoelaces untie themselves randomly": (el) => {
        gsap.to(el, {
            rotation: 1,
            repeat: -1,
            yoyo: true,
            duration: 0.05,
            ease: 'power1.inOut'
        });
    },
    "You can only laugh like a hyena": (el) => {
        gsap.to(el, {
            fontSize: '1.6rem', // Slightly larger font size
            color: 'red',
            repeat: -1,
            yoyo: true,
            duration: 0.3,
            ease: 'power1.inOut'
        });
    },
    "Your toast is always burnt on one side": (el) => {
        gsap.to(el, {
            filter: 'brightness(0.5)',
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: 'power1.inOut'
        });
    },
    "You're always slightly sticky": (el) => {
        gsap.to(el, {
            y: 2,
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: 'power1.inOut'
        });
    },
    "You can only communicate through interpretive dance": (el) => {
        const tl = gsap.timeline({repeat: -1, yoyo: true});
        tl.to(el, { rotation: 10, x: 20, duration: 1, ease: 'sine.inOut' })
          .to(el, { rotation: -10, x: -20, duration: 1, ease: 'sine.inOut' })
          .to(el, { rotation: 0, x: 0, duration: 1, ease: 'sine.inOut' });
    },
    "defaultCurse": (el) => {
        gsap.fromTo(el, {x: 0}, {
            x: (Math.random() - 0.5) * 10,
            repeat: 15,
            yoyo: true,
            duration: 0.1,
            ease: 'power1.inOut'
        });
    }
};

export function rainConfetti(confettiContainer, gameContainer) {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confettiContainer.appendChild(confetti);

        gsap.to(confetti, {
            x: (Math.random() - 0.5) * (gameContainer.offsetWidth),
            y: gameContainer.offsetHeight + 20,
            rotation: Math.random() * 360,
            duration: Math.random() * 3 + 3,
            opacity: 1,
            delay: Math.random() * 2,
            ease: "power1.out",
            onComplete: () => confetti.remove(),
        });
    }
}

// New helper for generic flash animations
export function createFlashEffect(elements, patternType, highlightColor) {
    if (!elements || elements.length === 0) return null;

    let sortedElements = [...elements];

    switch (patternType) {
        case 'linear':
            // Elements are already in DOM order (effectively linear)
            break;
        case 'reverse':
            sortedElements.reverse();
            break;
        case 'random':
            sortedElements.sort(() => Math.random() - 0.5);
            break;
        case 'wave':
            // The 'wave' effect will be handled by sequencing forward and backward staggers
            break;
        default:
            console.warn(`Unknown pattern type: ${patternType}. Defaulting to random.`);
            sortedElements.sort(() => Math.random() - 0.5);
    }

    const tl = gsap.timeline({ repeat: -1, ease: 'none' });

    // Determine if the elements are orbs (to apply filter styles) or value items (to apply background/color styles)
    const isOrb = elements[0].classList.contains('orb');

    // Define the animation steps for a single item
    const flashTween = (target) => {
        // Capture initial computed styles for accurate reversion
        const originalFilter = isOrb ? getComputedStyle(target).filter : null;
        const originalBg = isOrb ? null : getComputedStyle(target).backgroundColor;
        const originalColor = isOrb ? null : getComputedStyle(target).color;
        const originalTextShadow = isOrb ? null : getComputedStyle(target).textShadow;

        const flashProps = isOrb ? {
            filter: `brightness(2) drop-shadow(0 0 15px ${highlightColor})`
        } : {
            backgroundColor: highlightColor,
            color: 'var(--dark-bg)',
            textShadow: 'none'
        };

        const revertProps = isOrb ? {
            filter: originalFilter // Revert to captured original filter
        } : {
            backgroundColor: originalBg,
            color: originalColor,
            textShadow: originalTextShadow
        };

        return gsap.timeline()
            .to(target, flashProps, 0.0)
            .to(target, revertProps, 0.1); // Flash duration
    };

    if (patternType === 'wave') {
        const staggerAmount = 0.05;
        const durationPerItem = 0.4; // Total time for one item to flash and revert (0.1 + 0.3)
        const totalForwardDuration = sortedElements.length * staggerAmount + durationPerItem;

        // Forward pass
        tl.add(sortedElements.map(el => flashTween(el)), 0, "start", staggerAmount);
        
        // Backward pass (start after forward pass completes, plus a small pause)
        const reversedElements = [...sortedElements].reverse();
        tl.add(reversedElements.map(el => flashTween(el)), totalForwardDuration + 0.3, "start", staggerAmount);
    } else {
        // Linear, Reverse, Random
        tl.add(sortedElements.map(el => flashTween(el)), 0, "start", 0.05); // Standard stagger
    }
    
    return tl;
}

export function animateOrbsRandomFlash(orbsGridElement) {
    // Get all currently closed orbs
    const closedOrbs = Array.from(orbsGridElement.querySelectorAll('.orb.closed'));

    if (closedOrbs.length === 0) return null;

    // Choose a random pattern for orbs
    const patterns = ['linear', 'reverse', 'random', 'wave'];
    const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

    return createFlashEffect(closedOrbs, chosenPattern, 'var(--neon-cyan)');
}

export function animateChartRandomFlash(valueBoardContainerElement) {
    // Get all currently active value items
    const activeValueItems = Array.from(valueBoardContainerElement.querySelectorAll('.value-item.active'));

    if (activeValueItems.length === 0) return null;

    // Choose a random pattern for chart values
    const patterns = ['linear', 'reverse', 'random', 'wave'];
    const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

    return createFlashEffect(activeValueItems, chosenPattern, 'var(--neon-pink)');
}