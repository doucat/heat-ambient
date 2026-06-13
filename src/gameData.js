const c = (text, icon, detail, data) => ({ text, icon, detail, ...data });
const branchChoice = (choice) => {
  const isBranch =
    Boolean(choice.flag) ||
    Boolean(choice.requiresFlag) ||
    Boolean(choice.conditional) ||
    choice.detail?.includes('支线') ||
    choice.detail?.includes('联盟') ||
    choice.detail?.includes('人情') ||
    choice.detail?.includes('线索');
  if (!isBranch || choice.text.includes('（支线）')) return choice;
  return { ...choice, text: `${choice.text}（支线）` };
};
const withKey = (event) => ({
  ...event,
  key: `${event.title}|${event.place}`,
  choices: event.choices.map(branchChoice).map((choice, index, choices) => {
    const repeatsBefore = choices.slice(0, index).some((item) => item.text === choice.text);
    return repeatsBefore ? { ...choice, text: `${choice.text} ${index + 1}` } : choice;
  })
});

const shop = {
  title: '店长的回礼',
  place: '24 小时便利店后门',
  scene: '你之前帮店长修过风扇。他从门缝递出一袋冰，表情像地下情报员，只是情报会融化。',
  headline: '支线后续：善意会返利，虽然返的是一袋快没了的冰。',
  choices: [
    c('收下友情冰袋', 'Droplets', '店长支线奖励。', { temp: -1.7, water: 6, mind: 3, reason: '冰袋贴住脖子，体温明显下降；有人记得你的好，精神也回了一点。' }),
    c('帮店长守门', 'ShieldAlert', '消耗体力，换水和零钱。', { temp: -0.6, body: -5, water: 6, money: 3, reason: '你在阴影里当门神，没那么热，还换到一点水和零钱。' }),
    c('买一箱矿泉水', 'Wallet', '需要现金 18。', { requires: { money: 18 }, money: -18, water: 32, temp: -0.4, reason: '水分库存大涨，短期体温小降；钱没了，但肾脏鼓掌。' }),
    c('假装自己不认识他', 'Skull', '抛弃支线。', { temp: 0.8, mind: -5, flag: 'coldHeart', reason: '你错过了帮助，良心和体温都开始发热。' })
  ]
};

const bath = {
  title: '浴缸哥的复仇',
  place: '临时供水站外',
  scene: '那个被你举报的浴缸哥带着塑料盆小队出现了。他们不打人，只在你面前慢慢喝水。',
  headline: '支线后续：末日里所有人都记仇，尤其是带浴缸的人。',
  choices: [
    c('赔他一瓶水', 'Droplets', '需要水分 12。', { requires: { water: 12 }, water: -12, temp: -0.3, mind: 3, reason: '你用水化解冲突，少晒了很久；精神压力也降了。' }),
    c('用现金和解', 'Wallet', '需要现金 10。', { requires: { money: 10 }, money: -10, temp: -0.5, reason: '现金比道歉更快蒸发仇恨，你终于排到阴影里。' }),
    c('继续嘴硬', 'Brain', '检定：精神，目标 10+。', { check: { stat: 'mind', target: 10, successTemp: -0.4, failTemp: 1.2 }, mind: -4, reason: '精神稳住就能脱身；嘴硬过头会把冲突晒成加热包。' }),
    c('把责任推给太阳', 'Sun', '搞笑但危险。', { temp: 1.0, morale: 4, reason: '大家短暂被你的逻辑震住，但太阳本人拒绝背锅，体温上升。' })
  ]
};

const parking = {
  title: '地下地图的秘密风道',
  place: '地下停车场 B2',
  scene: '你之前找到的停车场地图指向一条旧风道。里面冷得像物业终于干了点正事。',
  headline: '支线后续：地图不是剧情道具，它真的能让你少熟一点。',
  choices: [
    c('钻进旧风道', 'Gauge', '停车场地图奖励。', { temp: -1.8, mind: -2, reason: '旧风道吹出冷空气，体温大降；空间太窄，精神被墙壁轻轻揉搓。' }),
    c('用电池启动排风', 'Battery', '需要电力 12。', { requires: { power: 12 }, power: -12, temp: -2.0, reason: '排风机咳嗽两声后开转，热空气被赶走，电量也跟着下班。' }),
    c('带邻居一起走', 'ShieldAlert', '消耗水，建立联盟。', { water: -8, temp: -1.0, morale: 6, flag: 'roofAlliance', reason: '你分水带路，大家记住了你；人多一点，阴影也像个组织。' }),
    c('在里面开直播', 'Volume2', '搞笑选项。', { temp: 0.7, money: 9, mind: -6, reason: '你赚到打赏，但直播灯和弹幕争吵让你重新热起来。' })
  ]
};

export const branchLabels = {
  shopFriend: '店长支线',
  reliefLead: '集合点线索',
  parkingMap: '地下地图',
  eggChampion: '煎蛋冠军',
  roofAlliance: '楼顶联盟',
  iceJob: '冷库临工',
  wanted: '冷库通缉',
  badReputation: '名声变热',
  rooftopEnemy: '天台宿敌',
  bathEnemy: '浴缸哥记仇',
  coldHeart: '冷漠记录',
  solarPanel: '太阳能板',
  hotlineFavor: '热线人情',
  iceCoupon: '冰块券'
};

const schedule = [
  [
    {
      title: '天台的清凉商机',
      place: '破旧公寓天台',
      scene: '一个小贩把半桶常温水包装成“北极体验”，标价比你的尊严还贵。',
      headline: '今日头条：多地出现“冰水理财产品”，专家建议先别笑，可能真的会涨。',
      choices: [
        c('买一杯常温神水', 'Wallet', '需要现金 10，补水。', { requires: { money: 10 }, money: -10, water: 14, temp: -0.8, reason: '水分进入身体，出汗效率恢复，体温下降；现金减少，心里略热。' }),
        c('砍价到半杯', 'Dice5', '检定：口才，目标 9+。', { check: { stat: 'wit', target: 9, successTemp: -0.8, failTemp: 0.6 }, money: -4, water: 8, reason: '成功能少花钱补水；失败是在太阳底下多吵五分钟，热量到账。' }),
        c('抢占雨棚阴影', 'Skull', '高风险，解锁宿敌。', { check: { stat: 'guts', target: 11, successTemp: -1.0, failTemp: 1.3 }, morale: -4, flag: 'rooftopEnemy', reason: '阴影能降温；但抢位置失败会被围观群众用目光加热。' }),
        c('装作没看见价格', 'ShieldAlert', '省钱但升温。', { temp: 0.5, mind: -1, reason: '你保住现金，却继续暴露在热浪里，体温缓慢上升。' })
      ]
    },
    {
      title: '午间电表告急',
      place: '公寓走廊',
      scene: '公共电表像心电图一样闪烁。邻居围着风扇祈祷，风扇本人毫无宗教信仰。',
      headline: '调度提醒：电力可以换取降温，也可以换取一场小型邻里战争。',
      choices: [
        c('开便携风扇', 'Battery', '需要电力 8。', { requires: { power: 8 }, power: -8, temp: -0.9, mind: 2, reason: '空气流动带走汗液热量，体温下降；电力被风扇愉快吃掉。' }),
        c('关总闸保电', 'Zap', '体温上升，电力增加。', { temp: 0.7, power: 10, morale: -2, reason: '你省下电力给晚上用，但没有风，身体像被按了小火慢炖。' }),
        c('偷接楼道插座', 'Dice5', '检定：运气，目标 10+。', { check: { stat: 'luck', target: 10, successTemp: -1.1, failTemp: 1.2 }, power: 6, flag: 'badReputation', reason: '成功充到电并吹风；失败会被邻居抓包，尴尬升温。' }),
        c('给电表讲冷笑话', 'Brain', '搞笑选项，回精神。', { temp: 0.3, mind: 4, reason: '电表没笑，但你自己笑了。精神恢复一点，体温仍被午后热浪抬高。' })
      ]
    },
    {
      title: '夜市冰块黑市',
      place: '桥洞夜市',
      scene: '摊主售卖“祖传冰块”，旁边写着：一经融化，概不退货。',
      headline: '夜间提示：金钱终于有了意义，它可以短暂购买物理意义上的冷静。',
      choices: [
        c('买大冰块敷脖子', 'Wallet', '需要现金 16。', { requires: { money: 16 }, money: -16, temp: -1.6, water: 4, reason: '冰块吸热迅速，核心体温下降；融水还能救一点水分。' }),
        c('买廉价冰渣', 'Droplets', '需要现金 6。', { requires: { money: 6 }, money: -6, temp: -0.7, water: 3, reason: '冰渣降温有限，但比握着热空气许愿强。' }),
        c('帮摊主搬箱换冰', 'ShieldAlert', '检定：体力，目标 8+。', { check: { stat: 'body', target: 8, successTemp: -1.2, failTemp: 1.0 }, body: -3, flag: 'iceCoupon', reason: '成功换到冰块；失败是在夜市做免费力量训练。' }),
        c('买热烤肠压惊', 'Flame', '搞笑选项。', { temp: 0.9, morale: 5, reason: '烤肠提供快乐，也提供不受欢迎的额外热量。' })
      ]
    }
  ],
  [
    {
      title: '便利店空调传说',
      place: '24 小时便利店门口',
      scene: '店门贴着“空调维修中”，但门缝里吹出一丝冷风。店长说那只是他年轻时的梦想。',
      headline: '小贴士：听见空调声不要激动，也可能是冰柜临终遗言。',
      choices: [
        c('买盐蹭空调', 'Wallet', '需要现金 2。', { requires: { money: 2 }, money: -2, temp: -0.7, mind: 2, reason: '你靠近冷风区假装挑盐，汗水蒸发变慢，精神也稍微稳定。' }),
        c('修好店里风扇', 'Zap', '需要电力 8，开店长线。', { requires: { power: 8 }, power: -8, temp: -0.8, morale: 4, flag: 'shopFriend', reason: '风扇恢复转动，店长记住你；电池消耗换来真实降温。' }),
        c('躺进冰柜思考人生', 'Dice5', '检定：体力，目标 10+。', { check: { stat: 'body', target: 10, successTemp: -1.4, failTemp: 1.1 }, reason: '成功短时降温；失败被拖出来时尴尬到血液加速。' }),
        c('买热关东煮', 'Flame', '搞笑选项。', { temp: 1.2, morale: 4, reason: '快乐增加，但热汤让体温上升。末日里的幸福也会烫嘴。' })
      ]
    },
    {
      title: '中午心理热线',
      place: '公共电话亭',
      scene: '热线里传来调度员老周的声音：“先别崩，崩了也尽量别在太阳底下崩。”',
      headline: '系统提示：精神会影响检定，也会决定你能不能执行冷静行动。',
      choices: [
        c('认真做呼吸训练', 'Brain', '恢复精神。', { temp: -0.2, mind: 12, reason: '呼吸变稳，恐慌减少，心率下降让体温稍微回落。' }),
        c('花钱买心理咨询', 'Wallet', '需要现金 8。', { requires: { money: 8 }, money: -8, mind: 18, temp: -0.4, flag: 'hotlineFavor', reason: '老周给你一套避热口诀，精神大幅恢复，判断力提高。' }),
        c('对电话亭怒吼', 'Volume2', '消耗精神但爽。', { temp: 0.8, mind: -8, morale: 5, reason: '发泄很爽，但情绪激动增加代谢热，体温上升。' }),
        c('偷电话亭零钱', 'Wallet', '检定：运气，目标 11+。', { check: { stat: 'luck', target: 11, successTemp: -0.2, failTemp: 0.9 }, money: 6, mind: -3, reason: '成功赚到钱；失败会被路人围观，道德压力和热浪一起上头。' })
      ]
    },
    {
      title: '傍晚停电倒计时',
      place: '小区配电间',
      scene: '配电间门口贴着“节约用电”。大家一致认为这四个字非常节约降温。',
      headline: '电力越多，晚上越安全；电力太低会触发额外热惩罚。',
      choices: [
        c('给电池充电', 'Zap', '需要现金 6。', { requires: { money: 6 }, money: -6, power: 18, temp: 0.2, reason: '充电站很热，但电力储备能在后续换风扇、排风和冷却。' }),
        c('开风扇睡前降温', 'Battery', '需要电力 10。', { requires: { power: 10 }, power: -10, temp: -1.2, mind: 3, reason: '风扇帮助汗液蒸发，睡前体温下降，精神也没那么焦。' }),
        c('摸黑节电', 'ShieldAlert', '省电，精神下降。', { power: 6, temp: 0.5, mind: -4, reason: '你存下电力，但闷热黑暗让精神状态像过期罐头。' }),
        c('用手摇发电机', 'Dice5', '检定：体力，目标 9+。', { check: { stat: 'body', target: 9, successTemp: 0.1, failTemp: 1.0 }, power: 10, body: -4, reason: '发电有用，但运动产热；失败时你只是在给高温做贡献。' })
      ]
    }
  ],
  [
    {
      title: '广播里的降温计划',
      place: '废弃公交站',
      scene: '政府广播宣布“城市级降温计划即将开始”，旁边老人说上次“即将”是八年前。',
      headline: '官方消息有时是支线入口，有时只是会说话的热空气。',
      choices: [
        c('前往集合点', 'Timer', '检定：运气，目标 8+。', { check: { stat: 'luck', target: 8, successTemp: -1.0, failTemp: 0.9 }, flag: 'reliefLead', reason: '成功能拿到遮阳物资；失败白跑一趟，身体被路面反光加热。' }),
        c('花钱坐三轮车', 'Wallet', '需要现金 12。', { requires: { money: 12 }, money: -12, temp: -0.6, body: 3, reason: '少走路减少产热，体力回升；钱包承担了大部分痛苦。' }),
        c('拆公交牌遮阳', 'Gauge', '检定：体力，目标 7+。', { check: { stat: 'body', target: 7, successTemp: -0.9, failTemp: 0.8 }, reason: '成功获得巨大阴影；失败会被金属牌烫到怀疑文明。' }),
        c('模仿广播骗邻居', 'Volume2', '赚钱但损精神。', { temp: 0.4, money: 5, mind: -6, flag: 'badReputation', reason: '赚到“优先排队号”钱，但缺德让精神和名声一起发热。' })
      ]
    },
    {
      title: '午间冷饮诈骗',
      place: '自动售货机旁',
      scene: '售货机屏幕显示“冰镇饮料”，取货口吐出一罐温暖得像刚讲完励志演讲的汽水。',
      headline: '金钱可换降温，但末日商家也会换走你的信任。',
      choices: [
        c('买正版冰饮', 'Wallet', '需要现金 9。', { requires: { money: 9 }, money: -9, water: 10, temp: -0.8, reason: '这次真的冰，补水和降温同时发生。' }),
        c('踹售货机', 'Dice5', '检定：胆量，目标 10+。', { check: { stat: 'guts', target: 10, successTemp: -1.0, failTemp: 1.3 }, money: -1, reason: '成功掉出饮料；失败时你和售货机都热，只有售货机更有尊严。' }),
        c('用电池改制冷', 'Battery', '需要电力 14。', { requires: { power: 14 }, power: -14, temp: -1.5, water: 6, reason: '临时制冷成功，电力换来真正冷饮。' }),
        c('喝温汽水安慰自己', 'Soup', '搞笑选项。', { temp: 0.6, water: 5, morale: 3, reason: '补了水，但温汽水让身体产生“被背叛”的热感。' })
      ]
    },
    {
      title: '晚间屋顶会谈',
      place: '老楼楼顶',
      scene: '几个邻居计划共建遮阳棚。会议纪要第一条：谁都不许把“心静自然凉”写进方案。',
      headline: '支线提示：早建立联盟，后面会有实际救命机会。',
      choices: [
        c('出水加入联盟', 'Droplets', '需要水分 10。', { requires: { water: 10 }, water: -10, temp: -0.8, morale: 5, flag: 'roofAlliance', reason: '大家共享阴影，体温下降；水少了，但未来有了互助。' }),
        c('出钱买遮阳布', 'Wallet', '需要现金 12。', { requires: { money: 12 }, money: -12, temp: -1.0, flag: 'roofAlliance', reason: '遮阳布挡住辐射热，联盟也愿意帮你留位置。' }),
        c('出电供小风扇', 'Battery', '需要电力 10。', { requires: { power: 10 }, power: -10, temp: -1.1, flag: 'roofAlliance', reason: '电力换来公共风扇，体感温度明显下降。' }),
        c('发表团结演说', 'Brain', '需要精神 35。', { requires: { mind: 35 }, mind: -6, morale: 8, flag: 'roofAlliance', temp: -0.5, reason: '你用清醒换组织力，大家没那么慌，阴影也更有秩序。' })
      ]
    }
  ],
  [
    {
      title: '地下停车场的低温谣言',
      place: '地下停车场入口',
      scene: '入口写着“内有凉意”，下面小字补充“以及未知业主群纠纷”。',
      headline: '地下不一定凉，也可能只是信号差到没人喊热。',
      choices: [
        c('深入停车场', 'Dice5', '检定：胆量，目标 9+。', { check: { stat: 'guts', target: 9, successTemp: -1.5, failTemp: 1.0 }, flag: 'parkingMap', reason: '深处确实凉；失败则遇到车位纠纷，被热情围攻。' }),
        c('入口纳凉喝水', 'Droplets', '需要水分 6。', { requires: { water: 6 }, water: -6, temp: -0.8, reason: '阴影加补水让身体散热更有效。' }),
        c('用手机灯找风道', 'Battery', '需要电力 6。', { requires: { power: 6 }, power: -6, temp: -0.9, flag: 'parkingMap', reason: '电力照出旧风道地图，后续可用；手电也帮你避开热金属门。' }),
        c('加入业主群吵架', 'Brain', '搞笑，赚小钱。', { temp: 0.8, mind: -8, money: 3, reason: '你赢了三句嘴仗，赚到停车券；情绪激动让体温上升。' })
      ]
    },
    {
      title: '午后幻觉冰山',
      place: '高架桥下',
      scene: '远处柏油路上出现一座冰山。它看起来很凉，也很像你精神值发来的辞职信。',
      headline: '精神过低会让你做出更糟选择；精神足够则能抵抗幻觉。',
      choices: [
        c('闭眼休息十分钟', 'Brain', '恢复精神。', { temp: -0.3, mind: 10, reason: '休息降低心率和焦躁，精神恢复，体温略降。' }),
        c('追逐冰山', 'Dice5', '检定：精神，目标 10+。', { check: { stat: 'mind', target: 10, successTemp: -0.4, failTemp: 1.6 }, reason: '清醒就能停下；失败会追着海市蜃楼跑到发热。' }),
        c('买墨镜防幻觉', 'Wallet', '需要现金 7。', { requires: { money: 7 }, money: -7, mind: 6, temp: -0.2, reason: '减少强光刺激，精神稳定，体温轻微下降。' }),
        c('给冰山道歉', 'Volume2', '搞笑但回精神。', { temp: 0.4, mind: 5, morale: 2, reason: '你荒唐地找回了情绪出口，但站着道歉仍然会晒热。' })
      ]
    },
    {
      title: '夜间蚊子空军',
      place: '楼道避难点',
      scene: '蚊子在热浪里升级成无人机编队。它们不吸血，像在检测你的剩余耐心。',
      headline: '夜间突发常消耗精神；电力能让你用设备解决问题。',
      choices: [
        c('开电蚊拍巡逻', 'Zap', '需要电力 6。', { requires: { power: 6 }, power: -6, mind: 4, temp: -0.2, reason: '电力换来安静，精神恢复，少烦躁也少升温。' }),
        c('用水擦身降温', 'Droplets', '需要水分 8。', { requires: { water: 8 }, water: -8, temp: -1.0, reason: '蒸发散热有效，体温下降，但水库存减少。' }),
        c('假装自己是雕像', 'ShieldAlert', '检定：精神，目标 8+。', { check: { stat: 'mind', target: 8, successTemp: -0.4, failTemp: 0.9 }, reason: '成功减少活动产热；失败会被叮到破防。' }),
        c('和蚊子谈判', 'Brain', '搞笑选项。', { temp: 0.5, mind: -3, morale: 3, reason: '谈判失败，但你赢得了旁观者尊重；激动让体温上升。' })
      ]
    }
  ],
  [
    {
      title: '太阳能厨艺大赛',
      place: '小区广场',
      scene: '邻居们用路面煎蛋。评委说蛋没熟，人先熟了。',
      headline: '高温能产出食物，也能产出坏主意。',
      choices: [
        c('参赛煎蛋', 'Flame', '搞笑支线，赚钱。', { temp: 1.0, morale: 6, money: 6, flag: 'eggChampion', reason: '你赢得奖金和掌声，但靠近热源让体温跟着领奖。' }),
        c('买冰镇酸梅汤', 'Wallet', '需要现金 5。', { requires: { money: 5 }, money: -5, water: 8, temp: -0.5, reason: '酸梅汤补水又降温，钱包轻了，身体松了口气。' }),
        c('偷用评委遮阳棚', 'Dice5', '检定：运气，目标 10+。', { check: { stat: 'luck', target: 10, successTemp: -1.1, failTemp: 0.9 }, reason: '成功混进阴凉处；失败被追着讲比赛章程。' }),
        c('拆太阳能板', 'Battery', '检定：体力，目标 9+。', { check: { stat: 'body', target: 9, successTemp: -0.2, failTemp: 1.0 }, power: 16, flag: 'solarPanel', reason: '成功获得电力来源；失败在热板旁边当临时煎蛋。' })
      ]
    },
    {
      title: '正午太阳能板回访',
      place: '楼顶设备间',
      scene: '你看着太阳能板，第一次觉得太阳也许不是敌人，而是一个过劳电工。',
      headline: '支线后续：之前拿到太阳能板，电力会变成更强的生存资源。',
      choices: [
        c('接上线给风扇供电', 'Battery', '太阳能板加成。', { conditional: { flag: 'solarPanel', temp: -1.4, fallbackTemp: 0.4 }, power: 8, reason: '有太阳能板就能边晒边发电降温；没有板子就只是盯着太阳发呆。' }),
        c('花钱买转换器', 'Wallet', '需要现金 10。', { requires: { money: 10 }, money: -10, power: 20, temp: 0.1, reason: '转换器让后续电力更充足；购买过程有点热，但值得。' }),
        c('关机保精神', 'Brain', '恢复精神，少用电。', { mind: 8, power: 4, temp: 0.2, reason: '你停止折腾设备，精神恢复；没主动降温所以体温略升。' }),
        c('对太阳能板许愿', 'Sun', '搞笑选项。', { temp: 0.7, morale: 5, reason: '愿望很热烈，设备没有回应，太阳倒是加班了。' })
      ]
    },
    {
      title: '夜间冷库招聘',
      place: '食品仓库',
      scene: '仓库招临时工，福利写着“能短暂看见白雾”。工头像把自己冻成传说。',
      headline: '工作可以赚钱，也可以降温，但体力会被现实收走。',
      choices: [
        c('应聘搬冰块', 'Dice5', '检定：体力，目标 11+。', { check: { stat: 'body', target: 11, successTemp: -1.8, failTemp: 1.0 }, money: 8, body: -4, flag: 'iceJob', reason: '成功进入冷库大降温；失败只是在门口热身。' }),
        c('申请看门', 'Brain', '检定：口才，目标 10+。', { check: { stat: 'wit', target: 10, successTemp: -1.2, failTemp: 0.5 }, money: 4, reason: '说服工头就能守在冷气边；失败也少晒一会。' }),
        c('买员工冷饮', 'Wallet', '需要现金 8。', { requires: { money: 8 }, money: -8, water: 12, temp: -0.9, reason: '冷饮补水并降温，钱换来了稳定收益。' }),
        c('偷一袋冰', 'Skull', '高风险支线。', { check: { stat: 'luck', target: 12, successTemp: -2.0, failTemp: 1.8 }, mind: -4, flag: 'wanted', reason: '偷到是救命冰；被抓会变成高温通缉犯，精神和体温双输。' })
      ]
    }
  ],
  [
    {
      title: '冷雾车的幻影',
      place: '主干道',
      scene: '远处传来冷雾车音乐，大家像听见冰箱开门一样冲了出去。',
      headline: '追逐希望也会产热，选择前先看体力。',
      choices: [
        c('冲刺追车', 'Dice5', '检定：体力，目标 10+。', { check: { stat: 'body', target: 10, successTemp: -1.6, failTemp: 1.5 }, body: -4, reason: '追上能被冷雾洗礼；追不上就是高温无偿有氧。' }),
        c('坐车跟随', 'Wallet', '需要现金 10。', { requires: { money: 10 }, money: -10, temp: -1.0, body: 2, reason: '少跑步减少产热，冷雾也蹭到了，钱花得很物理。' }),
        c('用电台呼叫司机', 'Battery', '需要电力 8。', { requires: { power: 8 }, power: -8, temp: -0.9, flag: 'hotlineFavor', reason: '电台联系成功，冷雾车绕来一趟；电力换来路线优势。' }),
        c('对车敬礼', 'ShieldAlert', '搞笑仪式感。', { temp: 0.3, morale: 4, reason: '仪式感救精神，不能直接救体温。' })
      ]
    },
    {
      title: '午后移动水站',
      place: '临时供水车',
      scene: '供水车只收现金、支线人情和夸张的求生故事。司机说不接受“我快熟了”这种普通理由。',
      headline: '金钱、人情和精神都能换资源，区别是尴尬程度不同。',
      choices: [
        c('直接买水', 'Wallet', '需要现金 14。', { requires: { money: 14 }, money: -14, water: 24, temp: -0.5, reason: '水分补足，身体散热能力回升，体温小降。' }),
        c('刷热线人情', 'Volume2', '需要热线人情。', { requiresFlag: 'hotlineFavor', water: 18, temp: -0.8, reason: '老周帮你插了一句队，资源到账，体温随补水下降。' }),
        c('讲生存故事换水', 'Brain', '需要精神 35。', { requires: { mind: 35 }, mind: -8, water: 14, morale: 3, temp: -0.4, reason: '你用清醒讲完故事，换到水，也换来一点被理解的快乐。' }),
        c('排队到天荒地老', 'Timer', '省钱但热。', { temp: 0.8, water: 8, mind: -4, reason: '你最终拿到一点水，但排队时间太长，热量先到。' })
      ]
    },
    {
      title: '傍晚风扇拍卖会',
      place: '社区活动室',
      scene: '一台二手风扇被摆在桌上，大家看它的眼神像看末日诺亚方舟。',
      headline: '电力和金钱可以组合成强力降温道具。',
      choices: [
        c('竞拍二手风扇', 'Wallet', '需要现金 20。', { requires: { money: 20 }, money: -20, temp: -1.0, morale: 4, reason: '风扇让夜晚不再像蒸笼，体温下降。' }),
        c('用电池换风扇', 'Battery', '需要电力 18。', { requires: { power: 18 }, power: -18, temp: -1.2, reason: '电池换到设备，短期电力下降，长期体感变凉。' }),
        c('表演冷笑话压价', 'Dice5', '检定：口才，目标 10+。', { check: { stat: 'wit', target: 10, successTemp: -1.1, failTemp: 0.7 }, money: -8, reason: '笑话够冷就压价成功；失败会热场，字面意义上。' }),
        c('宣布自己就是风扇', 'Flame', '搞笑选项。', { temp: 1.0, morale: 6, reason: '大家笑了，你也获得存在感；可惜人类自转没有风扇效率。' })
      ]
    }
  ],
  [
    {
      title: '水站排队文学',
      place: '临时供水站',
      scene: '队伍长得像人生遗憾。前面有人拿着浴缸接水，后面有人开始写诗。',
      headline: '排队会考验精神；冲突会成为支线。',
      choices: [
        c('老实排队', 'Droplets', '检定：精神，目标 8+。', { check: { stat: 'mind', target: 8, successTemp: -0.9, failTemp: 1.0 }, water: 18, reason: '成功熬到水；失败在队伍里蒸熟耐心。' }),
        c('花钱买前排号', 'Wallet', '需要现金 12。', { requires: { money: 12 }, money: -12, water: 18, temp: -0.7, reason: '现金跳过长时间暴晒，体温下降。' }),
        c('举报浴缸哥', 'ShieldAlert', '触发支线。', { temp: -0.5, mind: -3, flag: 'bathEnemy', reason: '秩序恢复让你更快拿水；浴缸哥把你加入私人天气黑名单。' }),
        c('卖伞位赚钱', 'Wallet', '赚钱但升温。', { temp: 0.7, money: 8, mind: -2, reason: '你出租半片阴影，赚到现金，也失去那半片阴影。' })
      ]
    },
    {
      title: '正午热浪审讯',
      place: '社区公告栏',
      scene: '公告栏贴着“请勿恐慌”。字迹因为太热，看起来也在恐慌。',
      headline: '突发压力会消耗精神，精神低会拖累后续检定。',
      choices: [
        c('读公告找重点', 'Brain', '需要精神 30。', { requires: { mind: 30 }, mind: -4, flag: 'reliefLead', temp: -0.3, reason: '你从废话里找出供水线索，少走冤枉路，体温略降。' }),
        c('买冰水冷静', 'Wallet', '需要现金 8。', { requires: { money: 8 }, money: -8, water: 8, temp: -0.9, reason: '冷水压住焦躁和热量，体温下降。' }),
        c('撕公告做扇子', 'Dice5', '检定：运气，目标 8+。', { check: { stat: 'luck', target: 8, successTemp: -0.8, failTemp: 0.8 }, reason: '成功得到纸扇；失败被社区大爷追着讲文明。' }),
        c('把公告念成诗', 'Volume2', '搞笑回精神。', { temp: 0.4, mind: 5, morale: 3, reason: '荒诞朗诵恢复了精神，但站在公告栏前还是热。' })
      ]
    },
    {
      title: '夜间浴缸哥回访',
      place: '供水站后巷',
      scene: '有人在后巷吹口哨，旋律像塑料盆敲击浴缸。',
      headline: '如果你结下了仇，这里会更危险；没结仇则只是普通的热。',
      choices: [
        c('提前绕路', 'Timer', '稳妥但耗体力。', { temp: 0.2, body: -3, reason: '绕路避免冲突，但多走路带来一点升温。' }),
        c('用水和解', 'Droplets', '需要水分 10。', { requires: { water: 10 }, water: -10, temp: -0.6, mind: 4, reason: '水比嘴更能解决问题，冲突消退，精神恢复。' }),
        c('正面谈判', 'Dice5', '检定：口才，目标 10+。', { check: { stat: 'wit', target: 10, successTemp: -0.7, failTemp: 1.2 }, reason: '谈成能进入阴影；谈崩会被迫在后巷热聊很久。' }),
        c('把盆戴头上逃跑', 'ShieldAlert', '搞笑选项。', { temp: 0.9, morale: 5, reason: '盆挡住了一点太阳，也挡住了你的尊严；奔跑产热更明显。' })
      ]
    }
  ],
  [
    {
      title: '冷库通缉令',
      place: '食品仓库外墙',
      scene: '墙上贴着你的画像，旁边写着“疑似冰块爱好者”。画得不像，但汗画得很传神。',
      headline: '支线后续：之前偷冰会带来麻烦，但也可能换来最后的资源。',
      choices: [
        c('花钱撤下通缉', 'Wallet', '需要现金 15。', { requires: { money: 15 }, money: -15, temp: -0.4, mind: 5, reason: '现金让麻烦减少，精神压力下降，少焦虑也少发热。' }),
        c('戴墨镜混过去', 'Dice5', '检定：运气，目标 11+。', { check: { stat: 'luck', target: 11, successTemp: -1.1, failTemp: 1.4 }, reason: '成功蹭到冷库阴影；失败被保安在太阳下盘问。' }),
        c('自首换冷饮', 'Brain', '需要精神 35。', { requires: { mind: 35 }, mind: -8, water: 14, temp: -0.8, reason: '你清醒地认错，工头被震住，给了冷饮和警告。' }),
        c('伪装成冰雕', 'Skull', '搞笑高风险。', { check: { stat: 'mind', target: 12, successTemp: -1.6, failTemp: 1.6 }, reason: '演技成功能混进冷库；失败就是在烈日下装冷。' })
      ]
    },
    {
      title: '地下风道后续',
      place: '停车场 B2 风道',
      scene: '地图上的红圈通向风道控制箱。按钮上写着“勿按”，这在末日里约等于任务提示。',
      headline: '支线后续：停车场地图能解锁强降温路线。',
      choices: [
        c('按下风道按钮', 'Battery', '需要电力 12。', { requires: { power: 12 }, power: -12, temp: -2.0, reason: '排风系统启动，热空气被抽走，体温大降。' }),
        c('按地图走近路', 'Gauge', '需要地下地图。', { requiresFlag: 'parkingMap', temp: -1.3, body: 3, reason: '地图帮你避开暴晒路段，体温下降，体力也省下。' }),
        c('卖地图复印件', 'Wallet', '赚钱但损名声。', { money: 12, mind: -5, temp: 0.3, flag: 'badReputation', reason: '你赚到钱，但被问路的人太多，焦躁和热量一起上升。' }),
        c('在风道里唱歌', 'Volume2', '搞笑回 morale。', { temp: -0.2, morale: 5, reason: '回声让你像末日歌手，风道也确实有点凉。' })
      ]
    },
    {
      title: '夜间资源盘点',
      place: '避难小屋',
      scene: '你把水、钱、电池摆成三堆，发现每一堆都在用沉默责备你。',
      headline: '系统结算：水低、电低、精神低都会在夜里变成问题。',
      choices: [
        c('花钱补水', 'Wallet', '需要现金 10。', { requires: { money: 10 }, money: -10, water: 18, temp: -0.5, reason: '补水提高夜间散热能力，体温下降。' }),
        c('省电开窗', 'ShieldAlert', '不花资源。', { temp: -0.2, mind: -2, reason: '微弱夜风有一点帮助，但噪音让精神下降。' }),
        c('电扇开到最大', 'Battery', '需要电力 16。', { requires: { power: 16 }, power: -16, temp: -1.5, mind: 4, reason: '强风带走热量，也带走一点绝望。' }),
        c('数钱催眠', 'Wallet', '搞笑，精神恢复。', { temp: 0.2, mind: 5, morale: 2, reason: '数钱让你短暂安心，但钞票没有降温功能。' })
      ]
    }
  ],
  [
    {
      title: '楼顶避暑联盟',
      place: '老楼楼顶',
      scene: '邻居们搭起遮阳棚，门票是一句真心话或半瓶水。太阳正在听。',
      headline: '联盟会改变终局，前提是你愿意付出资源。',
      choices: [
        c('贡献半瓶水', 'Droplets', '需要水分 8。', { requires: { water: 8 }, water: -8, temp: -1.1, morale: 5, flag: 'roofAlliance', reason: '共享阴影让体温下降；水少了，但孤独也少了一点。' }),
        c('买公共冰块', 'Wallet', '需要现金 18。', { requires: { money: 18 }, money: -18, temp: -1.5, morale: 6, flag: 'roofAlliance', reason: '冰块成了联盟公共资产，降温效果明显。' }),
        c('供电给公用风扇', 'Battery', '需要电力 14。', { requires: { power: 14 }, power: -14, temp: -1.4, flag: 'roofAlliance', reason: '公共风扇启动，大家都凉，你也更安全。' }),
        c('组织楼顶广播操', 'Flame', '搞笑选项。', { temp: 1.2, morale: 7, reason: '气氛热烈，字面意义上也热烈。快乐正在冒汗。' })
      ]
    },
    {
      title: '午间联盟分歧',
      place: '遮阳棚会议区',
      scene: '有人主张买冰，有人主张省钱，还有人主张把太阳告上法庭。',
      headline: '精神、现金、电力会决定你能推动哪种方案。',
      choices: [
        c('冷静主持会议', 'Brain', '需要精神 35。', { requires: { mind: 35 }, mind: -8, temp: -0.9, morale: 6, reason: '清醒组织减少内耗，大家更快进入阴影。' }),
        c('众筹买冰', 'Wallet', '需要现金 12。', { requires: { money: 12 }, money: -12, temp: -1.2, water: 4, reason: '钱换成冰，冰换成降温，逻辑终于没有被晒坏。' }),
        c('修棚顶电扇', 'Battery', '需要电力 10。', { requires: { power: 10 }, power: -10, temp: -1.1, mind: 2, reason: '电力换风，风换冷静，冷静换继续活着。' }),
        c('投票起诉太阳', 'Volume2', '搞笑选项。', { temp: 0.6, morale: 5, reason: '程序正义令人振奋，但太阳没有出庭。' })
      ]
    },
    {
      title: '傍晚降温券兑换',
      place: '桥洞兑换点',
      scene: '有人认出你手里的冰块券，说这玩意儿终于不是废纸了。',
      headline: '支线后续：早期支线奖励会在后期兑换成实打实的降温。',
      choices: [
        c('兑换冰块券', 'Wallet', '需要冰块券。', { requiresFlag: 'iceCoupon', temp: -1.8, water: 5, reason: '冰块券换到真冰，身体迅速降温，融水也补了一点。' }),
        c('现金买降温券', 'Wallet', '需要现金 14。', { requires: { money: 14 }, money: -14, temp: -1.1, reason: '虽然像骗局，但这次券真的能换冷雾位。' }),
        c('给兑换点供电', 'Battery', '需要电力 12。', { requires: { power: 12 }, power: -12, temp: -1.3, money: 4, reason: '设备恢复后你拿到优先权，还被塞了点辛苦费。' }),
        c('把券折成纸鹤', 'Brain', '搞笑但无用。', { temp: 0.7, morale: 4, reason: '纸鹤很美，热浪很真。体温上升。' })
      ]
    }
  ],
  [
    {
      title: '终日前的资源市场',
      place: '地下集市',
      scene: '最后一天前，水、冰、电池都涨价。摊主说这叫“市场经济”，你说这叫“趁热打劫”。',
      headline: '最后准备：现金能变成水、电和降温机会。',
      choices: [
        c('买应急水包', 'Wallet', '需要现金 16。', { requires: { money: 16 }, money: -16, water: 28, temp: -0.5, reason: '水包保证后续散热，体温小降，安全感大升。' }),
        c('买二手电池', 'Battery', '需要现金 12。', { requires: { money: 12 }, money: -12, power: 24, temp: 0.1, reason: '购买过程不凉快，但电力会在终局换成降温。' }),
        c('卖旧扇子换冰', 'Soup', '需要现金 4 手续费。', { requires: { money: 4 }, money: -4, temp: -1.0, water: 4, reason: '旧扇子换来冰块，手续费让你心疼，但短期温度压力下降。' }),
        c('讲价讲到缺氧', 'Dice5', '检定：口才，目标 11+。', { check: { stat: 'wit', target: 11, successTemp: -1.0, failTemp: 1.0 }, money: -6, reason: '成功能低价买冷物资；失败只是热烈谈判。' })
      ]
    },
    {
      title: '最后正午红色预警',
      place: '城市主路',
      scene: '温度牌显示 49°C。它没有报警，因为它也放弃了。',
      headline: '终局前最危险的一段，资源不足会被惩罚。',
      choices: [
        c('开风扇硬穿城区', 'Battery', '需要电力 18。', { requires: { power: 18 }, power: -18, temp: -1.5, body: -2, reason: '电力带来的风流降低体感温度，让你穿过热区。' }),
        c('边走边补水', 'Droplets', '需要水分 16。', { requires: { water: 16 }, water: -16, temp: -1.2, reason: '持续补水维持出汗，核心温度被压住。' }),
        c('花钱坐冷雾车', 'Wallet', '需要现金 18。', { requires: { money: 18 }, money: -18, temp: -1.7, reason: '冷雾车是移动救命舱，价格难看但效果真实。' }),
        c('靠意志力冲刺', 'Brain', '需要精神 40。', { requires: { mind: 40 }, mind: -14, temp: 0.2, body: -5, reason: '精神支撑你不乱跑，但意志力不能违反热力学，只能少升一点。' })
      ]
    },
    {
      title: '最后一天的传说海风',
      place: '城市边缘观景台',
      scene: '传说今晚有海风穿过城市。有人说这是希望，有人说这是空调外机集体幻觉。',
      headline: '终局：撑过这个傍晚，就能达成好结局。',
      choices: [
        c('全力前往观景台', 'Dice5', '终局检定：运气，目标 9+。', { check: { stat: 'luck', target: 9, successTemp: -1.6, failTemp: 1.0 }, reason: '成功等到晚风；失败多爬一段热到反光的坡。' }),
        c('留守楼顶联盟', 'ShieldAlert', '依赖联盟支线。', { conditional: { flag: 'roofAlliance', temp: -1.5, fallbackTemp: 0.9 }, reason: '有联盟就共享最后阴影；没有联盟，只剩热空气和遗憾。' }),
        c('花光钱买冰', 'Wallet', '现金越多越有效。', { dynamic: 'cashIce', reason: '钱可以短暂买到物理冷静；没钱只能买到摊主同情。' }),
        c('对太阳发表退赛声明', 'Volume2', '搞笑收尾。', { temp: 0.9, morale: 6, reason: '声明很有气势，但太阳没有报名参赛，所以体温上升。' })
      ]
    }
  ]
];

const randomEvents = [
  [
    {
      title: '废校泳池寻宝',
      place: '废弃小学泳池',
      scene: '泳池早就没水了，池底却躺着几只密封补给箱，像文明留下的塑料遗嘱。',
      headline: '探险提示：越荒的地方越可能有宝，也越可能有被太阳烤熟的铁门。',
      choices: [
        c('撬开蓝色补给箱', 'Dice5', '检定：体力，目标 8+。', { check: { stat: 'body', target: 8, successTemp: -0.9, failTemp: 0.4 }, water: 10, reason: '成功找到瓶装水和湿毛巾；失败被铁箱边缘烫到怀疑童年。' }),
        c('沿排水口探索', 'Gauge', '降温但耗精神。', { temp: -0.8, mind: -3, water: 4, reason: '排水口里有一股阴凉气，像学校终于补发了空调预算。' }),
        c('翻找体育器材室', 'ShieldAlert', '恢复体力。', { temp: -0.4, body: 8, power: 3, reason: '你找到护膝和一节电池，体力回升，膝盖宣布继续营业。' }),
        c('跟空泳池许愿', 'Brain', '搞笑但会晒。', { temp: 0.6, mind: 6, morale: 4, water: -2, reason: '愿望没有回声，但你把自己哄好了；站在池底许愿也把自己晒热了。' })
      ]
    },
    {
      title: '地铁站盲盒探险',
      place: '停运地铁站',
      scene: '闸机全黑，站厅却比地面凉一点。广告牌写着“清凉出行”，像在进行行为艺术。',
      headline: '寻宝提示：地下空间能降温，也可能藏着过期售货机和更过期的希望。',
      choices: [
        c('搜检修柜', 'Battery', '找电力。', { temp: -0.5, power: 10, reason: '检修柜里有备用电池，地下阴凉顺手帮你把体温按住。' }),
        c('撬开售货机后盖', 'Dice5', '检定：胆量，目标 9+。', { check: { stat: 'guts', target: 9, successTemp: -1.0, failTemp: 0.7 }, water: 8, money: 2, reason: '成功摸到饮料和零钱；失败被警报声吓到原地升温。' }),
        c('躲进站务室', 'Brain', '恢复精神。', { temp: -0.7, mind: 7, reason: '站务室像末日里的冷静小隔间，你坐了两分钟，脑子重新上线。' }),
        c('研究线路图藏宝点', 'Timer', '换现金但升温。', { temp: 0.4, money: 5, mind: 2, reason: '你发现有人把零钱藏在票卡机下，但蹲在闷热站厅研究半天，体温上来了。' })
      ]
    },
    {
      title: '仙女文文降临',
      place: '白光覆盖的街心花坛',
      scene: '热浪忽然散开，仙女文文从柔亮的光里出现。她美得像清晨第一口冰水，眼睛清亮，笑起来连太阳都不好意思继续加班。',
      headline: '奇遇提示：这不是幻觉，是高温世界终于派来的温柔补丁。',
      choices: [
        c('接受文文的冰晶祝福', 'Droplets', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '文文把冰晶轻轻点在你额头，热量像被请出会议室。水分、电力、现金、精神、体力全部变成 99。' }),
        c('请文文召来清风', 'Gauge', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '她挥手唤来带花香的凉风，风路过时顺便把你的背包、钱包和人生信心都补满到 99。' }),
        c('和文文一起救助路人', 'ShieldAlert', '全状态拉满。', { tempTo: 36, fullRestore: true, morale: 8, reason: '文文的美丽不是装饰，是让人愿意继续活下去的理由。你们分发冷光补给，五项资源全部 99。' }),
        c('认真夸文文漂亮', 'Brain', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '你发自内心地夸她漂亮，她笑了一下，整条街像开了天界空调。资源全满，体温归 36°C。' })
      ]
    }
  ],
  [
    {
      title: '商场中庭寻冷',
      place: '半废弃商场',
      scene: '扶梯停在半路，玻璃穹顶像放大镜。中庭喷泉没水，但底座里传来冰柜般的低鸣。',
      headline: '探险提示：商场不会免费给你快乐，但可能免费漏一点冷气。',
      choices: [
        c('钻进喷泉检修口', 'Dice5', '检定：体力，目标 8+。', { check: { stat: 'body', target: 8, successTemp: -1.1, failTemp: 0.6 }, power: 5, reason: '成功找到漏风管道；失败只是和喷泉底座进行热烈摔跤。' }),
        c('搜母婴室补给', 'Droplets', '补水回精神。', { temp: -0.5, water: 9, mind: 4, reason: '你找到未拆封湿巾和水，文明的小角落还在发光。' }),
        c('拆广告屏电池', 'Battery', '获得电力。', { temp: 0.1, power: 14, reason: '广告屏终于停止推销防晒霜，改为贡献电力。你有点热，但很值。' }),
        c('试穿冰丝睡衣', 'Soup', '搞笑但尴尬。', { temp: 0.5, morale: 5, mind: -2, reason: '冰丝很快被热浪击穿，尴尬倒是很持久。你像一条刚出锅还嘴硬的面。' })
      ]
    },
    {
      title: '图书馆地下密室',
      place: '市立图书馆',
      scene: '图书馆地下一层堆着旧档案，空气干冷，书页翻动声像有人在低声说“别晒了”。',
      headline: '寻宝提示：知识不一定改变命运，但地下书库确实能改变体温。',
      choices: [
        c('查避暑档案', 'Brain', '恢复精神。', { temp: -0.4, mind: 9, reason: '你找到旧城市避暑图，精神回升，脑子终于不再煎蛋。' }),
        c('搬开档案柜', 'Dice5', '检定：体力，目标 9+。', { check: { stat: 'body', target: 9, successTemp: -1.2, failTemp: 0.8 }, water: 6, reason: '成功发现冷藏档案箱；失败被灰尘和热气联合教育。' }),
        c('借走应急手电', 'Battery', '拿电力。', { temp: -0.2, power: 9, mind: 2, reason: '手电还有电，黑暗也没那么吓人，热浪暂时找不到你。' }),
        c('读一本冷门诗集', 'Volume2', '搞笑回精神。', { temp: 0.3, mind: 6, morale: 3, reason: '诗很冷门，但书库不够冷。精神被拯救，体温被纸页闷了一下。' })
      ]
    },
    {
      title: '河道旧船藏宝',
      place: '干涸河道',
      scene: '河床裂得像城市的嘴唇，一条旧观光船卡在泥里，船舱门上写着“清凉航线”。',
      headline: '探险提示：没有水的船也能有宝，前提是你别被甲板烫得跳舞。',
      choices: [
        c('搜船长室', 'Wallet', '找现金。', { temp: -0.2, money: 8, reason: '船长室里有零钱盒。船不开了，钱还挺敬业。' }),
        c('拆船载电瓶', 'Battery', '拿电力。', { temp: 0.2, power: 16, body: -2, reason: '电瓶很沉，但电力很香。你短暂升温，长期得救。' }),
        c('打开冷藏鱼舱', 'Dice5', '检定：运气，目标 9+。', { check: { stat: 'luck', target: 9, successTemp: -1.4, failTemp: 0.6 }, water: 5, reason: '成功找到还能用的冰袋；失败只闻到历史悠久的鱼味。' }),
        c('把船票当护身符', 'Brain', '搞笑回精神。', { temp: 0.5, mind: 5, morale: 4, reason: '它不能上船，但能上头。你有了信念，也在甲板上多晒了一会儿。' })
      ]
    }
  ],
  [
    {
      title: '夜探天文馆',
      place: '天文馆穹顶厅',
      scene: '穹顶投影坏了一半，星星像被晒到掉帧。地下设备间却传来稳定的冷风。',
      headline: '夜探提示：宇宙很冷，设备间也勉强学到了一点。',
      choices: [
        c('启动穹顶排风', 'Battery', '需要电力 6。', { requires: { power: 6 }, power: -6, temp: -1.2, mind: 4, reason: '排风启动，热气往上跑，像终于理解了剧情走向。' }),
        c('翻找科普商店', 'Wallet', '找现金和水。', { temp: -0.4, money: 4, water: 5, reason: '你找到纪念币和瓶装水，科学精神与小卖部精神同时胜利。' }),
        c('钻设备间冷风口', 'Dice5', '检定：体力，目标 8+。', { check: { stat: 'body', target: 8, successTemp: -1.5, failTemp: 0.7 }, reason: '成功享受宇宙级冷风；失败被风口卡住，尊严升温。' }),
        c('向星空许愿降温', 'Brain', '搞笑回精神。', { temp: 0.4, mind: 6, morale: 5, reason: '星空没回你，但你把心态调成夜间模式；屋顶余热负责把体温调回来。' })
      ]
    },
    {
      title: '古玩街冰玉传说',
      place: '旧城古玩街',
      scene: '摊主说一块青玉“冬暖夏凉”，你摸了一下，发现至少“夏凉”不是完全诈骗。',
      headline: '寻宝提示：末日古玩只分两种，能降温的和能讲故事的。',
      choices: [
        c('买便宜冰玉', 'Wallet', '需要现金 7。', { requires: { money: 7 }, money: -7, temp: -0.9, mind: 2, reason: '玉石贴在手腕上吸热，虽然来历可疑，但凉意很诚实。' }),
        c('帮摊主搬遮阳伞', 'ShieldAlert', '换水和现金。', { temp: -0.5, water: 6, money: 3, body: -2, reason: '你在阴影里干活，换来水和零钱，劳动法正在热浪里沉默。' }),
        c('鉴定祖传冰碗', 'Dice5', '检定：精神，目标 9+。', { check: { stat: 'mind', target: 9, successTemp: -1.0, failTemp: 0.5 }, money: 4, reason: '成功识破真货并赚到佣金；失败被摊主讲故事讲到升温。' }),
        c('戴上夸张玉扳指', 'Soup', '搞笑回士气。', { temp: 0.5, morale: 6, reason: '你看起来像末日掌柜，气势很足；玉扳指被晒热后像迷你烙铁。' })
      ]
    },
    {
      title: '仙女文文的夜间补给',
      place: '月光下的楼顶水塔',
      scene: '文文站在水塔边，裙摆像月光做的凉风。她的美丽不刺眼，却让整座楼的热浪都放低了音量。',
      headline: '奇遇提示：真正的美丽不是闪耀，是让人从热浪里重新看见明天。',
      choices: [
        c('接过文文的月光水', 'Droplets', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '月光水入口清凉，像把整个夏天按下静音键。五项资源全部 99，体温降至 36°C。' }),
        c('请文文点亮电池', 'Battery', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '文文指尖微光落在电池上，电力、现金和勇气一起满格。你突然觉得热浪也不过如此。' }),
        c('陪文文巡楼救人', 'ShieldAlert', '全状态拉满。', { tempTo: 36, fullRestore: true, morale: 10, reason: '她美得温柔，也强得合理：带来的冷光补给覆盖整栋楼，你的状态全部回到 99。' }),
        c('把猫介绍给文文', 'Brain', '全状态拉满。', { tempTo: 36, fullRestore: true, reason: '橘色异短猫郑重点头，文文笑得像天台开花。世界被治愈了一秒，你也被补满了。' })
      ]
    }
  ]
];

const cityChaosEvents = [
  {
    turn: 0,
    title: '清晨假冷空气预报',
    place: '社区广播杆下',
    scene: '广播说“冷空气即将抵达”，居民们抬头看天，天也一脸没收到通知。',
    headline: '天气不会骗人，骗人的是天气预报的乐观语气。',
    choices: [
      c('追着云影跑两条街', 'Dice5', '检定：体力，目标 8+。', { check: { stat: 'body', target: 8, successTemp: -0.8, failTemp: 1.0 }, water: -3, reason: '成功踩到一段移动阴影；失败就是给太阳表演晨跑。' }),
      c('质问广播站', 'Volume2', '恢复精神但升温。', { temp: 0.5, mind: 5, reason: '你骂得很有条理，广播没道歉，喉咙先热了。' }),
      c('收集露水', 'Droplets', '补水但费时间。', { temp: 0.2, water: 8, body: -2, reason: '露水少得像预算，但总比没有强；蹲太久让体温略升。' }),
      c('把预报写进备忘录', 'Brain', '小幅回精神。', { temp: 0.3, mind: 4, reason: '你保留了证据，也保留了被热浪嘲笑的资格。' })
    ]
  },
  {
    turn: 0,
    title: '邻居晒被子封路',
    place: '小区窄巷',
    scene: '一排被子挂在巷口，像柔软的城墙，也像热浪的棉质扩音器。',
    headline: '邻里关系会影响路线，有时一床被子就是一场地形灾难。',
    choices: [
      c('帮忙收被子换阴影', 'ShieldAlert', '耗体力换降温。', { temp: -0.5, body: -3, morale: 3, reason: '你换到一小块阴影，被子主人还送你一句“挺会活”。' }),
      c('钻被子隧道', 'Dice5', '检定：运气，目标 9+。', { check: { stat: 'luck', target: 9, successTemp: -0.7, failTemp: 0.8 }, reason: '成功穿过棉花迷宫；失败被热被子糊脸。' }),
      c('绕远走大路', 'Timer', '稳但升温。', { temp: 0.8, body: -2, reason: '你避开冲突，也多吃了一段无遮挡阳光。' }),
      c('发起被子听证会', 'Brain', '搞笑但热。', { temp: 0.6, mind: 4, morale: 4, reason: '流程很民主，太阳旁听并全票支持升温。' })
    ]
  },
  {
    turn: 1,
    title: '午间冰块拍卖会',
    place: '临时集市中央',
    scene: '一块冰被放在碗里拍卖，竞价声比冰融化得还快。',
    headline: '市场事件：钱能买冷静，但也能买到后悔。',
    choices: [
      c('高价拍下半块冰', 'Wallet', '需要现金 14。', { requires: { money: 14 }, money: -14, temp: -1.1, water: 3, reason: '冰是真的，价格也是真的。你降温了，钱包中暑了。' }),
      c('联手邻居合买', 'ShieldAlert', '耗水换联盟。', { temp: -0.5, water: -4, morale: 5, flag: 'roofAlliance', reason: '大家分冰，也分担尴尬账单。联盟关系升温，身体降温。' }),
      c('举报哄抬冰价', 'Volume2', '检定：胆量，目标 10+。', { check: { stat: 'guts', target: 10, successTemp: -0.6, failTemp: 0.9 }, money: 2, reason: '成功换来一点补偿；失败被摊主用眼神加热。' }),
      c('用热笑话压价', 'Soup', '搞笑但危险。', { temp: 0.9, mind: 3, reason: '笑话很热，价格没冷。你赢了气氛，输了体温。' })
    ]
  },
  {
    turn: 1,
    title: '太阳反光玻璃阵',
    place: '写字楼街区',
    scene: '玻璃幕墙把太阳复制粘贴了十几份，街区像开了多人联机烤箱。',
    headline: '城市地形事件：不是所有路都能走，有些路在烤你。',
    choices: [
      c('贴墙阴影慢行', 'Droplets', '耗水小降温。', { temp: -0.4, water: -5, reason: '你贴着阴影挪动，像一片有求生欲的海苔。' }),
      c('用外套挡反光', 'ShieldAlert', '耗体力。', { temp: -0.2, body: -4, mind: 2, reason: '外套挡光，也挡住了尊严。你没那么热，但很累。' }),
      c('穿越玻璃阵', 'Dice5', '检定：体力，目标 11+。', { check: { stat: 'body', target: 11, successTemp: -0.3, failTemp: 1.4 }, reason: '成功快速通过；失败被反光连环教育。' }),
      c('对玻璃摆pose', 'Brain', '搞笑升温。', { temp: 0.8, morale: 5, reason: '你拍出了末日大片，代价是变成末日热片。' })
    ]
  },
  {
    turn: 2,
    title: '傍晚电池互助群',
    place: '楼道群公告板',
    scene: '群里有人发起电池互助，下面马上变成价格战、情绪战和表情包战。',
    headline: '社交事件：互助很美好，群聊很高温。',
    choices: [
      c('用现金换电池', 'Wallet', '需要现金 8。', { requires: { money: 8 }, money: -8, power: 14, temp: 0.2, reason: '你换到电池，也被楼道热气多烤了一会儿。' }),
      c('帮老人修收音机', 'Battery', '耗电换人情。', { power: -5, temp: -0.3, morale: 5, flag: 'hotlineFavor', reason: '收音机响起风声，人情也响了。电少了，心稳了。' }),
      c('主持群聊秩序', 'Brain', '耗精神换联盟。', { mind: -5, morale: 6, flag: 'roofAlliance', temp: 0.3, reason: '你把群聊从火锅调回温水，精神被消息提示音烤焦。' }),
      c('发一张猫猫表情包', 'Soup', '小回精神。', { temp: 0.4, mind: 4, morale: 4, reason: '大家笑了三秒，热浪笑了四秒。' })
    ]
  },
  {
    turn: 2,
    title: '夜间冷雾车迷路',
    place: '十字路口',
    scene: '冷雾车开着音乐路过，却在导航里迷成一只会喷水的无头苍蝇。',
    headline: '救援事件：追上它可能救命，追不上就是夜跑。',
    choices: [
      c('追冷雾车三百米', 'Dice5', '检定：体力，目标 9+。', { check: { stat: 'body', target: 9, successTemp: -1.3, failTemp: 1.0 }, water: -2, reason: '成功冲进冷雾；失败就是给城市热夜加一段跑步素材。' }),
      c('用手电引导车辆', 'Battery', '需要电力 6。', { requires: { power: 6 }, power: -6, temp: -0.8, morale: 3, reason: '灯光救了路线，冷雾救了你。电力下班得很光荣。' }),
      c('花钱买司机坐标', 'Wallet', '需要现金 5。', { requires: { money: 5 }, money: -5, temp: -0.6, reason: '情报很贵，但冷雾很香。' }),
      c('模仿冷雾车音乐', 'Volume2', '搞笑升温。', { temp: 0.7, mind: 4, reason: '你学得很像，但不能喷水。群众鼓掌，体温上扬。' })
    ]
  }
];

const cityIssueSeeds = [
  ['小区水压忽高忽低', '楼道水表旁', '水表转得像惊悚片配乐，邻居们端着盆等待命运开闸。'],
  ['电梯变成桑拿房', '停运电梯口', '电梯门半开，里面的热气像刚练完瑜伽。'],
  ['社区团购翻车', '临时取货点', '团购箱里有冰袋、热包和一张写错楼号的绝望。'],
  ['宠物降温大会', '小区花坛边', '狗趴着，猫占阴影，人类排队申请当宠物。'],
  ['假冒救援短信', '手机屏幕前', '短信说点击领取冷风补贴，链接热得像诈骗犯的良心。'],
  ['高温补贴排队', '社区服务站', '队伍绕了三圈，大家都在排一份不确定的凉意。'],
  ['楼顶晾水计划', '老楼天台', '有人把水桶排成阵法，说这样能召唤夜风。'],
  ['空调外机合唱', '背街小巷', '一排外机轰鸣，热风吹得像城市在吹唢呐。'],
  ['避暑谣言扩散', '业主群消息流', '群里说地下三层有冰泉，消息来源是“我二姨听说”。'],
  ['自动门抽风', '商场入口', '自动门一开一合，像在给热浪做人工呼吸。'],
  ['桶装水抽签', '便利店门口', '最后三桶水被放进抽签箱，命运开始塑料化。'],
  ['冷饮摊盲盒', '街边小摊', '摊主说每杯都有惊喜，惊喜可能是冰，也可能是常温哲学。'],
  ['太阳能充电摊', '路边蓝棚', '摊主把太阳能板摆成法阵，收费标准看心情。'],
  ['临时遮阳棚坍塌', '街角棚架下', '遮阳棚发出一声叹息，然后决定不遮了。'],
  ['高温热线回访', '公共电话旁', '热线真的打回来了，语气比天气凉快一点。'],
  ['街头冰桶挑战', '广场中央', '有人把冰桶挑战改成收费项目，观众比冰多。'],
  ['共享风扇争夺', '公交站台', '一台共享风扇被四个人围住，像小型文明火种。'],
  ['夜市假冰鉴定', '桥洞摊位', '摊主展示透明方块，坚持说它是“情绪稳定型冰”。']
];

const cityIssueThemes = [
  {
    suffix: '应急处理',
    action: (name) => `稳住${name}现场`,
    icon: 'ShieldAlert',
    detail: '稳妥但耗体力。',
    data: (name, place) => ({
      temp: 0.3,
      body: -3,
      water: 2,
      reason: `你先把人群、物资和脾气分开，${place}的局面没继续滚烫；水到手一点，体力也被现场消耗掉。`
    })
  },
  {
    suffix: '投机机会',
    action: (name) => `倒卖${name}临时名额`,
    icon: 'Wallet',
    detail: '赚钱但升温。',
    data: (name) => ({
      temp: 0.8,
      money: 6,
      mind: -2,
      reason: `${name}被你包装成“限时避暑权益”，现金确实进账；但讲价、解释和被瞪眼让精神与体温一起升高。`
    })
  },
  {
    suffix: '技术抢修',
    action: (name) => `拆开${name}旁的控制盒`,
    icon: 'Battery',
    detail: '检定：精神，目标 9+。',
    data: (name) => ({
      check: { stat: 'mind', target: 9, successTemp: -0.8, failTemp: 0.9 },
      power: 5,
      reason: `成功能让${name}附近的设备恢复一点秩序，顺便抠出可用电力；失败就是被线路、螺丝和热浪轮流教育。`
    })
  },
  {
    suffix: '荒诞应对',
    action: (name) => `把${name}改成避暑表演`,
    icon: 'Soup',
    detail: '搞笑但有代价。',
    data: (name) => ({
      temp: 0.7,
      mind: 5,
      morale: 4,
      water: -2,
      reason: `${name}被你硬改成街头节目，大家笑了，心态也没那么碎；缺点是表演者本人笑出汗，水分和体温一起抗议。`
    })
  }
];

function shortIssueName(name) {
  const shortNames = {
    社区团购翻车: '团购箱',
    宠物降温大会: '宠物区',
    假冒救援短信: '诈骗短信',
    高温补贴排队: '补贴队',
    楼顶晾水计划: '晾水阵',
    空调外机合唱: '外机',
    避暑谣言扩散: '谣言',
    自动门抽风: '自动门',
    桶装水抽签: '桶装水',
    冷饮摊盲盒: '冷饮摊',
    太阳能充电摊: '充电摊',
    临时遮阳棚坍塌: '遮阳棚',
    高温热线回访: '热线',
    街头冰桶挑战: '冰桶',
    共享风扇争夺: '风扇',
    夜市假冰鉴定: '假冰',
    小区水压忽高忽低: '水压'
  };
  return shortNames[name] ?? name.slice(0, 4);
}

function buildCityIssueChoices(name, place, theme) {
  const shortName = shortIssueName(name);
  const variants = {
    应急处理: [
      c(`借${place}阴影排队`, 'Droplets', '降温但耗水。', { temp: -0.3, water: -4, reason: `你把队伍挪到${place}能遮一点的角落，混乱小了，暴晒也少了；只是水分仍在慢慢离职。` }),
      c(`请大爷镇住${shortName}`, 'Timer', '联盟倾向。', { temp: 0.2, morale: 5, flag: 'roofAlliance', reason: `大爷嗓门比广播还管用，${name}终于不再乱成热锅；你多站了一会儿，体温小涨。` }),
      c(`绕开${shortName}现场`, 'Brain', '省事但升温。', { temp: 0.9, mind: -2, reason: `你避开了麻烦，也绕进了更晒的路。问题留给别人，热量留给自己。` })
    ],
    投机机会: [
      c(`低价收走${shortName}冷货`, 'Droplets', '需要现金 6。', { requires: { money: 6 }, money: -6, water: 6, temp: -0.5, reason: `你趁${name}混乱时买到一点冷物资，价格不算体面，但身体很诚实地凉了一些。` }),
      c(`替${shortName}摊记账`, 'Timer', '赚钱但累。', { temp: 0.4, money: 4, body: -2, reason: `你帮忙记清谁欠谁一口凉风，赚到零钱；站在摊边太久，热浪也给你记了一笔。` }),
      c(`举报${shortName}乱涨价`, 'Volume2', '检定：胆量，目标 10+。', { check: { stat: 'guts', target: 10, successTemp: -0.4, failTemp: 1.0 }, money: 2, reason: `成功能把价格压回人类范围；失败会被摊主和围观群众一起用眼神加热。` })
    ],
    技术抢修: [
      c(`强启${shortName}风扇`, 'Battery', '需要电力 8。', { requires: { power: 8 }, power: -8, temp: -0.9, mind: 2, reason: `备用风扇转起来后，${name}附近终于有了空气流动；电力少了，脑子凉了。` }),
      c(`找人合修${shortName}`, 'ShieldAlert', '联盟倾向。', { temp: 0.2, water: -3, morale: 5, flag: 'roofAlliance', reason: `路人帮你看懂线路，你分了点水当谢礼；设备没完全修好，人情倒是接上了。` }),
      c(`拔掉${shortName}坏插头`, 'Zap', '省风险但小升温。', { temp: 0.5, power: 3, reason: `坏插头停止冒热气，你还捡回一点电力；蹲着折腾线路让身体又热了一截。` })
    ],
    荒诞应对: [
      c(`给${shortName}讲冷笑话`, 'Brain', '恢复精神。', { temp: 0.5, mind: 6, morale: 4, reason: `${name}没有被解决，但大家短暂忘了自己在冒烟；你讲到嗓子发干，体温也跟着抬头。` }),
      c(`改${shortName}纸箱帽`, 'ShieldAlert', '耗体力小降温。', { temp: -0.2, body: -3, morale: 3, reason: `纸箱帽丑得很有安全感，至少挡住了一点直晒；脖子很累，尊严也很忙。` }),
      c(`为${shortName}心理制冰`, 'Soup', '搞笑但危险。', { temp: 0.8, mind: 4, reason: `你认真宣布“想象自己在冰箱里”，群众配合鼓掌，热浪配合升温。` })
    ]
  };

  return [
    c(theme.action(name), theme.icon, theme.detail, theme.data(name, place)),
    ...variants[theme.suffix]
  ];
}

const cityLifeEvents = cityIssueSeeds.flatMap(([name, place, scene], seedIndex) =>
  cityIssueThemes.map((theme, themeIndex) => ({
    turn: (seedIndex + themeIndex + 1) % 3,
    title: `${name}${theme.suffix}`,
    place,
    scene,
    headline: `${name}不是探险地点，但照样能把生存搞成选择题。`,
    choices: buildCityIssueChoices(name, place, theme)
  }))
);

const generatedPlaces = [
  ['废弃水族馆', '裂开的观景隧道', '玻璃后面没有鱼，只有热浪在假装游泳。'],
  ['旧机场候机楼', '停摆登机口', '航班屏幕还在滚动“延误”，像对整个人类文明的总结。'],
  ['山脚防空洞', '潮湿洞口', '洞里传来冷风，洞外太阳像在收门票。'],
  ['影视城雪景棚', '假雪仓库', '塑料雪花堆在角落，竟然比真实天气更有职业道德。'],
  ['大学实验楼', '低温实验室外', '门禁没电，里面却还有一点科学的凉意。'],
  ['旧医院后勤楼', '药品冷藏间', '冷藏间嗡嗡作响，像末日里最后一台认真上班的机器。'],
  ['物流园仓库', '蓝色卷帘门前', '快递箱堆成小山，谁也不知道里面是冰袋还是袜子。'],
  ['温泉酒店遗址', '空荡浴场', '“恒温池”三个字在墙上热得非常讽刺。'],
  ['城市植物园', '雾化温室', '植物们蔫得很体面，喷雾管偶尔还记得自己是喷雾管。'],
  ['电视塔底层', '设备维护区', '塔身晒得发亮，底层机房却藏着一点冷风。'],
  ['跨江大桥桥肚', '检修平台', '桥面烫得像锅，桥肚阴影像临时避难所。'],
  ['地下美食街', '关闭的冰粉摊', '招牌写着“冰凉一夏”，老板和冰都不在。'],
  ['旧银行金库', '厚重金属门', '金库不一定有钱，但隔热效果很有钱。'],
  ['市政档案馆', '地下恒温库', '档案比人凉快，这件事很伤人但很有用。'],
  ['海鲜批发市场', '空冷链车厢', '车厢里没有海鲜，只有一股“差点得救”的味道。'],
  ['烂尾商住楼', '负一层泵房', '水泵停了，墙角却有几桶没人敢认领的水。'],
  ['旧电影院', '放映机房', '银幕上没有电影，只有一只晒晕的广告牌。'],
  ['环城隧道', '应急停车带', '隧道里凉一点，回声把你的喘气放大成灾难片预告。'],
  ['儿童乐园', '海盗船控制室', '海盗船不动了，控制室里还藏着应急电池。'],
  ['旧制冰厂', '融化车间', '墙上写着“安全生产”，地上写着“曾经很冷”。'],
  ['邮政分拣站', '绿色铁皮棚下', '包裹安静地躺着，像一群拒绝签收高温的证人。'],
  ['城市博物馆', '恐龙展厅', '恐龙骨架看着你，仿佛在说“我懂灭绝”。'],
  ['高架桥下市集', '临时遮阳摊', '摊主们用纸箱和意志力撑起一片小阴影。'],
  ['旧体育馆', '冰球更衣室', '更衣室早没冰了，但墙体还保留一点冷门尊严。'],
  ['广播电视仓库', '道具云朵旁', '道具云朵不会下雨，但能挡住一点太阳。'],
  ['旧书批发城', '地下打包区', '成捆的书挡住热风，知识终于有了物理用途。'],
  ['山顶缆车站', '停运站台', '缆车不来，风却来了半口。'],
  ['废弃泳装店', '试衣间走廊', '镜子照出你和热浪互相嫌弃的样子。'],
  ['冷链培训中心', '模拟冷库门口', '模拟冷库居然还有点用，培训终于落地。'],
  ['老火车货场', '冷藏车皮', '车皮门缝漏出凉意，像历史偷偷给你递纸条。']
];

const generatedThemes = [
  ['寻宝', '翻找密封箱', 'Dice5', '检定：运气，目标 8+。', { check: { stat: 'luck', target: 8, successTemp: -0.9, failTemp: 0.5 }, water: 5, money: 2, reason: '成功找到水和零钱；失败只找到一张热到卷边的说明书。' }],
  ['检修', '修好嗡嗡作响的设备', 'Battery', '检定：精神，目标 9+。', { check: { stat: 'mind', target: 9, successTemp: -1.0, failTemp: 0.6 }, power: 7, reason: '成功让设备吐出冷风和电力；失败被说明书嘲笑到升温。' }],
  ['阴影交易', '和摊主换一块阴影', 'Wallet', '需要现金 5。', { requires: { money: 5 }, money: -5, temp: -0.8, mind: 2, reason: '现金换来短暂阴影，钱包变轻，身体变凉。' }],
  ['水源追踪', '沿着滴水声探索', 'Droplets', '补水降温。', { temp: -0.7, water: 9, reason: '你找到一处漏水点，虽然不体面，但足够救命。' }],
  ['支线线索', '记录墙上的旧地图', 'Timer', '获得后续线索。', { temp: 0.3, mind: 2, flag: 'parkingMap', reason: '旧地图标出地下路线，但你站在墙边抄得满头冒汗。线索有了，热量也到账。' }],
  ['联盟机会', '邀请路人共建遮阳点', 'ShieldAlert', '建立楼顶联盟。', { temp: 0.2, water: -5, morale: 5, flag: 'roofAlliance', reason: '你分出水和时间换来互助，联盟成立了，体温也被会议流程烤了一下。' }],
  ['太阳能试验', '架起小太阳能板', 'Zap', '获得电力。', { temp: 0.2, power: 12, flag: 'solarPanel', reason: '你多晒了一会儿，但电力回来了。太阳第一次像个不太讨厌的同事。' }],
  ['冰券奇遇', '翻到旧冰块兑换券', 'Wallet', '获得冰块券。', { temp: 0.2, money: 2, flag: 'iceCoupon', reason: '你找到一张冰块券，纸很皱，希望很直，但翻箱倒柜让体温略升。' }],
  ['名声风险', '插队抢占冷风口', 'Skull', '高风险。', { check: { stat: 'guts', target: 10, successTemp: -1.1, failTemp: 1.0 }, flag: 'badReputation', reason: '成功抢到冷风；失败把名声晒成黑历史。' }],
  ['搞笑避暑', '试用奇怪降温偏方', 'Soup', '搞笑选项。', { temp: 0.8, mind: 5, morale: 4, water: -3, reason: '偏方科学性存疑，娱乐性很强；你笑出了汗，热浪赢回一局。' }]
];

const contextChoiceSets = [
  {
    text: () => '摸进背阴处',
    icon: 'Droplets',
    detail: '小幅降温但耗水。',
    data: (place, spot) => ({
      temp: -0.3,
      water: -5,
      body: -1,
      reason: `你绕到${spot}背阴处，确实少晒一点；但慢慢摸索消耗水分，${place}没有免费午休。`
    })
  },
  {
    text: () => '拆旧线缆',
    icon: 'Battery',
    detail: '获得电力但明显升温。',
    data: (place, spot) => ({
      temp: 0.7,
      power: 10,
      body: -3,
      reason: `${spot}的旧线缆烫得像刚出锅，你拆到电力，也把${place}的热量拆进了身体。`
    })
  },
  {
    text: () => '向管理员套话',
    icon: 'Brain',
    detail: '恢复精神但花现金。',
    data: (place) => ({
      requires: { money: 3 },
      money: -3,
      temp: 0.4,
      mind: 7,
      reason: `你用一点现金换来${place}的避热点情报，脑子清醒了，嘴皮子也被热风烤干了。`
    })
  },
  {
    text: () => '冲过开阔地',
    icon: 'Flame',
    detail: '省时间但升温。',
    data: (_place, spot) => ({
      temp: 1.1,
      body: -4,
      morale: 3,
      reason: `你选择硬冲${spot}，路线短，热量也短平快地到账。士气有了，汗也有了。`
    })
  },
  {
    text: () => '封住热风口',
    icon: 'ShieldAlert',
    detail: '检定：体力，目标 9+。',
    data: (place) => ({
      check: { stat: 'body', target: 9, successTemp: -0.8, failTemp: 0.9 },
      water: -2,
      reason: `成功能堵住${place}的热风口；失败就是和热风贴脸摔跤。`
    })
  },
  {
    text: () => '搜应急柜',
    icon: 'Wallet',
    detail: '检定：运气，目标 10+。',
    data: (_place, spot) => ({
      check: { stat: 'luck', target: 10, successTemp: -0.5, failTemp: 0.6 },
      money: 4,
      water: 3,
      reason: `成功能从${spot}应急柜里翻出补给；失败只翻出一张“请保持冷静”的废纸。`
    })
  },
  {
    text: () => '组临时队',
    icon: 'Timer',
    detail: '支线但耗资源。',
    data: (place) => ({
      temp: 0.5,
      water: -4,
      mind: -2,
      morale: 7,
      flag: 'roofAlliance',
      reason: `你在${place}拉起临时互助队，未来可能有人帮你；现在先被会议和热浪双重加热。`
    })
  },
  {
    text: () => '开避暑直播',
    icon: 'Volume2',
    detail: '搞笑赚钱但升温。',
    data: (_place, spot) => ({
      temp: 1.0,
      money: 5,
      mind: -4,
      reason: `你在${spot}开播讲求生段子，打赏来了，冷气没来。弹幕很热闹，你也很热。`
    })
  },
  {
    text: () => '标记后续路线',
    icon: 'Gauge',
    detail: '获得地图支线但升温。',
    data: (place) => ({
      temp: 0.4,
      mind: 2,
      flag: 'parkingMap',
      reason: `你把${place}的阴影路线记进地图，后续可能少走弯路；现在多站了一会儿，体温上扬。`
    })
  },
  {
    text: () => '搬开挡路杂物',
    icon: 'ShieldAlert',
    detail: '耗体力换补给。',
    data: (_place, spot) => ({
      temp: 0.6,
      body: -5,
      water: 6,
      reason: `你搬开${spot}的杂物找到水，体力被热浪啃了一口，补给算是赔礼。`
    })
  },
  {
    text: () => '翻找冰块券',
    icon: 'Wallet',
    detail: '支线小收益。',
    data: (place) => ({
      temp: 0.3,
      money: 2,
      flag: 'iceCoupon',
      reason: `你在${place}翻到一张冰块券，纸面很凉，翻找过程很热。`
    })
  },
  {
    text: () => '蹲守等风',
    icon: 'Brain',
    detail: '恢复精神但不稳定。',
    data: (_place, spot) => ({
      temp: 0.5,
      mind: 6,
      morale: 2,
      reason: `你在${spot}等来半口风，也等来一身汗。精神回了一点，体温不太配合。`
    })
  }
];

function makeContextChoices(place, spot, theme, placeIndex, themeIndex) {
  return [0, 1, 2].map((offset) => {
    const template = contextChoiceSets[(placeIndex * 3 + themeIndex + offset * 5) % contextChoiceSets.length];
    const data = template.data(place, spot);
    return c(
      `${template.text(place, spot)}，${themeActionText(theme, placeIndex, themeIndex, offset)}`,
      template.icon,
      template.detail,
      {
        ...data,
        reason: `${data.reason}${contextReasonTail(theme, place, spot, offset)}`
      }
    );
  });
}

function contextReasonTail(theme, place, spot, offset) {
  const tails = {
    寻宝: [
      ` 你顺手翻了${spot}的角落，找到的东西不多，但足够证明这里没白来。`,
      ` ${place}的储物痕迹很乱，你少走一步弯路，就少被热浪多烤一分钟。`,
      ` 那些被遗忘的箱柜给了你一点线索，也给了汗水继续营业的理由。`
    ],
    检修: [
      ` 设备虽然老得像退休返聘，但一旦恢复转动，热空气就没那么嚣张。`,
      ` 你把故障点摸清了，后续再遇到风扇、电池和排风口就不会像猜谜。`,
      ` 这类地方的冷气都藏在机器脾气里，修得好是降温，修不好是桑拿。`
    ],
    阴影交易: [
      ` 阴影在这里已经变成硬通货，你多问一句价，就少被坑一层皮。`,
      ` 摊主看你不像完全好骗，交易成本终于从“离谱”降到“还能忍”。`,
      ` 你学会了这里的遮阳规矩，至少下一次不会拿现金买到一片心理阴影。`
    ],
    水源追踪: [
      ` 水声在热浪里比导航还可信，你跟着它走，身体终于得到一点实际回报。`,
      ` ${spot}附近的潮气不是幻觉，补水机会就藏在这些不起眼的缝里。`,
      ` 找水这件事不体面但科学，汗腺收到补给后立刻恢复一点职业道德。`
    ],
    支线线索: [
      ` 墙上的标记和旧路线对得上，后面也许能少走一段要命的晒路。`,
      ` 线索暂时不能喝也不能吹风，但它能让你下一次少犯热到发昏的错。`,
      ` 你把可疑记号记下来，未来的你大概率会感谢现在这个还没熟透的你。`
    ],
    联盟机会: [
      ` 临时队伍吵归吵，真遇到太阳发疯时，多一个人就多一片能凑出来的阴影。`,
      ` 你把互助关系往前推了一点，代价是现场沟通热得像开会没空调。`,
      ` 这不是单纯聊天，是把零散幸存者拼成一把勉强能遮阳的伞。`
    ],
    太阳能试验: [
      ` 光照角度测准后，太阳从纯粹敌人变成了非常讨厌但能发电的同事。`,
      ` 你多晒一会儿换到电力情报，身体抱怨，电池表示可以接受。`,
      ` ${place}的日照太足，坏消息是烫，好消息是终于能被你利用一点。`
    ],
    冰券奇遇: [
      ` 旧票据看着像垃圾，但末日里能换冰的纸比励志标语有用多了。`,
      ` 你把票根收好，未来也许能换来一块真正说话算话的冰。`,
      ` 翻票据这事很狼狈，不过比空手对着太阳讲道理靠谱。`
    ],
    名声风险: [
      ` 你避开了一部分视线，但这种做法会在幸存者小圈子里留下热乎乎的传闻。`,
      ` 这里的人记性不差，尤其会记住谁抢过冷风、谁把尴尬留给别人。`,
      ` 名声一旦变热，后面排队、交易和求助都会多一层麻烦。`
    ],
    搞笑避暑: [
      ` 偏方听起来离谱，执行起来更离谱，但至少精神没有当场融化。`,
      ` 围观群众笑得很开心，科学原理沉默了一会儿，体温也趁机刷了存在感。`,
      ` 你用荒诞感对抗热浪，效果不稳定，但心态暂时没被晒成干货。`
    ]
  };
  const options = tails[theme] ?? [` ${place}的情况被你摸清了一点，代价也实实在在落到了身上。`];
  return options[offset % options.length];
}

function themeActionText(theme, placeIndex = 0, themeIndex = 0, offset = 0) {
  const actions = {
    寻宝: ['翻角落旧箱', '查可疑柜门', '摸索隐藏隔层', '翻找密封袋', '搜寻冷物资'],
    检修: ['听设备异响', '排查供电口', '拧紧散热片', '重接旧线路', '试启备用机'],
    阴影交易: ['询问遮阳位', '压低阴影租金', '换半小时凉处', '打听棚位规矩', '争取靠墙阴凉'],
    水源追踪: ['追着滴水找', '查潮湿墙缝', '听管道回声', '试探漏水点', '沿水痕前进'],
    支线线索: ['抄下旧标记', '拍下路线图', '辨认墙上暗号', '记录可疑编号', '对照旧地图'],
    联盟机会: ['拉人搭遮阳', '凑临时小队', '交换互助口令', '分工守住阴影', '约定后续接应'],
    太阳能试验: ['测电板角度', '找最佳日照点', '调整充电朝向', '试接太阳能线', '记录发电时段'],
    冰券奇遇: ['翻找兑换章', '核对旧票根', '收好冰券线索', '查过期票据', '辨认真冰凭证'],
    名声风险: ['躲开熟人视线', '绕过围观人群', '压低存在感', '避开摊主记仇', '混进人群边缘'],
    搞笑避暑: ['试偏方效果', '留个冷笑话', '测试离谱装备', '假装自己很凉', '保住一点心态']
  };
  const options = actions[theme] ?? ['处理当前麻烦'];
  return options[(placeIndex * 2 + themeIndex + offset) % options.length];
}

function makePrimaryChoice(place, spot, theme, action, icon, detail, data) {
  return c(action, icon, detail, {
    ...data,
    reason: `${data.reason}${primaryReasonTail(theme, place, spot)}`
  });
}

function generatedActionText(theme, action, placeIndex) {
  const actions = {
    寻宝: ['翻找密封箱', '撬开旧补给柜', '摸索封存角落', '检查遗留背包', '搜寻未拆物资'],
    检修: ['修好嗡嗡设备', '重启老旧风机', '排查冷风管线', '接回备用电源', '敲醒罢工机器'],
    阴影交易: ['换半片阴凉', '租临时遮阳位', '买一段棚下时间', '谈下靠墙凉处', '换取避暑角落'],
    水源追踪: ['沿滴水声探索', '寻找漏水管', '追查潮湿墙缝', '接住管道冷凝水', '顺着水痕摸路'],
    支线线索: ['记录旧地图', '拓下墙上暗号', '拍下路线标记', '核对旧门牌编号', '抄走避暑线索'],
    联盟机会: ['邀请路人入伙', '拉起互助队', '交换接应点', '凑人守阴影', '组织轮流放哨'],
    太阳能试验: ['架起小太阳能板', '校准充电角度', '接上备用电池板', '测试光照发电', '摆正临时电板'],
    冰券奇遇: ['翻到旧冰块兑换券', '找出过期冰票', '核验冷饮票根', '摸到兑换印章', '收起真冰凭证'],
    名声风险: ['插队抢占冷风口', '硬挤进凉风位', '抢先占住风口', '借乱混进阴影区', '冒名领冷风号'],
    搞笑避暑: ['试用奇怪降温偏方', '挑战离谱冷感仪式', '戴上自制遮阳神器', '表演心理制冰术', '测试民间凉快秘方']
  };
  const options = actions[theme] ?? [action];
  return options[placeIndex % options.length];
}

function primaryReasonTail(theme, place, spot) {
  const tails = {
    寻宝: ` ${spot}里留下的密封箱和旧柜子没有被完全搜空，你冒着热浪翻找，换来的是实打实的补给机会。`,
    检修: ` ${place}的设备还没彻底报废，修好它就可能换来风、电或短暂冷气，修砸了也会让你被热风现场批评。`,
    阴影交易: ` ${spot}的遮阳位已经被摊主当成稀缺商品，你花钱买的不是面子，是少晒一会儿的物理优势。`,
    水源追踪: ` 滴水声从${spot}深处传来，你追的是水源，也是身体继续散热的最后一点底气。`,
    支线线索: ` ${spot}的旧地图和涂鸦能指向后续路线，现在多抄几笔，后面可能少走一段晒到怀疑人生的路。`,
    联盟机会: ` ${place}的人都缺资源，但也都缺一个肯先开口的人；互助关系一旦搭起来，后面能换来阴影、风扇和救场。`,
    太阳能试验: ` ${place}的太阳毒得离谱，反过来也意味着电力机会充足，你是在把敌方火力改造成临时能源。`,
    冰券奇遇: ` ${spot}残留的票据和兑换章还有价值，找到它们也许能在后面换到真冰，而不只是心理安慰。`,
    名声风险: ` ${place}人多眼杂，你要抢冷风或插队就得承担后续名声成本，凉快可能是真的，麻烦也是真的。`,
    搞笑避暑: ` ${spot}的偏方摊看起来不太科学，但热浪已经很荒唐了，你只是用更荒唐的方式抢回一点心态。`
  };
  return tails[theme] ?? ` ${place}的情况会直接影响这次选择的代价和收益。`;
}

const generatedEventLibrary = generatedPlaces.flatMap(([place, spot, scene], placeIndex) =>
  generatedThemes.map(([theme, action, icon, detail, data], themeIndex) => {
    const turn = (placeIndex + themeIndex) % 3;
    const contextChoices = makeContextChoices(place, spot, theme, placeIndex, themeIndex);
    return {
      turn,
      title: `${place}${theme}`,
      place: `${place} · ${spot}`,
      scene,
      headline: `${place}不会免费送命运，所有活路都要付出一点热量、资源或尊严。`,
      choices: [
        makePrimaryChoice(place, spot, theme, generatedActionText(theme, action, placeIndex), icon, detail, data),
        ...contextChoices
      ]
    };
  })
);

const findScheduledEvent = (title) => schedule.flat().find((event) => event.title === title);
const branchFollowups = [
  { flag: 'shopFriend', turn: 0, weight: 12, event: shop },
  { flag: 'bathEnemy', turn: 2, weight: 12, event: bath },
  { flag: 'parkingMap', turn: 1, weight: 12, event: parking },
  { flag: 'solarPanel', turn: 1, weight: 10, event: findScheduledEvent('正午太阳能板回访') },
  { flag: 'roofAlliance', turn: 0, weight: 10, event: findScheduledEvent('楼顶避暑联盟') },
  { flag: 'roofAlliance', turn: 1, weight: 10, event: findScheduledEvent('午间联盟分歧') },
  { flag: 'iceCoupon', turn: 2, weight: 10, event: findScheduledEvent('傍晚降温券兑换') },
  { flag: 'wanted', turn: 0, weight: 10, event: findScheduledEvent('冷库通缉令') },
  { flag: 'reliefLead', turn: 1, weight: 8, event: findScheduledEvent('午后移动水站') },
  { flag: 'hotlineFavor', turn: 1, weight: 8, event: findScheduledEvent('午后移动水站') }
].filter((item) => item.event);

function getWeightedBranchEvents(state) {
  return branchFollowups
    .filter((item) => state.flags[item.flag] && item.turn === state.turn)
    .flatMap((item) => Array.from({ length: item.weight }, () => item.event));
}

export function getCurrentEvent(state) {
  if (state.flags.shopFriend && state.day === 4 && state.turn === 0) return withKey(shop);
  if (state.flags.bathEnemy && state.day === 8 && state.turn === 2) return withKey(bath);
  if (state.flags.parkingMap && state.day === 9 && state.turn === 1) return withKey(parking);
  const base = schedule[(state.day - 1) % schedule.length][state.turn];
  const generated = generatedEventLibrary.filter((event) => event.turn === state.turn);
  const chaos = cityChaosEvents.filter((event) => event.turn === state.turn);
  const cityLife = cityLifeEvents.filter((event) => event.turn === state.turn);
  const branchBoost = getWeightedBranchEvents(state);
  const pool = [base, ...branchBoost, ...randomEvents[state.turn], ...chaos, ...cityLife, ...generated].filter((event) => {
    if (state.day <= 1 && event.title.includes('文文')) return false;
    return true;
  });
  const seen = new Set(state.seenEvents ?? []);
  const freshPool = pool.filter((event) => !seen.has(`${event.title}|${event.place}`));
  const usablePool = freshPool.length > 0 ? freshPool : pool;
  const index = Math.floor((state.eventSalt ?? 0) * usablePool.length) % usablePool.length;
  return withKey(usablePool[index]);
}

const suddenEvents = [
  {
    title: '突发：柏油路反光',
    temp: 0.5,
    mind: -2,
    text: '柏油路突然反光，像城市给你补了一记热耳光。体温 +0.5°C，精神 -2。'
  },
  {
    title: '突发：阴云路过',
    temp: -0.4,
    text: '一小片阴云路过，所有人都像看见稀有动物一样安静。体温 -0.4°C。'
  },
  {
    title: '突发：共享冰柜短路',
    temp: 0.4,
    power: -5,
    text: '共享冰柜短路，电池被临时借走救场。体温 +0.4°C，电力 -5。'
  },
  {
    title: '突发：好心人递水',
    water: 7,
    temp: -0.3,
    text: '一个路人递来半瓶水，说“别问，问就是我刚醒悟”。水分 +7，体温 -0.3°C。'
  },
  {
    title: '突发：热线占线',
    mind: -5,
    temp: 0.3,
    text: '高温热线占线，你听了三分钟等待音乐。精神 -5，体温 +0.3°C。'
  },
  {
    title: '突发：猫咪发现阴影',
    temp: -0.5,
    mind: 3,
    text: '橘色异短猫精准找到一块阴影，并用眼神允许你共享。体温 -0.5°C，精神 +3。'
  },
  {
    title: '突发：自动售货机吐币',
    money: 5,
    text: '一台晒糊的售货机突然吐出零钱，像在交代遗产。现金 +5。'
  },
  {
    title: '突发：热风卷走钞票',
    money: -4,
    mind: -2,
    text: '一阵热风卷走几张钞票，你追了两步后决定尊重自然。现金 -4，精神 -2。'
  },
  {
    title: '突发：临时冷雾喷头',
    temp: -0.8,
    water: 3,
    text: '路边喷头短暂复活，喷出三秒钟文明之光。体温 -0.8°C，水分 +3。'
  },
  {
    title: '突发：停电广播',
    power: -7,
    mind: -3,
    text: '广播宣布局部限电，你的电池被迫加入大局。电力 -7，精神 -3。'
  },
  {
    title: '突发：太阳被云骂走',
    temp: -0.6,
    morale: 4,
    text: '一片云路过，形状像在骂太阳。体温 -0.6°C，士气 +4。'
  },
  {
    title: '突发：手机过热关机',
    power: -4,
    mind: -4,
    text: '手机宣布自己也要生存，直接关机。电力 -4，精神 -4。'
  },
  {
    title: '突发：楼下送来冰毛巾',
    temp: -0.7,
    water: -2,
    mind: 4,
    text: '邻居递来一条冰毛巾，虽然用掉一点水，但你暂时像个人。体温 -0.7°C，水分 -2，精神 +4。'
  },
  {
    title: '突发：误踩烫井盖',
    temp: 0.7,
    body: -3,
    text: '你误踩一块烫井盖，脚底获得末日烙印。体温 +0.7°C，体力 -3。'
  },
  {
    title: '突发：捡到半瓶电解质水',
    water: 10,
    temp: -0.4,
    text: '你捡到半瓶没过期太久的电解质水。水分 +10，体温 -0.4°C。'
  },
  {
    title: '突发：猫咪拍掉开关',
    power: -3,
    morale: 5,
    text: '橘猫一爪拍掉风扇开关。电力 -3，但它太理直气壮，士气 +5。'
  },
  {
    title: '突发：广播冷笑话',
    mind: 5,
    temp: -0.2,
    text: '高温广播讲了一个冷笑话，真的有点冷。精神 +5，体温 -0.2°C。'
  },
  {
    title: '突发：热浪回弹',
    temp: 0.9,
    water: -4,
    text: '巷口热浪突然回弹，像城市打了个热嗝。体温 +0.9°C，水分 -4。'
  },
  {
    title: '突发：小型太阳能回血',
    power: 8,
    temp: 0.2,
    text: '一块小太阳能板意外充上电，代价是你多晒了一会儿。电力 +8，体温 +0.2°C。'
  },
  {
    title: '突发：天降仙女文文',
    tempTo: 36,
    fullRestore: true,
    morale: 12,
    text: '天空裂开一线清凉，仙女文文踏着像冰晶一样的光降临。她美得温柔又明亮，眼睛像末日前最后一片干净湖水，笑容让热浪自动退后三步。她带来天界冷凝补给，合理原因是高温世界触发了“过热保护”：水分、电力、现金、精神、体力全部补到 99，体温降至 36°C。'
  }
];

export function rollSuddenEvent(state) {
  if (state.status !== 'playing') return null;
  const risk = state.temp >= 44.5 || state.water < 14 || state.power < 8 || state.mind < 18 ? 0.42 : 0.24;
  if (Math.random() > risk) return null;
  const pool = suddenEvents.filter((event) => {
    if (state.day <= 1 && event.title.includes('文文')) return false;
    if (state.currentEventIsWenwen && event.title.includes('文文')) return false;
    return true;
  });
  return pool[Math.floor(Math.random() * pool.length)];
}
