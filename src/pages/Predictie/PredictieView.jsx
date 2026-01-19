function PredictieView({ predictionData, weatherUpdatedAt, onBackToMonitor }) {
  const cards = [
    { key: 'sixHours', label: '6 ore' },
    { key: 'twelveHours', label: '12 ore' },
    { key: 'twentyFourHours', label: '24 ore' },
  ];

  const formatEnergy = (value) =>
    Number.isFinite(value) ? `${value.toFixed(2)} kWh` : '-';

  const formatUpdatedAt = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleString('ro-RO', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  return (
    <div className="predict-layout" role="region" aria-label="Predictie consum si productie">
      <div className="predict-header">
        <div>
          <h2>Predictie energie</h2>
          <p className="predict-subtitle">
            Estimari pe termen scurt pentru productie si consum.
          </p>
        </div>
        <button
          type="button"
          className="predict-action"
          onClick={() => onBackToMonitor?.()}
        >
          Inapoi la monitorizare
        </button>
      </div>

      {predictionData ? (
        <>
          <div className="predict-grid" role="list">
            {cards.map((card) => {
              const item = predictionData[card.key];
              return (
                <div className="predict-card" role="listitem" key={card.key}>
                  <h3>{card.label}</h3>
                  <div className="predict-metric">
                    <span>Productie estimata</span>
                    <strong>{formatEnergy(item?.production)}</strong>
                  </div>
                  <div className="predict-metric">
                    <span>Consum estimat</span>
                    <strong>{formatEnergy(item?.consumption)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="predict-note">
            Ultima actualizare meteo: {formatUpdatedAt(weatherUpdatedAt)}.
          </p>
        </>
      ) : (
        <div className="dashboard-placeholder" role="status" aria-live="polite">
          <p>Configureaza planul si monitorizarea pentru a vedea predictiile.</p>
        </div>
      )}
    </div>
  );
}

export default PredictieView;
