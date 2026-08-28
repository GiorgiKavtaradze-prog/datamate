// Generate cute consistent session names based on session ID
const adjectives = [
	"Fluffy",
	"Sparkly",
	"Happy",
	"Bouncy",
	"Cheerful",
	"Cozy",
	"Dreamy",
	"Gentle",
	"Jolly",
	"Lucky",
	"Merry",
	"Peaceful",
	"Rainbow",
	"Sunny",
	"Twilight",
	"Whimsy",
	"Zigzag",
	"Bubbly",
	"Dazzling",
	"Golden",
	"Mellow",
	"Playful",
	"Silky",
	"Tender",
	"Velvet",
	"Cosmic",
	"Crystal",
	"Mystic",
	"Starry",
	"Swift",
];

const nouns = [
	"Dragon",
	"Unicorn",
	"Phoenix",
	"Butterfly",
	"Dolphin",
	"Panda",
	"Tiger",
	"Eagle",
	"Fox",
	"Wolf",
	"Owl",
	"Bear",
	"Deer",
	"Rabbit",
	"Otter",
	"Penguin",
	"Koala",
	"Lynx",
	"Hawk",
	"Swan",
	"Lion",
	"Leopard",
	"Falcon",
	"Raven",
	"Jaguar",
	"Panther",
	"Cheetah",
	"Gazelle",
	"Peacock",
	"Flamingo",
];

// Simple hash function to convert string to number (djb2-style, no bitwise)
function hashString(str: string): number {
	const mod = 2_147_483_647;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash * 31 + char) % mod;
		if (hash < 0) {
			hash += mod;
		}
	}
	return hash;
}

export function generateSessionName(sessionId: string): string {
	const hash = hashString(sessionId);
	const adjIndex = hash % adjectives.length;
	const nounIndex = Math.floor(hash / adjectives.length) % nouns.length;
	return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}
