import { useState } from 'react';
import './styles/global.css';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import { exportRoiPdf } from './pages/Calculator/exportRoiPdf';

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
        tenYearSavings: 'Completeaza campurile pentru a estima economiile.',
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

  const handleExportRoiReport = async () => {
    if (!roiResult) {
      window.alert('Calculeaza ROI inainte de export.');
      return;
    }
    const confirmed = window.confirm('Sunteti de acord?');
    if (!confirmed) return;
    await exportRoiPdf({
      roiInstallCost,
      roiPanelCost,
      roiBatteryCost,
      roiMonthlySavings,
      roiMonthlyProduction,
      roiResult,
    });
  };

  const planProps = {
    producerOptions,
    consumerOptions,
    distributorOptions,
    planProducer,
    planProducerCount,
    planProducerPower,
    planConsumer,
    planConsumerCount,
    planConsumerPower,
    planDistributor,
    planProducers,
    planConsumers,
    planResult,
    onPlanProducerChange: setPlanProducer,
    onPlanProducerCountChange: setPlanProducerCount,
    onPlanProducerPowerChange: setPlanProducerPower,
    onPlanConsumerChange: setPlanConsumer,
    onPlanConsumerCountChange: setPlanConsumerCount,
    onPlanConsumerPowerChange: setPlanConsumerPower,
    onPlanDistributorChange: setPlanDistributor,
    onAddProducer: handleAddProducer,
    onAddConsumer: handleAddConsumer,
    onCalculatePlan: handleCalculatePlan,
    onImportPlan: handleImportPlan,
    onResetPlan: handleResetPlan,
  };

  const monitorProps = {
    monitorPlan,
    onRefresh: handleRefreshMonitor,
    onToggleItem: handleToggleMonitorItem,
  };

  const infoProps = {
    producers: getPlanProducers(),
    consumers: getPlanConsumers(),
    distributor: planDistributor,
    onShowAppInfo: () => setActiveView('info-aplicatie'),
  };

  const calculatorProps = {
    roiInstallCost,
    roiPanelCost,
    roiBatteryCost,
    roiMonthlySavings,
    roiMonthlyProduction,
    roiResult,
    onChangeInstallCost: setRoiInstallCost,
    onChangePanelCost: setRoiPanelCost,
    onChangeBatteryCost: setRoiBatteryCost,
    onChangeMonthlySavings: setRoiMonthlySavings,
    onChangeMonthlyProduction: setRoiMonthlyProduction,
    onCalculate: handleCalculateRoi,
    onExportPdf: handleExportRoiReport,
  };

  return (
    <div className="App">
      <main className={isAuthed ? 'dashboard-shell' : 'login-shell'}>
        {isAuthed ? (
          <DashboardPage
            activeView={activeView}
            onChangeView={setActiveView}
            onSignOut={handleReset}
            planProps={planProps}
            monitorProps={monitorProps}
            infoProps={infoProps}
            calculatorProps={calculatorProps}
          />
        ) : (
          <LoginPage
            username={username}
            password={password}
            status={status}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onChangeUsername={setUsername}
            onChangePassword={setPassword}
          />
        )}
      </main>
    </div>
  );
}

export default App;
