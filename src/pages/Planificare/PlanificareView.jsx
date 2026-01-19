function PlanificareView({
  consumerOptions,
  batteryOptions,
  batteryCatalog,
  distributorOptions,
  distributorRates,
  solarPanels,
  solarSuggestion,
  batterySuggestion,
  selectedPanelId,
  selectedPanelCount,
  selectedBatteryId,
  selectedBatteryCount,
  planConsumer,
  planConsumerCount,
  planConsumerPower,
  planDistributor,
  planProducers,
  planConsumers,
  planBatteryType,
  planBatteryCount,
  planBatteryCapacity,
  planBatteries,
  planResult,
  onPlanProducerChange,
  onPlanProducerCountChange,
  onPlanProducerPowerChange,
  onPlanConsumerChange,
  onPlanConsumerCountChange,
  onPlanConsumerPowerChange,
  onPlanDistributorChange,
  onPlanBatteryTypeChange,
  onPlanBatteryCountChange,
  onPlanBatteryCapacityChange,
  onAddProducer,
  onSelectPanel,
  onPanelCountChange,
  onApplySuggestedPanels,
  onAddSelectedPanel,
  onAddConsumer,
  onSelectBattery,
  onBatteryCountChange,
  onApplySuggestedBatteries,
  onAddSelectedBattery,
  onAddBattery,
  onCalculatePlan,
  onResetPlan,
}) {
  const totalBatteryCapacity = planBatteries.reduce(
    (sum, item) => sum + item.count * item.capacity,
    0
  );
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
      <section className="plan-form" aria-label="Formular de planificare a echipamentelor">
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

        <div className="plan-block plan-offer" aria-label="Recomandari panouri solare">
          <h3>Oferta panouri solare</h3>
          {solarSuggestion && suggestedPanels.length ? (
            <div className="plan-offer-card" role="status" aria-live="polite">
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

        <div className="plan-block plan-offer" aria-label="Recomandari baterii">
          <h3>Oferta baterii</h3>
          {batterySuggestion && batterySuggestion.batteries.length ? (
            <div className="plan-offer-card" role="status" aria-live="polite">
              <div>
                <p className="plan-offer-title">Recomandare pe baza surplusului</p>
                <strong>
                  {batterySuggestion.batteries.map((b) => `${b.name} x${b.count}`).join(' + ')}
                </strong>
                <div className="plan-offer-meta">
                  <span>Surplus tinta: {batterySuggestion.targetStorage.toFixed(2)} kWh</span>
                  <span>Capacitate totala: {batterySuggestion.totalCapacity.toFixed(2)} kWh</span>
                  <span>Diferenta: {batterySuggestion.diff.toFixed(2)} kWh</span>
                  <span>Cost estimat: {batterySuggestion.totalPrice.toLocaleString('ro-RO')} lei</span>
                </div>
              </div>
              <button type="button" onClick={onApplySuggestedBatteries}>
                Adauga recomandarea
              </button>
            </div>
          ) : (
            <p className="plan-offer-empty">
              Recomandam baterii doar daca exista productie mai mare decat consumul.
            </p>
          )}

          <div className="plan-offer-picker">
            <p className="plan-offer-title">Alege manual</p>
            <div className="plan-row">
              <label>
                Model baterie
                <select value={selectedBatteryId} onChange={(e) => onSelectBattery(e.target.value)}>
                  {batteryCatalog.map((battery) => (
                    <option key={battery.id} value={battery.id}>
                      {battery.name} ({battery.capacity} kWh, {battery.price} lei)
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Numar baterii
                <input
                  type="number"
                  min="1"
                  value={selectedBatteryCount}
                  onChange={(event) => onBatteryCountChange(event.target.value)}
                />
              </label>
            </div>
            <button type="button" onClick={onAddSelectedBattery}>
              Adauga baterie
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
          <button type="button" onClick={onResetPlan}>
            Reseteaza datele
          </button>
        </div>

        <div className="plan-results" role="status" aria-live="polite">
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

      <aside className="plan-summary" aria-label="Sumar configuratie curenta">
        <div role="region" aria-labelledby="summary-consumers">
          <h3 id="summary-consumers">Consumatori</h3>
          {planConsumers.length ? (
            <ul aria-live="polite">
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
        <div role="region" aria-labelledby="summary-producers">
          <h3 id="summary-producers">Producatori</h3>
          {planProducers.length ? (
            <ul aria-live="polite">
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
        <div role="region" aria-labelledby="summary-batteries">
          <h3 id="summary-batteries">Baterii</h3>
          {planBatteries.length ? (
            <ul aria-live="polite">
              {planBatteries.map((item, index) => (
                <li key={`${item.type}-${item.capacity}-${index}`}>
                  {item.type} x{item.count} ({item.capacity} kWh fiecare)
                </li>
              ))}
            </ul>
          ) : (
            <p>Nu exista baterii adaugate.</p>
          )}
          <p className="plan-hint">
            Capacitate totala: {Math.round(totalBatteryCapacity * 100) / 100} kWh
          </p>
        </div>
      </aside>
    </div>
  );
}

export default PlanificareView;
