const LiveBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[0.65rem] font-body font-semibold uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-live" />
      Ao Vivo
    </span>
  );
};

export default LiveBadge;
