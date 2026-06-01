type VerdictPanelProps = {
  verdict: string;
  buyerTypeMatch: string[];
};

export const VerdictPanel = ({ verdict, buyerTypeMatch }: VerdictPanelProps) => (
  <section className="card-surface p-4">
    <h3 className="font-heading text-xl">AI Verdict</h3>
    <p className="mt-2 text-textSecondary">{verdict}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {buyerTypeMatch.map((item) => (
        <span key={item} className="rounded-full bg-appBg px-3 py-1 text-xs">{item}</span>
      ))}
    </div>
  </section>
);
