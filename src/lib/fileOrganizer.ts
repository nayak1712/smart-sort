export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  uploadedAt: Date;
  category: string;
  keywords: string[];
  confidence: number;
}

// Simple keyword-based categorization
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Education: ["school", "university", "student", "course", "lecture", "exam", "homework", "study", "education", "learning", "teacher", "professor", "grade", "curriculum", "academic", "thesis", "research", "degree", "college", "syllabus"],
  Finance: ["bank", "money", "investment", "tax", "salary", "budget", "revenue", "profit", "expense", "financial", "loan", "credit", "stock", "market", "payment", "invoice", "accounting", "interest", "fund", "capital"],
  Health: ["health", "medical", "doctor", "hospital", "patient", "treatment", "diagnosis", "medicine", "disease", "symptom", "therapy", "wellness", "fitness", "diet", "nutrition", "surgery", "prescription", "vaccine", "clinic", "nurse"],
  Technology: ["software", "programming", "code", "algorithm", "computer", "data", "api", "database", "server", "cloud", "machine learning", "ai", "artificial", "network", "javascript", "python", "react", "developer", "tech", "digital"],
  Legal: ["law", "legal", "court", "attorney", "contract", "regulation", "compliance", "statute", "liability", "patent", "trademark", "lawsuit", "arbitration", "jurisdiction", "plaintiff"],
  Marketing: ["marketing", "brand", "campaign", "seo", "social media", "advertising", "content", "audience", "engagement", "analytics", "conversion", "strategy", "promotion", "customer", "funnel"],
};

export function categorizeFile(content: string): { category: string; keywords: string[]; confidence: number } {
  const lower = content.toLowerCase();
  const scores: Record<string, { count: number; matched: string[] }> = {};

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const matched: string[] = [];
    for (const w of words) {
      if (lower.includes(w)) matched.push(w);
    }
    scores[cat] = { count: matched.length, matched };
  }

  let bestCat = "Others";
  let bestScore = 0;
  let bestKeywords: string[] = [];

  for (const [cat, { count, matched }] of Object.entries(scores)) {
    if (count > bestScore) {
      bestScore = count;
      bestCat = cat;
      bestKeywords = matched;
    }
  }

  const confidence = Math.min(bestScore / 5, 1) * 100;

  if (bestScore === 0) {
    // Extract some generic keywords
    const words = lower.match(/\b[a-z]{4,}\b/g) || [];
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    bestKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([w]) => w);
  }

  return { category: bestCat, keywords: bestKeywords.slice(0, 6), confidence: bestScore === 0 ? 15 : confidence };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
