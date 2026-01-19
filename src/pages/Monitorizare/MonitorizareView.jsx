function MonitorizareView({ monitorPlan, onToggleItem, onShowPrediction }) {
  const formatPower = (value) =>
    Number.isFinite(value) ? value.toFixed(2) : (0).toFixed(2);

  return (
    <div className="monitor-layout" role="region" aria-label="Monitorizare in timp real">
      {monitorPlan ? (
        <>
          <div className="monitor-header">
            <div className="monitor-stats" role="region" aria-live="polite" aria-label="Statistici curente">
              <div className="monitor-stat monitor-stat-production">
                <div className="monitor-stat-main">
                  <span>Productie curenta</span>
                  <span className="monitor-dots" aria-hidden="true" />
                  <strong>{monitorPlan.metrics.productionCurrent} kWh</strong>
                </div>
                {monitorPlan.metrics.productionAlert && (
                  <span className="monitor-alert" role="alert">
                    {monitorPlan.metrics.productionAlert}
                  </span>
                )}
              </div>
              <div className="monitor-stat">
                <span>Consum curent</span>
                <span className="monitor-dots" aria-hidden="true" />
                <strong>{monitorPlan.metrics.consumptionCurrent} kWh</strong>
              </div>
              <div className="monitor-stat">
                <span>Stocare in baterie</span>
                <span className="monitor-dots" aria-hidden="true" />
                <strong>{monitorPlan.metrics.batteryStorage} kWh</strong>
              </div>
              <div className="monitor-stat">
                <span>Energie livrata in retea</span>
                <span className="monitor-dots" aria-hidden="true" />
                <strong>{monitorPlan.metrics.gridDelivered} kWh</strong>
              </div>
            </div>
          </div>
          <div className="monitor-actions">
            <button
              type="button"
              className="monitor-action"
              onClick={() => onShowPrediction?.()}
            >
              Predictie 6 / 12 / 24 ore
            </button>
          </div>

          <div className="monitor-section">
            <h3 id="monitor-producers-heading">Producatori</h3>
            <div
              className="monitor-table monitor-producers"
              role="table"
              aria-labelledby="monitor-producers-heading"
            >
              <div className="monitor-row monitor-head" role="row">
                <span role="columnheader">On/Off</span>
                <span role="columnheader">Producator</span>
                <span role="columnheader">Cantitate</span>
                <span role="columnheader">Productie</span>
              </div>
              {monitorPlan.producers.map((item, index) => {
                const currentPower = Number.isFinite(item.currentPower)
                  ? item.currentPower
                  : item.count * item.power;
                return (
                <div className="monitor-row" key={`${item.type}-${index}`} role="row">
                  <label className="monitor-toggle">
                    <input
                      type="checkbox"
                      checked={item.isOn}
                      onChange={() => onToggleItem('producers', index)}
                      aria-label={`Comuta producatorul ${item.type}`}
                    />
                    <span className="checkmark" aria-hidden="true" />
                  </label>
                  <span role="cell">{item.type}</span>
                  <span role="cell">{item.count}</span>
                  <span role="cell">{formatPower(currentPower)} kWh/h</span>
                </div>
                );
              })}
            </div>
          </div>

          <div className="monitor-section">
            <h3 id="monitor-consumers-heading">Consumatori</h3>
            <div
              className="monitor-table monitor-consumers"
              role="table"
              aria-labelledby="monitor-consumers-heading"
            >
              <div className="monitor-row monitor-head" role="row">
                <span role="columnheader">On/Off</span>
                <span role="columnheader">Consumator</span>
                <span role="columnheader">Cantitate</span>
                <span role="columnheader">Cantitate folosita</span>
              </div>
              {monitorPlan.consumers.map((item, index) => {
                const currentPower = Number.isFinite(item.currentPower)
                  ? item.currentPower
                  : item.count * item.power;
                return (
                <div className="monitor-row" key={`${item.type}-${index}`} role="row">
                  <label className="monitor-toggle">
                    <input
                      type="checkbox"
                      checked={item.isOn}
                      onChange={() => onToggleItem('consumers', index)}
                      aria-label={`Comuta consumatorul ${item.type}`}
                    />
                    <span className="checkmark" aria-hidden="true" />
                  </label>
                  <span role="cell">{item.type}</span>
                  <span role="cell">{item.count}</span>
                  <span role="cell">{formatPower(currentPower)} kWh/h</span>
                </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="dashboard-placeholder" role="status" aria-live="polite">
          <p>Adauga producatori si consumatori in Planificare ca sa vezi monitorizarea live.</p>
        </div>
      )}
    </div>
  );
}

export default MonitorizareView;
