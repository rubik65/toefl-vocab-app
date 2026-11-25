import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outPath = path.resolve(__dirname, '../src/data/words.json');
const existingWords = JSON.parse(fs.readFileSync(outPath, 'utf8'));
const existingMap = new Map(existingWords.map((w) => [w.id, w]));

const rawList773to956 = `
0773|relative|[rélətɪv]|adj./n.|比較の，関係のある / 親戚
0774|introduce|[ɪ̀ntrədjúːs]|v.|紹介する
0775|respective|[rɪspéktɪv]|adj.|それぞれの
0776|frost|[frɔ́(ː)st]|n.|霜
0777|manage|[mǽnɪdʒ]|v.|経営する，どうにかやっていく
0778|term|[tɜ́ːrm]|n.|学期，期間，（〜s）条件，専門用語
0779|view|[vjúː]|n.|眺め，（しばしば〜s）考え
0780|custom|[kʌ́stəm]|n.|慣例，顧客，（〜s）関税，税関
0781|introduction|[ɪ̀ntrədʌ́kʃən]|n.|紹介，序文
0782|positive|[pɑ́(ː)zətɪv]|adj.|肯定的な
0783|Arctic|[ɑ́ːrktɪk]|n.|（the 〜）北極（圏）
0784|furnish|[fɜ́ːrnɪʃ]|v.|（家具などを）備え付ける
0785|furniture|[fɜ́ːrnɪtʃər]|n.|家具
0786|accident|[ǽksɪdənt]|n.|事故
0787|effective|[ɪféktɪv]|adj.|有効な
0788|spacecraft|[spéɪskræ̀ft]|n.|宇宙船
0789|steel|[stíːl]|n.|鉄，鋼
0790|subject|[sʌ́bdʒekt]|n.|学科，主題，主語
0791|heritage|[hérɪtɪdʒ]|n.|遺産
0792|atmosphere|[ǽtməsfɪ̀ər]|n.|大気，雰囲気
0793|sulfur|[sʌ́lfər]|n.|硫黄
0794|expect|[ɪkspékt]|v.|予期する，期待する
0795|race|[réɪs]|n.|競争，人種
0796|drawer|[drɔ́ːər]|n.|引き出し
0797|deny|[dɪnáɪ]|v.|否定する
0798|ripe|[ráɪp]|adj.|熟した
0799|globe|[ɡlóʊb]|n.|球体，（通例 the 〜）地球
0800|suggest|[səɡdʒést]|v.|提案する，示唆する
0801|apply|[əpláɪ]|v.|申し込む，当てはまる，応用する
0802|population|[pɑ̀(ː)pjəléɪʃən]|n.|人口，（統計上の）母集団
0803|reform|[rɪfɔ́ːrm]|v.|改革する
0804|liberal|[lɪ́bərəl]|adj.|自由な
0805|active|[ǽktɪv]|adj.|活動的な
0806|assist|[əsɪ́st]|v.|手伝う
0807|overcome|[òʊvərkʌ́m]|v.|克服する，打ち勝つ
0808|principle|[prɪ́nsəpl]|n.|（通例 〜s）主義，原則
0809|sew|[sóʊ]|v.|縫う
0810|seed|[síːd]|n.|種
0811|behave|[bɪhéɪv]|v.|振る舞う
0812|advanced|[ədvǽnst]|adj.|進んだ
0813|comfortable|[kʌ́mfərtəbl]|adj.|快適な，気持ちのよい
0814|detail|[dɪtéɪl]|n.|（〜s）詳細，細部
0815|reach|[ríːtʃ]|v./n.|届く / 届く範囲
0816|volcano|[vɑ(ː)lkéɪnoʊ]|n.|火山
0817|guarantee|[ɡæ̀rəntíː]|v.|保証する
0818|infant|[ɪ́nfənt]|n.|幼児
0819|toxic|[tɑ́(ː)ksɪk]|adj.|有毒な
0820|create|[kri(ː)éɪt]|v.|創り出す，創造する
0821|ignore|[ɪɡnɔ́ːr]|v.|無視する
0822|central|[séntrəl]|adj.|中心の，中央の
0823|issue|[ɪ́ʃuː]|n.|発行（物），論点
0824|failure|[féɪljər]|n.|失敗
0825|proverb|[prɑ́(ː)vɜːrb]|n.|ことわざ
0826|squash|[skwɑ́(ː)ʃ]|n.|ウリ［カボチャ］の類
0827|radical|[rǽdɪkl]|adj.|急進的な
0828|mistake|[mɪstéɪk]|n.|誤り
0829|rest|[rést]|n./v.|休養 / 休む
0830|agree|[əɡríː]|v.|同意する
0831|economy|[ɪkɑ́(ː)nəmi]|n.|経済，倹約
0832|benefit|[bénəfɪt]|n.|利益，恩恵
0833|psychology|[saɪkɑ́(ː)lədʒi]|n.|心理学
0834|allow|[əláʊ]|v.|許可する，認める
0835|neat|[níːt]|adj.|こぎれいな
0836|twice|[twáɪs]|adv.|2倍（に）
0837|disappear|[dɪ̀səpɪ́ər]|v.|消える
0838|germ|[dʒɜ́ːrm]|n.|細菌
0839|inevitable|[ɪnévətəbl]|adj.|避けられない
0840|command|[kəmǽnd]|n./v.|命令 / 命令する
0841|influence|[ɪ́nfluəns]|n.|影響
0842|living|[lɪ́vɪŋ]|n.|生計，生活
0843|desire|[dɪzáɪər]|v.|希望する
0844|genre|[ʒɑ́ːnrə]|n.|（文学・音楽などの）ジャンル，様式
0845|choice|[tʃɔ́ɪs]|n.|選択
0846|process|[prɑ́(ː)ses]|n.|過程，プロセス
0847|indicate|[ɪ́ndɪkèɪt]|v.|示す
0848|support|[səpɔ́ːrt]|v.|支える
0849|neighboring|[néɪbərɪŋ]|adj.|隣の
0850|microscope|[máɪkrəskòʊp]|n.|顕微鏡
0851|proper|[prɑ́(ː)pər]|adj.|適正な
0852|aspect|[ǽspekt]|n.|局面，様子
0853|adapt|[ədǽpt]|v.|適合させる，改造する
0854|reluctant|[rɪlʌ́ktənt]|adj.|気の進まない，嫌々ながらの
0855|average|[ǽvərɪdʒ]|n./adj.|平均 / 平均の
0856|feeling|[fíːlɪŋ]|n.|感情，感覚
0857|economical|[ìːkənɑ́(ː)mɪkl]|adj.|経済的な，倹約した
0858|depend|[dɪpénd]|v.|依存する
0859|sprout|[spráʊt]|n./v.|芽 / 芽を出す
0860|estimate|[éstəmèɪt]|v.|見積もる
0861|heal|[híːl]|v.|（傷などを）癒やす
0862|discourage|[dɪskɜ́ːrɪdʒ]|v.|意気消沈させる
0863|reputation|[rèpjətéɪʃən]|n.|名声
0864|difficulty|[dɪ́fɪkʌ̀lti]|n.|困難
0865|earnest|[ɜ́ːrnɪst]|adj.|熱心な
0866|correct|[kərékt]|v./adj.|訂正する / 正しい
0867|defend|[dɪfénd]|v.|守る
0868|gradually|[ɡrǽdʒuəli]|adv.|徐々に
0869|respect|[rɪspékt]|v./n.|尊敬する / 尊敬
0870|fascinate|[fǽsənèɪt]|v.|魅了する
0871|allergic|[əlɜ́ːrdʒɪk]|adj.|アレルギー（性［体質］）の
0872|interval|[ɪ́ntərvəl]|n.|間隔，インターバル
0873|mature|[mətʊ́ər]|adj.|成熟した
0874|trouble|[trʌ́bl]|n.|困難，トラブル
0875|coal|[kóʊl]|n.|石炭
0876|generous|[dʒénərəs]|adj.|寛容な
0877|loss|[lɔ́(ː)s]|n.|損害，損失
0878|row|[róʊ]|n.|列，漕ぐこと
0879|interpret|[ɪntɜ́ːrprɪt]|v.|通訳する，解釈する
0880|nationality|[næ̀ʃənǽləti]|n.|国籍
0881|faculty|[fǽkəlti]|n.|（大学の）教授陣，学部，能力，才能，手腕
0882|option|[ɑ́(ː)pʃən]|n.|選択肢，オプション
0883|vegetarian|[vèdʒətéəriən]|n.|菜食（主義）者
0884|attach|[ətǽtʃ]|v.|取り付ける
0885|conclusion|[kənklúːʒən]|n.|結論
0886|claim|[kléɪm]|v.|要求する，主張する
0887|board|[bɔ́ːrd]|n./v.|板 / 乗り込む
0888|wheel|[hwíːl]|n.|車輪
0889|dawn|[dɔ́ːn]|n.|（the 〜）（物事の）始まり，夜明け
0890|imply|[ɪmpláɪ]|v.|暗示する
0891|national|[nǽʃənl]|adj.|国家の，国民の，全国的な
0892|apologize|[əpɑ́(ː)lədʒàɪz]|v.|謝る
0893|occasionally|[əkéɪʒənəli]|adv.|時折
0894|storm|[stɔ́ːrm]|n.|嵐
0895|ancient|[éɪnʃənt]|adj.|昔の，古代の
0896|existence|[ɪɡzɪ́stəns]|n.|存在
0897|award|[əwɔ́ːrd]|n.|賞
0898|variety|[vəráɪəti]|n.|変化，多様性，種類
0899|border|[bɔ́ːrdər]|n.|国境
0900|eloquent|[éləkwənt]|adj.|雄弁な
0901|deposit|[dɪpɑ́(ː)zɪt]|v./n.|（お金を）預ける / 預金，内金，手付金
0902|evolve|[ɪvɑ́(ː)lv]|v.|進化する
0903|enact|[ɪnǽkt]|v.|立法化する
0904|youth|[júːθ]|n.|青年（時代），若さ
0905|pedestrian|[pədéstriən]|n.|歩行者
0906|resolve|[rɪzɑ́(ː)lv]|v.|決意する，解決する，分解する
0907|federal|[fédərəl]|adj.|連邦の
0908|nearby|[nɪ́ərbáɪ]|adj./adv.|近くの / 近くに
0909|discuss|[dɪskʌ́s]|v.|議論する
0910|knit|[nɪ́t]|v.|編む
0911|headache|[hédeɪk]|n.|頭痛
0912|insight|[ɪ́nsaɪt]|n.|洞察力，見識
0913|mammal|[mǽməl]|n.|哺乳動物
0914|reasonable|[ríːznəbl]|adj.|程よい
0915|facility|[fəsɪ́ləti]|n.|容易さ，（しばしば〜ties）設備
0916|proof|[prúːf]|n.|証明
0917|gather|[ɡǽðər]|v.|集まる，集める
0918|except|[ɪksépt]|v./prep.|除外する / 〜を除いて（は）
0919|herd|[hɜ́ːrd]|n.|（牛や豚などの）群れ
0920|galaxy|[ɡǽləksi]|n.|（the G-）銀河系，天の川
0921|perform|[pərfɔ́ːrm]|v.|演じる
0922|return|[rɪtɜ́ːrn]|v./n.|戻る / （しばしば〜s）利益
0923|universe|[júːnəvɜ̀ːrs]|n.|（the 〜, the U-）宇宙，森羅万象
0924|spectator|[spékteɪtər]|n.|見物人
0925|neighbor|[néɪbər]|n./v.|隣人 / 隣接する
0926|invitation|[ɪ̀nvɪtéɪʃən]|n.|招待
0927|maintain|[meɪntéɪn]|v.|維持する
0928|exotic species|[ɪɡzɑ́ːtɪk spíːʃiːz]|n.|外来種
0929|synonym|[sɪ́nənɪm]|n.|同義語
0930|field|[fíːld]|n.|広い場所，畑，競技場
0931|prefer|[prɪfɜ́ːr]|v.|〜の方を好む
0932|supply|[səpláɪ]|n./v.|供給 / 供給する
0933|molecule|[mɑ́(ː)lɪkjùːl]|n.|分子
0934|exceedingly|[ɪksíːdɪŋli]|adv.|非常に，極めて
0935|device|[dɪváɪs]|n.|装置，工夫
0936|Antarctic|[æntɑ́ːrktɪk]|n.|（the 〜）南極
0937|expand|[ɪkspǽnd]|v.|拡張する
0938|nature|[néɪtʃər]|n.|自然
0939|refer|[rɪfɜ́ːr]|v.|参照する
0940|satellite|[sǽtəlàɪt]|n.|衛星
0941|conclude|[kənklúːd]|v.|結論づける
0942|determination|[dɪtɜ̀ːrmɪnéɪʃən]|n.|決意，決定
0943|export|[ɪkspɔ́ːrt]|v./n.|輸出する / （通例 〜s）輸出（品・額）
0944|politics|[pɑ́(ː)lətɪks]|n.|政治（学）
0945|fair|[féər]|adj.|公平な
0946|slope|[slóʊp]|n.|傾斜，スロープ
0947|share|[ʃéər]|n./v.|分け前，割当て分 / 分け合う
0948|nerve|[nɜ́ːrv]|n.|神経
0949|fate|[féɪt]|n.|（通例 one's 〜）運命
0950|gross|[ɡróʊs]|n.|総計
0951|bear|[béər]|v.|（心に）抱く，我慢する，（子を）産む
0952|shelf|[ʃélf]|n.|棚
0953|include|[ɪnklúːd]|v.|含む
0954|purpose|[pɜ́ːrpəs]|n.|目的，用途，決心
0955|bury|[béri]|v.|埋める
0956|Stone Age|[stóʊn éɪdʒ]|n.|（the 〜）石器時代
`.trim();

const examples773to956 = {
  773: [
    "Geologists determine the relative age of rock layers by examining their order.",
    "地質学者は地層の順序を調べることで比較の（相対的な）年代を特定する。"
  ],
  774: [
    "European settlers decided to introduce honeybees to North America for pollination.",
    "ヨーロッパの入植者は受粉のために北米へミツバチを導入（紹介）することを決めた。"
  ],
  775: [
    "After the joint conference, the two scientists returned to their respective laboratories.",
    "合同会議の後、2人の科学者はそれぞれの研究室へと戻った。"
  ],
  776: [
    "An early autumn frost can damage unharvested citrus crops overnight.",
    "初秋の霜は一晩のうちに未収穫の柑橘類の作物に被害を与えることがある。"
  ],
  777: [
    "National park rangers manage controlled burns to prevent catastrophic wildfires.",
    "国立公園のレンジャーは壊滅的な山火事を防ぐために計画的な野焼きを管理（運営）する。"
  ],
  778: [
    "Ecology is a scientific term coined in the nineteenth century.",
    "エコロジー（生態学）は19世紀に造られた科学の専門用語である。"
  ],
  779: [
    "The mountain summit offers a panoramic view of the surrounding glacier.",
    "その山頂からは周囲の氷河のパノラマの眺めが楽しめる。"
  ],
  780: [
    "Exchanging gifts during the winter solstice was an ancient Roman custom.",
    "冬至の時期に贈り物を交換することは古代ローマの慣例だった。"
  ],
  781: [
    "The author wrote a brief introduction explaining the purpose of the textbook.",
    "著者はその教科書の目的を説明する短い序文を書いた。"
  ],
  782: [
    "Compost has a positive effect on soil structure and moisture retention.",
    "堆肥は土壌構造と保水力に対して肯定的な（良い）効果をもたらす。"
  ],
  783: [
    "Polar bears hunt for seals across the frozen sea ice of the Arctic.",
    "ホッキョクグマは北極圏の凍った海氷の上でアザラシを狩る。"
  ],
  784: [
    "The university received a grant to furnish the new chemistry laboratory.",
    "大学は新しい化学実験室に設備（家具・備品）を備え付けるための助成金を受けた。"
  ],
  785: [
    "Colonial cabinetmakers crafted durable household furniture from local oak and maple.",
    "植民地時代の家具職人は地元のオークやカエデから丈夫な家庭用家具を作った。"
  ],
  786: [
    "The discovery of vulcanized rubber occurred partly by accident in 1839.",
    "加硫ゴムの発見は1839年に半ば偶然（不慮の事故・出来事）によって起こった。"
  ],
  787: [
    "Vaccination remains the most effective method for preventing viral epidemics.",
    "ワクチン接種はウイルスの流行を防ぐための最も有効な方法であり続けている。"
  ],
  788: [
    "The unmanned spacecraft transmitted high-resolution images of Saturn's rings.",
    "その無人宇宙船は土星の環の高解像度画像を送信した。"
  ],
  789: [
    "Bessemer's process allowed factories to mass-produce strong steel cheaply.",
    "ベッセマー法によって工場は強靭な鋼（鉄）を安価に大量生産できるようになった。"
  ],
  790: [
    "Botany became a popular subject of study during the eighteenth century.",
    "植物学は18世紀の間に人気の研究学科（主題）となった。"
  ],
  791: [
    "UNESCO helps protect cultural heritage sites such as ancient temples.",
    "ユネスコは古代寺院などの文化遺産を保護するのを支援している。"
  ],
  792: [
    "Earth's atmosphere consists mainly of nitrogen and oxygen gases.",
    "地球の大気は主に窒素と酸素の気体で構成されている。"
  ],
  793: [
    "Volcanic vents release yellow crystals of pure sulfur around the crater.",
    "火山の噴気孔は火口周辺に純粋な硫黄の黄色い結晶を放出する。"
  ],
  794: [
    "Astronomers expect the meteor shower to peak shortly after midnight.",
    "天文学者は流星群が真夜中過ぎにピークを迎えると予期している。"
  ],
  795: [
    "Two rival expeditions engaged in a dramatic race to reach the South Pole.",
    "2つのライバル遠征隊が南極点到達をめぐる劇的な競争を繰り広げた。"
  ],
  796: [
    "Each specimen was labeled and stored inside a wooden cabinet drawer.",
    "各標本はラベルが貼られ、木製キャビネットの引き出しの中に保管された。"
  ],
  797: [
    "No credible scientist can deny the importance of clean water for health.",
    "信頼できる科学者であれば誰も健康にとっての清潔な水の重要性を否定できない。"
  ],
  798: [
    "Fruit bats use their keen sense of smell to locate ripe mangoes.",
    "オオコウモリは鋭い嗅覚を使って熟したマンゴーの場所を見つける。"
  ],
  799: [
    "Ocean currents circulate warm and cold water around the entire globe.",
    "海流は地球全体にわたって暖水と冷水を循環させている。"
  ],
  800: [
    "Fossil pollen grains suggest that the desert was once a lush grassland.",
    "化石化した花粉粒は、その砂漠がかつて緑豊かな草原であったことを示唆している。"
  ],
  801: [
    "Engineers apply principles of aerodynamics when designing high-speed trains.",
    "技術者は高速鉄道を設計する際、空気力学の原理を応用する。"
  ],
  802: [
    "The island's seabird population has recovered since predators were removed.",
    "捕食者が排除されて以来、その島の海鳥の個体数（人口・母集団）は回復した。"
  ],
  803: [
    "Educational leaders worked to reform the outdated science curriculum.",
    "教育界の指導者たちは時代遅れの理科カリキュラムを改革するために尽力した。"
  ],
  804: [
    "A liberal arts education exposes students to literature, history, and philosophy.",
    "リベラルアーツ（自由学芸）教育は学生を文学、歴史、哲学に触れさせる。"
  ],
  805: [
    "Mount Etna is one of the most active volcanoes in Europe.",
    "エトナ山はヨーロッパで最も活動的な火山の一つである。"
  ],
  806: [
    "Trained guide dogs assist visually impaired individuals in navigating city streets.",
    "訓練された盲導犬は視覚障害のある人々が街路を移動するのを手伝う。"
  ],
  807: [
    "Early aviators had to overcome numerous mechanical challenges to achieve flight.",
    "初期の飛行家たちは飛行を実現するために数多くの機械的課題を克服しなければならなかった。"
  ],
  808: [
    "Archimedes discovered the fundamental principle of buoyancy in fluids.",
    "アルキメデスは流体における浮力の基本原則を発見した。"
  ],
  809: [
    "Inuit artisans used bone needles and sinew thread to sew warm parkas.",
    "イヌイットの職人は温かいパーカを縫うために骨の針と腱の糸を使った。"
  ],
  810: [
    "A tough outer coat protects the plant seed until moisture triggers germination.",
    "硬い外皮は水分が発芽を促すまで植物の種を保護している。"
  ],
  811: [
    "Quantum particles often behave like both waves and discrete particles.",
    "量子粒子はしばしば波と個別の粒子の両方のように振る舞う。"
  ],
  812: [
    "The ancient Maya developed a highly advanced calendar based on astronomy.",
    "古代マヤ人は天文学に基づく非常に進んだ暦を発達させた。"
  ],
  813: [
    "Thick wool fibers trap air, keeping sheep comfortable in cold weather.",
    "厚い羊毛の繊維が空気を閉じ込め、寒い天候でもヒツジを快適に保つ。"
  ],
  814: [
    "High-resolution photographs reveal every fine detail of the lunar craters.",
    "高解像度の写真は月面のクレーターのあらゆる細部（詳細）を明らかにする。"
  ],
  815: [
    "The roots of desert mesquite trees can reach depths of fifty meters.",
    "砂漠のメスキートの木の根は深さ50メートルまで届くことがある。"
  ],
  816: [
    "Ash from the erupting volcano blanketed the surrounding farmland.",
    "噴火する火山からの灰が周囲の農地を覆い尽くした。"
  ],
  817: [
    "Strict quality controls guarantee the purity of laboratory chemicals.",
    "厳格な品質管理が実験用化学薬品の純度を保証している。"
  ],
  818: [
    "A human infant learns to recognize familiar voices within weeks of birth.",
    "人間の幼児は生後数週間以内に聞き慣れた声を認識することを学ぶ。"
  ],
  819: [
    "Monarch caterpillars feed on milkweed leaves that contain toxic compounds.",
    "オオカバマダラの幼虫は有毒な化合物を含むトウワタの葉を食べる。"
  ],
  820: [
    "Wind blowing across sand dunes can create rhythmic acoustic vibrations.",
    "砂丘を吹き抜ける風はリズミカルな音響振動を創り出すことがある。"
  ],
  821: [
    "Researchers must not ignore anomalous data points during statistical analysis.",
    "研究者は統計分析の際に異常なデータ点を無視してはならない。"
  ],
  822: [
    "The central plaza was surrounded by temples and administrative buildings.",
    "中央の広場は神殿や行政建築物に囲まれていた。"
  ],
  823: [
    "Water scarcity has become a critical environmental issue in the southwest.",
    "水不足は南西部において重大な環境上の論点（問題）となっている。"
  ],
  824: [
    "Mechanical failure of the cooling pump forced operators to shut down the reactor.",
    "冷却ポンプの機械的故障（失敗）により、運転員は原子炉の停止を余儀なくされた。"
  ],
  825: [
    "An old agricultural proverb advises farmers to plant corn after the last frost.",
    "古い農業のことわざは、最後の霜の後にトウモロコシを植えるよう農家に助言している。"
  ],
  826: [
    "Indigenous Americans cultivated corn, beans, and winter squash together in fields.",
    "アメリカ先住民は畑でトウモロコシ、豆、そして冬カボチャ（ウリの類）を一緒に栽培した。"
  ],
  827: [
    "The Copernican model proposed a radical shift in how humans viewed the cosmos.",
    "コペルニクスのモデルは人類の宇宙観における急進的な転換を提唱した。"
  ],
  828: [
    "Double-checking calculations helps prevent a costly engineering mistake.",
    "計算を二重に確認することは高くつく工学上の誤りを防ぐのに役立つ。"
  ],
  829: [
    "Migratory birds stop at coastal wetlands to rest and refuel.",
    "渡り鳥は休養して栄養を補給するために沿岸の湿地帯に立ち寄る。"
  ],
  830: [
    "Most geologists agree that an asteroid impact contributed to dinosaur extinction.",
    "ほとんどの地質学者は小惑星の衝突が恐竜絶滅の一因となったことに同意している。"
  ],
  831: [
    "The region's economy shifted from heavy manufacturing to technology services.",
    "その地域の経済は重工業から技術サービス産業へと移行した。"
  ],
  832: [
    "Reforestation projects bring lasting ecological benefit to degraded watersheds.",
    "再造林事業は劣化した流域に永続的な生態学的恩恵（利益）をもたらす。"
  ],
  833: [
    "Cognitive psychology investigates how people perceive, remember, and solve problems.",
    "認知心理学は人々がどのように知覚し、記憶し、問題を解決するかを研究する。"
  ],
  834: [
    "Permeable soils allow rainwater to filter slowly into underground aquifers.",
    "透水性の土壌は雨水が地下の帯水層へとゆっくり浸透するのを可能にする（許す）。"
  ],
  835: [
    "Honeybees construct neat hexagonal wax cells to store honey and pollen.",
    "ミツバチは蜂蜜や花粉を蓄えるためにこぎれいな（整然とした）六角形の蜜蝋の部屋を作る。"
  ],
  836: [
    "Sound travels more than twice as fast in aluminum as in water.",
    "音は水の中よりもアルミニウムの中の方が2倍以上速く伝わる。"
  ],
  837: [
    "Small mountain glaciers may disappear completely if summer temperatures continue rising.",
    "夏の気温が上昇し続ければ、小さな山岳氷河は完全に消えるかもしれない。"
  ],
  838: [
    "Louis Pasteur demonstrated that microscopic germ organisms cause food spoilage.",
    "ルイ・パスツールは微細な細菌（微生物）が食品の腐敗を引き起こすことを実証した。"
  ],
  839: [
    "Gradual coastal erosion by ocean waves is an inevitable natural process.",
    "海の波による緩やかな海岸浸食は避けられない自然のプロセスである。"
  ],
  840: [
    "Ground controllers sent a radio command to orient the satellite's solar panels.",
    "地上管制官は衛星のソーラーパネルの向きを変えるために無線命令を送信した。"
  ],
  841: [
    "The gravitational influence of the moon is the primary cause of ocean tides.",
    "月の重力の影響は海の潮汐の主要な原因である。"
  ],
  842: [
    "Coastal villagers earned their living primarily through fishing and boatbuilding.",
    "沿岸の村人たちは主に漁業と造船によって生計を立てていた。"
  ],
  843: [
    "Many urban residents desire quieter neighborhoods with accessible public parks.",
    "多くの都市住民は利用しやすい公共公園のある、より静かな地域を希望している。"
  ],
  844: [
    "Science fiction emerged as a distinct literary genre in the nineteenth century.",
    "サイエンス・フィクションは19世紀に独自の文学ジャンルとして登場した。"
  ],
  845: [
    "Consumers now have a wide choice of energy-efficient household appliances.",
    "消費者は現在、エネルギー効率の高い家電製品の幅広い選択肢（選択）を持っている。"
  ],
  846: [
    "Metamorphosis is the biological process that transforms a caterpillar into a butterfly.",
    "変態とはイモムシをチョウへと変化させる生物学的過程（プロセス）である。"
  ],
  847: [
    "High levels of iridium in the clay layer indicate an extraterrestrial impact.",
    "粘土層に含まれる高濃度のイリジウムは地球外天体の衝突を示している。"
  ],
  848: [
    "Buttress roots help support tall rainforest trees in shallow tropical soil.",
    "板根は浅い熱帯の土壌で背の高い熱帯雨林の樹木を支えるのに役立つ。"
  ],
  849: [
    "Trade agreements strengthened economic ties between the two neighboring countries.",
    "貿易協定は隣接する（隣の）2国間の経済的な結びつきを強化した。"
  ],
  850: [
    "Anton van Leeuwenhoek used a simple single-lens microscope to observe bacteria.",
    "アントニ・ファン・レーウェンフックは細菌を観察するために単レンズの顕微鏡を使った。"
  ],
  851: [
    "Without proper ventilation, Radon gas can accumulate inside underground mines.",
    "適正な換気がなければ、ラドンガスが地下鉱山の内部に蓄積することがある。"
  ],
  852: [
    "The study examined every economic aspect of the proposed high-speed railway.",
    "その研究は提案された高速鉄道のあらゆる経済的側面（局面）を調査した。"
  ],
  853: [
    "Arctic hares adapt to winter by growing a pure white coat of fur.",
    "ホッキョクウサギは真っ白な毛皮を生やすことで冬に適合する。"
  ],
  854: [
    "Investors were initially reluctant to finance such an experimental technology.",
    "投資家たちは当初、そのような実験的技術に融資することに消極的（気の進まない状態）だった。"
  ],
  855: [
    "The average depth of the world's oceans is approximately four thousand meters.",
    "世界の海の平均水深は約4000メートルである。"
  ],
  856: [
    "Romantic poets prioritized personal feeling and imagination over strict formal rules.",
    "ロマン派の詩人は厳格な形式上の規則よりも個人の感情と想像力を優先した。"
  ],
  857: [
    "Shipping bulk grain by barge is far more economical than transport by truck.",
    "平底船による大量の穀物輸送はトラック輸送よりもはるかに経済的である。"
  ],
  858: [
    "Coral reef ecosystems depend on a symbiotic relationship with microscopic algae.",
    "サンゴ礁の生態系は微細な藻類との共生関係に依存している。"
  ],
  859: [
    "Dormant desert seeds sprout rapidly after a single heavy spring rainstorm.",
    "休眠状態の砂漠の種子は春の1回の激しい降雨の後に急速に芽を出す。"
  ],
  860: [
    "Foresters measure trunk diameter and height to estimate the volume of timber.",
    "林業家は木材の体積を見積もるために幹の直径と高さを測定する。"
  ],
  861: [
    "Tree resin seals bark wounds and helps the damaged trunk heal.",
    "木の樹脂は樹皮の傷口をふさぎ、損傷した幹が癒えるのを助ける。"
  ],
  862: [
    "Thorny branches and bitter leaves discourage herbivores from feeding on the shrub.",
    "トゲのある枝と苦い葉は草食動物がその低木を食べるのを思いとどまらせる（意気消沈させる）。"
  ],
  863: [
    "The university built an international reputation for excellence in astrophysics.",
    "その大学は天体物理学における卓越性で国際的な名声を築いた。"
  ],
  864: [
    "Early mountaineers experienced severe breathing difficulty at high altitudes.",
    "初期の登山家たちは高高度で深刻な呼吸困難を経験した。"
  ],
  865: [
    "The earnest young researcher spent every weekend cataloging marine fossils.",
    "その熱心な若手研究者は毎週末を海洋化石の目録作成に費やした。"
  ],
  866: [
    "Atomic clocks automatically correct minor timing errors in GPS satellites.",
    "原子時計はGPS衛星におけるわずかな時刻の誤差を自動的に訂正する。"
  ],
  867: [
    "Soldier termites use their powerful jaws to defend the colony against ants.",
    "兵アリ（シロアリの兵隊）は強力な顎を使ってアリからコロニーを守る。"
  ],
  868: [
    "Over thousands of years, the shallow lake gradually filled with sediment.",
    "何千年もの歳月をかけて、その浅い湖は徐々に堆積物で埋まっていった。"
  ],
  869: [
    "Field biologists must respect local wildlife regulations when collecting samples.",
    "フィールド生物学者は標本を採取する際、現地の野生生物保護規則を尊重（尊敬）しなければならない。"
  ],
  870: [
    "The intricate courtship dances of birds of paradise continue to fascinate ornithologists.",
    "フウチョウの精巧な求愛ダンスは鳥類学者を魅了し続けている。"
  ],
  871: [
    "Ragweed pollen can trigger severe symptoms in people who are allergic.",
    "ブタクサの花粉はアレルギー体質の人々に重い症状を引き起こすことがある。"
  ],
  872: [
    "Old Faithful geyser erupts at a relatively regular interval of ninety minutes.",
    "オールド・フェイスフル間欠泉は約90分という比較的規則的な間隔で噴出する。"
  ],
  873: [
    "A mature oak tree can produce thousands of acorns in a single autumn.",
    "成熟したオークの木は1回の秋に何千ものドングリを実らせることができる。"
  ],
  874: [
    "Early steamships often had mechanical trouble during rough ocean crossings.",
    "初期の蒸気船は荒れた大洋の横断中にしばしば機械トラブルに見舞われた。"
  ],
  875: [
    "The Industrial Revolution was powered largely by the burning of bituminous coal.",
    "産業革命は主に瀝青炭（石炭）の燃焼によって動力を得ていた。"
  ],
  876: [
    "A generous endowment from a philanthropist funded the new botanical conservatory.",
    "慈善家からの寛大な（惜しみない）寄付基金が新しい植物園の温室の建設資金となった。"
  ],
  877: [
    "Wetland drainage has resulted in a severe loss of waterfowl nesting habitat.",
    "湿地帯の干拓は水鳥の営巣生息地の深刻な喪失（損失）を招いた。"
  ],
  878: [
    "Farmers planted a dense row of pine trees to act as a windbreak.",
    "農家は防風林の役割を果たすよう松の木を密集した一列に植えた。"
  ],
  879: [
    "Paleontologists interpret fossilized tooth marks to understand ancient predator behavior.",
    "古生物学者は古代の捕食者の行動を理解するために化石化した歯型を解釈する。"
  ],
  880: [
    "Scientists of every nationality collaborate aboard the International Space Station.",
    "あらゆる国籍の科学者が国際宇宙ステーションの船内で協力している。"
  ],
  881: [
    "All members of the biology faculty voted to approve the new degree program.",
    "生物学部の教授陣全員が新しい学位プログラムの承認に賛成票を投じた。"
  ],
  882: [
    "Desalination is a viable option for coastal cities facing chronic drought.",
    "海水淡水化は慢性的な干ばつに直面する沿岸都市にとって実行可能な選択肢である。"
  ],
  883: [
    "A strict vegetarian diet excludes all meat, poultry, and fish products.",
    "厳格な菜食主義者の食事はすべての肉、家禽、および魚介類を除外する。"
  ],
  884: [
    "Marine biologists attach lightweight satellite tags to track whale migrations.",
    "海洋生物学者はクジラの回遊を追跡するために軽量の衛星タグを取り付ける。"
  ],
  885: [
    "After analyzing the ice cores, researchers reached a startling conclusion.",
    "氷床コアを分析した後、研究者たちは驚くべき結論に達した。"
  ],
  886: [
    "Some historians claim that the Viking settlement lasted for several decades.",
    "一部の歴史家は、そのヴァイキングの入植地が数十年間続いたと主張している。"
  ],
  887: [
    "Passengers must show their tickets before they board the high-speed ferry.",
    "乗客は高速フェリーに乗り込む前に乗船券を提示しなければならない。"
  ],
  888: [
    "The invention of the spoked wheel made ancient chariots lighter and faster.",
    "スポーク付きの車輪の発明は古代の戦車をより軽く、より速くした。"
  ],
  889: [
    "Many desert birds are most active at dawn before the air becomes hot.",
    "多くの砂漠の鳥は大気が暑くなる前の夜明けに最も活動的になる。"
  ],
  890: [
    "Polished stone tools imply that the prehistoric villagers practiced woodworking.",
    "磨製石器はその先史時代の村人たちが木工を行っていたことを暗示している。"
  ],
  891: [
    "Yellowstone was established in 1872 as the world's first national park.",
    "イエローストーンは1872年に世界初の国立（国家の）公園として設立された。"
  ],
  892: [
    "The newspaper published a correction to apologize for the factual error.",
    "その新聞社は事実誤認について謝るために訂正記事を掲載した。"
  ],
  893: [
    "Although primarily herbivorous, the tortoise occasionally consumes small insects.",
    "そのリクガメは主に草食性だが、時折小さな昆虫を食べる。"
  ],
  894: [
    "A powerful dust storm enveloped the Martian plains for several weeks.",
    "強力な砂嵐が数週間にわたって火星の平原を包み込んだ。"
  ],
  895: [
    "Archaeologists deciphered the cuneiform script carved on the ancient monument.",
    "考古学者たちはその古代の記念碑に刻まれた楔形文字を解読した。"
  ],
  896: [
    "Astronomers inferred the existence of Neptune from irregularities in Uranus's orbit.",
    "天文学者は天王星の軌道の乱れから海王星の存在を推論した。"
  ],
  897: [
    "The architectural design received a prestigious national award for sustainability.",
    "その建築設計は持続可能性に関する権威ある全国的な賞を受賞した。"
  ],
  898: [
    "Botanical gardens cultivate a wide variety of medicinal and ornamental plants.",
    "植物園は多種多様な（多様な種類の）薬用植物や観賞用植物を栽培している。"
  ],
  899: [
    "The mountain range forms a natural geographic border between the two nations.",
    "その山脈は2国間の自然の地理的国境を形成している。"
  ],
  900: [
    "The conservationist delivered an eloquent speech defending wilderness preservation.",
    "その環境保護活動家は原生自然の保護を擁護する雄弁な演説を行った。"
  ],
  901: [
    "Floodwaters deposit nutrient-rich silt across the river valley each spring.",
    "洪水の水は毎春、川の流域全体に栄養豊富なシルト（沈泥）を堆積させる（預ける・置く）。"
  ],
  902: [
    "Isolated island species often evolve unique traits over thousands of generations.",
    "孤立した島の種はしばしば何千世代にもわたって独自の特徴を進化させる。"
  ],
  903: [
    "Parliament voted to enact stricter regulations on offshore oil drilling.",
    "議会は沖合の石油掘削に対するより厳しい規制を立法化する（制定する）ことを可決した。"
  ],
  904: [
    "The composer spent his youth studying counterpoint in Vienna.",
    "その作曲家は青年時代をウィーンで対位法を学びながら過ごした。"
  ],
  905: [
    "The historic city center was converted into a car-free pedestrian zone.",
    "歴史的な都市中心部は自動車乗り入れ禁止の歩行者専用区域へと転換された。"
  ],
  906: [
    "High-powered telescopes can resolve binary stars that appear as one to the naked eye.",
    "高倍率の望遠鏡は肉眼では1つに見える連星を分解して見分けることができる。"
  ],
  907: [
    "The project received matching grants from both state and federal agencies.",
    "そのプロジェクトは州と連邦の機関の両方から共同助成金を受けた。"
  ],
  908: [
    "Volcanic ash from the eruption fertilized the soil of nearby farms.",
    "噴火による火山灰が近くの農場の土壌を肥沃にした。"
  ],
  909: [
    "Panelists met at the symposium to discuss advances in gene editing.",
    "パネリストたちは遺伝子編集の進歩について議論するためにシンポジウムに集まった。"
  ],
  910: [
    "Coastal villagers knit heavy sweaters from water-repellent sheep wool.",
    "沿岸の村人たちは撥水性の羊毛から厚手のセーターを編む。"
  ],
  911: [
    "Dehydration at high altitudes frequently causes a severe headache.",
    "高地での脱水症状は頻繁に激しい頭痛を引き起こす。"
  ],
  912: [
    "Studying chimpanzee tool use provided new insight into early human evolution.",
    "チンパンジーの道具使用の研究は初期の人類の進化に関する新たな洞察力（知見）をもたらした。"
  ],
  913: [
    "The blue whale is the largest mammal ever known to have lived on Earth.",
    "シロナガスクジラは地球上に生息したことが知られる最大の哺乳動物である。"
  ],
  914: [
    "Public transit systems must offer reliable service at a reasonable cost.",
    "公共交通システムは手頃な（程よい）費用で信頼できるサービスを提供しなければならない。"
  ],
  915: [
    "The new astronomical research facility is located atop a dry mountain peak.",
    "その新しい天文学の研究施設（設備）は乾燥した山頂に位置している。"
  ],
  916: [
    "Stellar parallax provided the first direct observational proof that Earth orbits the sun.",
    "恒星の年周視差は地球が太陽の周りを公転しているという最初の直接的な観測上の証明をもたらした。"
  ],
  917: [
    "Squirrels gather fallen acorns in autumn and bury them for winter.",
    "リスは秋に落ちたドングリを集め、冬のために地面に埋める。"
  ],
  918: [
    "The museum is open every day of the year except New Year's Day.",
    "その博物館は元日を除いて年中無休で開館している。"
  ],
  919: [
    "A large herd of bison grazed peacefully across the open prairie.",
    "バイソンの大きな群れが開けたプレーリーで穏やかに草を食んでいた。"
  ],
  920: [
    "Our solar system is located in a spiral arm of the Milky Way galaxy.",
    "私たちの太陽系は天の川銀河の渦巻腕の中に位置している。"
  ],
  921: [
    "Actors wore stylized masks to perform classical dramas in ancient Greek theaters.",
    "古代ギリシャの劇場では、俳優は古典劇を演じるために様式化された仮面を着けた。"
  ],
  922: [
    "Adult salmon return to the exact stream where they hatched to spawn.",
    "成魚のサケは産卵のために自分が孵化したまさにその川へと戻る。"
  ],
  923: [
    "Cosmologists study the origin, structure, and expansion of the universe.",
    "宇宙論研究者は宇宙の起源、構造、そして膨張を研究する。"
  ],
  924: [
    "The stadium could seat fifty thousand people, giving every spectator a clear view.",
    "その競技場は5万人を収容でき、すべての見物人（観客）に遮るもののない視界を提供した。"
  ],
  925: [
    "Venus is Earth's closest planetary neighbor in the inner solar system.",
    "金星は内太陽系において地球に最も近い惑星の隣人である。"
  ],
  926: [
    "The scholar accepted an official invitation to lecture at Oxford University.",
    "その学者はオックスフォード大学で講義を行うという公式の招待を受けた。"
  ],
  927: [
    "Predators help maintain a healthy balance between herbivores and vegetation.",
    "捕食者は草食動物と植生の間の健全なバランスを維持するのを助けている。"
  ],
  928: [
    "Introducing an exotic species can disrupt native food webs on isolated islands.",
    "外来種を持ち込むことは孤立した島々の在来の食物網を破壊することがある。"
  ],
  929: [
    "In botanical terminology, the word flora is often used as a synonym for plant life.",
    "植物学の用語では、フロラという言葉はしばしば植物相の同義語として使われる。"
  ],
  930: [
    "Farmers leave one field fallow each year to restore soil nutrients.",
    "農家は土壌の栄養分を回復させるために毎年1つの畑を休耕地にする。"
  ],
  931: [
    "Shade-tolerant ferns prefer the cool, damp floor of old-growth forests.",
    "耐陰性のシダ植物は原生林の涼しく湿った林床の方を好む。"
  ],
  932: [
    "Melting mountain snowpacks supply fresh water to valleys throughout the summer.",
    "山の雪解け水は夏の間ずっと谷に真水を供給する。"
  ],
  933: [
    "A single water molecule consists of two hydrogen atoms and one oxygen atom.",
    "1つの水分子は2つの水素原子と1つの酸素原子で構成されている。"
  ],
  934: [
    "Diamonds are exceedingly hard because their carbon atoms form a rigid lattice.",
    "ダイヤモンドは炭素原子が強固な格子を形成しているため極めて硬い。"
  ],
  935: [
    "The astrolabe was an ancient device used by astronomers to measure star positions.",
    "アストロラーベは天文学者が星の位置を測定するために使用した古代の装置だった。"
  ],
  936: [
    "Emperor penguins breed on the frozen ice shelves of the Antarctic coast.",
    "コウテイペンギンは南極沿岸の凍った棚氷の上で繁殖する。"
  ],
  937: [
    "Most metals expand slightly when heated and contract when cooled.",
    "ほとんどの金属は加熱されるとわずかに膨張（拡張）し、冷却されると収縮する。"
  ],
  938: [
    "Biomimicry looks to nature for inspiration in solving human engineering problems.",
    "バイオミミクリー（生物模倣技術）は人間の工学的問題を解決する着想を自然に求める。"
  ],
  939: [
    "Footnotes allow readers to refer directly to the original historical documents.",
    "脚注によって読者は元の歴史文書を直接参照することができる。"
  ],
  940: [
    "A weather satellite orbits the poles to monitor global cloud cover.",
    "気象衛星が地球全体の雲量を監視するために両極を周回している。"
  ],
  941: [
    "Without further data, it is premature to conclude that the species is extinct.",
    "さらなるデータがなければ、その種が絶滅したと結論づけるのは時期尚早である。"
  ],
  942: [
    "With fierce determination, the conservation team saved the wetland from development.",
    "強い決意をもって、環境保全チームはその湿地帯を開発から救った。"
  ],
  943: [
    "agrarian regions export surplus grain to neighboring industrial nations.",
    "農業地域は隣接する工業国へ余剰の穀物を輸出する。"
  ],
  944: [
    "Aristotle wrote influential treatises on ethics, biology, and politics.",
    "アリストテレスは倫理学、生物学、そして政治学に関する影響力のある論文を著した。"
  ],
  945: [
    "International trade rules are designed to promote fair competition among nations.",
    "国際貿易ルールは国々の間で公平な競争を促進するように設計されている。"
  ],
  946: [
    "Terraced farming allows crops to grow on a steep mountain slope.",
    "段々畑での農法は険しい山の斜面（傾斜）で作物を育てることを可能にする。"
  ],
  947: [
    "Social carnivores such as lions share food with members of their pride.",
    "ライオンなどの社会性肉食動物は群れの仲間と獲物を分け合う。"
  ],
  948: [
    "The optic nerve transmits visual information from the retina to the brain.",
    "視神経は網膜から脳へと視覚情報を伝達する。"
  ],
  949: [
    "Archaeologists still debate the fate of the lost Roanoke colony.",
    "考古学者たちは今なお、失われたロアノーク植民地の運命について議論している。"
  ],
  950: [
    "Gross domestic product measures the total value of goods produced by a nation.",
    "国内総生産（総計）は1つの国で生産された財の総価値を測定する。"
  ],
  951: [
    "Fruit trees typically take several years of growth before they bear fruit.",
    "果樹は通常、実をつける（産む）までに数年間の成長を要する。"
  ],
  952: [
    "Shallow seas covering the continental shelf support rich marine fisheries.",
    "大陸棚を覆う浅い海は豊かな海洋漁業を支えている。"
  ],
  953: [
    "Sedimentary rocks often include fossilized shells of ancient marine organisms.",
    "堆積岩はしばしば古代の海洋生物の化石化した貝殻を含んでいる。"
  ],
  954: [
    "The primary purpose of a lighthouse is to warn ships of dangerous reefs.",
    "灯台の主要な目的は危険な暗礁を船に警告することである。"
  ],
  955: [
    "Landslides can rapidly bury entire valleys beneath tons of rock and mud.",
    "地滑りは谷全体を何トンもの岩石と泥の下に急速に埋めることがある。"
  ],
  956: [
    "Cave paintings in Lascaux were created by hunters during the Stone Age.",
    "ラスコーの洞窟壁画は石器時代の狩猟者たちによって描かれた。"
  ]
};

examples773to956[943][0] = "Agrarian regions export surplus grain to neighboring industrial nations.";

const lines = rawList773to956.split(/\r?\n/).filter(Boolean);
if (lines.length !== 184) {
  throw new Error(`Expected 184 lines for 773..956, but found ${lines.length}`);
}

for (const line of lines) {
  const parts = line.split('|');
  if (parts.length !== 5) {
    throw new Error(`Invalid format on line: ${line}`);
  }
  const [numStr, word, phonetic, pos, meaning] = parts;
  const id = parseInt(numStr, 10);
  const examplePair = examples773to956[id];
  if (!examplePair || !examplePair[0] || !examplePair[1]) {
    throw new Error(`Missing example for id ${id}`);
  }

  existingMap.set(id, {
    id,
    rank: 1,
    word: word.trim(),
    pos: pos.trim(),
    phonetic: phonetic.trim(),
    meaning: meaning.trim(),
    exampleSentence: examplePair[0],
    exampleTranslation: examplePair[1],
  });
}

const finalWords = [];
for (let i = 1; i <= 956; i++) {
  const item = existingMap.get(i);
  if (!item) {
    throw new Error(`Missing ID ${i}`);
  }
  if (
    !item.word ||
    !item.pos ||
    !item.phonetic ||
    !item.meaning ||
    !item.exampleSentence ||
    !item.exampleTranslation
  ) {
    throw new Error(`Incomplete fields on ID ${i}`);
  }
  finalWords.push(item);
}

fs.writeFileSync(outPath, JSON.stringify(finalWords, null, 2) + '\n', 'utf8');
console.log(
  `Successfully generated ${finalWords.length} words (Rank 1 IDs 1..956 verified without gaps) at ${outPath}`
);
