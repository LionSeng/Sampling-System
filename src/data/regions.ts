import type { Region, Province, City, County } from '../types/sampling';

// 基于中国第七次人口普查(2020)数据的8大区分组
// 数据来源：国家统计局2020年第七次全国人口普查

const createDistricts = (names: string[]) =>
  names.map((n, i) => ({ code: `D${i}`, name: n }));

const createTowns = (names: string[]) =>
  names.map((n, i) => ({ code: `T${i}`, name: n }));

const createCity = (name: string, type: 'capital' | 'prefecture', districtNames: string[]): City => ({
  code: `CITY-${name}`,
  name,
  type,
  districts: createDistricts(districtNames),
});

const createCounty = (name: string, townNames: string[]): County => ({
  code: `COUNTY-${name}`,
  name,
  type: 'rural' as const,
  towns: createTowns(townNames),
});

// ===== 华北地区 =====
const huabei: Region = {
  code: 'R-HB',
  name: '华北地区',
  population: 17239,
  provinces: [
    {
      code: '110000',
      name: '北京市',
      population: 2189,
      capital: createCity('北京', 'capital', ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区']),
      prefectures: [],
      ruralCounties: [
        createCounty('延庆区', ['延庆镇', '康庄镇', '永宁镇', '八达岭镇']),
        createCounty('密云区', ['密云镇', '太师屯镇', '溪翁庄镇', '西田各庄镇']),
      ],
    },
    {
      code: '120000',
      name: '天津市',
      population: 1387,
      capital: createCity('天津', 'capital', ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '滨海新区']),
      prefectures: [],
      ruralCounties: [
        createCounty('蓟州区', ['蓟州镇', '洇溜镇', '别山镇', '邦均镇']),
        createCounty('宁河区', ['芦台镇', '丰台镇', '岳龙镇', '板桥镇']),
      ],
    },
    {
      code: '130000',
      name: '河北省',
      population: 7461,
      capital: createCity('石家庄', 'capital', ['长安区', '桥西区', '新华区', '裕华区', '井陉矿区']),
      prefectures: [
        createCity('唐山市', 'prefecture', ['路南区', '路北区', '古冶区', '开平区', '丰南区']),
        createCity('保定市', 'prefecture', ['竞秀区', '莲池区', '满城区', '清苑区', '徐水区']),
        createCity('邯郸市', 'prefecture', ['邯山区', '丛台区', '复兴区', '峰峰矿区', '肥乡区']),
      ],
      ruralCounties: [
        createCounty('张北县', ['张北镇', '公会镇', '二台镇', '大囫囵镇']),
        createCounty('围场满族蒙古族自治县', ['围场镇', '四合永镇', '克勒沟镇', '棋盘山镇']),
        createCounty('青龙满族自治县', ['青龙镇', '双山子镇', '肖营子镇', '土门子镇']),
        createCounty('阜平县', ['阜平镇', '龙泉关镇', '平阳镇', '城南庄镇']),
      ],
    },
    {
      code: '140000',
      name: '山西省',
      population: 3492,
      capital: createCity('太原', 'capital', ['小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区']),
      prefectures: [
        createCity('大同市', 'prefecture', ['平城区', '云冈区', '新荣区', '云州区']),
        createCity('运城市', 'prefecture', ['盐湖区', '永济市', '河津市', '绛县']),
      ],
      ruralCounties: [
        createCounty('右玉县', ['新城镇', '右卫镇', '威远镇', '元堡子镇']),
        createCounty('五台县', ['台城镇', '耿镇', '豆村镇', '白家庄镇']),
      ],
    },
    {
      code: '150000',
      name: '内蒙古自治区',
      population: 2405,
      capital: createCity('呼和浩特', 'capital', ['新城区', '回民区', '玉泉区', '赛罕区']),
      prefectures: [
        createCity('包头市', 'prefecture', ['东河区', '昆都仑区', '青山区', '石拐区']),
        createCity('鄂尔多斯市', 'prefecture', ['东胜区', '康巴什区', '达拉特旗', '准格尔旗']),
      ],
      ruralCounties: [
        createCounty('四子王旗', ['乌兰花镇', '吉生太镇', '库伦图镇', '供济堂镇']),
        createCounty('阿拉善左旗', ['巴彦浩特镇', '嘉尔嘎勒赛汉镇', '吉兰泰镇', '乌斯太镇']),
      ],
    },
  ],
};

// ===== 东北地区 =====
const dongbei: Region = {
  code: 'R-DB',
  name: '东北地区',
  population: 9851,
  provinces: [
    {
      code: '210000',
      name: '辽宁省',
      population: 4259,
      capital: createCity('沈阳', 'capital', ['和平区', '沈河区', '大东区', '皇姑区', '铁西区', '苏家屯区']),
      prefectures: [
        createCity('大连市', 'prefecture', ['中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区']),
        createCity('鞍山市', 'prefecture', ['铁东区', '铁西区', '立山区', '千山区']),
      ],
      ruralCounties: [
        createCounty('桓仁满族自治县', ['桓仁镇', '普乐堡镇', '二棚甸子镇', '沙尖子镇']),
        createCounty('建昌县', ['建昌镇', '八家子镇', '药王庙镇', '玲珑塔镇']),
      ],
    },
    {
      code: '220000',
      name: '吉林省',
      population: 2407,
      capital: createCity('长春', 'capital', ['南关区', '宽城区', '朝阳区', '二道区', '绿园区']),
      prefectures: [
        createCity('吉林市', 'prefecture', ['昌邑区', '龙潭区', '船营区', '丰满区']),
        createCity('四平市', 'prefecture', ['铁西区', '铁东区', '梨树县', '伊通满族自治县']),
      ],
      ruralCounties: [
        createCounty('靖宇县', ['靖宇镇', '三道湖镇', '花园口镇', '龙泉镇']),
        createCounty('汪清县', ['汪清镇', '大兴沟镇', '天桥岭镇', '百草沟镇']),
      ],
    },
    {
      code: '230000',
      name: '黑龙江省',
      population: 3185,
      capital: createCity('哈尔滨', 'capital', ['道里区', '南岗区', '道外区', '平房区', '松北区', '香坊区']),
      prefectures: [
        createCity('齐齐哈尔市', 'prefecture', ['龙沙区', '建华区', '铁锋区', '昂昂溪区']),
        createCity('大庆市', 'prefecture', ['萨尔图区', '龙凤区', '让胡路区', '红岗区']),
      ],
      ruralCounties: [
        createCounty('漠河市', ['西林吉镇', '图强镇', '阿木尔镇', '兴安镇']),
        createCounty('孙吴县', ['孙吴镇', '辰清镇', '沿江满族达斡尔族乡', '奋斗乡']),
      ],
    },
  ],
};

// ===== 华东地区 =====
const huadong: Region = {
  code: 'R-HD',
  name: '华东地区',
  population: 41979,
  provinces: [
    {
      code: '310000',
      name: '上海市',
      population: 2487,
      capital: createCity('上海', 'capital', ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区']),
      prefectures: [],
      ruralCounties: [
        createCounty('崇明区', ['城桥镇', '堡镇', '新河镇', '庙镇']),
      ],
    },
    {
      code: '320000',
      name: '江苏省',
      population: 8475,
      capital: createCity('南京', 'capital', ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区']),
      prefectures: [
        createCity('苏州市', 'prefecture', ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区']),
        createCity('无锡市', 'prefecture', ['锡山区', '惠山区', '滨湖区', '梁溪区', '新吴区']),
        createCity('南通市', 'prefecture', ['崇川区', '通州区', '海门区', '如东县']),
      ],
      ruralCounties: [
        createCounty('沭阳县', ['沭城街道', '南湖街道', '梦溪街道', '十字街道']),
        createCounty('灌南县', ['新安镇', '堆沟港镇', '汤沟镇', '百禄镇']),
      ],
    },
    {
      code: '330000',
      name: '浙江省',
      population: 6457,
      capital: createCity('杭州', 'capital', ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区']),
      prefectures: [
        createCity('宁波市', 'prefecture', ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区']),
        createCity('温州市', 'prefecture', ['鹿城区', '龙湾区', '瓯海区', '洞头区']),
      ],
      ruralCounties: [
        createCounty('淳安县', ['千岛湖镇', '汾口镇', '威坪镇', '姜家镇']),
        createCounty('泰顺县', ['罗阳镇', '百丈镇', '泗溪镇', '雅阳镇']),
      ],
    },
    {
      code: '340000',
      name: '安徽省',
      population: 6103,
      capital: createCity('合肥', 'capital', ['瑶海区', '庐阳区', '蜀山区', '包河区', '肥东县', '肥西县']),
      prefectures: [
        createCity('芜湖市', 'prefecture', ['镜湖区', '弋江区', '鸠江区', '湾沚区']),
        createCity('蚌埠市', 'prefecture', ['龙子湖区', '蚌山区', '禹会区', '淮上区']),
      ],
      ruralCounties: [
        createCounty('金寨县', ['梅山镇', '麻埠镇', '青山镇', '燕子河镇']),
        createCounty('岳西县', ['天堂镇', '店前镇', '来榜镇', '温泉镇']),
      ],
    },
    {
      code: '350000',
      name: '福建省',
      population: 4154,
      capital: createCity('福州', 'capital', ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '长乐区']),
      prefectures: [
        createCity('厦门市', 'prefecture', ['思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区']),
        createCity('泉州市', 'prefecture', ['鲤城区', '丰泽区', '洛江区', '泉港区']),
      ],
      ruralCounties: [
        createCounty('政和县', ['熊山街道', '东平镇', '石屯镇', '铁山镇']),
        createCounty('寿宁县', ['鳌阳镇', '斜滩镇', '南阳镇', '武曲镇']),
      ],
    },
    {
      code: '360000',
      name: '江西省',
      population: 4518,
      capital: createCity('南昌', 'capital', ['东湖区', '西湖区', '青云谱区', '青山湖区', '新建区', '红谷滩区']),
      prefectures: [
        createCity('九江市', 'prefecture', ['濂溪区', '浔阳区', '柴桑区', '庐山市']),
        createCity('赣州市', 'prefecture', ['章贡区', '南康区', '赣县区', '信丰县']),
      ],
      ruralCounties: [
        createCounty('遂川县', ['泉江镇', '雩田镇', '碧洲镇', '草林镇']),
        createCounty('鄱阳县', ['鄱阳镇', '饶丰镇', '田畈街镇', '金盘岭镇']),
      ],
    },
    {
      code: '370000',
      name: '山东省',
      population: 10153,
      capital: createCity('济南', 'capital', ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区']),
      prefectures: [
        createCity('青岛市', 'prefecture', ['市南区', '市北区', '黄岛区', '崂山区', '李沧区']),
        createCity('烟台市', 'prefecture', ['芝罘区', '福山区', '牟平区', '莱山区']),
      ],
      ruralCounties: [
        createCounty('单县', ['单城镇', '郭村镇', '黄岗镇', '终兴镇']),
        createCounty('曹县', ['曹城街道', '磐石街道', '青岗集乡', '郑庄街道']),
      ],
    },
  ],
};

// ===== 华中地区 =====
const huazhong: Region = {
  code: 'R-HZ',
  name: '华中地区',
  population: 25252,
  provinces: [
    {
      code: '410000',
      name: '河南省',
      population: 9937,
      capital: createCity('郑州', 'capital', ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区']),
      prefectures: [
        createCity('洛阳市', 'prefecture', ['老城区', '西工区', '瀍河回族区', '涧西区', '洛龙区']),
        createCity('南阳市', 'prefecture', ['宛城区', '卧龙区', '南召县', '方城县']),
      ],
      ruralCounties: [
        createCounty('兰考县', ['兰阳街道', '桐乡街道', '许河乡', '谷营镇']),
        createCounty('新县', ['新集镇', '沙窝镇', '苏河镇', '吴陈河镇']),
      ],
    },
    {
      code: '420000',
      name: '湖北省',
      population: 5775,
      capital: createCity('武汉', 'capital', ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区']),
      prefectures: [
        createCity('宜昌市', 'prefecture', ['西陵区', '伍家岗区', '点军区', '猇亭区']),
        createCity('襄阳市', 'prefecture', ['襄城区', '樊城区', '襄州区', '南漳县']),
      ],
      ruralCounties: [
        createCounty('英山县', ['温泉镇', '南河镇', '红山镇', '金家铺镇']),
        createCounty('竹溪县', ['城关镇', '蒋家堰镇', '中峰镇', '水坪镇']),
      ],
    },
    {
      code: '430000',
      name: '湖南省',
      population: 6644,
      capital: createCity('长沙', 'capital', ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区']),
      prefectures: [
        createCity('株洲市', 'prefecture', ['天元区', '荷塘区', '芦淞区', '石峰区']),
        createCity('岳阳市', 'prefecture', ['岳阳楼区', '云溪区', '君山区', '岳阳县']),
      ],
      ruralCounties: [
        createCounty('古丈县', ['古阳镇', '默戎镇', '断龙山镇', '红石林镇']),
        createCounty('新晃侗族自治县', ['新晃镇', '波洲镇', '兴隆镇', '鱼市镇']),
      ],
    },
  ],
};

// ===== 华南地区 =====
const huanan: Region = {
  code: 'R-HN',
  name: '华南地区',
  population: 17771,
  provinces: [
    {
      code: '440000',
      name: '广东省',
      population: 12601,
      capital: createCity('广州', 'capital', ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区']),
      prefectures: [
        createCity('深圳市', 'prefecture', ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区']),
        createCity('东莞市', 'prefecture', ['莞城街道', '南城街道', '东城街道', '万江街道']),
      ],
      ruralCounties: [
        createCounty('阳山县', ['青莲镇', '江英镇', '杜步镇', '七拱镇']),
        createCounty('乳源瑶族自治县', ['乳城镇', '大桥镇', '大布镇', '洛阳镇']),
      ],
    },
    {
      code: '450000',
      name: '广西壮族自治区',
      population: 5013,
      capital: createCity('南宁', 'capital', ['兴宁区', '青秀区', '江南区', '西乡塘区', '良庆区', '邕宁区']),
      prefectures: [
        createCity('柳州市', 'prefecture', ['城中区', '鱼峰区', '柳南区', '柳北区']),
        createCity('桂林市', 'prefecture', ['秀峰区', '叠彩区', '象山区', '七星区', '雁山区']),
      ],
      ruralCounties: [
        createCounty('都安瑶族自治县', ['安阳镇', '高岭镇', '澄江镇', '地苏镇']),
        createCounty('那坡县', ['城厢镇', '平孟镇', '龙合镇', '坡荷乡']),
      ],
    },
    {
      code: '460000',
      name: '海南省',
      population: 1008,
      capital: createCity('海口', 'capital', ['秀英区', '龙华区', '琼山区', '美兰区']),
      prefectures: [
        createCity('三亚市', 'prefecture', ['海棠区', '吉阳区', '天涯区', '崖州区']),
      ],
      ruralCounties: [
        createCounty('保亭黎族苗族自治县', ['保城镇', '什玲镇', '加茂镇', '响水镇']),
        createCounty('白沙黎族自治县', ['牙叉镇', '七坊镇', '邦溪镇', '打安镇']),
      ],
    },
  ],
};

// ===== 西南地区 =====
const xinan: Region = {
  code: 'R-XN',
  name: '西南地区',
  population: 22937,
  provinces: [
    {
      code: '500000',
      name: '重庆市',
      population: 3205,
      capital: createCity('重庆', 'capital', ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区']),
      prefectures: [],
      ruralCounties: [
        createCounty('城口县', ['葛城街道', '修齐镇', '高观镇', '庙坝镇']),
        createCounty('巫溪县', ['柏杨街道', '宁厂镇', '上磺镇', '古路镇']),
      ],
    },
    {
      code: '510000',
      name: '四川省',
      population: 8367,
      capital: createCity('成都', 'capital', ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区']),
      prefectures: [
        createCity('绵阳市', 'prefecture', ['涪城区', '游仙区', '安州区', '江油市']),
        createCity('德阳市', 'prefecture', ['旌阳区', '罗江区', '广汉市', '什邡市']),
      ],
      ruralCounties: [
        createCounty('美姑县', ['巴普镇', '觉洛乡', '井叶特西乡', '合姑洛乡']),
        createCounty('石渠县', ['尼呷镇', '色须镇', '蒙宜镇', '温波镇']),
      ],
    },
    {
      code: '520000',
      name: '贵州省',
      population: 3856,
      capital: createCity('贵阳', 'capital', ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区']),
      prefectures: [
        createCity('遵义市', 'prefecture', ['红花岗区', '汇川区', '播州区', '桐梓县']),
        createCity('六盘水市', 'prefecture', ['钟山区', '六枝特区', '水城区', '盘州市']),
      ],
      ruralCounties: [
        createCounty('威宁彝族回族苗族自治县', ['草海镇', '陕桥街道', '海边街道', '雄山街道']),
        createCounty('紫云苗族布依族自治县', ['松山街道', '白石岩乡', '猫营镇', '板当镇']),
      ],
    },
    {
      code: '530000',
      name: '云南省',
      population: 4721,
      capital: createCity('昆明', 'capital', ['五华区', '盘龙区', '官渡区', '西山区', '呈贡区', '晋宁区']),
      prefectures: [
        createCity('曲靖市', 'prefecture', ['麒麟区', '沾益区', '马龙区', '宣威市']),
        createCity('玉溪市', 'prefecture', ['红塔区', '江川区', '通海县', '华宁县']),
      ],
      ruralCounties: [
        createCounty('福贡县', ['上帕镇', '子里甲乡', '架科底乡', '鹿马登乡']),
        createCounty('贡山独龙族怒族自治县', ['茨开镇', '丙中洛镇', '捧当乡', '独龙江乡']),
      ],
    },
    {
      code: '540000',
      name: '西藏自治区',
      population: 365,
      capital: createCity('拉萨', 'capital', ['城关区', '堆龙德庆区', '达孜区']),
      prefectures: [
        createCity('日喀则市', 'prefecture', ['桑珠孜区', '南木林县', '江孜县', '定日县']),
      ],
      ruralCounties: [
        createCounty('墨脱县', ['墨脱镇', '背崩乡', '德兴乡', '达木珞巴民族乡']),
        createCounty('双湖县', ['措折罗玛镇', '多玛乡', '巴岭乡', '雅乡']),
      ],
    },
  ],
};

// ===== 西北地区 =====
const xibei: Region = {
  code: 'R-XB',
  name: '西北地区',
  population: 10381,
  provinces: [
    {
      code: '610000',
      name: '陕西省',
      population: 3953,
      capital: createCity('西安', 'capital', ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区']),
      prefectures: [
        createCity('宝鸡市', 'prefecture', ['渭滨区', '金台区', '陈仓区', '凤翔区']),
        createCity('咸阳市', 'prefecture', ['秦都区', '渭城区', '三原县', '泾阳县']),
      ],
      ruralCounties: [
        createCounty('吴起县', ['吴起街道', '长官庙镇', '长官庙镇', '白豹镇']),
        createCounty('镇坪县', ['城关镇', '曾家镇', '牛头店镇', '钟宝镇']),
      ],
    },
    {
      code: '620000',
      name: '甘肃省',
      population: 2502,
      capital: createCity('兰州', 'capital', ['城关区', '七里河区', '西固区', '安宁区', '红古区']),
      prefectures: [
        createCity('天水市', 'prefecture', ['秦州区', '麦积区', '甘谷县', '武山县']),
        createCity('酒泉市', 'prefecture', ['肃州区', '金塔县', '瓜州县', '敦煌市']),
      ],
      ruralCounties: [
        createCounty('东乡族自治县', ['锁南镇', '达板镇', '河滩镇', '那勒寺镇']),
        createCounty('积石山保安族东乡族撒拉族自治县', ['吹麻滩镇', '大河家镇', '银川镇', '刘集乡']),
      ],
    },
    {
      code: '630000',
      name: '青海省',
      population: 592,
      capital: createCity('西宁', 'capital', ['城东区', '城中区', '城西区', '城北区']),
      prefectures: [
        createCity('海东市', 'prefecture', ['乐都区', '平安区', '民和回族土族自治县', '互助土族自治县']),
      ],
      ruralCounties: [
        createCounty('班玛县', ['赛来塘镇', '多贡麻乡', '吉卡乡', '达卡乡']),
        createCounty('甘德县', ['柯曲镇', '岗龙乡', '下藏科乡', '江千乡']),
      ],
    },
    {
      code: '640000',
      name: '宁夏回族自治区',
      population: 720,
      capital: createCity('银川', 'capital', ['兴庆区', '西夏区', '金凤区', '永宁县', '贺兰县']),
      prefectures: [
        createCity('石嘴山市', 'prefecture', ['大武口区', '惠农区', '平罗县']),
      ],
      ruralCounties: [
        createCounty('西吉县', ['吉强镇', '将台堡镇', '平峰镇', '新营乡']),
        createCounty('海原县', ['海城镇', '李旺镇', '西安镇', '三河镇']),
      ],
    },
    {
      code: '650000',
      name: '新疆维吾尔自治区',
      population: 2585,
      capital: createCity('乌鲁木齐', 'capital', ['天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区']),
      prefectures: [
        createCity('克拉玛依市', 'prefecture', ['独山子区', '克拉玛依区', '白碱滩区', '乌尔禾区']),
        createCity('喀什市', 'prefecture', ['喀什市', '疏附县', '疏勒县', '英吉沙县']),
      ],
      ruralCounties: [
        createCounty('塔什库尔干塔吉克自治县', ['塔什库尔干镇', '塔吉克阿巴提镇', '达布达尔乡', '提孜那甫乡']),
        createCounty('阿合奇县', ['阿合奇镇', '哈拉奇乡', '苏木塔什乡', '色帕巴依乡']),
      ],
    },
  ],
};

export const regions: Region[] = [huabei, dongbei, huadong, huazhong, huanan, xinan, xibei];
