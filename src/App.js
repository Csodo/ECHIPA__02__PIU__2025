import { useEffect, useState } from 'react';
import './styles/global.css';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import { distributorRates } from './config/distributors';
import { exportRoiPdf } from './pages/Calculator/exportRoiPdf';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [planProducer, setPlanProducer] = useState("Panouri solare");
  const [planProducerCount, setPlanProducerCount] = useState(4);
  const [planProducerPower, setPlanProducerPower] = useState(1.5);
  const [planConsumer, setPlanConsumer] = useState("Frigider");
  const [planConsumerCount, setPlanConsumerCount] = useState(1);
  const [planConsumerPower, setPlanConsumerPower] = useState(0.3);
  const [planDistributor, setPlanDistributor] = useState(
    distributorRates[0]?.name || "E.ON",
  );
  const [planProducers, setPlanProducers] = useState([]);
  const [planConsumers, setPlanConsumers] = useState([]);
  const [planBatteryType, setPlanBatteryType] = useState('Baterie Li-Ion');
  const [planBatteryCount, setPlanBatteryCount] = useState(0);
  const [planBatteryCapacity, setPlanBatteryCapacity] = useState(5);
  const [planBatteries, setPlanBatteries] = useState([]);
  const [planResult, setPlanResult] = useState(null);
  const [planNotice, setPlanNotice] = useState('');
  const [monitorPlan, setMonitorPlan] = useState(null);
  const [roiInstallCost, setRoiInstallCost] = useState("");
  const [roiPanelCost, setRoiPanelCost] = useState("");
  const [roiBatteryCost, setRoiBatteryCost] = useState("");
  const [roiMonthlySavings, setRoiMonthlySavings] = useState("");
  const [roiMonthlyProduction, setRoiMonthlyProduction] = useState("");
  const [roiResult, setRoiResult] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState('solaris-320');
  const [selectedPanelCount, setSelectedPanelCount] = useState(4);

  const producerOptions = [
    'Panouri solare',
    'Turbina eoliana',
    'Microhidro',
    'Biomasa',
    'Generator diesel',
  ];
  const consumerOptions = [
    "Frigider",
    "Aer conditionat",
    "Masina de spalat",
    "Laptop",
    "Iluminat LED",
    "Incalzitor electric",
  ];

  const solarPanels = [
    { id: 'solaris-320', name: 'Solaris 320', power: 0.32, price: 680 },
    { id: 'helio-400', name: 'Helio 400', power: 0.4, price: 820 },
    { id: 'aurora-450', name: 'Aurora 450', power: 0.45, price: 980 },
    { id: 'vortex-520', name: 'Vortex 520', power: 0.52, price: 1180 },
  ];
  const batteryOptions = ['Baterie Li-Ion', 'Baterie LFP', 'Baterie AGM'];

  useEffect(() => {
    if (!planNotice) return undefined;
    const timer = setTimeout(() => setPlanNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [planNotice]);

  const users = [
    { username: "user1", password: "user1" },
    { username: "user2", password: "user2" },
    { username: "user3", password: "user3" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const match = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (match) {
      setStatus({
        type: "success",
        message: `Welcome back, ${match.username}.`,
      });
      setIsAuthed(true);
      setActiveView("dashboard");
    } else {
      setStatus({ type: "error", message: "Invalid username or password." });
    }
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setStatus({ type: "idle", message: "" });
    setIsAuthed(false);
    setActiveView("dashboard");
    setPlanProducers([]);
    setPlanConsumers([]);
    setPlanBatteries([]);
    setPlanBatteryType('Baterie Li-Ion');
    setPlanBatteryCount(0);
    setPlanBatteryCapacity(5);
    setPlanResult(null);
    setPlanNotice('');
  };

  const handleAddProducer = () => {
    const newItem = {
      type: planProducer,
      count: Number(planProducerCount),
      power: Number(planProducerPower),
    };

    setPlanProducers((items) => {
      const matchIndex = items.findIndex(
        (item) => item.type === newItem.type && item.power === newItem.power,
      );
      if (matchIndex === -1) return [...items, newItem];
      return items.map((item, index) =>
        index === matchIndex
          ? { ...item, count: item.count + newItem.count }
          : item,
      );
    });
  };

  const handleAddConsumer = () => {
    const newItem = {
      type: planConsumer,
      count: Number(planConsumerCount),
      power: Number(planConsumerPower),
    };

    setPlanConsumers((items) => {
      const matchIndex = items.findIndex(
        (item) => item.type === newItem.type && item.power === newItem.power,
      );
      if (matchIndex === -1) return [...items, newItem];
      return items.map((item, index) =>
        index === matchIndex
          ? { ...item, count: item.count + newItem.count }
          : item,
      );
    });
  };

  const handleAddBattery = () => {
    const newItem = {
      type: planBatteryType,
      count: Number(planBatteryCount),
      capacity: Number(planBatteryCapacity),
    };
    if (!newItem.count || newItem.capacity <= 0) return;

    setPlanBatteries((items) => {
      const matchIndex = items.findIndex(
        (item) => item.type === newItem.type && item.capacity === newItem.capacity
      );
      if (matchIndex === -1) return [...items, newItem];
      return items.map((item, index) =>
        index === matchIndex ? { ...item, count: item.count + newItem.count } : item
      );
    });
  };

  const handleCalculatePlan = (nextDistributor) => {
    const totalProducerPower = planProducers.reduce(
      (sum, item) => sum + item.count * item.power,
      0,
    );
    const totalConsumerPower = planConsumers.reduce(
      (sum, item) => sum + item.count * item.power,
      0,
    );
    const produced = Math.max(0, totalProducerPower);
    const consumed = Math.max(0, totalConsumerPower);
    const currentRate =
      distributorRates.find(
        (item) => item.name === (nextDistributor || planDistributor),
      )?.price ??
      distributorRates[0]?.price ??
      1;
    const cost = Math.max(0, Math.round(consumed * 1000 * currentRate));

    setPlanResult({
      cost,
      consumed: consumed.toFixed(2),
      produced: produced.toFixed(2),
    });
  };

  const buildMonitorMetrics = (producers, consumers, batteryCapacityTotal = 0) => {
    const activeProducers = producers.filter((item) => item.isOn);
    const activeConsumers = consumers.filter((item) => item.isOn);
    const totalProducerPower = activeProducers.reduce(
      (sum, item) => sum + item.count * item.power,
      0,
    );
    const totalConsumerPower = activeConsumers.reduce(
      (sum, item) => sum + item.count * item.power,
      0,
    );
    const produced = Math.max(0, totalProducerPower);
    const consumed = Math.max(0, totalConsumerPower);
    const surplus = Math.max(0, produced - consumed);
    const batteryStorage = batteryCapacityTotal
      ? Math.min(batteryCapacityTotal, surplus * 0.6)
      : 0;
    const gridDelivered = Math.max(0, surplus - batteryStorage);

    return {
      productionCurrent: produced.toFixed(2),
      consumptionCurrent: consumed.toFixed(2),
      batteryStorage: batteryStorage.toFixed(2),
      gridDelivered: gridDelivered.toFixed(2),
    };
  };

  const handleImportPlan = () => {
    const producers = planProducers.map((item) => ({ ...item, isOn: true }));
    const consumers = planConsumers.map((item) => ({ ...item, isOn: true }));
    const batteries =
      planBatteries.length > 0
        ? planBatteries
        : planBatteryCount && planBatteryCapacity > 0
          ? [{ type: planBatteryType, count: planBatteryCount, capacity: planBatteryCapacity }]
          : [];
    const batteryCapacityTotal = batteries.reduce(
      (sum, item) => sum + item.count * item.capacity,
      0
    );

    setMonitorPlan({
      producers,
      consumers,
      batteries,
      batteryCapacityTotal,
      metrics: buildMonitorMetrics(producers, consumers, batteryCapacityTotal),
    });
    setPlanNotice('Plan importat in monitorizare.');
  };

  const handleRefreshMonitor = () => {
    setMonitorPlan((current) => {
      if (!current) return current;
      return {
        ...current,
        metrics: buildMonitorMetrics(
          current.producers,
          current.consumers,
          current.batteryCapacityTotal || 0
        ),
      };
    });
  };

  const handleToggleMonitorItem = (group, index) => {
    setMonitorPlan((current) => {
      if (!current) return current;
      const updated = {
        ...current,
        [group]: current[group].map((item, itemIndex) =>
          itemIndex === index ? { ...item, isOn: !item.isOn } : item,
        ),
      };

      return {
        ...updated,
        metrics: buildMonitorMetrics(
          updated.producers,
          updated.consumers,
          updated.batteryCapacityTotal || 0
        ),
      };
    });
  };

  const handleResetPlan = () => {
    setPlanProducer("Panouri solare");
    setPlanProducerCount(4);
    setPlanProducerPower(1.5);
    setPlanConsumer("Frigider");
    setPlanConsumerCount(1);
    setPlanConsumerPower(0.3);
    setPlanDistributor(distributorRates[0]?.name || "E.ON");
    setPlanProducers([]);
    setPlanConsumers([]);
    setPlanBatteries([]);
    setPlanBatteryType('Baterie Li-Ion');
    setPlanBatteryCount(0);
    setPlanBatteryCapacity(5);
    setPlanResult(null);
    setSelectedPanelId('solaris-320');
    setSelectedPanelCount(4);
  };

  const getSolarSuggestion = (consumers) => {
    if (!consumers.length) return null;
    const targetPower = consumers.reduce((sum, item) => sum + item.count * item.power, 0);
    if (targetPower <= 0) return null;

    const minPanelPower = Math.min(...solarPanels.map((panel) => panel.power));
    const maxPanels = Math.min(24, Math.ceil(targetPower / minPanelPower) + 3);
    const maxPerType = solarPanels.map((panel) =>
      Math.min(maxPanels, Math.ceil(targetPower / panel.power) + 2)
    );

    const combos = [];
    const counts = new Array(solarPanels.length).fill(0);

    const buildCombos = (index, totalCount, totalPower, totalPrice) => {
      if (index === solarPanels.length) {
        if (totalCount === 0) return;
        combos.push({
          counts: [...counts],
          totalCount,
          totalPower,
          totalPrice,
          diff: Math.abs(targetPower - totalPower),
        });
        return;
      }

      const panel = solarPanels[index];
      for (let count = 0; count <= maxPerType[index]; count += 1) {
        if (totalCount + count > maxPanels) break;
        counts[index] = count;
        buildCombos(
          index + 1,
          totalCount + count,
          totalPower + count * panel.power,
          totalPrice + count * panel.price
        );
      }
    };

    buildCombos(0, 0, 0, 0);
    if (!combos.length) return null;

    const byDiff = [...combos].sort(
      (a, b) => a.diff - b.diff || a.totalCount - b.totalCount || a.totalPrice - b.totalPrice
    )[0];
    const tolerance = Math.max(minPanelPower * 0.5, targetPower * 0.15);
    const withinTolerance = combos.filter((combo) => combo.diff <= tolerance);
    const byCount = withinTolerance.length
      ? [...withinTolerance].sort(
          (a, b) =>
            a.totalCount - b.totalCount || a.diff - b.diff || a.totalPrice - b.totalPrice
        )[0]
      : null;

    const selected = byCount || byDiff;
    const panels = selected.counts
      .map((count, index) =>
        count
          ? {
              ...solarPanels[index],
              count,
            }
          : null
      )
      .filter(Boolean);

    return {
      panels,
      targetPower,
      totalPower: selected.totalPower,
      totalPrice: selected.totalPrice,
      diff: selected.diff,
    };
  };

  const handleAddSolarPanel = (panelId, countValue) => {
    const panel = solarPanels.find((item) => item.id === panelId);
    if (!panel) return;
    const count = Math.max(1, Number(countValue) || 1);
    const newItem = {
      type: `Panou solar ${panel.name}`,
      count,
      power: panel.power,
      price: panel.price,
    };

    setPlanProducers((items) => {
      const matchIndex = items.findIndex(
        (item) => item.type === newItem.type && item.power === newItem.power
      );
      if (matchIndex === -1) return [...items, newItem];
      return items.map((item, index) =>
        index === matchIndex ? { ...item, count: item.count + newItem.count } : item
      );
    });
  };

  const solarSuggestion = getSolarSuggestion(planConsumers);

  const handleApplySuggestedPanels = () => {
    if (!solarSuggestion) return;
    solarSuggestion.panels.forEach((panel) => {
      handleAddSolarPanel(panel.id, panel.count);
    });
  };

  const formatPayback = (months) => {
    const roundedMonths = Math.max(1, Math.round(months));
    const years = Math.floor(roundedMonths / 12);
    const remainingMonths = roundedMonths % 12;
    if (years === 0) {
      return `~ ${remainingMonths} ${remainingMonths === 1 ? "luna" : "luni"}`;
    }
    if (remainingMonths === 0) {
      return `~ ${years} ${years === 1 ? "an" : "ani"}`;
    }
    return `~ ${years} ${years === 1 ? "an" : "ani"} si ${remainingMonths} ${
      remainingMonths === 1 ? "luna" : "luni"
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
        payback: "Completeaza costurile si economiile lunare.",
        tenYearSavings: "Completeaza campurile pentru a estima economiile.",
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
      window.alert("Calculeaza ROI inainte de export.");
      return;
    }
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
    batteryOptions,
    distributorOptions: distributorRates.map((item) => item.name),
    distributorRates,
    solarPanels,
    solarSuggestion,
    selectedPanelId,
    selectedPanelCount,
    planProducer,
    planProducerCount,
    planProducerPower,
    planConsumer,
    planConsumerCount,
    planConsumerPower,
    planDistributor,
    planProducers,
    planConsumers,
    planBatteryType,
    planBatteryCount,
    planBatteryCapacity,
    planBatteries,
    planResult,
    planNotice,
    onPlanProducerChange: setPlanProducer,
    onPlanProducerCountChange: setPlanProducerCount,
    onPlanProducerPowerChange: setPlanProducerPower,
    onPlanConsumerChange: setPlanConsumer,
    onPlanConsumerCountChange: setPlanConsumerCount,
    onPlanConsumerPowerChange: setPlanConsumerPower,
    onPlanDistributorChange: setPlanDistributor,
    onPlanBatteryTypeChange: setPlanBatteryType,
    onPlanBatteryCountChange: setPlanBatteryCount,
    onPlanBatteryCapacityChange: setPlanBatteryCapacity,
    onSelectPanel: setSelectedPanelId,
    onPanelCountChange: setSelectedPanelCount,
    onApplySuggestedPanels: handleApplySuggestedPanels,
    onAddSelectedPanel: () => handleAddSolarPanel(selectedPanelId, selectedPanelCount),
    onAddProducer: handleAddProducer,
    onAddConsumer: handleAddConsumer,
    onAddBattery: handleAddBattery,
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
    producers: planProducers,
    consumers: planConsumers,
    batteries: planBatteries,
    distributor: planDistributor,
    onShowAppInfo: () => setActiveView("info-aplicatie"),
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
      <main className={isAuthed ? "dashboard-shell" : "login-shell"}>
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
