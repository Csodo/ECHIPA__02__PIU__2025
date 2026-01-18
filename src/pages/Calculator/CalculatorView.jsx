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
  return (
    <div className="calc-layout">
      <h2>Calculator ROI (Return On Investment)</h2>
      <div className="calc-divider" aria-hidden="true" />
      <div className="calc-form">
        <div className="calc-row">
          <label>Cost total instalare sistem:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiInstallCost}
              onChange={(event) => onChangeInstallCost(event.target.value)}
            />
            <span>lei</span>
          </div>
        </div>
        <div className="calc-row">
          <label>Cost panouri solare:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiPanelCost}
              onChange={(event) => onChangePanelCost(event.target.value)}
            />
            <span>lei</span>
          </div>
        </div>
        <div className="calc-row">
          <label>Cost baterii (optional):</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiBatteryCost}
              onChange={(event) => onChangeBatteryCost(event.target.value)}
            />
            <span>lei</span>
          </div>
        </div>
        <div className="calc-row">
          <label>Economii lunare estimate:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiMonthlySavings}
              onChange={(event) => onChangeMonthlySavings(event.target.value)}
            />
            <span>lei</span>
          </div>
        </div>
        <div className="calc-row">
          <label>Productie lunara estimata:</label>
          <div className="calc-input">
            <input
              type="number"
              min="0"
              value={roiMonthlyProduction}
              onChange={(event) =>
                onChangeMonthlyProduction(event.target.value)
              }
            />
            <span>kWh</span>
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
      <div className="calc-results">
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
