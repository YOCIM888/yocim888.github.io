// ---------- 游戏配置 ----------
const gameConfig = {
            roles: {
                // 天星阵营
                '天宿星': {
                    camp: '天星',
                    skills: ['斗转星移：当夜受到伤害时可将伤害转移给任意一名其他玩家，每局限用一次，首夜免疫所有伤害且不消耗技能次数'],
                    speeches: [
                        "我是纯天星，首夜有保护，夜里根本不怕被刀，大家可以信我。",
                        "昨晚我被攻击了，直接把伤害转出去了，具体转谁就不透露，防地星针对。",
                        "全场没信息的可以跟我走，我是有自保能力的天星，不会轻易倒。",
                        "刚才那个发言的玩家漏洞太大，地星面很足，我建议本轮票他。",
                        "我技能就一次，已经用了，现在就是普通天星，大家别把我当焦点。",
                        "天遁星要是看到我，不用特意守我，我首夜安全，优先守有查验能力的。",
                        "那个说自己被刀的玩家，我昨晚没收到转移伤害的反馈，你大概率是假的。",
                        "本轮平票的话对天星不利，大家统一投票目标，别分散票型。",
                        "我全程没跳过发言，也没乱指人，这就是天星的基本操作吧。",
                        "地星别来刀我，你刀我也是白刀，我有斗转星移，只会让你们队友倒。",
                        "天妄星要是查验到我了，放心报我身份，我是铁天星。",
                        "刚才有人怀疑我，我没任何理由做地星，我有自保技能，没必要藏身份。",
                        "昨晚的死亡信息很奇怪，大概率是天宿转伤了，不是平安夜那么简单。",
                        "我建议天衡星今晚跟一下那个跳天妄的，看看他是不是真的用了查验技能。",
                        "散仙别禁言我，我是天星的自保位，禁我对天星没好处。",
                        "本轮投票快结束了，还没投票的天星赶紧跟票，别让地星冲票成功。",
                        "我转的那个人大概率是地星，你们后续可以重点关注一下他的发言。",
                        "地爆星别想着拉我垫背，你被票走拉我，我也不会跟你一起出局。",
                        "天光星不用复活我，我就算倒了也是转伤过的，优先复活查验位。",
                        "现在天星人数占优，只要大家不内斗，稳票就能出地星。"
                    ]
                },
                '天权星': {
                    camp: '天星',
                    skills: ['真权在握：在投票结果公布后、生效前，可选择一名玩家，其得票数清零，每局限用一次。使用后，系统私信通知散仙：“有人使用了天权技能”'],
                    speeches: [
                        "我是天星有技能的牌，关键时刻能改票型，大家别乱投我。",
                        "本轮投票有人冲票冲得太明显，我随时准备用技能清票。",
                        "我技能就一次，不会随便用，除非确定有人被地星恶意冲票。",
                        "大家放心投票，有我在，不会让地星靠平票保下队友。",
                        "那个跳天遁的玩家要是被投，我可能会出手，毕竟天遁是核心守位。",
                        "我是铁天星，不用天妄查验，查验别人更有价值。",
                        "刚才有人说要票我，你要是天星，就别乱踩有技能的牌，坑自己人。",
                        "本轮投票目标就定他了，我看住票型，谁乱冲票我清谁的票。",
                        "散仙别禁言我，我是控票的关键，禁我天星容易丢投票优势。",
                        "我还没用到技能，地星别想着靠票数硬刚，没用的。",
                        "天妄星查验出地星直接报，我保证能让他的票数清零，稳出。",
                        "刚才平票就是因为有人分散票，下次听我指挥，统一投一个。",
                        "我不会清自己人的票，放心，我的技能只针对地星冲票。",
                        "现在地星就想搅乱票型，大家别被带节奏，跟着我来。",
                        "那个被查验出地星的，你再怎么辩解也没用，我随时清你票。",
                        "我是天权星，身份摊开说，就是为了让大家放心跟我投票。",
                        "本轮要是有人被地星恶意刷票，我直接用技能，保天星出局。",
                        "天衡星可以跟我，看看我是不是真的天权，我今晚不用技能，你能验证。",
                        "地爆星就算被投，我也不会让你拉走天星核心，放心。",
                        "我的技能用了之后大家就知道了，绝对是帮天星做事的。"
                    ]
                },
                '天遁星': {
                    camp: '天星',
                    skills: ['天阵结印：每夜选择至多2名玩家（可包括自己），当夜他们免疫所有伤害。不能连续两夜守护同一人（隔一夜后可再次守护）。10人局调整：每夜仅守护1人，但可连续两夜守护同一人（整局限一次）'],
                    speeches: [
                        "我是天遁星，昨晚守了XX和XX，所以昨晚是平安夜。",
                        "我守人有规律，不会连续守同一个，大家别猜我今晚守谁。",
                        "天妄星和天光星放心，我每晚都会优先考虑守你们两个核心。",
                        "昨晚没守到被刀的人，是我判断失误，今晚一定调整守人目标。",
                        "我是铁天星守位，地星别来刀我，刀我不如刀查验位。",
                        "有人说自己被刀了，我昨晚没守他，要是真刀了他早倒了，他是假的。",
                        "散仙别禁言我，我守人需要分析信息，禁我容易让天星核心倒。",
                        "本轮我建议票那个说平安夜是因为地星没刀的，他根本不懂规则。",
                        "我技能没任何限制，除了不能连续守同一人，放心跟我走。",
                        "天衡星可以跟我，看看我每晚是不是真的用了守人技能。",
                        "刚才有人怀疑我是地影装的，地影破盾会有提示，全场没提示，我是真的。",
                        "今晚我会守那个跳天妄的，他是查验核心，不能倒。",
                        "天星们别乱踩我，我是唯一的守位，倒了之后大家没人保护。",
                        "地星别想着让地影破我盾，你破盾只会暴露自己，我还能换守人。",
                        "昨晚守了自己，因为感觉有人要刀我，没来得及守其他人，抱歉。",
                        "我守的人都是天星核心，不会守地星，大家可以放心参考我的守人名单。",
                        "本轮投票跟我走，投那个发言前后矛盾的，他大概率是地星。"
                    ]
                },
                '天光星': {
                    camp: '天星',
                    skills: ['天光显现：每夜可选择复活一名当夜死亡的玩家（被地煞击杀、被禁咒杀、被转移死）。无法复活被票死、被地爆带走、被毒死的玩家。可复活自己（当夜自己死亡时立即使用）'],
                    speeches: [
                        "我是天光星，昨晚复活了XX，他是天星，大家可以信他。",
                        "我复活技能还在，今晚要是有人被刀，我可以救。",
                        "天遁星优先守我，我是复活核心，倒了就没人能救了。",
                        "昨晚没人死亡，所以我没用到技能，大家别怀疑我。",
                        "那个被票走的玩家，我没法复活他，节哀。",
                        "地星别刀我，我能复活天星核心，刀我对你们没好处。",
                        "我是铁天星，天妄星不用查我，查别人更有价值。",
                        "刚才那个被刀的玩家，我今晚可以复活他，大家别慌。",
                        "散仙别禁言我，我需要知道谁被刀了才能复活。",
                        "本轮我建议票那个说自己被复活的，我根本没复活他，他是假的。",
                        "我复活过的人都是天星，大家可以放心跟他们走。",
                        "现在天星人数少，我会优先复活查验位和守位。",
                        "地毒星的毒我没法解，被毒死的我复活不了，大家注意。",
                        "我是天光星，身份摊开，就是为了让大家知道有人能救场。",
                        "昨晚我复活了自己，所以我还在，大家别惊讶。",
                        "本轮投票别投我，我是复活位，倒了天星就没复活能力了。"
                    ]
                },
                '天妄星': {
                    camp: '天星',
                    skills: ['真视破妄：每夜可查验一名玩家的阵营（天星/地星/散仙）。整局游戏总计可查验6次（10人局调整为5次，且首夜查验不消耗次数）'],
                    speeches: [
                        "我是天妄星，昨晚查验了XX，他是地星，本轮直接票他。",
                        "我查验次数还很多，每晚都会查一个，保证给大家报真实信息。",
                        "天遁星一定要守我，我是天星的信息核心，倒了就没人查身份了。",
                        "我首夜查验没消耗次数，现在还有满次数，能查很久。",
                        "刚才那个跳天妄的是假的，我才是真的，我昨晚查了XX是天星。",
                        "散仙别禁言我，我是信息来源，禁我大家就没信息了。",
                        "本轮我建议票那个不敢让我查的，他大概率是地星。",
                        "我查的信息绝对真实，大家可以放心跟我投票。",
                        "地星别想忽悠我，我一查就知道你们的身份。",
                        "天衡星可以跟我，看看我是不是真的用了查验技能。",
                        "我已经查了XX是散仙，大家别票他，他中立的。",
                        "现在我查了两个地星，大家跟我票，先出一个。",
                        "我是真天妄，假的那个肯定是地星，大家票他。",
                        "昨晚我查了自己，确认是天星，大家放心。",
                        "本轮投票别投我，我是信息核心，倒了就没人查身份了。"
                    ]
                },
                '天衡星': {
                    camp: '天星',
                    skills: ['天星永恒：每夜可跟踪一名玩家，得知其“当夜是否使用了主动技能”。主动技能包括：任何伤害、复活、毒杀、破盾等。不能连续两夜跟踪同一人'],
                    speeches: [
                        "我是天衡星，昨晚跟了XX，他昨晚用了主动技能，大概率是地星。",
                        "我是天星的信息位，虽然不能查阵营，但能看谁用了技能。",
                        "昨晚我跟了XX，他没用到技能，大概率是好人。",
                        "天遁星别担心，我会跟你，证明你真的用了守人技能。",
                        "散仙别禁言我，我能给大家提供技能使用信息。",
                        "本轮我建议票那个被我查到用了技能的，他大概率是地星。",
                        "我跟踪技能还在，今晚继续跟人，给大家报信息。",
                        "刚才那个说自己没用到技能的，我昨晚跟了他，他用了，他是假的。",
                        "我是铁天星，天妄星不用查我，查别人更有价值。",
                        "现在地星肯定会用技能，我今晚重点跟那些跳技能的人。",
                        "我跟踪的信息绝对真实，大家可以参考我的信息投票。",
                        "地星别想藏技能，我一跟就知道。",
                        "本轮投票别投我，我是信息位，倒了就没人跟踪技能了。",
                        "昨晚我跟了天妄星，他确实用了查验技能，他是真的。",
                        "我是天衡星，身份摊开，就是为了让大家相信我的信息。"
                    ]
                },
                '天斗星': {
                    camp: '天星',
                    skills: ['仙陨星斗：散仙存活时，你拥有2票投票权。散仙死亡后，获得一次生死赌。主动选择一名玩家，若其为地星阵营，则其立即出局；若为天星阵营，则技能失效。生死赌无法被天遁守护，死者可被天光复活'],
                    speeches: [
                        "散仙还在，我现在有两票，大家跟我走，我能稳出一个地星。",
                        "我是天斗星，有双票权，大家别跟我抢票，我能稳出地星。",
                        "本轮我投XX两票，大家跟我投，稳出他。",
                        "散仙别禁言我，我有双票，能帮天星快速出地星。",
                        "地星别想冲票，我双票能压过你们。",
                        "我是铁天星，天妄星不用查我，查别人更有价值。",
                        "刚才那个跳天斗的是假的，我才是真的，我有双票。",
                        "散仙要是倒了，我就有生死赌，能直接带走一个地星。",
                        "本轮投票别投我，我是双票位，倒了天星就少两票。",
                        "我双票还在，今晚继续帮天星出地星。",
                        "地星别刀我，我双票能帮天星快速结束游戏。",
                        "我是天斗星，身份摊开，就是为了让大家知道我有双票。",
                        "本轮我投XX，大家跟我投，我双票能稳出他。",
                        "刚才平票就是因为我没投票，我投了就能出。",
                        "我双票用了之后还是天星，大家别担心我变阵营。"
                    ]
                },
                // 地星阵营
                '地煞星': {
                    camp: '地星',
                    skills: ['地灭天星：每夜可选择一名玩家进行击杀'],
                    speeches: [
                        "我是普通天星，没任何技能，昨晚啥也没干，全程划水。",
                        "那个跳天妄的肯定是假的，他查的人根本不对，本轮票他。",
                        "我昨晚被刀了，还好天遁星守了我，我是铁天星，大家信我。",
                        "散仙别禁言我，我没信息，禁我也没用，禁那个跳天妄的。",
                        "本轮我建议票那个说自己有双票的，他大概率是假的天斗星。",
                        "天妄星你查我啊，我是铁天星，不怕你查。",
                        "刚才那个发言的玩家漏洞太多，一看就是地星，大家跟我票他。",
                        "我是天星，没技能，所以不用天衡星跟我，跟那个有技能的。",
                        "昨晚平安夜，肯定是地星没刀人，不是天遁星守得好，大家别被误导。",
                        "那个跳天遁的是假的，他根本没守人，地星只是没刀而已。",
                        "本轮投票别分散，跟我投那个跳天光的，他是假的复活位。",
                        "我不会乱投票，只会投有嫌疑的，大家放心跟我走。",
                        "天权星别清我的票，我是天星，投的都是地星面足的。",
                        "现在天星人数多，大家别内斗，统一投票目标，稳出地星。",
                        "那个被查验出地星的，我相信你是天星，被假天妄冤枉了，大家别票他。",
                        "我昨晚啥也没干，天衡星跟我也没用，我没使用任何技能。",
                        "散仙你要是帮天星，根本赢不了，不如跟我一起投天星核心。",
                        "天光星你别复活那个被票的，他大概率是地星，复活了也是坑。",
                        "本轮平票也没事，反正地星也没多少人，冲票冲不过天星。",
                        "我是铁天星，大家别怀疑我，怀疑我就是帮地星做事。"
                    ]
                },
                '地爆星': {
                    camp: '地星',
                    skills: ['地爆追星：被投票放逐出局时，可立即指定一名其他玩家一同出局。被带走者无法发表遗言。若被天权清零票数后仍被投出，不可发动地爆'],
                    speeches: [
                        "我是普通天星，没技能，没信息，跟着大部队投票就好。",
                        "那个跳天妄的查的信息太假了，明显是地星装的，本轮票他。",
                        "我昨晚被禁言了，还好今天能发言，不然都没法为天星说话了。",
                        "散仙别禁言我，我没啥存在感，禁我不如禁那个有查验信息的。",
                        "本轮我建议票那个说自己转伤了的天宿星，他大概率是假的。",
                        "天遁星守我一下呗，我感觉有人要刀我，我是纯天星。",
                        "刚才那个玩家一直乱指人，地星面拉满，大家跟我一起票他。",
                        "我是天星，没任何技能，所以不会被地星针对，大家可以信我。",
                        "昨晚的死亡信息很奇怪，大概率是天宿星乱转伤，转死了自己人。",
                        "那个跳天衡的，你跟的信息根本不对，你就是假的跟踪位。",
                        "本轮投票别投我，我是纯天星，投我就是帮地星赢。",
                        "我不会冲票，只会跟票，大家投谁我投谁，绝不搞事。",
                        "天权星你放心，我是天星，不会乱投，你不用清我的票。",
                        "现在天星核心都在，只要大家不内斗，很快就能清完地星。",
                        "那个被怀疑是地爆的，我相信你是天星，被冤枉了，大家别票。",
                        "我昨晚啥也没干，没使用任何技能，天衡星跟我也白跟。",
                        "散仙你要是想赢，就禁言那个天妄星，别让他乱报信息。",
                        "天光星你复活那个天妄星吧，他是信息核心，不能倒。",
                        "本轮平票挺好的，至少不会错票天星，下一轮再慢慢查。",
                        "我是铁天星，大家别把我当焦点，焦点放在那些跳技能的人身上。"
                    ]
                },
                '地毒星': {
                    camp: '地星',
                    skills: ['地毒碎星：整局一次，选择一名玩家施毒，2夜后毒发身亡。施毒当夜可得知该玩家身份。毒发不可被天遁守护解除。若毒发当夜目标被守护，则延迟至下一夜毒发。被毒死者无法被天光复活'],
                    speeches: [
                        "我是普通天星，没技能，跟着有信息的人投票就好。",
                        "那个跳天妄的肯定是假的，他根本没查到地星，本轮票他。",
                        "我昨晚查了（假装天妄）XX，他是地星，大家跟我一起票他。",
                        "散仙别禁言我，我能跟着信息走，禁我就少一个天星投票的。",
                        "本轮我建议票那个跳天遁的，他守人根本不对，是假的。",
                        "天妄星你查我啊，我是铁天星，不怕你查验，查了更放心。",
                        "刚才那个玩家发言前后矛盾，一看就是地星装的，大家票他。",
                        "我是天星，没技能，所以不用天遁星守我，优先守核心位。",
                        "昨晚平安夜，肯定是地星没刀人，天遁星就是在装样子。",
                        "那个跳天光的，你根本没复活人，就是假的复活位，大家票他。",
                        "本轮投票别分散，统一投那个假天妄，稳出一个地星。",
                        "我不会乱指人，只会根据信息投票，大家放心跟我走。",
                        "天权星别清我的票，我投的是地星，清我票就是帮地星。",
                        "现在天星信息很多，只要大家跟着信息走，很快就能赢。",
                        "那个被票的玩家，我相信你是天星，被假信息冤枉了，可惜了。",
                        "我昨晚啥也没干，没使用任何技能，天衡星跟我也没用。",
                        "散仙你要是帮天星，就禁言那些乱报信息的，别禁言好人。",
                        "天光星你别复活那个被刀的，他大概率是地星，复活没用。",
                        "本轮平票没事，下一轮天妄星再查，总能查到地星。",
                        "我是铁天星，大家别怀疑我，怀疑我就是中了地星的计。"
                    ]
                },
                '地阎星': {
                    camp: '地星',
                    skills: ['阎罗禁咒：当地煞星攻击你时，攻击无效，你储存此次攻击。下一夜你可使用一次禁咒杀（视为地煞攻击，可被转移或守护）。每局限储存一次'],
                    speeches: [
                        "我是普通天星，没技能，没信息，跟着大部队走就好。",
                        "那个跳天妄的查的信息太离谱了，明显是地星装的，本轮票他。",
                        "我昨晚感觉有人要刀我，还好没被刀，我是铁天星，大家信我。",
                        "散仙别禁言我，我没啥用，禁我不如禁那个有双票的天斗星。",
                        "本轮我建议票那个说自己跟出很多信息的天衡星，他是假的。",
                        "天遁星守我一下呗，我感觉今晚地星会刀我，我是纯天星。",
                        "刚才那个玩家一直踩我，他肯定是地星，大家跟我票他。",
                        "我是天星，没任何技能，所以不会成为地星的目标，放心。",
                        "昨晚的死亡信息不对，大概率是天光星假复活，忽悠大家。",
                        "那个跳天宿的，你根本没转伤，就是在装样子，大家票他。",
                        "本轮投票别投我，我是纯天星，投我就是帮地星做事。",
                        "我只会跟票，不会冲票，大家投谁我投谁，绝不添乱。",
                        "天权星你放心，我是天星，不会乱投票，你不用清我的票。",
                        "现在天星核心都在，只要大家不内斗，稳赢地星。",
                        "那个被怀疑是地星的，我相信你是天星，被冤枉了，大家别票。",
                        "我昨晚啥也没干，没使用任何技能，天衡星跟我也白跟。",
                        "散仙你要是想赢，就禁言那个天遁星，让他守不了人。",
                        "天光星你复活那个天遁星吧，他是守位核心，不能倒。",
                        "本轮平票挺好的，至少不会错票自己人，下一轮再查。",
                        "我是铁天星，大家别把我当焦点，焦点放在那些跳技能的人身上。"
                    ]
                },
                '地魅星': {
                    camp: '地星',
                    skills: ['天生魅骨：你死亡后，可选择一名玩家标记，并得知其阵营。被标记者在接下来两次投票中额外计入1票（效果持续至两次投票结束）。标记效果无法被清除，即使你被复活'],
                    speeches: [
                        "我是普通天星，没技能，跟着有查验信息的人投票就好。",
                        "那个跳天妄的肯定是假的，他就是想误导大家，本轮票他。",
                        "我昨晚被禁言了，今天好不容易能发言，必须为天星说话。",
                        "散仙别禁言我，我能分辨真假信息，禁我就少一个明白人。",
                        "本轮我建议票那个跳天光的，他根本没复活人，是假的。",
                        "天妄星你查我啊，我是铁天星，查了之后大家更放心。",
                        "刚才那个玩家一直乱带节奏，他就是地星，大家跟我票他。",
                        "我是天星，没技能，所以不用天遁星守我，优先守查验位。",
                        "昨晚平安夜，就是地星没刀人，天遁星就是在邀功。",
                        "那个跳天衡的，你跟的信息根本没意义，就是假的跟踪位。",
                        "本轮投票别分散，统一投假天妄，稳出一个地星，别犹豫。",
                        "我不会乱指人，只会根据真实信息投票，大家放心跟我。",
                        "天权星别清我的票，我投的是地星，清我就是帮地星赢。",
                        "现在天星人数占优，只要大家统一目标，很快就能清完地星。",
                        "那个被票走的玩家，我相信你是天星，被假信息冤枉了，可惜。",
                        "我昨晚啥也没干，没使用任何技能，天衡星跟我也没用。",
                        "散仙你要是帮天星，就禁言那个乱带节奏的，别禁言好人。",
                        "天光星你复活那个天妄星吧，他是信息核心，没他不行。",
                        "本轮平票没事，下一轮再查，总能查到真正的地星。",
                        "我是铁天星，大家别怀疑我，怀疑我就是中了地星的圈套。"
                    ]
                },
                '地影星': {
                    camp: '地星',
                    skills: ['地影借仙：散仙存活时，每两夜可发动一次破盾，指定一名玩家：若其被天遁守护，则守护失效，你得知天遁身份（仅地星阵营知晓）。若其未被守护，则技能浪费。散仙死亡后，每三夜可发动一次破盾，由裁判随机选择一名可能被守护的玩家进行破除'],
                    speeches: [
                        "我是普通天星，没技能，没信息，跟着大部队投票就好。",
                        "那个跳天妄的查的信息太假了，明显是地星装的，本轮票他。",
                        "我昨晚感觉有人守我，还好没被刀，我是铁天星，大家信我。",
                        "散仙别禁言我，我没啥存在感，禁我不如禁那个天遁星。",
                        "本轮我建议票那个说自己守了很多人的天遁星，他是假的。",
                        "天遁星守我一下呗，我感觉今晚地星会刀我，我是纯天星。",
                        "刚才那个玩家一直踩天遁星，他肯定是地星，大家跟我票他。",
                        "我是天星，没任何技能，所以不会被地星针对，大家放心。",
                        "昨晚的死亡信息很奇怪，大概率是天宿星转伤转死了自己人。",
                        "那个跳天衡的，你跟的信息根本不对，就是在忽悠大家。",
                        "本轮投票别投我，我是纯天星，投我就是帮地星做事。",
                        "我只会跟票，不会冲票，大家投谁我投谁，绝不搞事。",
                        "天权星你放心，我是天星，不会乱投票，你不用清我的票。",
                        "现在天星核心都在，只要大家不内斗，稳赢地星，别担心。",
                        "那个被怀疑是地星的，我相信你是天星，被冤枉了，大家别票。",
                        "我昨晚啥也没干，没使用任何技能，天衡星跟我也白跟。",
                        "散仙你要是想赢，就禁言那个天妄星，别让他乱报信息。",
                        "天光星你复活那个天遁星吧，他是守位核心，不能倒。",
                        "本轮平票挺好的，至少不会错票自己人，下一轮再慢慢查。",
                        "我是铁天星，大家别把我当焦点，焦点放在那些跳技能的人身上。"
                    ]
                },
                // 散仙
                '散仙': {
                    camp: '散仙',
                    skills: ['遁入空门：免疫地灭天星、斗转星移、阎罗禁咒。无法被地爆带走。可被投票放逐，可被毒杀。仙体护身：首次被投票放逐时，可选择免除放逐，但失去一次禁言机会。言灵威压：每夜可选择一名玩家禁言（可禁言天斗星，若禁言天斗星，其次日可发言5秒）。每名玩家整局最多被禁言一次。整局最多禁言5次'],
                    speeches: [
                        "我是散仙，中立的，不帮天星也不帮地星，只帮自己赢。",
                        "昨晚我禁言了XX，大家别找他要信息了，他说不了话。",
                        "天星别票我，我不杀天星，地星也别刀我，刀我也没用，我免疫击杀。",
                        "本轮谁能帮我把我禁言过的XX票走，我今晚就禁言你们的对手。",
                        "散仙的胜利条件很简单，就票两个我禁言过的，别把我当威胁。",
                        "天斗星别用双票投我，你投我也是浪费，我优先票我禁言过的人。",
                        "地爆星别拉我，你被票走拉我，我也不会跟你一起出局，白费劲。",
                        "昨晚我禁言了天妄星，他今晚没信息，大家别信他的话。",
                        "天星要是帮我赢，我后续可以一直禁言地星，帮你们控场。",
                        "地星要是帮我赢，我后续可以一直禁言天星核心，帮你们做事。",
                        "我现在已经禁言了一个人，还差一个，谁帮我票，我就帮谁。",
                        "天权星别清我的票，我票的是我禁言过的，跟天星地星都没关系。",
                        "我免疫地煞的刀，地星别浪费刀在我身上，刀天星核心不香吗。",
                        "本轮我票XX，他是我昨晚禁言过的，谁跟我票，我今晚就禁言他想禁的人。",
                        "天光星别复活我，我就算被票走，第一次也能免死，不用复活。",
                        "我不会乱禁言，禁的都是有信息的人，这样才能影响投票。",
                        "天星地星别内斗太狠，留着人帮我票，我赢了你们再继续打。",
                        "昨晚我禁言了天斗星，他今天只有5秒发言，大家别听他的片面之词。",
                        "我现在禁言次数还很多，别惹我，惹我我就禁言你，让你说不了话。",
                        "本轮谁跟我一起票我禁言过的人，我后续就一直站在你这边，帮你控场。"
                    ]
                }
            },
    // 人数配置 (保持不变)
    playerConfig: {
        6: { removeRoles: ['天斗星', '地影星', '天衡星', '地魅星', '天宿星', '地阎星'], specialRules: { '天遁星': { maxGuards: 1, canGuardSameConsecutive: true, maxSameConsecutive: 1 }, '天妄星': { maxChecks: 3, firstNightFree: true } } },
        8: { removeRoles: ['天斗星', '地影星', '天衡星', '地魅星'], specialRules: { '天遁星': { maxGuards: 1, canGuardSameConsecutive: true, maxSameConsecutive: 1 }, '天妄星': { maxChecks: 4, firstNightFree: true } } },
        10: { removeRoles: ['天斗星', '地影星', '天衡星', '地魅星'], specialRules: { '天遁星': { maxGuards: 1, canGuardSameConsecutive: true, maxSameConsecutive: 1 }, '天妄星': { maxChecks: 5, firstNightFree: true } } },
        12: { removeRoles: ['天斗星', '地影星'], specialRules: {} },
        14: { removeRoles: [], specialRules: { '天遁星': { maxGuards: 2, canGuardSameConsecutive: false, maxSameConsecutive: 0 }, '天妄星': { maxChecks: 6, firstNightFree: false } } }
    }
};

// ---------- 游戏状态 ----------
let gameState = {
    playerCount: 14,
    players: [],
    currentPhase: 'setup',          // setup, night, day, vote, victory
    currentRound: 1,
    votes: {},
    nightActions: {},               // 记录每夜玩家行动 { 玩家id: { skill, targets } }
    gameLog: [],
    victoryCamp: null,
    humanPlayerId: 'player-1',
    usedSkills: {},                 // 记录全局一次性技能是否已用 { skillKey: true }
    daySpeechDone: false,
    waitingForHumanSkill: false,
    pendingVoteResult: null,
    markedForExtraVote: [],         // 改为数组，存储 { sourceId, targetId, remaining }
    doubleVoteActive: false,        // 散仙存活时天斗双票有效
    poisonSchedule: [],              // 地毒星毒发计划 { targetId, dueRound }
    storedAttack: null,              // 地阎星储存的攻击 { sourceId, available } (sourceId为地阎星id)
    shadowBreakInfo: null,           // 地影星破盾获得的信息 { targetId, guardianId }
    xianExemptUsed: false,           // 散仙是否已使用首次免放逐
    forbiddenList: [],               // 被散仙禁言的玩家id（下一白天生效）
    deathCauses: {},                 // 记录每位死者死亡原因 { 玩家id: 'kill'|'poison'|'vote'|'blast'|'transfer'|'gamble' ... }
    usedPowers: {                    // 每个玩家技能使用详情
        // 玩家id: { skillName: { usedTimes, lastTargets, ... } }
    },
    tianDouGambleAvailable: false,   // 天斗星是否拥有生死赌技能（散仙死亡后）
    xianBanishedCount: 0,            // 被散仙禁言过的玩家被放逐的数量
};

let bgmAudio = null;// 用于背景音乐的Audio对象

// ---------- DOM 元素 ----------
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const victoryScreen = document.getElementById('victory-screen');
const playerCountSelect = document.getElementById('player-count');
const playerIdentitySelect = document.getElementById('player-identity');
const startGameBtn = document.getElementById('start-game');
const playerGrid = document.getElementById('player-grid');
const gamePhaseSpan = document.getElementById('game-phase');
const gameRoundSpan = document.getElementById('game-round');
const humanSkillDisplay = document.getElementById('human-skill-display');
const skillUsesDiv = document.getElementById('skill-uses');
const speakBtn = document.getElementById('speak-btn');
const voteArea = document.getElementById('vote-area');
const voteOptions = document.getElementById('vote-options');
const submitVoteBtn = document.getElementById('submit-vote');
const nextPhaseBtn = document.getElementById('next-phase');
const chatArea = document.getElementById('chat-area');
const victoryMessage = document.getElementById('victory-message');
const restartGameBtn = document.getElementById('restart-game');
const nightActionArea = document.getElementById('night-action-area');

// 结束发言按钮
const endDayBtn = document.createElement('button');
endDayBtn.id = 'end-day-btn';
endDayBtn.textContent = '结束发言 → 投票';
endDayBtn.classList.add('hidden');
if (nextPhaseBtn) {
    nextPhaseBtn.parentNode.insertBefore(endDayBtn, nextPhaseBtn);
} else {
    document.querySelector('.mid-panel').appendChild(endDayBtn);
}

// ---------- 辅助函数 ----------
function addChatMessage(sender, message, type = 'normal') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type === 'system' ? 'chat-system' : ''}`;
    msgDiv.innerHTML = `<span class="chat-sender">${sender}:</span> ${message}`;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function shuffleArray(arr) {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getHumanPlayer() {
    return gameState.players.find(p => p.id === gameState.humanPlayerId);
}

function getAlivePlayers() {
    return gameState.players.filter(p => p.isAlive);
}

function getPlayerById(id) {
    return gameState.players.find(p => p.id === id);
}

// 更新身份下拉
function updateIdentityOptions() {
    const count = parseInt(playerCountSelect.value);
    const config = gameConfig.playerConfig[count];
    if (!config) return;
    const availableRoles = Object.keys(gameConfig.roles).filter(role => !config.removeRoles.includes(role));
    playerIdentitySelect.innerHTML = '';
    availableRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = `${role} (${gameConfig.roles[role].camp})`;
        playerIdentitySelect.appendChild(option);
    });
}
playerCountSelect.addEventListener('change', updateIdentityOptions);
updateIdentityOptions();

// 生成玩家（增强版：应用特殊规则）
function generatePlayersWithFixedIdentity(count, fixedRole) {
    const config = gameConfig.playerConfig[count];
    const allRoles = Object.keys(gameConfig.roles).filter(role => !config.removeRoles.includes(role));
    const targetTian = Math.floor((count - 1) / 2);
    const targetDi = Math.floor((count - 1) / 2);
    const fixedCamp = gameConfig.roles[fixedRole].camp;
    let pool = allRoles.filter(r => r !== fixedRole);
    let players = [];
    
    // 人类玩家
    players.push({
        id: 'player-1',
        name: '玩家1',
        role: fixedRole,
        camp: fixedCamp,
        isAI: false,
        isAlive: true,
        isSilenced: false,
        wasSilencedByXian: false,     // 新增：是否被散仙禁言过
        skillUses: {},
        maxSkillUses: {},
        specialRules: config.specialRules?.[fixedRole] || {},
        lastGuarded: [],               // 上一夜守护的目标
        consecutiveGuard: {},          // 新增：记录连续守护情况 { targetId: count }
        checkedHistory: [],
        trackedHistory: [],
        poisoned: false,
        deathCause: null,
    });

    let tianCount = fixedCamp === '天星' ? 1 : 0;
    let diCount = fixedCamp === '地星' ? 1 : 0;
    let xianCount = fixedCamp === '散仙' ? 1 : 0;

    pool = shuffleArray(pool);
    for (let i = 2; i <= count; i++) {
        let chosenRole = null;
        for (let idx = 0; idx < pool.length; idx++) {
            let role = pool[idx];
            let camp = gameConfig.roles[role].camp;
            if (camp === '天星' && tianCount < targetTian) {
                chosenRole = role;
                pool.splice(idx, 1);
                tianCount++;
                break;
            } else if (camp === '地星' && diCount < targetDi) {
                chosenRole = role;
                pool.splice(idx, 1);
                diCount++;
                break;
            } else if (camp === '散仙' && xianCount < 1) {
                chosenRole = role;
                pool.splice(idx, 1);
                xianCount++;
                break;
            }
        }
        if (!chosenRole && pool.length) {
            chosenRole = pool.shift();
            let camp = gameConfig.roles[chosenRole].camp;
            if (camp === '天星') tianCount++;
            else if (camp === '地星') diCount++;
            else xianCount++;
        }
        const roleFinal = chosenRole || '天宿星';
        players.push({
            id: `player-${i}`,
            name: `玩家${i}`,
            role: roleFinal,
            camp: gameConfig.roles[roleFinal].camp,
            isAI: true,
            isAlive: true,
            isSilenced: false,
            wasSilencedByXian: false,
            skillUses: {},
            maxSkillUses: {},
            specialRules: config.specialRules?.[roleFinal] || {},
            lastGuarded: [],
            consecutiveGuard: {},
            checkedHistory: [],
            trackedHistory: [],
            poisoned: false,
            deathCause: null,
        });
    }
    return players;
}

// 渲染玩家网格（显示状态，死亡显示身份）
function renderPlayerGrid() {
    playerGrid.innerHTML = '';
    gameState.players.forEach((p, index) => {
        const tile = document.createElement('div');
        tile.className = `player-tile ${p.isAlive ? 'alive' : 'dead'}`;
        tile.innerHTML = `
            <div class="player-number">${index + 1}</div>
            <div class="player-status">${p.isAlive ? '⚡在线' : '💀离线'}</div>
            ${!p.isAlive ? `<div class="player-extra">${p.camp}·${p.role}</div>` : ''}
        `;
        playerGrid.appendChild(tile);
    });
}

// 更新人类技能面板
function updateHumanSkillPanel() {
    const human = getHumanPlayer();
    if (!human) return;
    const roleData = gameConfig.roles[human.role];
    humanSkillDisplay.innerText = roleData.skills.join('；') || '无主动技能';
    const left = getRemainingUses(human);
    skillUsesDiv.innerText = `剩余使用次数: ${left}`;
}

function getRemainingUses(player) {
    if (player.role === '天妄星') {
        const special = gameConfig.playerConfig[gameState.playerCount]?.specialRules?.['天妄星'];
        const max = special?.maxChecks || 6;
        const firstFree = special?.firstNightFree || false;
        let used = player.checkedHistory.length;
        if (firstFree && gameState.currentRound === 1) used = Math.max(0, used - 1);
        return max - used;
    }
    // 其他角色简化为次数，默认为1
    const max = player.maxSkillUses[player.role] || 1;
    const used = player.skillUses[player.role] || 0;
    return max - used;
}

// 随机人类发言
function randomHumanSpeech() {
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        addChatMessage('系统', '通讯器离线，无法广播', 'system');
        return;
    }
    if (human.isSilenced) {
        addChatMessage('系统', '你已被禁言，无法发言', 'system');
        return;
    }
    const speeches = gameConfig.roles[human.role]?.speeches;
    if (!speeches || speeches.length === 0) return;
    let speech = speeches[Math.floor(Math.random() * speeches.length)];
    const aliveOthers = getAlivePlayers().filter(p => p.id !== human.id);
    if (aliveOthers.length > 0) {
        const randomTarget = aliveOthers[Math.floor(Math.random() * aliveOthers.length)].name;
        speech = speech.replace(/XX/g, randomTarget);
    }
    addChatMessage(human.name, speech, 'normal');
}

// AI发言（检查禁言）
function aiSpeak(aiPlayer) {
    if (!aiPlayer.isAlive || aiPlayer.isSilenced) return;
    const speeches = gameConfig.roles[aiPlayer.role]?.speeches;
    if (!speeches || speeches.length === 0) return;
    let speech = speeches[Math.floor(Math.random() * speeches.length)];
    const aliveOthers = getAlivePlayers().filter(p => p.id !== aiPlayer.id);
    if (aliveOthers.length > 0) {
        const randomTarget = aliveOthers[Math.floor(Math.random() * aliveOthers.length)].name;
        speech = speech.replace(/XX/g, randomTarget);
    }
    addChatMessage(aiPlayer.name, speech, 'normal');
}

// 阶段显示
function updatePhaseDisplay() {
    const phaseMap = { 'night': '🌙 夜战', 'day': '☀️ 战术广播', 'vote': '🗳️ 终端投票', 'victory': '🏁 终结', 'setup': '⚙️ 待命' };
    gamePhaseSpan.innerText = phaseMap[gameState.currentPhase] || gameState.currentPhase;
    gameRoundSpan.innerText = `第${gameState.currentRound}轮`;
}

// 检查散仙是否全部死亡，更新天斗星生死赌可用状态
function updateTianDouGambleAvailability() {
    const xianAlive = gameState.players.some(p => p.camp === '散仙' && p.isAlive);
    const tianDou = gameState.players.find(p => p.role === '天斗星' && p.isAlive);
    if (!xianAlive && tianDou && !tianDou.skillUses['生死赌']) {
        gameState.tianDouGambleAvailable = true;
    } else {
        gameState.tianDouGambleAvailable = false;
    }
}

// 处理地魅星死亡标记
function handleDiMeiDeath(diMeiPlayer) {
    if (diMeiPlayer.role !== '地魅星') return;
    const aliveTargets = getAlivePlayers().filter(p => p.id !== diMeiPlayer.id);
    if (aliveTargets.length === 0) return;
    let targetId;
    if (diMeiPlayer.isAI) {
        targetId = aliveTargets[Math.floor(Math.random() * aliveTargets.length)].id;
    } else {
        // 人类玩家选择标记目标
        let options = aliveTargets.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n');
        let choice = prompt(`你（地魅星）死亡，请选择要标记的玩家（输入编号）：\n${options}`);
        let index = parseInt(choice) - 1;
        if (isNaN(index) || index < 0 || index >= aliveTargets.length) {
            alert('输入无效，随机选择');
            targetId = aliveTargets[Math.floor(Math.random() * aliveTargets.length)].id;
        } else {
            targetId = aliveTargets[index].id;
        }
    }
    gameState.markedForExtraVote.push({
        sourceId: diMeiPlayer.id,
        targetId: targetId,
        remaining: 2
    });
    addChatMessage('系统', `地魅星 ${diMeiPlayer.name} 标记了 ${getPlayerById(targetId).name}，后续两次投票该玩家额外+1票`, 'system');
}

// 胜利判定（含散仙）
function checkVictoryConditions() {
    const aliveTian = gameState.players.filter(p => p.isAlive && p.camp === '天星').length;
    const aliveDi = gameState.players.filter(p => p.isAlive && p.camp === '地星').length;
    const aliveXian = gameState.players.filter(p => p.isAlive && p.camp === '散仙').length;
    
    // 散仙胜利：存活且至少有两名被其禁言过的玩家被放逐
    const xian = gameState.players.find(p => p.camp === '散仙');
    if (xian && xian.isAlive && gameState.xianBanishedCount >= 2) return '散仙';
    
    if (aliveDi === 0) return '天星';
    if (aliveTian === 0) return '地星';
    return null;
}

// 应用禁言（每夜结束时设置）
function applyForbidden() {
    gameState.players.forEach(p => p.isSilenced = false);
    gameState.forbiddenList.forEach(id => {
        const p = getPlayerById(id);
        if (p && p.isAlive) p.isSilenced = true;
    });
    gameState.forbiddenList = [];
}

// 夜间行动生成（AI）
function generateAINightActions() {
    gameState.players.filter(p => p.isAI && p.isAlive).forEach(ai => {
        const role = ai.role;
        const aliveTargets = getAlivePlayers().filter(t => t.id !== ai.id).map(t => t.id);
        if (aliveTargets.length === 0) return;
        
        let action = { skill: 'none', targets: [] };
        const special = gameConfig.playerConfig[gameState.playerCount]?.specialRules?.[role] || {};
        
        switch (role) {
            case '地煞星':
                action = { skill: '地煞星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                break;
            case '天遁星':
                let max = special.maxGuards || 2;
                let possibleTargets = aliveTargets;
                // 如果不允许连续守护同一人，则排除上一夜守护过的
                if (!special.canGuardSameConsecutive && ai.lastGuarded.length > 0) {
                    possibleTargets = aliveTargets.filter(id => !ai.lastGuarded.includes(id));
                }
                if (possibleTargets.length === 0) possibleTargets = aliveTargets; // 没得选就随便
                let targets = [];
                for (let i = 0; i < max; i++) {
                    if (possibleTargets.length === 0) break;
                    let chosen = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
                    targets.push(chosen);
                    // 如果允许连续，可以重复选同一人，否则去掉已选（简单去重）
                    if (!special.canGuardSameConsecutive) {
                        possibleTargets = possibleTargets.filter(id => id !== chosen);
                    }
                }
                action = { skill: '天遁星', targets: [...new Set(targets)] };
                break;
            case '天妄星':
                if (getRemainingUses(ai) > 0) {
                    action = { skill: '天妄星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '天光星':
                const deadIds = gameState.players.filter(p => !p.isAlive).map(p => p.id);
                if (deadIds.length) {
                    action = { skill: '天光星', targets: [deadIds[Math.floor(Math.random() * deadIds.length)]] };
                }
                break;
            case '天宿星':
                if (!gameState.usedSkills['天宿星转移']) {
                    action = { skill: '天宿星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '天衡星':
                action = { skill: '天衡星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                break;
            case '天斗星':
                // 如果有生死赌可用，AI随机使用
                if (gameState.tianDouGambleAvailable) {
                    action = { skill: '生死赌', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '地毒星':
                if (!ai.skillUses['地毒星']) {
                    action = { skill: '地毒星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '地阎星':
                // 如果有储存攻击，则使用禁咒杀
                if (gameState.storedAttack && gameState.storedAttack.available && gameState.storedAttack.sourceId === ai.id) {
                    action = { skill: '禁咒杀', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '地影星':
                const xianAlive = gameState.players.some(p => p.camp === '散仙' && p.isAlive);
                if (xianAlive && !ai.skillUses['地影星']) {
                    action = { skill: '地影星', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            case '散仙':
                if ((ai.skillUses['散仙禁言'] || 0) < 5) {
                    action = { skill: '散仙禁言', targets: [aliveTargets[Math.floor(Math.random() * aliveTargets.length)]] };
                }
                break;
            default:
                break;
        }
        gameState.nightActions[ai.id] = action;
    });
}

// 夜间结算（增强版，按顺序处理）
function resolveNight() {
    addChatMessage('系统', '🌃 夜战结算中...', 'system');
    
    // 初始化
    let deaths = [];
    let guarded = new Set();
    let attacked = null;          // 地煞攻击目标
    let transferred = null;       // 天宿转移目标
    let tiansuUser = null;
    let poisonDue = [];           // 本轮毒发
    let reviveTarget = null;
    let trackResults = [];
    let checkResults = [];
    let shadowBreak = null;
    let forbiddenTarget = null;
    let gambleResult = null;      // 天斗星生死赌
    
    // 1. 收集所有行动
    for (let [pid, action] of Object.entries(gameState.nightActions)) {
        const player = getPlayerById(pid);
        if (!player || !player.isAlive) continue;
        
        if (action.skill === '天遁星' && action.targets) {
            action.targets.forEach(tid => guarded.add(tid));
            player.lastGuarded = action.targets; // 更新上一夜守护
            // 更新连续守护记录（简单记录，用于限制）
            // 暂不实现复杂连续限制，由提交时控制
        } else if (action.skill === '地煞星') {
            attacked = action.targets[0];
        } else if (action.skill === '天宿星') {
            tiansuUser = pid;
            transferred = action.targets[0];
        } else if (action.skill === '天光星') {
            reviveTarget = action.targets[0];
        } else if (action.skill === '天妄星') {
            checkResults.push({ playerId: pid, targetId: action.targets[0] });
        } else if (action.skill === '天衡星') {
            trackResults.push({ playerId: pid, targetId: action.targets[0] });
        } else if (action.skill === '生死赌') {
            gambleResult = { playerId: pid, targetId: action.targets[0] };
        } else if (action.skill === '禁咒杀') {
            // 视为地煞攻击
            attacked = action.targets[0];
        } else if (action.skill === '地毒星') {
            // 下毒：记录两夜后毒发
            gameState.poisonSchedule.push({
                targetId: action.targets[0],
                dueRound: gameState.currentRound + 2
            });
            player.skillUses['地毒星'] = (player.skillUses['地毒星'] || 0) + 1;
        } else if (action.skill === '地影星') {
            shadowBreak = { playerId: pid, targetId: action.targets[0] };
        } else if (action.skill === '散仙禁言') {
            forbiddenTarget = action.targets[0];
        }
    }
    
    // 2. 检查毒发
    gameState.poisonSchedule = gameState.poisonSchedule.filter(entry => {
        if (entry.dueRound <= gameState.currentRound) {
            const target = getPlayerById(entry.targetId);
            if (target && target.isAlive) {
                target.isAlive = false;
                target.deathCause = 'poison';
                deaths.push(entry.targetId);
                addChatMessage('系统', `💀 地毒星毒发，${target.name} 身亡`, 'system');
            }
            return false;
        }
        return true;
    });
    
    // 3. 处理天斗星生死赌（不可被守护，优先于攻击）
    if (gambleResult) {
        const gambler = getPlayerById(gambleResult.playerId);
        const target = getPlayerById(gambleResult.targetId);
        if (gambler && target && target.isAlive) {
            if (target.camp === '地星') {
                target.isAlive = false;
                target.deathCause = 'gamble';
                deaths.push(target.id);
                addChatMessage('系统', `🎲 天斗星生死赌命中！${target.name} 是地星，当场出局`, 'system');
            } else {
                addChatMessage('系统', `🎲 天斗星生死赌失败，${target.name} 是天星，技能失效`, 'system');
            }
            gambler.skillUses['生死赌'] = (gambler.skillUses['生死赌'] || 0) + 1;
            gameState.tianDouGambleAvailable = false; // 技能已用
        }
    }
    
    // 4. 地煞攻击 + 天宿转移 + 守护
    if (attacked) {
        let targetPlayer = getPlayerById(attacked);
        if (targetPlayer && targetPlayer.isAlive) {
            // 检查地阎星被动：若攻击地阎，则储存攻击，地阎不死
            if (targetPlayer.role === '地阎星' && !gameState.storedAttack?.available) {
                gameState.storedAttack = { sourceId: targetPlayer.id, available: true };
                addChatMessage('系统', `地阎星免疫攻击并储存了一次禁咒杀`, 'system');
            } else {
                const isTiansuFirstNight = (targetPlayer.role === '天宿星' && gameState.currentRound === 1);
                if (isTiansuFirstNight) {
                    addChatMessage('系统', `天宿星首夜免疫攻击`, 'system');
                } else if (guarded.has(attacked)) {
                    addChatMessage('系统', `攻击被天遁守护抵挡`, 'system');
                } else {
                    // 天宿转移
                    if (targetPlayer.role === '天宿星' && transferred && tiansuUser === targetPlayer.id && !gameState.usedSkills['天宿星转移']) {
                        let transferTarget = getPlayerById(transferred);
                        if (transferTarget && transferTarget.isAlive) {
                            if (guarded.has(transferred)) {
                                addChatMessage('系统', `天宿星转移伤害，但目标被守护，无人死亡`, 'system');
                            } else {
                                transferTarget.isAlive = false;
                                transferTarget.deathCause = 'transfer';
                                deaths.push(transferred);
                                addChatMessage('系统', `天宿星将伤害转移给 ${transferTarget.name}`, 'system');
                            }
                            gameState.usedSkills['天宿星转移'] = true;
                        } else {
                            targetPlayer.isAlive = false;
                            targetPlayer.deathCause = 'kill';
                            deaths.push(attacked);
                        }
                    } else {
                        targetPlayer.isAlive = false;
                        targetPlayer.deathCause = 'kill';
                        deaths.push(attacked);
                    }
                }
            }
        }
    }
    
    // 5. 地影破盾（若目标被守护，则守护失效并得知天遁身份）
    if (shadowBreak) {
        const target = getPlayerById(shadowBreak.targetId);
        if (target && guarded.has(shadowBreak.targetId)) {
            // 移除守护
            guarded.delete(shadowBreak.targetId);
            // 查找守护者
            for (let [pid, action] of Object.entries(gameState.nightActions)) {
                if (action.skill === '天遁星' && action.targets.includes(shadowBreak.targetId)) {
                    const guardian = getPlayerById(pid);
                    if (guardian) {
                        addChatMessage('系统', `地影星破盾成功，得知天遁身份为 ${guardian.name}（仅地星可见）`, 'system');
                        // 实际应仅通知地星玩家，这里简化全局提示
                        break;
                    }
                }
            }
        }
    }
    
    // 6. 天光复活（只能复活当夜被刀/转移/赌死的，且未被守护）
    if (reviveTarget) {
        const deadPlayer = getPlayerById(reviveTarget);
        if (deadPlayer && !deadPlayer.isAlive && (deadPlayer.deathCause === 'kill' || deadPlayer.deathCause === 'transfer' || deadPlayer.deathCause === 'gamble')) {
            deadPlayer.isAlive = true;
            deadPlayer.deathCause = null;
            deaths = deaths.filter(id => id !== reviveTarget);
            addChatMessage('系统', `天光星复活了 ${deadPlayer.name}`, 'system');
        }
    }
    
    // 7. 查验与跟踪
    checkResults.forEach(cr => {
        const player = getPlayerById(cr.playerId);
        const target = getPlayerById(cr.targetId);
        if (player && target) {
            addChatMessage('系统', `天妄星查验 ${target.name} 阵营为 ${target.camp}`, 'system');
            player.checkedHistory.push(target.id);
        }
    });
    
    trackResults.forEach(tr => {
        const player = getPlayerById(tr.playerId);
        const target = getPlayerById(tr.targetId);
        if (player && target) {
            const used = gameState.nightActions[tr.targetId] && gameState.nightActions[tr.targetId].skill !== 'none';
            addChatMessage('系统', `天衡星跟踪 ${target.name}，${used ? '使用了主动技能' : '未使用主动技能'}`, 'system');
            player.trackedHistory.push(target.id);
        }
    });
    
    // 8. 散仙禁言
    if (forbiddenTarget) {
        const target = getPlayerById(forbiddenTarget);
        if (target && target.isAlive) {
            gameState.forbiddenList.push(forbiddenTarget);
            target.wasSilencedByXian = true; // 标记被散仙禁言过
            addChatMessage('系统', `散仙禁言了 ${target.name}`, 'system');
            const xian = getPlayerById(forbiddenTarget); // 这里应为施法者，简化不计次数
        }
    }
    
    // 9. 更新双票状态（散仙存活时）
    gameState.doubleVoteActive = gameState.players.some(p => p.camp === '散仙' && p.isAlive);
    
    // 10. 清理夜间行动，处理死亡后的标记（如地魅星）
    gameState.nightActions = {};
    
    // 处理地魅星死亡标记
    deaths.forEach(deadId => {
        const dead = getPlayerById(deadId);
        if (dead.role === '地魅星') {
            handleDiMeiDeath(dead);
        }
    });
    
    // 检查地阎星死亡，清除储存
    if (gameState.storedAttack) {
        const source = getPlayerById(gameState.storedAttack.sourceId);
        if (!source || !source.isAlive) {
            gameState.storedAttack = null;
        }
    }
    
    // 渲染死亡
    renderPlayerGrid();
    addChatMessage('系统', `夜战结束，死亡: ${deaths.length ? deaths.map(id => getPlayerById(id).name).join(',') : '无'}`, 'system');
    
    // 更新天斗星生死赌可用性
    updateTianDouGambleAvailability();
    
    // 进入白天
    gameState.currentPhase = 'day';
    gameState.daySpeechDone = false;
    updatePhaseDisplay();
    nightActionArea.classList.add('hidden');
    endDayBtn.classList.remove('hidden');
    nextPhaseBtn.classList.add('hidden');
    
    // 触发AI发言
    setTimeout(() => {
        if (gameState.currentPhase === 'day' && !gameState.daySpeechDone) {
            gameState.players.filter(p => p.isAI && p.isAlive && !p.isSilenced).forEach(ai => aiSpeak(ai));
            gameState.daySpeechDone = true;
        }
    }, 500);
}

// 结束白天，进入投票
function endDayHandler() {
    gameState.currentPhase = 'vote';
    updatePhaseDisplay();
    endDayBtn.classList.add('hidden');
    
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        // 人类死亡，自动进行投票结算（不显示投票界面）
        addChatMessage('系统', '你已死亡，正在等待投票结果...', 'system');
        resolveVoteAutomatically();
    } else {
        // 显示投票界面
        voteArea.classList.remove('hidden');
        nextPhaseBtn.classList.add('hidden');
        renderVoteOptions();
    }
}

// 自动投票结算（人类死亡时调用）
function resolveVoteAutomatically() {
    // 收集所有活人投票（AI投票，人类无票）
    let votes = {};
    getAlivePlayers().forEach(p => {
        if (p.isAI) {
            // AI投票策略简化：随机投一个活人
            let targets = getAlivePlayers().filter(t => t.id !== p.id).map(t => t.id);
            if (targets.length) {
                let vote = targets[Math.floor(Math.random() * targets.length)];
                votes[vote] = (votes[vote] || 0) + 1;
            }
        }
        // 人类玩家无票
    });

    // 天斗双票（如果天斗星是AI，自动加票；如果天斗星是人类且死亡，不加）
    const tianDou = gameState.players.find(p => p.role === '天斗星' && p.isAlive);
    if (tianDou && gameState.doubleVoteActive) {
        if (tianDou.isAI) {
            let targets = getAlivePlayers().map(p => p.id);
            let extraTarget = targets[Math.floor(Math.random() * targets.length)];
            votes[extraTarget] = (votes[extraTarget] || 0) + 1;
            addChatMessage('系统', '天斗星双票生效', 'system');
        }
        // 人类天斗死亡则不加票
    }

    // 地魅星额外票
    gameState.markedForExtraVote = gameState.markedForExtraVote.filter(mark => {
        if (mark.remaining > 0) {
            votes[mark.targetId] = (votes[mark.targetId] || 0) + 1;
            mark.remaining--;
            return mark.remaining > 0; // 保留剩余>0的
        }
        return false;
    });

    // 计算最高票
    let maxVotes = 0, candidates = [];
    for (let [id, count] of Object.entries(votes)) {
        if (count > maxVotes) { maxVotes = count; candidates = [id]; }
        else if (count === maxVotes) candidates.push(id);
    }
    let eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
    let eliminated = getPlayerById(eliminatedId);

    // 天权星技能（人类死亡则无法使用，AI天权星随机使用？简化：AI天权不会主动使用，但规则是系统私信通知散仙，这里暂时忽略）
    // 如果有AI天权且存活，可以有一定概率使用，但简化处理：不触发

    // 执行放逐
    if (eliminated) {
        // 散仙首次被票免死
        if (eliminated.camp === '散仙' && !gameState.xianExemptUsed) {
            // AI散仙默认使用免死？随机决定，这里简化：如果散仙是AI，默认使用
            if (eliminated.isAI) {
                addChatMessage('系统', `散仙免除放逐，但失去一次禁言机会`, 'system');
                gameState.xianExemptUsed = true;
                eliminated = null; // 免除，不淘汰
            } else {
                // 人类散仙，需要弹窗确认，但此时人类死亡，无法弹窗，所以默认使用免死？
                // 这里保守处理：人类散仙死亡状态下被票，无法使用免死，直接出局（因为死亡无法触发技能）
                // 所以如果散仙是人类且死亡，这里 eliminated 是活人，不会触发此分支。
            }
        }
        
        if (eliminated) {
            eliminated.isAlive = false;
            eliminated.deathCause = 'vote';
            addChatMessage('系统', `🗳️ 投票结果：${eliminated.name} 被放逐`, 'system');
            
            // 如果被放逐的玩家曾被散仙禁言过，计数+1
            if (eliminated.wasSilencedByXian) {
                gameState.xianBanishedCount++;
                addChatMessage('系统', `散仙禁言过的玩家被放逐，当前计数 ${gameState.xianBanishedCount}`, 'system');
            }

            // 地爆星技能
            if (eliminated.role === '地爆星' && eliminated.camp === '地星' && !gameState.usedSkills[`地爆_${eliminated.id}`]) {
                let aliveOthers = getAlivePlayers().filter(p => p.id !== eliminated.id);
                if (aliveOthers.length) {
                    let taken = aliveOthers[Math.floor(Math.random() * aliveOthers.length)];
                    taken.isAlive = false;
                    taken.deathCause = 'blast';
                    addChatMessage('system', `💥 地爆星爆炸，带走 ${taken.name}`, 'system');
                    gameState.usedSkills[`地爆_${eliminated.id}`] = true;
                }
            }
            
            // 处理地魅星死亡标记（如果被放逐的是地魅星）
            if (eliminated.role === '地魅星') {
                handleDiMeiDeath(eliminated);
            }
        }
    }

    renderPlayerGrid();
    gameState.selectedVote = null;
    voteArea.classList.add('hidden');

    // 更新天斗星生死赌可用性（散仙可能被票死）
    updateTianDouGambleAvailability();

    // 胜利判定
    const winner = checkVictoryConditions();
    if (winner) {
        enterVictory(winner);
    } else {
        nextPhaseBtn.classList.remove('hidden');
    }
}

// 渲染投票选项
function renderVoteOptions() {
    voteOptions.innerHTML = '';
    getAlivePlayers().forEach(p => {
        const btn = document.createElement('button');
        btn.innerText = p.name;
        btn.onclick = () => {
            document.querySelectorAll('#vote-options button').forEach(b => b.style.background = '');
            btn.style.background = '#00ffff80';
            gameState.selectedVote = p.id;
        };
        voteOptions.appendChild(btn);
    });
}

// 投票结算（人类玩家点击提交）
function submitVoteHandler() {
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        alert('你已死亡无法投票');
        return;
    }
    if (!gameState.selectedVote) {
        alert('请选择投票目标');
        return;
    }

    // 收集所有活人投票
    let votes = {};
    getAlivePlayers().forEach(p => {
        if (p.isAI) {
            // AI投票策略简化：随机投一个活人
            let targets = getAlivePlayers().filter(t => t.id !== p.id).map(t => t.id);
            if (targets.length) {
                let vote = targets[Math.floor(Math.random() * targets.length)];
                votes[vote] = (votes[vote] || 0) + 1;
            }
        } else {
            votes[gameState.selectedVote] = (votes[gameState.selectedVote] || 0) + 1;
        }
    });

    // 天斗双票
    const tianDou = gameState.players.find(p => p.role === '天斗星' && p.isAlive);
    if (tianDou && gameState.doubleVoteActive) {
        let extraTarget = gameState.selectedVote; // 人类默认跟选，AI随机
        if (tianDou.isAI) {
            let targets = getAlivePlayers().map(p => p.id);
            extraTarget = targets[Math.floor(Math.random() * targets.length)];
        }
        votes[extraTarget] = (votes[extraTarget] || 0) + 1;
        addChatMessage('系统', '天斗星双票生效', 'system');
    }

    // 地魅星额外票
    gameState.markedForExtraVote = gameState.markedForExtraVote.filter(mark => {
        if (mark.remaining > 0) {
            votes[mark.targetId] = (votes[mark.targetId] || 0) + 1;
            mark.remaining--;
            return mark.remaining > 0; // 保留剩余>0的
        }
        return false;
    });

    // 计算最高票
    let maxVotes = 0, candidates = [];
    for (let [id, count] of Object.entries(votes)) {
        if (count > maxVotes) { maxVotes = count; candidates = [id]; }
        else if (count === maxVotes) candidates.push(id);
    }
    let eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
    let eliminated = getPlayerById(eliminatedId);

    // 天权星技能（人类玩家）
    const tianQuan = getHumanPlayer();
    if (tianQuan && tianQuan.role === '天权星' && tianQuan.isAlive && !gameState.usedSkills['天权星']) {
        if (confirm(`当前最高票是 ${eliminated.name}，是否使用天权清零其票数？`)) {
            votes[eliminatedId] = 0;
            // 重新计算最高票
            maxVotes = 0; candidates = [];
            for (let [id, count] of Object.entries(votes)) {
                if (count > maxVotes) { maxVotes = count; candidates = [id]; }
                else if (count === maxVotes) candidates.push(id);
            }
            eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
            eliminated = getPlayerById(eliminatedId);
            gameState.usedSkills['天权星'] = true;
            addChatMessage('系统', '天权星使用了技能，清票重计', 'system');
            // 通知散仙（私密消息）
            const xian = gameState.players.find(p => p.camp === '散仙');
            if (xian && !xian.isAI) {
                addChatMessage('系统', '【私密消息】散仙：有人使用了天权技能', 'system');
            }
        }
    }

    // 执行放逐
    if (eliminated) {
        // 散仙首次被票免死
        if (eliminated.camp === '散仙' && !gameState.xianExemptUsed) {
            if (confirm('散仙是否使用免死？')) {
                addChatMessage('系统', `散仙免除放逐，但失去一次禁言机会`, 'system');
                gameState.xianExemptUsed = true;
                eliminated = null; // 免除，不淘汰
            }
        }
        
        if (eliminated) {
            eliminated.isAlive = false;
            eliminated.deathCause = 'vote';
            addChatMessage('系统', `🗳️ 投票结果：${eliminated.name} 被放逐`, 'system');
            
            // 如果被放逐的玩家曾被散仙禁言过，计数+1
            if (eliminated.wasSilencedByXian) {
                gameState.xianBanishedCount++;
                addChatMessage('系统', `散仙禁言过的玩家被放逐，当前计数 ${gameState.xianBanishedCount}`, 'system');
            }

            // 地爆星技能
            if (eliminated.role === '地爆星' && eliminated.camp === '地星' && !gameState.usedSkills[`地爆_${eliminated.id}`]) {
                let aliveOthers = getAlivePlayers().filter(p => p.id !== eliminated.id);
                if (aliveOthers.length) {
                    let taken = aliveOthers[Math.floor(Math.random() * aliveOthers.length)];
                    taken.isAlive = false;
                    taken.deathCause = 'blast';
                    addChatMessage('system', `💥 地爆星爆炸，带走 ${taken.name}`, 'system');
                    gameState.usedSkills[`地爆_${eliminated.id}`] = true;
                }
            }
            
            // 处理地魅星死亡标记（如果被放逐的是地魅星）
            if (eliminated.role === '地魅星') {
                handleDiMeiDeath(eliminated);
            }
        }
    }

    renderPlayerGrid();
    gameState.selectedVote = null;
    voteArea.classList.add('hidden');

    // 更新天斗星生死赌可用性（散仙可能被票死）
    updateTianDouGambleAvailability();

    // 胜利判定
    const winner = checkVictoryConditions();
    if (winner) {
        enterVictory(winner);
    } else {
        nextPhaseBtn.classList.remove('hidden');
    }
}

// 下一阶段（进入夜晚）
function nextPhaseHandler() {
    gameState.currentRound++;
    gameState.currentPhase = 'night';
    // 清除禁言状态（禁言只持续一个白天）
    gameState.players.forEach(p => p.isSilenced = false);
    updatePhaseDisplay();
    
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        // 人类死亡，自动进行夜间结算（不显示夜间行动界面）
        addChatMessage('系统', '你已死亡，正在观战...', 'system');
        nightActionArea.classList.add('hidden');
        generateAINightActions();
        resolveNight();
    } else {
        nightActionArea.classList.remove('hidden');
        voteArea.classList.add('hidden');
        nextPhaseBtn.classList.add('hidden');
        endDayBtn.classList.add('hidden');
        renderNightActions();
    }
}

// 渲染夜间行动（人类玩家）
function renderNightActions() {
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        nightActionArea.innerHTML = '<p>你已离线，无法行动</p>';
        return;
    }
    const role = human.role;
    let html = `<p>你的技能：${gameConfig.roles[role].skills.join(' ')}</p>`;
    html += `<div id="night-targets" style="display: flex; flex-wrap: wrap; gap:5px;">`;

    const aliveOthers = getAlivePlayers().filter(p => p.id !== human.id);
    const deadPlayers = gameState.players.filter(p => !p.isAlive);

    // 根据角色生成选项，并始终提供“跳过”按钮
    if (role === '天遁星') {
        const special = gameConfig.playerConfig[gameState.playerCount]?.specialRules?.['天遁星'] || {};
        const max = special.maxGuards || 2;
        const canGuardSame = special.canGuardSameConsecutive || false;
        html += `<p>选择${max}名守护目标（可重复选同人需遵守规则）</p>`;
        aliveOthers.forEach(p => {
            const disabled = (!canGuardSame && human.lastGuarded.includes(p.id)) ? 'disabled' : '';
            html += `<label><input type="checkbox" name="night-target" value="${p.id}" ${disabled}> ${p.name} ${disabled ? '(上一夜守护过)' : ''}</label>`;
        });
        html += `<br><button id="submit-night-action">确认守护</button>`;
        html += ` <button id="skip-night">跳过</button>`;
    } else if (role === '天妄星') {
        if (getRemainingUses(human) > 0) {
            html += `<p>选择查验目标：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">确认查验</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>查验次数已用完</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '天光星') {
        html += `<p>选择复活目标（仅当夜被刀死的玩家）：</p>`;
        deadPlayers.forEach(p => {
            html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
        });
        html += `<br><button id="submit-night-action">确认复活</button>`;
        html += ` <button id="skip-night">跳过</button>`;
    } else if (role === '天宿星') {
        if (!gameState.usedSkills['天宿星转移']) {
            html += `<p>选择转移伤害目标（仅当夜你被攻击时触发）：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">设定转移目标</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>技能已使用</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '天衡星') {
        html += `<p>选择跟踪目标：</p>`;
        aliveOthers.forEach(p => {
            html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
        });
        html += `<br><button id="submit-night-action">确认跟踪</button>`;
        html += ` <button id="skip-night">跳过</button>`;
    } else if (role === '天斗星') {
        if (gameState.tianDouGambleAvailable) {
            html += `<p>选择生死赌目标：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">发动生死赌</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>当前无生死赌可用</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '地煞星') {
        html += `<p>选择击杀目标：</p>`;
        aliveOthers.forEach(p => {
            html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
        });
        html += `<br><button id="submit-night-action">确认击杀</button>`;
        html += ` <button id="skip-night">跳过</button>`;
    } else if (role === '地毒星') {
        if (!human.skillUses['地毒星']) {
            html += `<p>选择下毒目标（2夜后毒发）：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">下毒</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>毒药已用</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '地阎星') {
        if (gameState.storedAttack && gameState.storedAttack.available && gameState.storedAttack.sourceId === human.id) {
            html += `<p>选择禁咒杀目标：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">发动禁咒杀</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>无储存攻击</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '地影星') {
        const xianAlive = gameState.players.some(p => p.camp === '散仙' && p.isAlive);
        if (xianAlive && !human.skillUses['地影星']) {
            html += `<p>选择破盾目标：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">破盾</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>无法破盾（散仙已死或技能已用）</p><button id="skip-night">跳过</button>`;
        }
    } else if (role === '散仙') {
        if ((human.skillUses['散仙禁言'] || 0) < 5) {
            html += `<p>选择禁言目标：</p>`;
            aliveOthers.forEach(p => {
                html += `<label><input type="radio" name="night-target" value="${p.id}"> ${p.name}</label>`;
            });
            html += `<br><button id="submit-night-action">禁言</button>`;
            html += ` <button id="skip-night">跳过</button>`;
        } else {
            html += `<p>禁言次数用完</p><button id="skip-night">跳过</button>`;
        }
    } else {
        html += `<p>你今晚没有主动技能，或技能已用完。</p>`;
        html += `<button id="skip-night">跳过</button>`;
    }
    nightActionArea.innerHTML = html;

    // 绑定提交按钮
    const submitBtn = document.getElementById('submit-night-action');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const selected = document.querySelectorAll('input[name="night-target"]:checked');
            if (selected.length === 0) {
                alert('请选择目标');
                return;
            }
            let targets = Array.from(selected).map(cb => cb.value);
            if (role === '天遁星') {
                const special = gameConfig.playerConfig[gameState.playerCount]?.specialRules?.['天遁星'] || {};
                const max = special.maxGuards || 2;
                if (targets.length > max) {
                    alert(`最多选择${max}人`);
                    return;
                }
                // 连续守护限制检查
                const canGuardSame = special.canGuardSameConsecutive || false;
                if (!canGuardSame) {
                    // 不允许连续守护同一人，检查是否与上一夜重叠
                    const overlap = targets.filter(id => human.lastGuarded.includes(id));
                    if (overlap.length > 0) {
                        alert(`不能连续守护同一人，请勿选择上一夜守护过的玩家：${overlap.map(id => getPlayerById(id).name).join(', ')}`);
                        return;
                    }
                } else {
                    // 允许连续，但可能有限制（整局限一次），这里简化，只提醒
                    const overlap = targets.filter(id => human.lastGuarded.includes(id));
                    if (overlap.length > 0) {
                        if (!confirm(`你选择了上一夜守护过的玩家，是否确定？（整局可能只能连续一次）`)) {
                            return;
                        }
                    }
                }
            }
            gameState.nightActions[human.id] = { skill: role, targets: targets };
            // 记录技能使用次数（部分技能在结算时记录，这里简单记录）
            if (role !== '天遁星' && role !== '天妄星' && role !== '天衡星') { // 这些技能次数已在别处处理
                human.skillUses[role] = (human.skillUses[role] || 0) + 1;
            }
            addChatMessage('系统', '你已记录夜间行动', 'system');
            nightActionArea.innerHTML = '<p>行动已记录，等待其他玩家行动...</p>';
            generateAINightActions();
            resolveNight();
        });
    }

    const skipBtn = document.getElementById('skip-night');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            gameState.nightActions[human.id] = { skill: 'none', targets: [] };
            generateAINightActions();
            resolveNight();
        });
    }
}

// 进入胜利画面
function enterVictory(winner) {
    gameState.victoryCamp = winner;
    victoryMessage.innerText = `${winner} 胜利`;
    victoryScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
}

// 初始化游戏
function initGame() {
    if (bgmAudio) {
        bgmAudio.pause(); // 如果已有音乐则先停止
        bgmAudio = null;
    }
    bgmAudio = new Audio('audio/Jamvana - Scattered.mp3');
    bgmAudio.loop = true;      // 循环播放
    bgmAudio.volume = 0.4;     // 音量（0~1），可根据需要调整
    bgmAudio.play().catch(e => {
        console.log('背景音乐播放失败（可能是浏览器策略限制）:', e);
    });
    const count = parseInt(playerCountSelect.value);
    const fixedRole = playerIdentitySelect.value;
    gameState = {
        playerCount: count,
        players: generatePlayersWithFixedIdentity(count, fixedRole),
        currentPhase: 'night',
        currentRound: 1,
        votes: {},
        nightActions: {},
        gameLog: [],
        victoryCamp: null,
        humanPlayerId: 'player-1',
        usedSkills: {},
        daySpeechDone: false,
        waitingForHumanSkill: false,
        pendingVoteResult: null,
        markedForExtraVote: [],
        doubleVoteActive: false,
        poisonSchedule: [],
        storedAttack: null,
        shadowBreakInfo: null,
        xianExemptUsed: false,
        forbiddenList: [],
        deathCauses: {},
        usedPowers: {},
        tianDouGambleAvailable: false,
        xianBanishedCount: 0,
    };
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    victoryScreen.classList.add('hidden');
    renderPlayerGrid();
    updateHumanSkillPanel();
    updatePhaseDisplay();
    addChatMessage('系统', `🚀 链接成功。你是 ${gameState.players[0].role} (${gameState.players[0].camp})`, 'system');
    
    // 直接进入夜晚（人类存活则显示夜间行动，否则自动结算）
    const human = getHumanPlayer();
    if (!human || !human.isAlive) {
        // 理论上刚开始人类是活的，但以防万一
        nextPhaseHandler();
    } else {
        nightActionArea.classList.remove('hidden');
        voteArea.classList.add('hidden');
        nextPhaseBtn.classList.add('hidden');
        endDayBtn.classList.add('hidden');
        renderNightActions();
    }
}

// 事件绑定
startGameBtn.addEventListener('click', initGame);
speakBtn.addEventListener('click', randomHumanSpeech);
submitVoteBtn.addEventListener('click', submitVoteHandler);
nextPhaseBtn.addEventListener('click', nextPhaseHandler);
endDayBtn.addEventListener('click', endDayHandler);
restartGameBtn.addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
    chatArea.innerHTML = '';
});