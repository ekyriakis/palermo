// Noir theme colors and styles
export const NOIR_COLORS = {
  // Dark background colors
  darkBg: '#0f0f1e',
  darkCard: '#16213e',
  darkBorder: '#2d3561',
  
  // Text colors
  lightText: '#eaeaea',
  mutedText: '#a9a9a9',
  
  // Accent colors
  neonRed: '#ff6b6b',
  neonBlue: '#667eea',
  neonGreen: '#51cf66',
  neonYellow: '#ffd93d',
  
  // Shadow/depth
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowDeep: 'rgba(0, 0, 0, 0.8)',
};

// Character emoji representations with noir style
export const CHARACTER_EMOJIS = {
  civilian: '👤',      // Person silhouette
  killer: '🔪',        // Knife - for killers
  killerHidden: '🕵️',  // Detective/spy
  cop: '🛡️',          // Shield - protector
  dead: '💀',          // Skull - eliminated
};

// Noir-themed gradients and backgrounds
export const NOIR_STYLES = {
  cardGradient: {
    start: '#16213e',
    end: '#0f0f1e',
  },
  
  // Cards with noir aesthetic
  darkCard: {
    backgroundColor: '#16213e',
    borderColor: '#2d3561',
    borderWidth: 1,
  },
  
  // Danger/killer styling
  dangerCard: {
    backgroundColor: '#3e1616',
    borderColor: '#6b2626',
    borderWidth: 1,
  },
  
  // Success/town styling
  successCard: {
    backgroundColor: '#163e1a',
    borderColor: '#266b2c',
    borderWidth: 1,
  },
};
