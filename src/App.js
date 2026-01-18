import './App.css';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [planProducer, setPlanProducer] = useState('Panouri solare');
  const [planProducerCount, setPlanProducerCount] = useState(4);
  const [planProducerPower, setPlanProducerPower] = useState(1.5);
  const [planConsumer, setPlanConsumer] = useState('Frigider');
  const [planConsumerCount, setPlanConsumerCount] = useState(1);
  const [planConsumerPower, setPlanConsumerPower] = useState(0.3);
  const [planDistributor, setPlanDistributor] = useState('E.ON');
  const [planProducers, setPlanProducers] = useState([]);
  const [planConsumers, setPlanConsumers] = useState([]);
  const [planResult, setPlanResult] = useState(null);
  const [monitorPlan, setMonitorPlan] = useState(null);
  const [roiInstallCost, setRoiInstallCost] = useState('');
  const [roiPanelCost, setRoiPanelCost] = useState('');
  const [roiBatteryCost, setRoiBatteryCost] = useState('');
  const [roiMonthlySavings, setRoiMonthlySavings] = useState('');
  const [roiMonthlyProduction, setRoiMonthlyProduction] = useState('');
  const [roiResult, setRoiResult] = useState(null);

  const producerOptions = [
    'Panouri solare',
    'Turbina eoliana',
    'Microhidro',
    'Biomasa',
    'Generator diesel',
  ];

  const consumerOptions = [
    'Frigider',
    'Aer conditionat',
    'Masina de spalat',
    'Laptop',
    'Iluminat LED',
    'Incalzitor electric',
  ];

  const distributorOptions = ['E.ON', 'Enel', 'Electrica', 'CEZ', 'Restart Energy'];

  const users = [
    { username: 'user1', password: 'user1' },
    { username: 'user2', password: 'user2' },
    { username: 'user3', password: 'user3' },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const match = users.find(
      (user) => user.username === username && user.password === password
    );

    if (match) {
      setStatus({ type: 'success', message: `Welcome back, ${match.username}.` });
      setIsAuthed(true);
      setActiveView('dashboard');
    } else {
      setStatus({ type: 'error', message: 'Invalid username or password.' });
    }
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setStatus({ type: 'idle', message: '' });
    setIsAuthed(false);
    setActiveView('dashboard');
    setPlanProducers([]);
    setPlanConsumers([]);
    setPlanResult(null);
  };

  const handleAddProducer = () => {
    setPlanProducers((items) => [
      ...items,
      {
        type: planProducer,
        count: Number(planProducerCount),
        power: Number(planProducerPower),
      },
    ]);
  };

  const handleAddConsumer = () => {
    setPlanConsumers((items) => [
      ...items,
      {
        type: planConsumer,
        count: Number(planConsumerCount),
        power: Number(planConsumerPower),
      },
    ]);
  };

  const getPlanProducers = () => {
    if (planProducers.length) return planProducers;
    return [
      {
        type: planProducer,
        count: Number(planProducerCount),
        power: Number(planProducerPower),
      },
    ];
  };

  const getPlanConsumers = () => {
    if (planConsumers.length) return planConsumers;
    return [
      {
        type: planConsumer,
        count: Number(planConsumerCount),
        power: Number(planConsumerPower),
      },
    ];
  };

  const formatConsumerSummary = (items) => {
    const names = items.map((item) => item.type);
    const unique = [...new Set(names)];
    if (unique.length <= 3) return unique.join(', ');
    return `${unique.slice(0, 3).join(', ')} etc.`;
  };

  const handleCalculatePlan = () => {
    const totalProducerPower = planProducers.reduce(
      (sum, item) => sum + item.count * item.power,
      0
    );
    const totalConsumerPower = planConsumers.reduce(
      (sum, item) => sum + item.count * item.power,
      0
    );
    const produced = Math.max(0.5, totalProducerPower * 1.8);
    const consumed = Math.max(0.4, totalConsumerPower * 1.4);
    const cost = Math.max(250, Math.round(consumed * 1000));

    setPlanResult({
      cost,
      consumed: consumed.toFixed(2),
      produced: produced.toFixed(2),
    });
  };

  const buildMonitorMetrics = (producers, consumers) => {
    const activeProducers = producers.filter((item) => item.isOn);
    const activeConsumers = consumers.filter((item) => item.isOn);
    const totalProducerPower = activeProducers.reduce(
      (sum, item) => sum + item.count * item.power,
      0
    );
    const totalConsumerPower = activeConsumers.reduce(
      (sum, item) => sum + item.count * item.power,
      0
    );
    const produced = Math.max(0.5, totalProducerPower * 1.8);
    const consumed = Math.max(0.4, totalConsumerPower * 1.4);
    const surplus = Math.max(0, produced - consumed);

    return {
      productionCurrent: produced.toFixed(2),
      consumptionCurrent: consumed.toFixed(2),
      batteryStorage: (surplus * 0.6).toFixed(2),
      gridDelivered: (surplus * 0.4).toFixed(2),
    };
  };

  const handleImportPlan = () => {
    const producers = planProducers.map((item) => ({ ...item, isOn: true }));
    const consumers = planConsumers.map((item) => ({ ...item, isOn: true }));

    setMonitorPlan({
      producers,
      consumers,
      metrics: buildMonitorMetrics(producers, consumers),
    });
  };

  const handleRefreshMonitor = () => {
    setMonitorPlan((current) => {
      if (!current) return current;
      return {
        ...current,
        metrics: buildMonitorMetrics(current.producers, current.consumers),
      };
    });
  };

  const handleToggleMonitorItem = (group, index) => {
    setMonitorPlan((current) => {
      if (!current) return current;
      const updated = {
        ...current,
        [group]: current[group].map((item, itemIndex) =>
          itemIndex === index ? { ...item, isOn: !item.isOn } : item
        ),
      };

      return {
        ...updated,
        metrics: buildMonitorMetrics(updated.producers, updated.consumers),
      };
    });
  };

  const handleResetPlan = () => {
    setPlanProducer('Panouri solare');
    setPlanProducerCount(4);
    setPlanProducerPower(1.5);
    setPlanConsumer('Frigider');
    setPlanConsumerCount(1);
    setPlanConsumerPower(0.3);
    setPlanDistributor('E.ON');
    setPlanProducers([]);
    setPlanConsumers([]);
    setPlanResult(null);
  };

  const formatPayback = (months) => {
    const roundedMonths = Math.max(1, Math.round(months));
    const years = Math.floor(roundedMonths / 12);
    const remainingMonths = roundedMonths % 12;
    if (years === 0) {
      return `~ ${remainingMonths} ${remainingMonths === 1 ? 'luna' : 'luni'}`;
    }
    if (remainingMonths === 0) {
      return `~ ${years} ${years === 1 ? 'an' : 'ani'}`;
    }
    return `~ ${years} ${years === 1 ? 'an' : 'ani'} si ${remainingMonths} ${
      remainingMonths === 1 ? 'luna' : 'luni'
    }`;
  };

  const handleCalculateRoi = () => {
    const install = Number(roiInstallCost) || 0;
    const panels = Number(roiPanelCost) || 0;
    const battery = Number(roiBatteryCost) || 0;
    const monthlySavings = Number(roiMonthlySavings) || 0;
    const totalInvestment = install + panels + battery;

    if (monthlySavings <= 0 || totalInvestment <= 0) {
      setRoiResult({
        payback: 'Completeaza costurile si economiile lunare.',
        tenYearSavings: '—',
      });
      return;
    }

    const monthsToRecover = totalInvestment / monthlySavings;
    const tenYearSavings = monthlySavings * 120 - totalInvestment;

    setRoiResult({
      payback: formatPayback(monthsToRecover),
      tenYearSavings: `~ ${Math.max(0, Math.round(tenYearSavings))} lei`,
    });
  };

  return (
    <div className="App">
      <main className={isAuthed ? 'dashboard-shell' : 'login-shell'}>
        {isAuthed ? (
          <section className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <p className="brand-kicker">Access Portal</p>
                <h1>Welcome</h1>
              </div>
              <button type="button" className="btn-ghost" onClick={handleReset}>
                Sign out
              </button>
            </div>

            {activeView === 'dashboard' ? (
              <div className="dashboard-grid">
                <button
                  type="button"
                  className="dashboard-tile"
                  onClick={() => setActiveView('planificare')}
                >
                  <span>Planificare</span>
                </button>
                <button
                  type="button"
                  className="dashboard-tile"
                  onClick={() => setActiveView('monitorizare')}
                >
                  <span>Monitorizare</span>
                </button>
                <button
                  type="button"
                  className="dashboard-tile"
                  onClick={() => setActiveView('informatii')}
                >
                  <span>Informatii</span>
                </button>
                <button
                  type="button"
                  className="dashboard-tile"
                  onClick={() => setActiveView('calculator')}
                >
                  <span>Calculator</span>
                </button>
              </div>
            ) : (
              <>
                <div className="dashboard-tabs">
                  {['Planificare', 'Monitorizare', 'Informatii', 'Calculator'].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        className={`tab-button ${
                          activeView === label.toLowerCase() ? 'active' : ''
                        }`}
                        onClick={() => setActiveView(label.toLowerCase())}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>

                {activeView === 'planificare' ? (
                  <div className="plan-layout">
                    <section className="plan-form">
                      <h2>Introducere date generale</h2>

                      <div className="plan-block">
                        <h3>Producator</h3>
                        <div className="plan-row">
                          <label>
                            Tip Producator
                            <select
                              value={planProducer}
                              onChange={(event) =>
                                setPlanProducer(event.target.value)
                              }
                            >
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
                              onChange={(event) =>
                                setPlanProducerCount(event.target.value)
                              }
                            />
                          </label>
                          <label>
                            Putere per unitate (kW)
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={planProducerPower}
                              onChange={(event) =>
                                setPlanProducerPower(event.target.value)
                              }
                            />
                          </label>
                          <button type="button" onClick={handleAddProducer}>
                            Adauga producator
                          </button>
                        </div>
                      </div>

                      <div className="plan-block">
                        <h3>Consumator</h3>
                        <div className="plan-row">
                          <label>
                            Tip Consumator
                            <select
                              value={planConsumer}
                              onChange={(event) =>
                                setPlanConsumer(event.target.value)
                              }
                            >
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
                              onChange={(event) =>
                                setPlanConsumerCount(event.target.value)
                              }
                            />
                          </label>
                          <label>
                            Consum per unitate (kW)
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={planConsumerPower}
                              onChange={(event) =>
                                setPlanConsumerPower(event.target.value)
                              }
                            />
                          </label>
                          <button type="button" onClick={handleAddConsumer}>
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
                            onChange={(event) =>
                              setPlanDistributor(event.target.value)
                            }
                          >
                            {distributorOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="plan-actions">
                        <button type="button" onClick={handleCalculatePlan}>
                          Calculeaza estimare
                        </button>
                        <button type="button" onClick={handleImportPlan}>
                          Importa plan
                        </button>
                        <button type="button" onClick={handleResetPlan}>
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
                    </aside>
                  </div>
                ) : activeView === 'monitorizare' ? (
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
                          <button
                            type="button"
                            className="monitor-refresh"
                            onClick={handleRefreshMonitor}
                          >
                            <svg
                              className="refresh-icon"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
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
                                    onChange={() =>
                                      handleToggleMonitorItem('producers', index)
                                    }
                                  />
                                  <span className="checkmark" aria-hidden="true" />
                                </label>
                                <span>{item.type}</span>
                                <span>{item.count}</span>
                                <span>{(item.count * item.power).toFixed(2)} kWh</span>
                                <span>{(item.count * item.power * 1.1).toFixed(2)} kWh/h</span>
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
                                    onChange={() =>
                                      handleToggleMonitorItem('consumers', index)
                                    }
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
                ) : activeView === 'informatii' ? (
                  <div className="info-layout">
                    {(() => {
                      const producers = getPlanProducers();
                      const consumers = getPlanConsumers();
                      const totalProducerPower = producers.reduce(
                        (sum, item) => sum + item.count * item.power,
                        0
                      );
                      const totalProducerCount = producers.reduce(
                        (sum, item) => sum + item.count,
                        0
                      );
                      const consumerCount = consumers.reduce(
                        (sum, item) => sum + item.count,
                        0
                      );
                      const producerTypes = [
                        ...new Set(producers.map((item) => item.type.toLowerCase())),
                      ];
                      const batteryLevel = Math.min(
                        95,
                        Math.max(45, Math.round(totalProducerPower * 12))
                      );

                      return (
                        <>
                          <div className="info-summary">
                            <div className="info-row">
                              <span>Producatori instalati:</span>
                              <strong>
                                {totalProducerCount}{' '}
                                {producerTypes.length === 1
                                  ? producerTypes[0]
                                  : `(${producerTypes.join(', ')})`}
                              </strong>
                            </div>
                            <div className="info-row">
                              <span>Consumatori principali:</span>
                              <strong>
                                {consumerCount} ({formatConsumerSummary(consumers)})
                              </strong>
                            </div>
                            <div className="info-row">
                              <span>Capacitate totala sistem:</span>
                              <strong>{totalProducerPower.toFixed(2)} kW</strong>
                            </div>
                            <div className="info-row">
                              <span>Stocare in baterie:</span>
                              <strong>{batteryLevel}%</strong>
                            </div>
                            <div className="info-row">
                              <span>Ultima mentenanta:</span>
                              <strong>12/03/2025</strong>
                            </div>
                            <div className="info-row">
                              <span>Distribuitor curent:</span>
                              <strong>{planDistributor}</strong>
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
                                <a
                                  href="https://calculator.romania-eficienta.ro/"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Cum se calculeaza eficienta energetica
                                </a>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="info-link-button"
                                  onClick={() => setActiveView('info-aplicatie')}
                                >
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
                        </>
                      );
                    })()}
                  </div>
                ) : activeView === 'info-aplicatie' ? (
                  <div className="info-layout info-detail">
                    <h2>Despre aplicatie</h2>
                    <p>
                      Aceasta aplicatie centralizeaza datele despre productie si
                      consum pentru un sistem energetic local. In Planificare
                      adaugi echipamentele, in Monitorizare urmaresti starea lor,
                      iar in Informatii ai un rezumat al sistemului si acces la
                      documentatie.
                    </p>
                    <p>
                      Datele afisate sunt orientative si ajuta la simularea unor
                      scenarii de functionare. Poti ajusta configuratia ori de
                      cate ori ai nevoie pentru a vedea impactul estimat.
                    </p>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setActiveView('informatii')}
                    >
                      Inapoi
                    </button>
                  </div>
                ) : activeView === 'calculator' ? (
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
                            onChange={(event) => setRoiInstallCost(event.target.value)}
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
                            onChange={(event) => setRoiPanelCost(event.target.value)}
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
                            onChange={(event) => setRoiBatteryCost(event.target.value)}
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
                            onChange={(event) => setRoiMonthlySavings(event.target.value)}
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
                            onChange={(event) => setRoiMonthlyProduction(event.target.value)}
                          />
                          <span>kWh</span>
                        </div>
                      </div>
                    </div>
                    <div className="calc-divider" aria-hidden="true" />
                    <div className="calc-actions">
                      <button type="button" onClick={handleCalculateRoi}>
                        Calculeaza ROI
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
                          <p>Recuperarea investitiei: —</p>
                          <p>Economii totale in 10 ani: —</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-placeholder">
                    <p>Selecteaza un tab pentru continut.</p>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <section className="login-card">
            <div className="login-brand">
              <span className="brand-mark" aria-hidden="true" />
              <div>
                <p className="brand-kicker">Access Portal</p>
                <h1>Sign in</h1>
              </div>
            </div>

            <p className="login-subtitle">Enter your credentials.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="user1"
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="user1"
                  required
                />
              </label>

              <div className="actions">
                <button type="submit" className="btn-primary">
                  Sign in
                </button>
                <button type="button" className="btn-ghost" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>

            <div className={`status ${status.type}`} role="status" aria-live="polite">
              {status.message || 'Use user1/user1, user2/user2, or user3/user3.'}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
