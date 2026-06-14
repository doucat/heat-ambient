import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  Battery,
  Brain,
  Check,
  Dice5,
  Droplets,
  Flame,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Skull,
  Soup,
  Sun,
  Timer,
  Volume2,
  Wallet,
  Zap
} from 'lucide-react';
import './styles.css';
import { branchLabels, getCurrentEvent, rollSuddenEvent } from './gameData';

const turns = ['早晨', '中午', '傍晚'];
const BAD_TEMP = 46;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const applyTemp = (temp, delta) => Number(clamp(temp + delta, 36, 60).toFixed(1));
const cleanSuddenTitle = (title) => title.replace(/^突发：/, '');
const endSentence = (text) => /[。！？]$/.test(text) ? text : `${text}。`;
const splitCheckReason = (reason, success) => {
  const parts = reason.split(/；失败/);
  if (parts.length < 2 || !parts[0].startsWith('成功')) {
    return reason;
  }
  const successText = parts[0].replace(/^成功/, '').trim();
  const failText = parts.slice(1).join('；失败').replace(/^失败/, '').trim();
  return success ? `成功：${endSentence(successText)}` : `失败：${endSentence(failText)}`;
};

const iconMap = {
  AlertTriangle,
  Battery,
  Brain,
  Check,
  Dice5,
  Droplets,
  Flame,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Skull,
  Soup,
  Sun,
  Timer,
  Volume2,
  Wallet,
  Zap
};

function makeInitialState(challengeDays = 10, started = false) {
  return {
    started,
    challengeDays,
    day: 1,
    turn: 0,
    temp: 40,
    water: 42,
    body: 44,
    mind: 42,
    morale: 45,
    money: 23,
    power: 31,
    flags: {},
    status: 'playing',
    lastRoll: null,
    lastSudden: null,
    eventSalt: Math.random(),
    seenEvents: [],
    lastOutcome: `热线接通。请在 ${challengeDays} 天里保持体温不超过 46°C，并尽量不要和太阳争辩。`,
    log: [
      {
        day: 1,
        turn: '早晨',
        text: '你醒来时窗帘已经热得像在辞职。高温热线建议：先活着。',
        delta: 0
      }
    ]
  };
}

function statBonus(state, stat) {
  const table = {
    body: state.body,
    mind: state.mind,
    wit: Math.round((state.mind + state.morale) / 2),
    guts: Math.round((state.body + state.morale) / 2),
    luck: 50 + (state.flags.shopFriend ? 6 : 0) + (state.flags.badReputation ? -5 : 0)
  };
  return Math.floor((table[stat] - 30) / 12);
}

function resolveChoice(state, choice) {
  let next = structuredClone(state);
  if (!canAfford(next, choice).ok) {
    return next;
  }
  const day = next.day;
  const turn = turns[next.turn];
  let tempDelta = choice.temp ?? 0;
  let result = '';
  let rollInfo = null;
  let success = null;

  if (choice.check) {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    const bonus = statBonus(next, choice.check.stat);
    const total = d1 + d2 + bonus;
    success = total >= choice.check.target;
    tempDelta += success ? choice.check.successTemp : choice.check.failTemp;
    rollInfo = {
      dice: [d1, d2],
      bonus,
      total,
      target: choice.check.target,
      stat: choice.check.stat,
      success
    };
    result = success ? '检定成功' : '检定失败';
  }

  if (choice.conditional) {
    const hasFlag = Boolean(next.flags[choice.conditional.flag]);
    tempDelta += hasFlag ? choice.conditional.temp : choice.conditional.fallbackTemp;
    result = hasFlag ? '支线生效' : '支线缺失';
  }

  if (choice.dynamic === 'cashIce') {
    const spend = Math.min(next.money, 18);
    next.money -= spend;
    tempDelta += spend >= 12 ? -1.7 : spend >= 6 ? -0.9 : 0.4;
    result = spend >= 12 ? '豪华冰块' : spend >= 6 ? '半份冰块' : '余额尴尬';
  }

  if (choice.tempTo !== undefined) {
    tempDelta = Number((choice.tempTo - next.temp).toFixed(1));
  }

  const resourceHeat = choice.tempTo === undefined && next.water + (choice.water ?? 0) <= 0 ? 1.2 : 0;
  tempDelta += resourceHeat;

  next.temp = choice.tempTo !== undefined ? Number(choice.tempTo.toFixed(1)) : applyTemp(next.temp, tempDelta);
  next.water = clamp(next.water + (choice.water ?? 0) - 2, 0, 100);
  next.body = clamp(next.body + (choice.body ?? 0) - (tempDelta > 0.8 ? 3 : 1), 0, 100);
  next.mind = clamp(next.mind + (choice.mind ?? 0) - (next.turn === 1 ? 2 : 1), 0, 100);
  next.morale = clamp(next.morale + (choice.morale ?? 0), 0, 100);
  next.money = clamp(next.money + (choice.money ?? 0), 0, 99);
  next.power = clamp(next.power + (choice.power ?? 0), 0, 100);

  if (choice.fullRestore) {
    next.water = 99;
    next.power = 99;
    next.money = 99;
    next.mind = 99;
    next.body = 99;
  }

  if (choice.flag) {
    next.flags[choice.flag] = true;
  }

  next.seenEvents = Array.from(new Set([...(next.seenEvents ?? []), choice.eventKey].filter(Boolean)));
  next.currentEventIsWenwen = Boolean(choice.eventIsWenwen);

  const tempText = tempDelta > 0 ? `体温 +${tempDelta.toFixed(1)}°C` : `体温 ${tempDelta.toFixed(1)}°C`;
  const resourceNote = resourceHeat > 0 ? ' 资源不足让身体额外升温。' : '';
  const reasonText = choice.check ? splitCheckReason(choice.reason, success) : choice.reason;
  next.lastRoll = rollInfo;
  next.lastSudden = null;
  next.lastOutcome = `${result ? `${result}。` : ''}${tempText}。${reasonText}${resourceNote}`;
  next.log.unshift({
    day,
    turn,
    text: `选择「${choice.text}」：${next.lastOutcome}`,
    delta: tempDelta
  });

  const sudden = rollSuddenEvent(next);
  if (sudden) {
    next.temp = sudden.tempTo !== undefined ? Number(sudden.tempTo.toFixed(1)) : applyTemp(next.temp, sudden.temp ?? 0);
    next.water = clamp(next.water + (sudden.water ?? 0), 0, 100);
    next.body = clamp(next.body + (sudden.body ?? 0), 0, 100);
    next.mind = clamp(next.mind + (sudden.mind ?? 0), 0, 100);
    next.morale = clamp(next.morale + (sudden.morale ?? 0), 0, 100);
    next.money = clamp(next.money + (sudden.money ?? 0), 0, 99);
    next.power = clamp(next.power + (sudden.power ?? 0), 0, 100);
    if (sudden.fullRestore) {
      next.water = 99;
      next.power = 99;
      next.money = 99;
      next.mind = 99;
      next.body = 99;
    }
    next.lastSudden = `${cleanSuddenTitle(sudden.title)}：${sudden.text}`;
    next.log.unshift({
      day,
      turn: '突发',
      text: `${sudden.title}：${sudden.text}`,
      delta: sudden.temp ?? 0
    });
  }

  if (next.temp > BAD_TEMP) {
    next.status = 'bad';
    next.lastSudden = null;
    next.lastOutcome = `坏结局：体温达到 ${next.temp.toFixed(1)}°C。你成为高温热线培训教材里的反面案例。`;
    return next;
  }

  if (next.day === next.challengeDays && next.turn === 2) {
    next.status = 'good';
    next.lastSudden = null;
    next.lastOutcome = `好结局：你撑过了 ${next.challengeDays} 天。传说中的晚风来了，虽然它像二手空调，但你活下来了。`;
    return next;
  }

  if (next.turn === 2) {
    next.day += 1;
    next.turn = 0;
    const nightRecovery = next.flags.roofAlliance ? -0.4 : -0.2;
    const nightPenalty =
      (next.water < 10 ? 0.7 : 0) +
      (next.power < 6 ? 0.5 : 0) +
      (next.mind < 15 ? 0.4 : 0);
    const nightDelta = Number((nightRecovery + nightPenalty).toFixed(1));
    next.temp = applyTemp(next.temp, nightDelta);
    next.log.unshift({
      day: next.day,
      turn: '夜间',
      text: `夜间结算：基础降温 ${nightRecovery.toFixed(1)}°C${nightPenalty ? `，资源不足额外升温 +${nightPenalty.toFixed(1)}°C` : ''}。水、电、精神都会影响睡眠散热。`,
      delta: nightDelta
    });
  } else {
    next.turn += 1;
  }

  next.eventSalt = Math.random();

  return next;
}

function canAfford(state, choice) {
  if (choice.alwaysAvailable) {
    return { ok: true, reason: '' };
  }
  if (choice.requiresFlag && !state.flags[choice.requiresFlag]) {
    return { ok: false, reason: `需要支线：${branchLabels[choice.requiresFlag] ?? choice.requiresFlag}` };
  }
  const req = choice.requires ?? {};
  const labels = {
    money: '现金',
    water: '水分',
    power: '电力',
    mind: '精神',
    body: '体力'
  };
  for (const [key, value] of Object.entries(req)) {
    if ((state[key] ?? 0) < value) {
      return { ok: false, reason: `${labels[key] ?? key}不足，需要 ${value}` };
    }
  }
  return { ok: true, reason: '' };
}

function getFallbackChoice(event) {
  return {
    text: '硬撑到下一时段',
    icon: 'AlertTriangle',
    detail: '所有方案都缺资源时可用。',
    alwaysAvailable: true,
    temp: 1.1,
    mind: -5,
    body: -4,
    reason: `你没有足够资源处理「${event.title}」，只能原地硬撑。暴露在热浪里会升温，精神和体力也被消耗。`
  };
}

function Thermometer({ temp }) {
  const percent = clamp(((temp - 38) / 10) * 100, 0, 100);
  return (
    <div className="thermo-wrap">
      <div className="temp-readout">{temp.toFixed(1)}<span>°C</span></div>
      <div className="thermo-scale" aria-label={`当前体温 ${temp.toFixed(1)} 摄氏度`}>
        <div className="danger-line" />
        <div className="thermo-fill" style={{ height: `${percent}%` }} />
      </div>
      <div className="scale-labels">
        <span>50°</span>
        <strong>46° 危险线</strong>
        <span>42°</span>
        <span>38°</span>
      </div>
    </div>
  );
}

function Resource({ icon: Icon, label, value, max = 100, prefix = '', suffix = '' }) {
  return (
    <div className="resource">
      <div className="resource-head">
        <Icon size={18} />
        <span>{label}</span>
        <b>{prefix}{value}{suffix}</b>
      </div>
      <div className="bar"><i style={{ width: `${clamp((value / max) * 100, 0, 100)}%` }} /></div>
    </div>
  );
}

function ChoiceButton({ choice, index, onChoose, disabled, disabledReason }) {
  const Icon = iconMap[choice.icon] ?? AlertTriangle;
  return (
    <button className="choice" onClick={() => onChoose(choice)} disabled={disabled}>
      <span className="choice-num">{index + 1}</span>
      <span className="choice-copy">
        <b>{choice.text}</b>
        {disabled && <small>{disabledReason}</small>}
      </span>
      <Icon size={28} strokeWidth={2.5} />
    </button>
  );
}

function StartScreen({ onStart, onToggleSound, soundOn }) {
  const options = [
    { days: 10, label: '10 天', note: '短篇热浪，适合快速被太阳教育。' },
    { days: 30, label: '30 天', note: '中篇求生，资源管理开始长出牙齿。' },
    { days: 90, label: '90 天', note: '长线末日，事件池全开，汗腺需要年假。' }
  ];

  return (
    <main className="app start-app">
      <section className="start-panel">
        <div className="start-art">
          <img src="/assets/heat-apocalypse-scene.jpg" alt="高温末日漫画场景" />
        </div>
        <div className="start-copy">
          <span className="stamp">生存调度中心</span>
          <h1>高温热线</h1>
          <p>选择你的生存挑战。目标很朴素：别让体温超过 46°C，也别和太阳讲道理。</p>
          <div className="story-brief">
            <b>故事背景</b>
            <p>连续热穹顶把城市扣成一口透明高压锅，湿球温度逼近人体散热极限，汗水开始怀疑自己的职业规划。电网被空调压到喘不过气，柏油路释放白天存下的热量，夜晚也像二次加热的外卖。官方把这叫“极端复合热事件”，居民把它叫“太阳终于疯了”。</p>
          </div>
          <div className="challenge-grid">
            {options.map((option) => (
              <button key={option.days} className="challenge-card" onClick={() => onStart(option.days)}>
                <b>{option.label}</b>
                <span>{option.note}</span>
              </button>
            ))}
          </div>
          <button className={`sound-toggle start-sound ${soundOn ? 'active' : ''}`} onClick={onToggleSound}>
            <Volume2 size={18} />
            {soundOn ? '关闭声音' : '开启声音'}
          </button>
        </div>
      </section>
    </main>
  );
}

function createAudioEngine() {
  if (typeof document === 'undefined') return null;
  const ambient = document.createElement('audio');
  ambient.src = '/assets/audio/heat-ambient.m4a';
  ambient.loop = true;
  ambient.volume = 0.48;
  const wenwen = document.createElement('audio');
  wenwen.src = '/assets/audio/wenwen.wav';
  wenwen.loop = true;
  wenwen.volume = 0.62;
  const clickSound = document.createElement('audio');
  clickSound.src = '/assets/audio/button-click.wav';
  clickSound.volume = 0.58;
  let enabled = false;
  let wenwenMode = false;

  const activeTrack = () => wenwenMode ? wenwen : ambient;
  const inactiveTrack = () => wenwenMode ? ambient : wenwen;

  return {
    async start() {
      if (!enabled) return;
      inactiveTrack().pause();
      await activeTrack().play().catch(() => {});
    },
    setEnabled(nextEnabled) {
      enabled = Boolean(nextEnabled);
      ambient.muted = !enabled;
      wenwen.muted = !enabled;
      clickSound.muted = !enabled;
      if (!enabled) {
        ambient.pause();
        wenwen.pause();
      } else {
        this.start();
      }
    },
    setWenwenMode(active) {
      const nextMode = Boolean(active);
      if (nextMode === wenwenMode) return;
      const from = activeTrack();
      wenwenMode = nextMode;
      const to = activeTrack();
      from.pause();
      to.currentTime = 0;
      if (enabled) to.play().catch(() => {});
    },
    click() {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  };
}

function App() {
  const [state, setState] = useState(() => makeInitialState(10, false));
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const event = state.started ? getCurrentEvent(state) : null;
  const finished = state.status !== 'playing';
  const choiceAffordability = event ? event.choices.map((choice) => canAfford(state, choice)) : [];
  const allChoicesBlocked = !finished && choiceAffordability.every((afford) => !afford.ok);
  const sceneImage = event?.title.includes('文文') || state.lastSudden?.includes('文文')
    ? '/assets/wenwen-fairy-scene.jpg'
    : '/assets/heat-apocalypse-scene.jpg';
  const wenwenActive = sceneImage.includes('wenwen');

  useEffect(() => {
    audioRef.current?.setWenwenMode(wenwenActive);
  }, [wenwenActive]);

  const ensureAudio = async () => {
    if (!audioRef.current) {
      audioRef.current = createAudioEngine();
      audioRef.current?.setWenwenMode(wenwenActive);
    }
    if (audioRef.current) {
      await audioRef.current.start();
      audioRef.current.setEnabled(true);
      setSoundOn(true);
    }
  };

  const playClick = async () => {
    if (!audioRef.current) {
      await ensureAudio();
      audioRef.current?.click();
      return;
    }
    if (soundOn) {
      audioRef.current.click();
    }
  };

  const choose = async (choice) => {
    if (finished) return;
    await playClick();
    setState((prev) => resolveChoice(prev, choice));
  };

  const startChallenge = async (days) => {
    await playClick();
    setState(makeInitialState(days, true));
  };

  const reset = async () => {
    await playClick();
    setState(makeInitialState(state.challengeDays, true));
  };

  const toggleSound = async () => {
    if (!audioRef.current) {
      await ensureAudio();
      audioRef.current?.setEnabled(true);
      audioRef.current?.click();
      setSoundOn(true);
      return;
    }
    const next = !soundOn;
    audioRef.current.setEnabled(next);
    if (next) await audioRef.current.start();
    if (next) audioRef.current.click();
    setSoundOn(next);
  };

  if (!state.started) {
    return <StartScreen onStart={startChallenge} onToggleSound={toggleSound} soundOn={soundOn} />;
  }

  return (
    <main className="app">
      <section className="layout">
        <aside className="panel choices-panel">
          <div className="event-head">
            <div>
              <span>事件：{event.title}</span>
              <p className="event-scene-copy">{event.scene}</p>
            </div>
          </div>

          <div className="choices">
            {finished ? (
              <div className={`ending ${state.status}`}>
                {state.status === 'good' ? <Check size={42} /> : <Skull size={42} />}
                <h2>{state.status === 'good' ? '好结局' : '坏结局'}</h2>
                <p>{state.lastOutcome}</p>
              </div>
            ) : (
              event.choices.map((choice, index) => {
                const afford = canAfford(state, choice);
                return (
                  <ChoiceButton
                    key={choice.text}
                    choice={{ ...choice, eventKey: event.key, eventIsWenwen: event.title.includes('文文') }}
                    index={index}
                    onChoose={choose}
                    disabled={!afford.ok}
                    disabledReason={afford.reason}
                  />
                );
              })
            )}
            {allChoicesBlocked && (
              <ChoiceButton
                choice={{ ...getFallbackChoice(event), eventKey: event.key, eventIsWenwen: event.title.includes('文文') }}
                index={event.choices.length}
                onChoose={choose}
              />
            )}
          </div>
          <div className="outcome-panel">
            <div>
              <Volume2 size={22} />
              <b>结果说明</b>
            </div>
            <p>{state.lastOutcome}</p>
          </div>
        </aside>

        <section className="panel event-panel">
          <div className={`scene ${wenwenActive ? 'scene-cold' : 'scene-hot'}`}>
            <img src={sceneImage} alt="高温末日漫画场景" />
            <div className="scene-effect" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            {state.lastSudden && (
              <div className="sudden-bubble">
                <b>突发事件</b>
                <p>{state.lastSudden}</p>
              </div>
            )}
          </div>
          <section className="day-card side-day-card">
            <b>DAY {String(state.day).padStart(2, '0')} / {state.challengeDays}</b>
            <div className="turn-track">
              {turns.map((label, index) => (
                <span key={label} className={index < state.turn ? 'done' : index === state.turn ? 'active' : ''}>
                  {label}
                </span>
              ))}
            </div>
          </section>
        </section>
      </section>

      <section className="bottom-hud">
        <section className="panel survival top-survival bottom-survival">
          <div className="panel-title">
            <Gauge size={22} />
            <b>生存状态</b>
            <span>别硬撑</span>
            <div className="survival-actions">
              <button className="reset" onClick={reset} aria-label="重新开始" title="重新开始">
                <RotateCcw size={18} />
              </button>
              <button className={`sound-toggle ${soundOn ? 'active' : ''}`} onClick={toggleSound} aria-label={soundOn ? '关闭声音' : '开启声音'} title={soundOn ? '关闭声音' : '开启声音'}>
                <Volume2 size={18} />
              </button>
            </div>
          </div>
          <div className="top-survival-body">
            <Thermometer temp={state.temp} />
            <div className="top-resources">
              <Resource icon={Droplets} label="水分" value={state.water} />
              <Resource icon={Battery} label="电力" value={state.power} />
              <Resource icon={Wallet} label="现金" value={state.money} max={99} />
              <Resource icon={Brain} label="精神" value={state.mind} />
              <Resource icon={ShieldAlert} label="体力" value={state.body} />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
