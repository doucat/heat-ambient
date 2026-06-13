const c = (text, icon, detail, data) => ({ text, icon, detail, ...data });

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

export function getCurrentEvent(state) {
  if (state.flags.shopFriend && state.day === 4 && state.turn === 0) return shop;
  if (state.flags.bathEnemy && state.day === 8 && state.turn === 2) return bath;
  if (state.flags.parkingMap && state.day === 9 && state.turn === 1) return parking;
  return schedule[state.day - 1][state.turn];
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
  }
];

export function rollSuddenEvent(state) {
  if (state.status !== 'playing') return null;
  const risk = state.temp >= 44.5 || state.water < 14 || state.power < 8 || state.mind < 18 ? 0.42 : 0.24;
  if (Math.random() > risk) return null;
  return suddenEvents[Math.floor(Math.random() * suddenEvents.length)];
}
