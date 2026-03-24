const CrashPage = () => {
  return (
    <div className="px-4 pt-4 pb-20 space-y-6">
      <h1 className="font-display text-2xl font-extrabold">Jogos Crash</h1>
      <p className="text-sm font-body text-muted-foreground">Em breve! Jogos de crash e mini-games.</p>
      <div className="grid grid-cols-2 gap-3">
        {['Aviator', 'Spaceman', 'Mines', 'Plinko', 'Dice', 'Hi-Lo'].map((game) => (
          <div key={game} className="bg-surface-card rounded-xl p-6 flex items-center justify-center">
            <span className="font-display font-bold text-sm text-muted-foreground">{game}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrashPage;
