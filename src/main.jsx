import React, { useRef, useState } from 'react';
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
const turnHours = ['06:10', '12:30', '18:45'];
const MAX_DAY = 10;
const BAD_TEMP = 46;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const applyTemp = (temp, delta) => Number(clamp(temp + delta, 36, 60).toFixed(1));

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

function makeInitialState() {
  return {
    day: 1,
    turn: 0,
    temp: 42.7,
    water: 42,
    body: 44,
    mind: 42,
    morale: 45,
    money: 23,
    power: 31,
    flags: {},
    status: 'playing',
    lastRoll: null,
    lastOutcome: '热线接通。请在 10 天里保持体温不超过 46°C，并尽量不要和太阳争辩。',
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

  const resourceHeat = next.water + (choice.water ?? 0) <= 0 ? 1.2 : 0;
  tempDelta += resourceHeat;

  next.temp = applyTemp(next.temp, tempDelta);
  next.water = clamp(next.water + (choice.water ?? 0) - 2, 0, 100);
  next.body = clamp(next.body + (choice.body ?? 0) - (tempDelta > 0.8 ? 3 : 1), 0, 100);
  next.mind = clamp(next.mind + (choice.mind ?? 0) - (next.turn === 1 ? 2 : 1), 0, 100);
  next.morale = clamp(next.morale + (choice.morale ?? 0), 0, 100);
  next.money = clamp(next.money + (choice.money ?? 0), 0, 99);
  next.power = clamp(next.power + (choice.power ?? 0), 0, 100);

  if (choice.flag) {
    next.flags[choice.flag] = true;
  }

  const tempText = tempDelta > 0 ? `体温 +${tempDelta.toFixed(1)}°C` : `体温 ${tempDelta.toFixed(1)}°C`;
  const resourceNote = resourceHeat > 0 ? ' 资源不足让身体额外升温。' : '';
  next.lastRoll = rollInfo;
  next.lastOutcome = `${result ? `${result}。` : ''}${tempText}。${choice.reason}${resourceNote}`;
  next.log.unshift({
    day,
    turn,
    text: `选择「${choice.text}」：${next.lastOutcome}`,
    delta: tempDelta
  });

  const sudden = rollSuddenEvent(next);
  if (sudden) {
    next.temp = applyTemp(next.temp, sudden.temp ?? 0);
    next.water = clamp(next.water + (sudden.water ?? 0), 0, 100);
    next.body = clamp(next.body + (sudden.body ?? 0), 0, 100);
    next.mind = clamp(next.mind + (sudden.mind ?? 0), 0, 100);
    next.morale = clamp(next.morale + (sudden.morale ?? 0), 0, 100);
    next.money = clamp(next.money + (sudden.money ?? 0), 0, 99);
    next.power = clamp(next.power + (sudden.power ?? 0), 0, 100);
    next.lastOutcome += ` ${sudden.title}：${sudden.text}`;
    next.log.unshift({
      day,
      turn: '突发',
      text: `${sudden.title}：${sudden.text}`,
      delta: sudden.temp ?? 0
    });
  }

  if (next.temp > BAD_TEMP) {
    next.status = 'bad';
    next.lastOutcome = `坏结局：体温达到 ${next.temp.toFixed(1)}°C。你成为高温热线培训教材里的反面案例。`;
    return next;
  }

  if (next.day === MAX_DAY && next.turn === 2) {
    next.status = 'good';
    next.lastOutcome = `好结局：你撑过了 10 天。传说中的晚风来了，虽然它像二手空调，但你活下来了。`;
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
        <small>{disabled ? disabledReason : choice.detail}</small>
      </span>
      <Icon size={28} strokeWidth={2.5} />
    </button>
  );
}

function createAudioEngine() {
  if (typeof document === 'undefined') return null;
  const ambient = document.createElement('audio');
  ambient.src = '/assets/audio/heat-ambient.wav';
  ambient.loop = true;
  ambient.volume = 0.48;
  const clickSound = document.createElement('audio');
  clickSound.src = '/assets/audio/button-click.wav';
  clickSound.volume = 0.58;

  return {
    async start() {
      await ambient.play().catch(() => {});
    },
    setEnabled(enabled) {
      ambient.muted = !enabled;
      clickSound.muted = !enabled;
      if (!enabled) ambient.pause();
    },
    click() {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  };
}

function App() {
  const [state, setState] = useState(makeInitialState);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const event = getCurrentEvent(state);
  const finished = state.status !== 'playing';
  const currentTurn = turns[state.turn];
  const choiceAffordability = event.choices.map((choice) => canAfford(state, choice));
  const allChoicesBlocked = !finished && choiceAffordability.every((afford) => !afford.ok);

  const ensureAudio = async () => {
    if (!audioRef.current) {
      audioRef.current = createAudioEngine();
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

  const reset = async () => {
    await playClick();
    setState(makeInitialState());
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

  return (
    <main className="app">
      <section className="layout">
        <section className="panel event-panel">
          <div className="event-head">
            <div>
              <span>事件：{event.title}</span>
              <b>{currentTurn} | {turnHours[state.turn]}</b>
            </div>
            <small>位置：{event.place}</small>
          </div>
          <div className="scene">
            <img src="/assets/heat-apocalypse-scene.png" alt="高温末日漫画场景" />
            <div className="speech">
              <b>{event.title}</b>
              <p>{event.scene}</p>
            </div>
          </div>
          <p className="event-copy">{event.headline}</p>
          <div className="result-strip">
            <div className="dice-box">
              <Dice5 size={24} />
              {state.lastRoll ? (
                <span>
                  {state.lastRoll.dice.join(' + ')}
                  {state.lastRoll.bonus >= 0 ? ` + ${state.lastRoll.bonus}` : ` - ${Math.abs(state.lastRoll.bonus)}`}
                  {' = '}
                  <b>{state.lastRoll.total}</b> / 目标 {state.lastRoll.target}
                </span>
              ) : (
                <span>等待检定</span>
              )}
            </div>
            <div className={state.lastRoll?.success ? 'roll-ok' : state.lastRoll ? 'roll-bad' : 'roll-idle'}>
              {state.lastRoll ? (state.lastRoll.success ? '检定成功' : '检定失败') : '今天还没掷骰'}
            </div>
          </div>
        </section>

        <aside className="panel choices-panel">
          <div className="panel-title">
            <Sun size={22} />
            <b>你的选择（{currentTurn}）</b>
            <span>每个选择都有后果</span>
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
                    choice={choice}
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
                choice={getFallbackChoice(event)}
                index={event.choices.length}
                onChoose={choose}
              />
            )}
          </div>
          <div className="callout">
            <Volume2 size={24} />
            <p>{state.lastOutcome}</p>
          </div>
          <div className="utility-actions">
            <button className="reset" onClick={reset}>
              <RotateCcw size={18} />
              重新开始
            </button>
            <button className="sound-toggle" onClick={toggleSound}>
              <Volume2 size={18} />
              {soundOn ? '关闭声音' : '开启声音'}
            </button>
          </div>
        </aside>
      </section>

      <section className="bottom-hud">
        <section className="day-card bottom-day-card">
          <b>DAY {String(state.day).padStart(2, '0')}</b>
          <div className="turn-track">
            {turns.map((label, index) => (
              <span key={label} className={index < state.turn ? 'done' : index === state.turn ? 'active' : ''}>
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="panel survival top-survival bottom-survival">
          <div className="panel-title">
            <Gauge size={22} />
            <b>生存状态</b>
            <span>别硬撑</span>
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
