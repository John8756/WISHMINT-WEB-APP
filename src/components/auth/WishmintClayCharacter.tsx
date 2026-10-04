import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type CharacterPose =
  | 'idle'
  | 'typing'
  | 'covering'
  | 'peeking'
  | 'forgot'
  | 'otp'
  | 'success'
  | 'error';

interface WishmintClayCharacterProps {
  pose: CharacterPose;
  className?: string;
  isPasswordVisible?: boolean;
}

export const WishmintClayCharacter: React.FC<WishmintClayCharacterProps> = ({
  pose,
  className = '',
  isPasswordVisible = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking effect for idle/typing poses
  useEffect(() => {
    if (pose === 'covering' || pose === 'success') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [pose]);

  // Determine effective pose
  const activePose: CharacterPose =
    pose === 'covering' && isPasswordVisible ? 'peeking' : pose;

  return (
    <div
      className={`relative select-none pointer-events-none flex justify-center items-end ${className}`}
      style={{ width: '220px', height: '170px' }}
      aria-hidden="true"
    >
      <motion.div
        className="w-full h-full relative"
        initial={{ y: 25, opacity: 0, scale: 0.92 }}
        animate={{
          y: activePose === 'covering' ? 2 : activePose === 'success' ? -8 : 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* Soft 3D Drop Shadow behind character onto back wall */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-10 bg-purple-950/20 blur-xl rounded-full" />

        <svg
          viewBox="0 0 240 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(74,35,74,0.18)]"
        >
          <defs>
            {/* Skin Shading Gradients */}
            <radialGradient id="claySkin" cx="48%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF2EB" />
              <stop offset="65%" stopColor="#F9D7C8" />
              <stop offset="100%" stopColor="#EDB8A3" />
            </radialGradient>
            <radialGradient id="clayCheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8B9E" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#FF9EB0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFB3C2" stopOpacity="0" />
            </radialGradient>

            {/* Hair Gradients */}
            <linearGradient id="clayHairDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5D3A29" />
              <stop offset="45%" stopColor="#4A2A1B" />
              <stop offset="100%" stopColor="#2E160C" />
            </linearGradient>
            <radialGradient id="clayHairBun" cx="45%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#7A4E38" />
              <stop offset="50%" stopColor="#4D2B1B" />
              <stop offset="100%" stopColor="#2B150A" />
            </radialGradient>

            {/* Wishmint Borahae Purple Hoodie Gradients */}
            <linearGradient id="clayHoodieBody" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#B399D9" />
              <stop offset="40%" stopColor="#9677C4" />
              <stop offset="85%" stopColor="#7A58AA" />
              <stop offset="100%" stopColor="#603F8F" />
            </linearGradient>
            <linearGradient id="clayHoodieSleeve" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4ACE6" />
              <stop offset="50%" stopColor="#9D7ECB" />
              <stop offset="100%" stopColor="#7653A5" />
            </linearGradient>

            {/* Soft Ambient Occlusion shadow under hands/neck */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3F2052" floodOpacity="0.25" />
            </filter>
            <filter id="clayHighlight" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="-1" stdDeviation="1.5" floodColor="#FFFFFF" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* ==============================================
              1. HAIR BUN & BACKGROUND HAIR
              ============================================== */}
          <g id="hair-back">
            {/* Top Bun with Clay Volume */}
            <motion.circle
              cx="120"
              cy="28"
              r="24"
              fill="url(#clayHairBun)"
              filter="url(#softShadow)"
              animate={{
                scale: activePose === 'covering' ? 0.98 : 1,
                y: activePose === 'success' ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Bun Messy Strands / Clay Tuft */}
            <ellipse cx="112" cy="16" rx="9" ry="7" fill="#6B4431" />
            <ellipse cx="128" cy="18" rx="8" ry="6" fill="#7A4E38" />
            <circle cx="120" cy="12" r="5" fill="#8C5C44" opacity="0.6" />
            {/* Cute Hair Tie / Ribbon in Wishmint Rose Gold */}
            <rect x="109" y="38" width="22" height="6" rx="3" fill="#D4AF37" filter="url(#softShadow)" />

            {/* Back Hair Volume framing shoulders */}
            <path
              d="M62 108 C60 70 85 45 120 45 C155 45 180 70 178 108 C176 130 168 142 165 150 C155 135 150 120 150 110 C130 118 110 118 90 110 C90 120 85 135 75 150 C72 142 64 130 62 108 Z"
              fill="url(#clayHairDark)"
            />
          </g>

          {/* ==============================================
              2. HOODIE BODY & TORSO
              ============================================== */}
          <g id="hoodie-torso">
            {/* Main Upper Torso */}
            <path
              d="M68 152 C70 135 88 128 120 128 C152 128 170 135 172 152 C175 168 180 185 182 190 L58 190 C60 185 65 168 68 152 Z"
              fill="url(#clayHoodieBody)"
              filter="url(#softShadow)"
            />
            {/* Hoodie Collar / Drawstring Neck Fold */}
            <path
              d="M92 128 C92 140 102 148 120 148 C138 148 148 140 148 128 C140 132 130 134 120 134 C110 134 100 132 92 128 Z"
              fill="#5A3A84"
            />
            {/* Hoodie Soft Front Pocket / Seam Accents */}
            <path
              d="M84 172 C104 168 136 168 156 172"
              stroke="#5A3A84"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>

          {/* ==============================================
              3. HEAD & FACE
              ============================================== */}
          <motion.g
            id="head"
            animate={{
              y:
                activePose === 'idle'
                  ? 0
                  : activePose === 'covering'
                  ? 1
                  : activePose === 'peeking'
                  ? -1
                  : activePose === 'forgot'
                  ? -2
                  : activePose === 'success'
                  ? -4
                  : 0,
              rotate:
                activePose === 'idle'
                  ? -1.5
                  : activePose === 'peeking'
                  ? 2
                  : activePose === 'forgot'
                  ? -3
                  : activePose === 'error'
                  ? 3
                  : 0,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            style={{ transformOrigin: '120px 95px' }}
          >
            {/* Head Base Clay Oval */}
            <ellipse
              cx="120"
              cy="90"
              rx="40"
              ry="37"
              fill="url(#claySkin)"
              filter="url(#softShadow)"
            />

            {/* Cute Rounded Ears */}
            <ellipse cx="78" cy="92" rx="6.5" ry="8" fill="#F4C6B3" />
            <circle cx="79" cy="92" r="3.5" fill="#E8A793" opacity="0.6" />
            <ellipse cx="162" cy="92" rx="6.5" ry="8" fill="#F4C6B3" />
            <circle cx="161" cy="92" r="3.5" fill="#E8A793" opacity="0.6" />

            {/* Front Bangs & Side Tendrils (Clay Layered) */}
            <path
              d="M78 82 C82 60 98 52 120 52 C142 52 158 60 162 82 C154 74 142 70 134 72 C125 74 122 80 116 80 C110 80 106 72 95 72 C88 72 82 76 78 82 Z"
              fill="url(#clayHairDark)"
            />
            {/* Side Tendrils hugging cheeks */}
            <path
              d="M80 82 C76 92 77 106 82 114 C81 106 81 94 85 86 Z"
              fill="#4A2A1B"
            />
            <path
              d="M160 82 C164 92 163 106 158 114 C159 106 159 94 155 86 Z"
              fill="#4A2A1B"
            />

            {/* Soft Rosy Cheeks (Wishmint Blush) */}
            <circle cx="95" cy="100" r="10.5" fill="url(#clayCheek)" />
            <circle cx="145" cy="100" r="10.5" fill="url(#clayCheek)" />

            {/* Small Cute Button Nose */}
            <ellipse cx="120" cy="95" rx="2.5" ry="1.8" fill="#E29D88" />

            {/* ==============================================
                EYES & BROWS (Dynamic per state)
                ============================================== */}
            {/* Eyebrows */}
            <motion.path
              d="M93 75 Q101 72 108 76"
              stroke="#5D3A29"
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{
                y: activePose === 'forgot' ? -2 : activePose === 'error' ? 1 : 0,
              }}
            />
            <motion.path
              d="M132 76 Q139 72 147 75"
              stroke="#5D3A29"
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{
                y: activePose === 'forgot' ? -2 : activePose === 'error' ? 1 : 0,
              }}
            />

            {/* Left Eye */}
            <g id="left-eye">
              {activePose === 'covering' ? (
                // Hidden behind hands
                null
              ) : isBlinking || activePose === 'idle' ? (
                // Playful wink arc on left eye when idle or blinking
                <path
                  d="M94 88 Q101 93 108 88"
                  stroke="#2E160C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              ) : activePose === 'success' ? (
                // Joyful closed happy crescent
                <path
                  d="M94 89 Q101 83 108 89"
                  stroke="#2E160C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              ) : (
                // Open big expressive anime/clay eye
                <g>
                  <ellipse cx="101" cy="87" rx="7.5" ry="8.5" fill="#24140D" />
                  {/* Iris color */}
                  <ellipse cx="101" cy="88" rx="6" ry="7" fill="#422214" />
                  {/* Catchlights */}
                  <circle cx="99" cy="84" r="2.8" fill="#FFFFFF" />
                  <circle cx="103" cy="89" r="1.4" fill="#FFFFFF" />
                  {/* Upper Lash Line */}
                  <path
                    d="M93 84 C97 80 106 80 109 83"
                    stroke="#1D0E08"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>

            {/* Right Eye */}
            <g id="right-eye">
              {activePose === 'covering' ? (
                // Hidden behind hands
                null
              ) : isBlinking ? (
                <path
                  d="M132 88 Q139 93 146 88"
                  stroke="#2E160C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              ) : activePose === 'success' ? (
                // Joyful closed happy crescent
                <path
                  d="M132 89 Q139 83 146 89"
                  stroke="#2E160C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              ) : activePose === 'peeking' ? (
                // Peeking wide curious eye!
                <g>
                  <ellipse cx="139" cy="86" rx="8" ry="9" fill="#24140D" />
                  <ellipse cx="139" cy="87" rx="6.5" ry="7.5" fill="#422214" />
                  <circle cx="137" cy="83" r="3.2" fill="#FFFFFF" />
                  <circle cx="142" cy="88" r="1.6" fill="#FFFFFF" />
                  <path
                    d="M131 83 C135 79 144 79 148 82"
                    stroke="#1D0E08"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>
              ) : (
                // Regular open shining dark eye
                <g>
                  <ellipse cx="139" cy="87" rx="7.5" ry="8.5" fill="#24140D" />
                  <ellipse cx="139" cy="88" rx="6" ry="7" fill="#422214" />
                  <circle cx="137" cy="84" r="2.8" fill="#FFFFFF" />
                  <circle cx="141" cy="89" r="1.4" fill="#FFFFFF" />
                  <path
                    d="M131 84 C135 80 144 80 147 83"
                    stroke="#1D0E08"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>

            {/* Mouth */}
            <g id="mouth">
              {activePose === 'success' ? (
                // Big beaming open smile with tongue
                <path
                  d="M112 103 Q120 114 128 103 Z"
                  fill="#C24357"
                  stroke="#5A1A24"
                  strokeWidth="1.5"
                />
              ) : activePose === 'error' ? (
                // Small pout / gasp
                <ellipse cx="120" cy="104" rx="3.5" ry="4" fill="#B34458" />
              ) : activePose === 'covering' || activePose === 'peeking' ? (
                // Sweet shy smile
                <path
                  d="M114 103 Q120 108 126 103"
                  stroke="#5D262B"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Warm friendly open smile
                <path
                  d="M113 102 Q120 110 127 102"
                  stroke="#5D262B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          </motion.g>

          {/* ==============================================
              4. ARMS, HANDS & COZY HOODIE SLEEVES
              (Animated smoothly between Ledge and Eyes)
              ============================================== */}

          {/* POSE A: COVERING EYES (No Peeking! 🙈) */}
          <AnimatePresence>
            {activePose === 'covering' && (
              <motion.g
                key="covering-arms"
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {/* Left Arm & Sleeve rising up over left eye */}
                <ellipse
                  cx="95"
                  cy="98"
                  rx="16"
                  ry="20"
                  fill="url(#clayHoodieSleeve)"
                  transform="rotate(-15 95 98)"
                  filter="url(#softShadow)"
                />
                {/* Left Cute Rounded Hand covering eye */}
                <path
                  d="M86 82 C86 74 98 72 105 78 C108 81 110 88 108 94 C104 100 94 102 88 98 C84 94 86 86 86 82 Z"
                  fill="url(#claySkin)"
                  filter="url(#softShadow)"
                />
                {/* Rounded clay fingers */}
                <ellipse cx="94" cy="76" rx="3.5" ry="6" fill="#F4C6B3" transform="rotate(-10 94 76)" />
                <ellipse cx="101" cy="77" rx="3.5" ry="6.5" fill="#F4C6B3" transform="rotate(2 101 77)" />
                <ellipse cx="107" cy="81" rx="3.5" ry="6" fill="#F4C6B3" transform="rotate(15 107 81)" />

                {/* Right Arm & Sleeve rising up over right eye */}
                <ellipse
                  cx="145"
                  cy="98"
                  rx="16"
                  ry="20"
                  fill="url(#clayHoodieSleeve)"
                  transform="rotate(15 145 98)"
                  filter="url(#softShadow)"
                />
                {/* Right Cute Rounded Hand covering eye */}
                <path
                  d="M154 82 C154 74 142 72 135 78 C132 81 130 88 132 94 C136 100 146 102 152 98 C156 94 154 86 154 82 Z"
                  fill="url(#claySkin)"
                  filter="url(#softShadow)"
                />
                {/* Right rounded clay fingers */}
                <ellipse cx="146" cy="76" rx="3.5" ry="6" fill="#F4C6B3" transform="rotate(10 146 76)" />
                <ellipse cx="139" cy="77" rx="3.5" ry="6.5" fill="#F4C6B3" transform="rotate(-2 139 77)" />
                <ellipse cx="133" cy="81" rx="3.5" ry="6" fill="#F4C6B3" transform="rotate(-15 133 81)" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* POSE B: PEEKING THROUGH FINGERS (Show Password Active! 👀) */}
          <AnimatePresence>
            {activePose === 'peeking' && (
              <motion.g
                key="peeking-arms"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 15, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {/* Left hand stays covering left eye */}
                <ellipse
                  cx="95"
                  cy="98"
                  rx="16"
                  ry="20"
                  fill="url(#clayHoodieSleeve)"
                  transform="rotate(-15 95 98)"
                  filter="url(#softShadow)"
                />
                <path
                  d="M86 82 C86 74 98 72 105 78 C108 81 110 88 108 94 C104 100 94 102 88 98 Z"
                  fill="url(#claySkin)"
                  filter="url(#softShadow)"
                />
                {/* Right hand parts fingers open around eye */}
                <ellipse
                  cx="148"
                  cy="104"
                  rx="15"
                  ry="18"
                  fill="url(#clayHoodieSleeve)"
                  transform="rotate(22 148 104)"
                  filter="url(#softShadow)"
                />
                {/* Lowered palm / parted fingers */}
                <path
                  d="M148 94 C152 94 156 100 154 106 C150 110 142 110 138 106 C136 102 142 94 148 94 Z"
                  fill="url(#claySkin)"
                />
                {/* Parted finger peek */}
                <ellipse cx="134" cy="82" rx="3" ry="7" fill="#F4C6B3" transform="rotate(-28 134 82)" />
                <ellipse cx="147" cy="81" rx="3.2" ry="7.5" fill="#F4C6B3" transform="rotate(25 147 81)" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* POSE C: CELEBRATION / SUCCESS (Both Hands in Air! 🎉) */}
          <AnimatePresence>
            {activePose === 'success' && (
              <motion.g
                key="celebrate-arms"
                initial={{ y: 20, scale: 0.9, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                {/* Left Arm Raised */}
                <path
                  d="M72 140 C65 125 60 100 62 82 C63 76 72 75 75 80 C80 94 84 116 88 134 Z"
                  fill="url(#clayHoodieSleeve)"
                  filter="url(#softShadow)"
                />
                {/* Left Open Hand */}
                <circle cx="62" cy="74" r="8" fill="url(#claySkin)" />
                <ellipse cx="56" cy="70" rx="2.5" ry="5" fill="#F4C6B3" transform="rotate(-30 56 70)" />
                <ellipse cx="61" cy="67" rx="2.5" ry="5.5" fill="#F4C6B3" transform="rotate(-10 61 67)" />
                <ellipse cx="67" cy="68" rx="2.5" ry="5.5" fill="#F4C6B3" transform="rotate(15 67 68)" />

                {/* Right Arm Raised */}
                <path
                  d="M168 140 C175 125 180 100 178 82 C177 76 168 75 165 80 C160 94 156 116 152 134 Z"
                  fill="url(#clayHoodieSleeve)"
                  filter="url(#softShadow)"
                />
                {/* Right Open Hand */}
                <circle cx="178" cy="74" r="8" fill="url(#claySkin)" />
                <ellipse cx="184" cy="70" rx="2.5" ry="5" fill="#F4C6B3" transform="rotate(30 184 70)" />
                <ellipse cx="179" cy="67" rx="2.5" ry="5.5" fill="#F4C6B3" transform="rotate(10 179 67)" />
                <ellipse cx="173" cy="68" rx="2.5" ry="5.5" fill="#F4C6B3" transform="rotate(-15 173 68)" />

                {/* Sparkle Stars around head */}
                <path d="M50 50 L53 58 L61 61 L53 64 L50 72 L47 64 L39 61 L47 58 Z" fill="#FFD700" />
                <path d="M190 48 L192 54 L198 56 L192 58 L190 64 L188 58 L182 56 L188 54 Z" fill="#FFD700" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* POSE D: DEFAULT / IDLE / TYPING / FORGOT (Resting over Card Ledge) */}
          {activePose !== 'covering' && activePose !== 'peeking' && activePose !== 'success' && (
            <g id="idle-arms-on-ledge">
              {/* Left Arm: Resting elbow on ledge */}
              <ellipse
                cx="88"
                cy="148"
                rx="20"
                ry="15"
                fill="url(#clayHoodieSleeve)"
                transform="rotate(-8 88 148)"
                filter="url(#softShadow)"
              />
              {/* Left Hand: Resting curved fingers over card rim */}
              <g id="left-hand-ledge">
                <rect x="76" y="146" width="28" height="14" rx="7" fill="url(#claySkin)" filter="url(#softShadow)" />
                {/* Cute rounded finger segments overlapping card */}
                <ellipse cx="82" cy="154" rx="3.5" ry="5" fill="#F4C6B3" />
                <ellipse cx="89" cy="155" rx="3.5" ry="5.5" fill="#F4C6B3" />
                <ellipse cx="96" cy="154" rx="3.5" ry="5" fill="#F4C6B3" />
                <ellipse cx="102" cy="152" rx="3" ry="4" fill="#E8B5A2" />
              </g>

              {/* Right Arm: Propping up chin / cheek (Like Reference Image!) */}
              <g id="right-arm-prop">
                <ellipse
                  cx="150"
                  cy="142"
                  rx="18"
                  ry="24"
                  fill="url(#clayHoodieSleeve)"
                  transform="rotate(18 150 142)"
                  filter="url(#softShadow)"
                />
                {/* Right Hand propping chin */}
                <ellipse
                  cx="140"
                  cy="120"
                  rx="10"
                  ry="12"
                  fill="url(#claySkin)"
                  filter="url(#softShadow)"
                />
                {/* Cute curled fingers touching cheek */}
                <ellipse cx="136" cy="116" rx="4" ry="4" fill="#F4C6B3" />
                <ellipse cx="143" cy="117" rx="3.5" ry="4" fill="#F4C6B3" />
                <ellipse cx="147" cy="122" rx="3.5" ry="4" fill="#F4C6B3" />
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
