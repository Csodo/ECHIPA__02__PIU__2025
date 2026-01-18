function MonitorizareView({ monitorPlan, onRefresh, onToggleItem }) {
  return (
    <div className="monitor-layout">
      {monitorPlan ? (
        <>
          <div className="monitor-header">
            <div className="monitor-stats">
              <div className="monitor-stat">
                <span>Productie curenta</span>
                <span className="monitor-dots" aria-hidden="true" />
                <strong>{monitorPlan.metrics.productionCurrent} kWh</strong>
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
            <button type="button" className="monitor-refresh" onClick={onRefresh}>
              <svg className="refresh-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20 12a8 8 0 1 1-2.34-5.66"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 4v6h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Actualizare date
            </button>
          </div>

          <div className="monitor-section">
            <h3>Producatori</h3>
            <div className="monitor-table monitor-producers">
              <div className="monitor-row monitor-head">
                <span>On/Off</span>
                <span>Producator</span>
                <span>Cantitate</span>
                <span>Cantitate produsa</span>
                <span>Productie</span>
              </div>
              {monitorPlan.producers.map((item, index) => (
                <div className="monitor-row" key={`${item.type}-${index}`}>
                  <label className="monitor-toggle">
                    <input
                      type="checkbox"
                      checked={item.isOn}
                      onChange={() => onToggleItem('producers', index)}
                    />
                    <span className="checkmark" aria-hidden="true" />
                  </label>
                <span>{item.type}</span>
                <span>{item.count}</span>
                <span>{(item.count * item.power).toFixed(2)} kWh</span>
                <span>{(item.count * item.power).toFixed(2)} kWh/h</span>
              </div>
            ))}
          </div>
        </div>

          <div className="monitor-section">
            <h3>Consumatori</h3>
            <div className="monitor-table monitor-consumers">
              <div className="monitor-row monitor-head">
                <span>On/Off</span>
                <span>Consumator</span>
                <span>Cantitate</span>
                <span>Cantitate folosita</span>
              </div>
              {monitorPlan.consumers.map((item, index) => (
                <div className="monitor-row" key={`${item.type}-${index}`}>
                  <label className="monitor-toggle">
                    <input
                      type="checkbox"
                      checked={item.isOn}
                      onChange={() => onToggleItem('consumers', index)}
                    />
                    <span className="checkmark" aria-hidden="true" />
                  </label>
                  <span>{item.type}</span>
                  <span>{item.count}</span>
                  <span>{(item.count * item.power).toFixed(2)} kWh/h</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="dashboard-placeholder">
          <p>Importa planul din tabul Planificare ca sa apara monitorizarea.</p>
        </div>
      )}
    </div>
  );
}

export default MonitorizareView;
