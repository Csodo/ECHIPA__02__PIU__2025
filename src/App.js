import { useEffect, useState } from 'react';
import './styles/global.css';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import { distributorRates } from './config/distributors';
import AssistantChat from './components/AssistantChat';
import { exportRoiPdf } from './pages/Calculator/exportRoiPdf';

const batteryCatalog = [
  { id: 'li-5', name: 'Battery 5kWh Li-Ion', capacity: 5, price: 3200 },
  { id: 'lfp-10', name: 'Battery 10kWh LFP', capacity: 10, price: 5700 },
  { id: 'lfp-15', name: 'Battery 15kWh LFP Pro', capacity: 15, price: 8400 },
];

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
  const [monitorPlan, setMonitorPlan] = useState(null);
  const [weatherData, setWeatherData] = useState({
    cloudCover: null,
    isDaytime: true,
    lastUpdated: null,
    hourlyTimes: [],
    hourlyCloud: [],
    dailyTimes: [],
    dailySunrise: [],
    dailySunset: [],
  });
  const [roiInstallCost, setRoiInstallCost] = useState("");
  const [roiPanelCost, setRoiPanelCost] = useState("");
  const [roiBatteryCost, setRoiBatteryCost] = useState("");
  const [roiMonthlySavings, setRoiMonthlySavings] = useState("");
  const [roiMonthlyProduction, setRoiMonthlyProduction] = useState("");
  const [roiResult, setRoiResult] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState('solaris-320');
  const [selectedPanelCount, setSelectedPanelCount] = useState(4);
  const [selectedBatteryId, setSelectedBatteryId] = useState(batteryCatalog[0].id);
  const [selectedBatteryCount, setSelectedBatteryCount] = useState(1);

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
  const LIVE_UPDATE_MS = 2000;
  const WEATHER_REFRESH_MS = 10 * 60 * 1000;
  const CLOUDY_CUTOFF = 70;
  const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=46.770439&longitude=23.591423&daily=sunrise,sunset,daylight_duration&hourly=cloud_cover&timezone=auto';

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

  const handleAddBatteryById = (batteryId, countValue) => {
    const model = batteryCatalog.find((item) => item.id === batteryId);
    if (!model) return;
    const count = Math.max(1, Number(countValue) || 1);
    const newItem = {
      type: model.name,
      count,
      capacity: model.capacity,
      price: model.price,
    };

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

  const handleBatteryTypeChange = (value) => {
    setPlanBatteryType(value);
    const match = batteryCatalog.find((item) => item.name === value);
    if (match) setPlanBatteryCapacity(match.capacity);
  };

  const handleSelectBatteryId = (value) => {
    setSelectedBatteryId(value);
    const match = batteryCatalog.find((item) => item.id === value);
    if (match) {
      setPlanBatteryType(match.name);
      setPlanBatteryCapacity(match.capacity);
    }
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

  const toIsoHourAtTimezone = (timeZone, date = new Date()) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timeZone || undefined,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
      });
      const parts = formatter.formatToParts(date).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:00`;
    } catch (_err) {
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return `${local.toISOString().slice(0, 13)}:00`;
    }
  };

  const getWeatherSnapshot = (data) => {
    const timeZone = data?.timezone || null;
    const hourlyTimes = data?.hourly?.time || [];
    const hourlyCloud = data?.hourly?.cloud_cover || [];
    const localHour = toIsoHourAtTimezone(timeZone);
    let index = hourlyTimes.indexOf(localHour);
    if (index === -1) {
      index = hourlyTimes.findIndex((time) => time.startsWith(localHour.slice(0, 13)));
    }
    const cloudCover = index >= 0 ? Number(hourlyCloud[index]) : null;

    const dailyTimes = data?.daily?.time || [];
    const dayIndex = dailyTimes.indexOf(localHour.slice(0, 10));
    let isDaytime = true;
    if (dayIndex >= 0) {
      const sunrise = data?.daily?.sunrise?.[dayIndex];
      const sunset = data?.daily?.sunset?.[dayIndex];
      if (sunrise && sunset) {
        isDaytime = localHour >= sunrise && localHour <= sunset;
      }
    }

    return {
      cloudCover: Number.isFinite(cloudCover) ? cloudCover : null,
      isDaytime,
      lastUpdated: new Date().toISOString(),
      hourlyTimes,
      hourlyCloud,
      dailyTimes,
      dailySunrise: data?.daily?.sunrise || [],
      dailySunset: data?.daily?.sunset || [],
      timezone: timeZone,
    };
  };

  useEffect(() => {
    let isActive = true;

    const fetchWeather = async () => {
      try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) return;
        const data = await response.json();
        if (!isActive) return;
        setWeatherData(getWeatherSnapshot(data));
      } catch (error) {
      }
    };

    fetchWeather();
    const timer = setInterval(fetchWeather, WEATHER_REFRESH_MS);
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, []);

  const isSolarProducer = (item) => {
    const type = `${item?.type || ''}`.toLowerCase();
    return type.includes('panou solar') || type.includes('panouri solare');
  };

  const getSolarFactor = (weather) => {
    if (!weather?.isDaytime) return 0;
    const cloudCover = Number(weather?.cloudCover);
    if (!Number.isFinite(cloudCover)) return 1;
    if (cloudCover >= CLOUDY_CUTOFF) return 0;
    return Math.max(0, 1 - cloudCover / 100);
  };

  const getProductionAlert = (producedValue, producers, weather) => {
    if (producedValue > 0.01) return null;
    if (!producers.length) return 'Nu se produce: nu exista producatori configurati.';
    const activeProducers = producers.filter((item) => item.isOn);
    if (!activeProducers.length) return 'Nu se produce: toti producatorii sunt opriti.';
    const basePower = activeProducers.reduce(
      (sum, item) => sum + Number(item.count) * Number(item.power),
      0,
    );
    if (basePower <= 0) return 'Nu se produce: puterea configurata este 0.';
    const activeSolar = activeProducers.filter((item) => isSolarProducer(item));
    const activeNonSolar = activeProducers.filter((item) => !isSolarProducer(item));
    if (!activeNonSolar.length && activeSolar.length) {
      if (weather?.isDaytime === false) {
        return 'Nu se produce: este noapte, panourile solare nu produc.';
      }
      const cloudCover = Number(weather?.cloudCover);
      if (Number.isFinite(cloudCover) && cloudCover >= CLOUDY_CUTOFF) {
        return `Nu se produce: este innorat (cloud_cover ${Math.round(
          cloudCover,
        )}%), productia solara este 0.`;
      }
      if (Number.isFinite(cloudCover)) {
        return `Nu se produce: productia solara este foarte mica (cloud_cover ${Math.round(
          cloudCover,
        )}%).`;
      }
      return 'Nu se produce: nu sunt date meteo disponibile.';
    }
    return 'Nu se produce: productia curenta este 0.';
  };

  const getHourlySolarFactors = (hours, weather) => {
    const hourlyTimes = weather?.hourlyTimes || [];
    const hourlyCloud = weather?.hourlyCloud || [];
    const dailyTimes = weather?.dailyTimes || [];
    const dailySunrise = weather?.dailySunrise || [];
    const dailySunset = weather?.dailySunset || [];
    const timeZone = weather?.timezone || null;
    if (!hourlyTimes.length || !hourlyCloud.length) return null;

    const startIso = toIsoHourAtTimezone(timeZone);
    let startIndex = hourlyTimes.indexOf(startIso);
    if (startIndex === -1) {
      startIndex = hourlyTimes.findIndex((time) => time.startsWith(startIso.slice(0, 13)));
    }
    if (startIndex === -1) return null;

    const factors = [];
    for (let offset = 0; offset < hours; offset += 1) {
      const idx = startIndex + offset;
      const hourTime = hourlyTimes[idx];
      if (!hourTime) break;
      const cloudCover = Number(hourlyCloud[idx]);
      const dayIndex = dailyTimes.indexOf(hourTime.slice(0, 10));
      let isDaytime = true;
      if (dayIndex >= 0 && dailySunrise[dayIndex] && dailySunset[dayIndex]) {
        const sunrise = dailySunrise[dayIndex];
        const sunset = dailySunset[dayIndex];
        isDaytime = hourTime >= sunrise && hourTime <= sunset;
      }

      let factor = 1;
      if (!isDaytime) {
        factor = 0;
      } else if (Number.isFinite(cloudCover)) {
        if (cloudCover >= CLOUDY_CUTOFF) {
          factor = 0;
        } else {
          factor = Math.max(0, 1 - cloudCover / 100);
        }
      }
      factors.push(factor);
    }

    return factors;
  };

  const buildPredictionTotals = (hours, plan, weather) => {
    if (!plan) return null;
    const activeProducers = plan.producers.filter((item) => item.isOn);
    const activeConsumers = plan.consumers.filter((item) => item.isOn);
    const baseSolarPower = activeProducers
      .filter((item) => isSolarProducer(item))
      .reduce((sum, item) => sum + Number(item.count) * Number(item.power), 0);
    const baseOtherPower = activeProducers
      .filter((item) => !isSolarProducer(item))
      .reduce((sum, item) => sum + Number(item.count) * Number(item.power), 0);
    const baseConsumerPower = activeConsumers.reduce(
      (sum, item) => sum + Number(item.count) * Number(item.power),
      0,
    );

    const fallbackFactor = getSolarFactor(weather);
    const hourlyFactors = getHourlySolarFactors(hours, weather);
    let solarTotal = 0;
    for (let hour = 0; hour < hours; hour += 1) {
      const factor = hourlyFactors?.[hour] ?? fallbackFactor;
      solarTotal += baseSolarPower * factor;
    }

    const production = baseOtherPower * hours + solarTotal;
    const consumption = baseConsumerPower * hours;
    return {
      hours,
      production: Number(production.toFixed(2)),
      consumption: Number(consumption.toFixed(2)),
    };
  };

  const getLiveMultiplier = (group) => {
    const range =
      group === 'producers'
        ? [0.85, 1.05]
        : group === 'consumers'
          ? [0.7, 1.1]
          : [0.9, 1.05];
    return range[0] + Math.random() * (range[1] - range[0]);
  };

  const getLivePower = (basePower, group, factor = 1) => {
    const safeBase = Math.max(0, Number(basePower) || 0);
    const safeFactor = Number.isFinite(factor) ? factor : 1;
    const scaledBase = safeBase * safeFactor;
    if (scaledBase <= 0) return 0;
    return Number((scaledBase * getLiveMultiplier(group)).toFixed(2));
  };

  const buildLiveItems = (items, previousItems = [], group) =>
    items.map((item) => {
      const match = previousItems.find(
        (prevItem) => prevItem.type === item.type && prevItem.power === item.power,
      );
      const isOn = match?.isOn ?? true;
      const basePower = Number(item.count) * Number(item.power);
      const factor =
        group === 'producers' && isSolarProducer(item) ? getSolarFactor(weatherData) : 1;
      const currentPower = isOn ? getLivePower(basePower, group, factor) : 0;
      return {
        ...item,
        isOn,
        currentPower,
      };
    });

  const buildMonitorMetrics = (
    producers,
    consumers,
    batteries = [],
    previousCharge = 0,
    capacityHint = 0
  ) => {
    const safeBatteries = Array.isArray(batteries) ? batteries : [];
    const totalProducerPower = producers.reduce(
      (sum, item) =>
        sum + (item.isOn ? item.currentPower ?? item.count * item.power : 0),
      0,
    );
    const totalConsumerPower = consumers.reduce(
      (sum, item) =>
        sum + (item.isOn ? item.currentPower ?? item.count * item.power : 0),
      0,
    );
    const produced = Math.max(0, totalProducerPower);
    const consumed = Math.max(0, totalConsumerPower);
    const totalCapacityFromArray = Math.max(
      0,
      safeBatteries.reduce(
        (sum, item) =>
          sum + (Number(item.count) || 0) * (Number(item.capacity) || 0),
        0
      ) || 0
    );
    const totalCapacity = Math.max(totalCapacityFromArray, Number(capacityHint) || 0);
    const activeCapacity = Math.max(
      0,
      safeBatteries
        .filter((item) => item.isOn)
        .reduce(
          (sum, item) =>
            sum + (Number(item.count) || 0) * (Number(item.capacity) || 0),
          0
        ) || 0
    );
    let currentCharge = Math.min(totalCapacity, Math.max(0, Number(previousCharge) || 0));
    const flowNotes = [];
    let gridExport = 0;
    let gridImport = 0;
    let batteryDelta = 0;

    const hasBattery = totalCapacity > 0;
    const batteriesConnected = activeCapacity > 0;

    if (!hasBattery) {
      if (produced > consumed) {
        gridExport = produced - consumed;
        flowNotes.push('Nu exista baterie, surplusul merge direct in retea.');
      } else if (consumed > produced) {
        gridImport = consumed - produced;
        flowNotes.push('Nu exista baterie, deficitul este acoperit din retea.');
      } else {
        flowNotes.push('Nu exista baterie, productia acopera consumul.');
      }
    } else if (!batteriesConnected) {
      if (produced > consumed) {
        gridExport = produced - consumed;
        flowNotes.push('Bateriile sunt oprite: surplusul merge direct in retea.');
      } else if (consumed > produced) {
        gridImport = consumed - produced;
        flowNotes.push('Bateriile sunt oprite: deficitul este acoperit din retea.');
      } else {
        flowNotes.push('Bateriile sunt oprite: productia acopera consumul.');
      }
    } else {
      if (produced > consumed) {
        const surplus = produced - consumed;
        const room = Math.max(0, activeCapacity - currentCharge);
        const toBattery = Math.min(surplus, room);
        currentCharge += toBattery;
        batteryDelta = toBattery;
        gridExport = surplus - toBattery;

        if (room <= 0) {
          flowNotes.push('Bateria este plina, surplusul merge in retea.');
        } else {
          flowNotes.push(
            `Surplus de ${surplus.toFixed(2)} kWh: incarcam bateria cu ${toBattery.toFixed(2)} kWh.`
          );
          if (gridExport > 0) {
            flowNotes.push(
              `Dupa incarcare, ${gridExport.toFixed(2)} kWh merg in retea.`
            );
          }
        }
      } else if (consumed > produced) {
        const deficit = consumed - produced;
        const fromBattery = Math.min(deficit, currentCharge);
        currentCharge -= fromBattery;
        batteryDelta = -fromBattery;
        gridImport = deficit - fromBattery;

        if (fromBattery === 0) {
          flowNotes.push(
            `Bateria este goala, ${gridImport.toFixed(2)} kWh vin din retea.`
          );
        } else {
          flowNotes.push(
            `Deficit de ${deficit.toFixed(2)} kWh: descarcam bateria cu ${fromBattery.toFixed(2)} kWh.`
          );
          if (gridImport > 0) {
            flowNotes.push(
              `Restul de ${gridImport.toFixed(2)} kWh vine din retea.`
            );
          }
        }
      } else {
        flowNotes.push('Productia acopera consumul, nu sunt transferuri suplimentare.');
      }
    }

    const gridFlow = gridExport - gridImport; // >0 export, <0 import
    const gridLabel =
      gridFlow >= 0
        ? `${gridFlow.toFixed(2)} kWh spre retea`
        : `${gridFlow.toFixed(2)} kWh din retea`;
    const productionAlert = getProductionAlert(produced, producers, weatherData);

    return {
      productionCurrent: produced.toFixed(2),
      consumptionCurrent: consumed.toFixed(2),
      batteryStorage: currentCharge.toFixed(2),
      batteryDelta:
        batteryDelta === 0
          ? '0.00'
          : `${batteryDelta > 0 ? '+' : ''}${batteryDelta.toFixed(2)}`,
      gridDelivered: gridFlow.toFixed(2),
      gridLabel,
      flowExplanation: flowNotes.join(' '),
      productionAlert,
    };
  };

  useEffect(() => {
    const hasPlanData =
      planProducers.length > 0 || planConsumers.length > 0 || planBatteries.length > 0;
    if (!hasPlanData) {
      setMonitorPlan(null);
      return;
    }

    setMonitorPlan((current) => {
      const producers = buildLiveItems(planProducers, current?.producers, 'producers');
      const consumers = buildLiveItems(planConsumers, current?.consumers, 'consumers');
      const batteries = planBatteries.map((item) => {
        const match = current?.batteries?.find(
          (prev) => prev.type === item.type && prev.capacity === item.capacity
        );
        return { ...item, isOn: match?.isOn ?? true };
      });
      const totalCapacity = batteries.reduce(
        (sum, item) => sum + item.count * item.capacity,
        0,
      );
      const previousCharge = Math.min(
        totalCapacity,
        Math.max(0, current?.batteryCharge ?? 0)
      );
      const metrics = buildMonitorMetrics(
        producers,
        consumers,
        batteries,
        previousCharge,
        totalCapacity
      );

      return {
        producers,
        consumers,
        batteries,
        batteryCapacityTotal: totalCapacity,
        batteryCharge: Number(metrics.batteryStorage) || 0,
        metrics,
      };
    });
  }, [planProducers, planConsumers, planBatteries, weatherData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMonitorPlan((current) => {
        if (!current) return current;
        const producers = buildLiveItems(current.producers, current.producers, 'producers');
        const consumers = buildLiveItems(current.consumers, current.consumers, 'consumers');
        const metrics = buildMonitorMetrics(
          producers,
          consumers,
          current.batteries || [],
          current.batteryCharge || 0,
          current.batteryCapacityTotal || 0
        );
        return {
          ...current,
          producers,
          consumers,
          batteryCharge: Number(metrics.batteryStorage) || 0,
          metrics,
        };
      });
    }, LIVE_UPDATE_MS);

    return () => clearInterval(timer);
  }, [weatherData]);

  const handleToggleMonitorItem = (group, index) => {
    setMonitorPlan((current) => {
      if (!current) return current;
      const updatedItems = current[group].map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const nextIsOn = !item.isOn;
        const basePower = Number(item.count) * Number(item.power);
        const factor =
          group === 'producers' && isSolarProducer(item) ? getSolarFactor(weatherData) : 1;
        return {
          ...item,
          isOn: nextIsOn,
          currentPower: nextIsOn ? getLivePower(basePower, group, factor) : 0,
        };
      });
      const updated = {
        ...current,
        [group]: updatedItems,
      };
      const metrics = buildMonitorMetrics(
        updated.producers,
        updated.consumers,
        updated.batteries || [],
        current?.batteryCharge || 0,
        current?.batteryCapacityTotal || 0
      );

      return {
        ...updated,
        batteryCharge: Number(metrics.batteryStorage) || 0,
        metrics,
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

  const getBatterySuggestion = (producers, consumers) => {
    const totalProducerPower = producers.reduce((sum, item) => sum + item.count * item.power, 0);
    const totalConsumerPower = consumers.reduce((sum, item) => sum + item.count * item.power, 0);
    const netSurplus = totalProducerPower - totalConsumerPower;
    if (netSurplus <= 0.2) return null; // nu recomandam daca nu exista surplus

    const targetStorage = Math.min(30, Math.max(2, netSurplus * 4)); // ~4h de surplus
    const maxCount = 6;

    const combos = [];
    const counts = new Array(batteryCatalog.length).fill(0);

    const buildCombos = (index, totalCount, totalCapacity, totalPrice) => {
      if (index === batteryCatalog.length) {
        if (totalCount === 0) return;
        combos.push({
          counts: [...counts],
          totalCount,
          totalCapacity,
          totalPrice,
          diff: Math.abs(targetStorage - totalCapacity),
        });
        return;
      }

      const battery = batteryCatalog[index];
      for (let count = 0; count <= maxCount; count += 1) {
        counts[index] = count;
        buildCombos(
          index + 1,
          totalCount + count,
          totalCapacity + count * battery.capacity,
          totalPrice + count * battery.price
        );
      }
    };

    buildCombos(0, 0, 0, 0);
    const valid = combos.filter((c) => c.totalCapacity > 0);
    if (!valid.length) return null;

    const best = [...valid].sort(
      (a, b) => a.diff - b.diff || a.totalCount - b.totalCount || a.totalPrice - b.totalPrice
    )[0];

    const batteries = best.counts
      .map((count, index) =>
        count
          ? {
              ...batteryCatalog[index],
              count,
            }
          : null
      )
      .filter(Boolean);

    return {
      batteries,
      targetStorage,
      totalCapacity: best.totalCapacity,
      totalPrice: best.totalPrice,
      diff: best.diff,
    };
  };

  const batterySuggestion = getBatterySuggestion(planProducers, planConsumers);

  const handleApplySuggestedBatteries = () => {
    if (!batterySuggestion) return;
    batterySuggestion.batteries.forEach((battery) => {
      handleAddBatteryById(battery.id, battery.count);
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
    batteryCatalog,
    batterySuggestion,
    selectedBatteryId,
    selectedBatteryCount,
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
    onPlanProducerChange: setPlanProducer,
    onPlanProducerCountChange: setPlanProducerCount,
    onPlanProducerPowerChange: setPlanProducerPower,
    onPlanConsumerChange: setPlanConsumer,
    onPlanConsumerCountChange: setPlanConsumerCount,
    onPlanConsumerPowerChange: setPlanConsumerPower,
    onPlanDistributorChange: setPlanDistributor,
    onPlanBatteryTypeChange: handleBatteryTypeChange,
    onPlanBatteryCountChange: setPlanBatteryCount,
    onPlanBatteryCapacityChange: setPlanBatteryCapacity,
    onSelectPanel: setSelectedPanelId,
    onPanelCountChange: setSelectedPanelCount,
    onApplySuggestedPanels: handleApplySuggestedPanels,
    onAddSelectedPanel: () => handleAddSolarPanel(selectedPanelId, selectedPanelCount),
    onSelectBattery: handleSelectBatteryId,
    onBatteryCountChange: setSelectedBatteryCount,
    onApplySuggestedBatteries: handleApplySuggestedBatteries,
    onAddSelectedBattery: () => handleAddBatteryById(selectedBatteryId, selectedBatteryCount),
    onAddProducer: handleAddProducer,
    onAddConsumer: handleAddConsumer,
    onAddBattery: handleAddBattery,
    onCalculatePlan: handleCalculatePlan,
    onResetPlan: handleResetPlan,
  };

  const monitorProps = {
    monitorPlan,
    onToggleItem: handleToggleMonitorItem,
    onShowPrediction: () => setActiveView('predictie'),
  };

  const predictionData = monitorPlan
    ? {
        sixHours: buildPredictionTotals(6, monitorPlan, weatherData),
        twelveHours: buildPredictionTotals(12, monitorPlan, weatherData),
        twentyFourHours: buildPredictionTotals(24, monitorPlan, weatherData),
      }
    : null;

  const predictionProps = {
    predictionData,
    weatherUpdatedAt: weatherData.lastUpdated,
    onBackToMonitor: () => setActiveView('monitorizare'),
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
            predictionProps={predictionProps}
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
      {isAuthed && <AssistantChat />}
    </div>
  );
}

export default App;
