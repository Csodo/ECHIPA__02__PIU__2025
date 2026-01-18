import PlanificarePage from '../Planificare';
import MonitorizarePage from '../Monitorizare';
import InformatiiPage from '../Informatii';
import InfoAplicatiePage from '../InfoAplicatie';
import CalculatorPage from '../Calculator';

const tabItems = [
  { key: 'planificare', label: 'Planificare' },
  { key: 'monitorizare', label: 'Monitorizare' },
  { key: 'informatii', label: 'Informatii' },
  { key: 'calculator', label: 'Calculator' },
];

function DashboardView({
  activeView,
  onChangeView,
  onSignOut,
  planProps,
  monitorProps,
  infoProps,
  calculatorProps,
}) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <p className="brand-kicker">Access Portal</p>
          <h1>Welcome</h1>
        </div>
        <button type="button" className="btn-ghost" onClick={onSignOut}>
          Sign out
        </button>
      </div>

      {activeView === 'dashboard' ? (
        <div className="dashboard-grid">
          {tabItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="dashboard-tile"
              onClick={() => onChangeView(item.key)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="dashboard-tabs">
            {tabItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`tab-button ${activeView === item.key ? 'active' : ''}`}
                onClick={() => onChangeView(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeView === 'planificare' && <PlanificarePage {...planProps} />}
          {activeView === 'monitorizare' && <MonitorizarePage {...monitorProps} />}
          {activeView === 'informatii' && <InformatiiPage {...infoProps} />}
          {activeView === 'info-aplicatie' && (
            <InfoAplicatiePage onBack={() => onChangeView('informatii')} />
          )}
          {activeView === 'calculator' && <CalculatorPage {...calculatorProps} />}
        </>
      )}
    </section>
  );
}

export default DashboardView;
