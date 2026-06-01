type ShortlistShareProps = {
  link: string;
};

export const ShortlistShare = ({ link }: ShortlistShareProps) => (
  <div className="rounded-lg border border-appBorder bg-appBg p-3 text-xs text-textSecondary">
    Share shortlist: {link}
  </div>
);
