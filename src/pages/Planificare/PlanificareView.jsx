function PlanificareView({
  producerOptions,
  consumerOptions,
  batteryOptions,
  distributorOptions,
  distributorRates,
  planProducer,
  planProducerCount,
  planProducerPower,
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
  planNotice,
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
  onAddConsumer,
  onAddBattery,
  onCalculatePlan,
  onImportPlan,
  onResetPlan,
}) {
  const totalBatteryCapacity = planBatteries.reduce(
    (sum, item) => sum + item.count * item.capacity,
    0
  );

  return (
    <div className="plan-layout">
      <section className="plan-form">
        <h2>Introducere date generale</h2>

        <div className="plan-block">
          <h3>Producator</h3>
          <div className="plan-row">
            <label>
              Tip Producator
              <select value={planProducer} onChange={(event) => onPlanProducerChange(event.target.value)}>
                {producerOptions.map((option) => (
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
                value={planProducerCount}
                onChange={(event) => onPlanProducerCountChange(event.target.value)}
              />
            </label>
            <label>
              Putere per unitate (kW)
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={planProducerPower}
                onChange={(event) => onPlanProducerPowerChange(event.target.value)}
              />
            </label>
            <button type="button" onClick={onAddProducer}>
              Adauga producator
            </button>
          </div>
        </div>

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

        {planNotice && <div className="plan-notice">{planNotice}</div>}

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
                  {item.type} x{item.count} ({item.power} kW)
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
        <div>
          <h3>Baterii</h3>
          {planBatteries.length ? (
            <ul>
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
