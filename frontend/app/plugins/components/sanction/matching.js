
export function fuzzyIncludes(hay, needle) {
    if (!needle) return true;
    return (hay || '').toLowerCase().includes(needle.toLowerCase());
}

export function confidenceFromScore(score) {
    // Map 0..1 to percentage with slight easing
    const pct = Math.max(0, Math.min(1, score));
    return Math.round((0.15 + 0.85 * pct) * 100) / 100; // 0.15..1.00
}
