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
