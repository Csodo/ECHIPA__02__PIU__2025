function CalculatorView({
  roiInstallCost,
  roiPanelCost,
  roiBatteryCost,
  roiMonthlySavings,
  roiMonthlyProduction,
  roiResult,
  onChangeInstallCost,
  onChangePanelCost,
  onChangeBatteryCost,
  onChangeMonthlySavings,
  onChangeMonthlyProduction,
  onCalculate,
  onExportPdf,
}) {
  const inputIds = {
    install: 'calc-install-cost',
    panels: 'calc-panel-cost',
    battery: 'calc-battery-cost',
    savings: 'calc-monthly-savings',
    production: 'calc-monthly-production',
  };

  return (
    <div className="calc-layout" aria-labelledby="calculator-heading">
      <h2 id="calculator-heading">Calculator ROI (Return On Investment)</h2>
      <div className="calc-divider" aria-hidden="true" />
      <div className="calc-form">
        <div className="calc-row">
          <label htmlFor={inputIds.install}>Cost total instalare sistem:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiInstallCost}
              id={inputIds.install}
              onChange={(event) => onChangeInstallCost(event.target.value)}
              aria-describedby={`${inputIds.install}-unit`}
            />
            <span id={`${inputIds.install}-unit`} aria-hidden="true">
              lei
            </span>
          </div>
        </div>
        <div className="calc-row">
          <label htmlFor={inputIds.panels}>Cost panouri solare:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiPanelCost}
              id={inputIds.panels}
              onChange={(event) => onChangePanelCost(event.target.value)}
              aria-describedby={`${inputIds.panels}-unit`}
            />
            <span id={`${inputIds.panels}-unit`} aria-hidden="true">
              lei
            </span>
          </div>
        </div>
        <div className="calc-row">
          <label htmlFor={inputIds.battery}>Cost baterii (optional):</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiBatteryCost}
              id={inputIds.battery}
              onChange={(event) => onChangeBatteryCost(event.target.value)}
              aria-describedby={`${inputIds.battery}-unit`}
            />
            <span id={`${inputIds.battery}-unit`} aria-hidden="true">
              lei
            </span>
          </div>
        </div>
        <div className="calc-row">
          <label htmlFor={inputIds.savings}>Economii lunare estimate:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiMonthlySavings}
              id={inputIds.savings}
              onChange={(event) => onChangeMonthlySavings(event.target.value)}
              aria-describedby={`${inputIds.savings}-unit`}
            />
            <span id={`${inputIds.savings}-unit`} aria-hidden="true">
              lei
            </span>
          </div>
        </div>
        <div className="calc-row">
          <label htmlFor={inputIds.production}>Productie lunara estimata:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiMonthlyProduction}
              id={inputIds.production}
              onChange={(event) => onChangeMonthlyProduction(event.target.value)}
              aria-describedby={`${inputIds.production}-unit`}
            />
            <span id={`${inputIds.production}-unit`} aria-hidden="true">
              kWh
            </span>
          </div>
        </div>
      </div>
      <div className="calc-divider" aria-hidden="true" />
      <div className="calc-actions">
        <button type="button" onClick={onCalculate}>
          Calculeaza ROI
        </button>
        <button type="button" onClick={onExportPdf}>
          Exporta raport PDF
        </button>
      </div>
      <div className="calc-divider" aria-hidden="true" />
      <div className="calc-results" role="status" aria-live="polite">
        <h3>Rezultat:</h3>
        {roiResult ? (
          <>
            <p>Recuperarea investitiei: {roiResult.payback}</p>
            <p>Economii totale in 10 ani: {roiResult.tenYearSavings}</p>
          </>
        ) : (
          <>
            <p>Recuperarea investitiei: ’'?"</p>
            <p>Economii totale in 10 ani: ’'?"</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CalculatorView;
