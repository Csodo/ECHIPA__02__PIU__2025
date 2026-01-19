const formatConsumerSummary = (items) => {
  const names = items.map((item) => item.type);
  const unique = [...new Set(names)];
  if (unique.length <= 3) return unique.join(', ');
  return `${unique.slice(0, 3).join(', ')} etc.`;
};

function InformatiiView({ producers = [], consumers = [], batteries = [], distributor, onShowAppInfo }) {
  const totalProducerPower = producers.reduce((sum, item) => sum + item.count * item.power, 0);
  const totalProducerCount = producers.reduce((sum, item) => sum + item.count, 0);
  const consumerCount = consumers.reduce((sum, item) => sum + item.count, 0);
  const producerTypes = [...new Set(producers.map((item) => item.type.toLowerCase()))];
  const producerTypeLabel =
    totalProducerCount === 0
      ? '0'
      : producerTypes.length === 1
      ? producerTypes[0]
      : `(${producerTypes.join(', ')})`;
  const consumerSummary = consumerCount === 0 ? '0' : `${consumerCount} (${formatConsumerSummary(consumers)})`;
  const batteryCapacityTotal = batteries.reduce((sum, item) => sum + item.count * item.capacity, 0);

  return (
    <div className="info-layout">
      <div className="info-summary">
        <div className="info-row">
          <span>Producatori instalati:</span>
          <strong>
            {totalProducerCount} {producerTypeLabel}
          </strong>
        </div>
        <div className="info-row">
          <span>Consumatori principali:</span>
          <strong>{consumerSummary}</strong>
        </div>
        <div className="info-row">
          <span>Capacitate totala sistem:</span>
          <strong>{totalProducerPower.toFixed(2)} kW</strong>
        </div>
        <div className="info-row">
          <span>Capacitate in baterie:</span>
          <strong>{batteryCapacityTotal.toFixed(2)} kWh</strong>
        </div>
        <div className="info-row">
          <span>Ultima mentenanta:</span>
          <strong>12/03/2025</strong>
        </div>
        <div className="info-row">
          <span>Distribuitor curent:</span>
          <strong>{distributor}</strong>
        </div>
      </div>

      <div className="info-divider" aria-hidden="true" />

      <div className="info-docs">
        <h3>Documentatie & Ajutor</h3>
        <ul>
          <li>
            <a
              href="https://www.youtube.com/watch?v=E7ydQR0e_LE"
              target="_blank"
              rel="noreferrer"
            >
              Ghid instalare sistem solar
            </a>
          </li>
          <li>
            <a href="https://calculator.romania-eficienta.ro/" target="_blank" rel="noreferrer">
              Cum se calculeaza eficienta energetica
            </a>
          </li>
          <li>
            <button type="button" className="info-link-button" onClick={onShowAppInfo}>
              Informatii despre modul de functionare al aplicatiei
            </button>
          </li>
          <li>
            <a
              href="https://electricup.ro/energie-regenerabila/ghid-intretinere-mentenanta-panouri-fotovoltaice/"
              target="_blank"
              rel="noreferrer"
            >
              Revizii programate si recomandari de intretinere
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InformatiiView;
