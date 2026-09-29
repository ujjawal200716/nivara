export default function Privacy() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto font-[family-name:var(--font-inter)]">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-zinc prose-sm">
        <p>Last updated: October 2023</p>
        <h2>1. Data Collection</h2>
        <p>We collect complaint texts and metadata to process triage operations via AI models.</p>
        <h2>2. Data Security</h2>
        <p>Your data is stored securely using Supabase Row Level Security.</p>
      </div>
    </div>
  )
}
