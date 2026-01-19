import PlanificarePage from '../Planificare';
import MonitorizarePage from '../Monitorizare';
import InformatiiPage from '../Informatii';
import InfoAplicatiePage from '../InfoAplicatie';
import CalculatorPage from '../Calculator';
import PredictiePage from '../Predictie';

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
  predictionProps,
}) {
  const renderPanel = (key, content, options = {}) => {
    const { labelledBy, label } = options;
    const ariaProps = labelledBy
      ? { 'aria-labelledby': labelledBy }
      : { 'aria-labelledby': `${key}-tab` };
    if (label) {
      ariaProps['aria-label'] = label;
    }

    return (
      <div id={`${key}-panel`} role="tabpanel" hidden={activeView !== key} {...ariaProps}>
        {activeView === key ? content : null}
      </div>
    );
  };

  return (
    <section className="dashboard-card" aria-labelledby="dashboard-title">
      <div className="dashboard-header">
        <div>
          <p className="brand-kicker">Access Portal</p>
          <h1 id="dashboard-title">Welcome</h1>
        </div>
        <button type="button" className="btn-ghost" onClick={onSignOut} aria-label="Sign out">
          Sign out
        </button>
      </div>

      {activeView === 'dashboard' ? (
        <div
          className="dashboard-grid"
          role="navigation"
          aria-label="Navigare catre modulele Energy Portal"
        >
          {tabItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="dashboard-tile"
              onClick={() => onChangeView(item.key)}
              aria-label={`Deschide modulul ${item.label}`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="dashboard-tabs" role="tablist" aria-label="Module Energy Portal">
            {tabItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`tab-button ${activeView === item.key ? 'active' : ''}`}
                onClick={() => onChangeView(item.key)}
                role="tab"
                id={`${item.key}-tab`}
                aria-controls={`${item.key}-panel`}
                aria-selected={activeView === item.key}
                tabIndex={activeView === item.key ? 0 : -1}
              >
                {item.label}
              </button>
            ))}
          </div>

          {renderPanel('planificare', <PlanificarePage {...planProps} />)}
          {renderPanel('monitorizare', <MonitorizarePage {...monitorProps} />)}
          {renderPanel('predictie', <PredictiePage {...predictionProps} />, {
            label: 'Predictie energie',
          })}
          {renderPanel('informatii', <InformatiiPage {...infoProps} />)}
          {renderPanel(
            'info-aplicatie',
            <InfoAplicatiePage onBack={() => onChangeView('informatii')} />,
            {
              labelledBy: 'informatii-tab',
              label: 'Informatii detaliate despre aplicatie',
            },
          )}
          {renderPanel('calculator', <CalculatorPage {...calculatorProps} />)}
        </>
      )}
    </section>
  );
}

export default DashboardView;
