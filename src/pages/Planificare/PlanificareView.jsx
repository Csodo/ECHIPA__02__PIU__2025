function PlanificareView({
  consumerOptions,
  distributorRates,
  solarPanels,
  solarSuggestion,
  selectedPanelId,
  selectedPanelCount,
  planConsumer,
  planConsumerCount,
  planConsumerPower,
  planDistributor,
  planProducers,
  planConsumers,
  planResult,
  onPlanConsumerChange,
  onPlanConsumerCountChange,
  onPlanConsumerPowerChange,
  onPlanDistributorChange,
  onSelectPanel,
  onPanelCountChange,
  onApplySuggestedPanels,
  onAddSelectedPanel,
  onAddConsumer,
  onCalculatePlan,
  onImportPlan,
  onResetPlan,
}) {
  const selectedPanel = solarPanels.find((panel) => panel.id === selectedPanelId);
  const suggestedPanels = solarSuggestion?.panels ?? [];
  const suggestionLabel = suggestedPanels
    .map((panel) => `${panel.name} x${panel.count}`)
    .join(' + ');
  const selectedCount = Math.max(1, Number(selectedPanelCount) || 1);

  const formatLei = (value) => {
    if (!Number.isFinite(value)) return '-';
    return `${value.toLocaleString('ro-RO')} lei`;
  };

  const formatKw = (value) => {
    if (!Number.isFinite(value)) return '-';
    return `${value.toFixed(2)} kW`;
  };

  return (
    <div className="plan-layout">
      <section className="plan-form">
        <h2>Introducere date generale</h2>

        <div className="plan-block">
          <h3>Consumator</h3>
          <div className="plan-row">
            <label>
              Tip Consumator
              <select value={planConsumer} onChange={(event) => onPlanConsumerChange(event.target.value)}>
                {consumerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Numar unitati
              <input
                type="number"
                min="1"
                value={planConsumerCount}
                onChange={(event) => onPlanConsumerCountChange(event.target.value)}
              />
            </label>
            <label>
              Consum per unitate (kW)
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={planConsumerPower}
                onChange={(event) => onPlanConsumerPowerChange(event.target.value)}
              />
            </label>
            <button type="button" onClick={onAddConsumer}>
              Adauga consumator
            </button>
          </div>
        </div>

        <div className="plan-block plan-offer">
          <h3>Oferta panouri solare</h3>
          {solarSuggestion && suggestedPanels.length ? (
            <div className="plan-offer-card">
              <div>
                <p className="plan-offer-title">Recomandare pentru consumul curent</p>
                <strong>{suggestionLabel}</strong>
                <div className="plan-offer-meta">
                  <span>Consum total: {formatKw(solarSuggestion.targetPower)}</span>
                  <span>Putere totala: {formatKw(solarSuggestion.totalPower)}</span>
                  <span>Diferenta: {formatKw(solarSuggestion.diff)}</span>
                  <span>Cost estimat: {formatLei(solarSuggestion.totalPrice)}</span>
                </div>
              </div>
              <button type="button" onClick={onApplySuggestedPanels}>
                Adauga recomandarea
              </button>
            </div>
          ) : (
            <p className="plan-offer-empty">Adauga consumatori pentru a primi o recomandare.</p>
          )}

          <div className="plan-offer-picker">
            <p className="plan-offer-title">Alege alt model</p>
            <div className="plan-row">
              <label>
                Model panou
                <select
                  value={selectedPanelId}
                  onChange={(event) => onSelectPanel(event.target.value)}
                >
                  {solarPanels.map((panel) => (
                    <option key={panel.id} value={panel.id}>
                      {panel.name} ({panel.power} kW, {panel.price} lei)
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Numar panouri
                <input
                  type="number"
                  min="1"
                  value={selectedPanelCount}
                  onChange={(event) => onPanelCountChange(event.target.value)}
                />
              </label>
            </div>
            <div className="plan-offer-meta">
              <span>Pret unitar: {formatLei(selectedPanel?.price)}</span>
              <span>Putere totala: {formatKw((selectedPanel?.power || 0) * selectedCount)}</span>
              <span>
                Total estimat: {formatLei((selectedPanel?.price || 0) * selectedCount)}
              </span>
            </div>
            <button type="button" onClick={onAddSelectedPanel}>
              Adauga selectie
            </button>
          </div>
        </div>

        <div className="plan-block">
          <h3>Distribuitor curent</h3>
          <label>
            Distribuitor
            <select
              value={planDistributor}
              onChange={(event) => {
                const value = event.target.value;
                onPlanDistributorChange(value);
                onCalculatePlan(value);
              }}
            >
              {distributorRates.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name} (pret: {option.price} lei/kWh)
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="plan-actions">
          <button type="button" onClick={onCalculatePlan}>
            Calculeaza estimare
          </button>
          <button type="button" onClick={onImportPlan}>
            Importa plan
          </button>
          <button type="button" onClick={onResetPlan}>
            Reseteaza datele
          </button>
        </div>

        <div className="plan-results">
          <h3>Rezultate</h3>
          {planResult ? (
            <ul>
              <li>Cost estimat: {planResult.cost} lei</li>
              <li>Consum estimat: {planResult.consumed} kWh/zi</li>
              <li>Energie produsa: {planResult.produced} kWh/zi</li>
            </ul>
          ) : (
            <p>Apasa pe calcul pentru un rezultat fictiv.</p>
          )}
        </div>
      </section>

      <aside className="plan-summary">
        <div>
          <h3>Producatori</h3>
          {planProducers.length ? (
            <ul>
              {planProducers.map((item, index) => (
                <li key={`${item.type}-${index}`}>
                  {item.type} x{item.count} ({item.power} kW/unitate
                  {Number.isFinite(item.price) ? `, ${item.price} lei/unitate` : ''})
                </li>
              ))}
            </ul>
          ) : (
            <p>Nu exista producatori adaugati.</p>
          )}
        </div>
        <div>
          <h3>Consumatori</h3>
          {planConsumers.length ? (
            <ul>
              {planConsumers.map((item, index) => (
                <li key={`${item.type}-${index}`}>
                  {item.type} x{item.count} ({item.power} kW)
                </li>
              ))}
            </ul>
          ) : (
            <p>Nu exista consumatori adaugati.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

export default PlanificareView;
