import type { CensusDistribution, AgeGenderGroup } from '../types/sampling';

// 2020年第七次人口普查全国年龄性别分布数据（万人）
// 数据来源：国家统计局

export const nationalCensus: CensusDistribution = {
  provinceCode: '000000',
  provinceName: '全国',
  totalPopulation: 141178,
  groups: [
    { ageRange: '0-4岁', ageMin: 0, ageMax: 4, male: 3847, female: 3330 },
    { ageRange: '5-9岁', ageMin: 5, ageMax: 9, male: 4620, female: 3995 },
    { ageRange: '10-14岁', ageMin: 10, ageMax: 14, male: 4746, female: 4100 },
    { ageRange: '15-19岁', ageMin: 15, ageMax: 19, male: 4624, female: 4045 },
    { ageRange: '20-24岁', ageMin: 20, ageMax: 24, male: 4350, female: 3980 },
    { ageRange: '25-29岁', ageMin: 25, ageMax: 29, male: 4880, female: 4520 },
    { ageRange: '30-34岁', ageMin: 30, ageMax: 34, male: 5900, female: 5480 },
    { ageRange: '35-39岁', ageMin: 35, ageMax: 39, male: 5850, female: 5520 },
    { ageRange: '40-44岁', ageMin: 40, ageMax: 44, male: 5100, female: 4850 },
    { ageRange: '45-49岁', ageMin: 45, ageMax: 49, male: 5200, female: 5000 },
    { ageRange: '50-54岁', ageMin: 50, ageMax: 54, male: 4750, female: 4550 },
    { ageRange: '55-59岁', ageMin: 55, ageMax: 59, male: 4100, female: 3950 },
    { ageRange: '60-64岁', ageMin: 60, ageMax: 64, male: 3300, female: 3200 },
    { ageRange: '65-69岁', ageMin: 65, ageMax: 69, male: 2600, female: 2600 },
    { ageRange: '70-74岁', ageMin: 70, ageMax: 74, male: 1800, female: 1900 },
    { ageRange: '75-79岁', ageMin: 75, ageMax: 79, male: 1100, female: 1300 },
    { ageRange: '80-84岁', ageMin: 80, ageMax: 84, male: 600, female: 800 },
    { ageRange: '85-89岁', ageMin: 85, ageMax: 89, male: 260, female: 400 },
    { ageRange: '90-94岁', ageMin: 90, ageMax: 94, male: 70, female: 140 },
    { ageRange: '95岁以上', ageMin: 95, ageMax: 150, male: 13, female: 30 },
  ],
};

// 各省级区域人口普查年龄性别分布（简化版，用调整系数模拟各省差异）
// 实际项目中应使用完整的省级普查数据
const createProvinceCensus = (
  code: string,
  name: string,
  total: number,
  youngRatio: number, // 0-14岁占比系数
  oldRatio: number,   // 65岁以上占比系数
): CensusDistribution => {
  const baseGroups = nationalCensus.groups;
  const totalMale = baseGroups.reduce((s, g) => s + g.male, 0);
  const totalFemale = baseGroups.reduce((s, g) => s + g.female, 0);

  const scaleFactor = total / (totalMale + totalFemale);

  const groups: AgeGenderGroup[] = baseGroups.map(g => {
    let maleFactor = scaleFactor;
    let femaleFactor = scaleFactor;

    // 年轻人口调整
    if (g.ageMax <= 14) {
      maleFactor *= youngRatio;
      femaleFactor *= youngRatio;
    }
    // 老年人口调整
    if (g.ageMin >= 65) {
      maleFactor *= oldRatio;
      femaleFactor *= oldRatio;
    }

    return {
      ageRange: g.ageRange,
      ageMin: g.ageMin,
      ageMax: g.ageMax,
      male: Math.round(g.male * maleFactor),
      female: Math.round(g.female * femaleFactor),
    };
  });

  return { provinceCode: code, provinceName: name, totalPopulation: total, groups };
};

// 省级人口普查数据（带区域特征调整系数）
export const provinceCensusData: CensusDistribution[] = [
  // 华北
  createProvinceCensus('110000', '北京市', 2189, 0.75, 1.15),
  createProvinceCensus('120000', '天津市', 1387, 0.78, 1.18),
  createProvinceCensus('130000', '河北省', 7461, 1.05, 1.08),
  createProvinceCensus('140000', '山西省', 3492, 0.95, 1.05),
  createProvinceCensus('150000', '内蒙古自治区', 2405, 0.88, 1.0),
  // 东北
  createProvinceCensus('210000', '辽宁省', 4259, 0.72, 1.3),
  createProvinceCensus('220000', '吉林省', 2407, 0.7, 1.28),
  createProvinceCensus('230000', '黑龙江省', 3185, 0.68, 1.35),
  // 华东
  createProvinceCensus('310000', '上海市', 2487, 0.65, 1.2),
  createProvinceCensus('320000', '江苏省', 8475, 0.88, 1.22),
  createProvinceCensus('330000', '浙江省', 6457, 0.85, 1.15),
  createProvinceCensus('340000', '安徽省', 6103, 1.05, 1.1),
  createProvinceCensus('350000', '福建省', 4154, 1.0, 0.95),
  createProvinceCensus('360000', '江西省', 4518, 1.12, 0.95),
  createProvinceCensus('370000', '山东省', 10153, 0.92, 1.18),
  // 华中
  createProvinceCensus('410000', '河南省', 9937, 1.15, 1.02),
  createProvinceCensus('420000', '湖北省', 5775, 0.95, 1.1),
  createProvinceCensus('430000', '湖南省', 6644, 1.05, 1.05),
  // 华南
  createProvinceCensus('440000', '广东省', 12601, 1.1, 0.82),
  createProvinceCensus('450000', '广西壮族自治区', 5013, 1.2, 0.92),
  createProvinceCensus('460000', '海南省', 1008, 1.1, 0.9),
  // 西南
  createProvinceCensus('500000', '重庆市', 3205, 0.9, 1.15),
  createProvinceCensus('510000', '四川省', 8367, 0.95, 1.18),
  createProvinceCensus('520000', '贵州省', 3856, 1.15, 0.95),
  createProvinceCensus('530000', '云南省', 4721, 1.1, 0.92),
  createProvinceCensus('540000', '西藏自治区', 365, 1.25, 0.72),
  // 西北
  createProvinceCensus('610000', '陕西省', 3953, 0.95, 1.08),
  createProvinceCensus('620000', '甘肃省', 2502, 1.0, 1.0),
  createProvinceCensus('630000', '青海省', 592, 1.05, 0.88),
  createProvinceCensus('640000', '宁夏回族自治区', 720, 1.15, 0.88),
  createProvinceCensus('650000', '新疆维吾尔自治区', 2585, 1.12, 0.78),
];

export function getCensusByProvinceCode(code: string): CensusDistribution {
  return provinceCensusData.find(c => c.provinceCode === code) || nationalCensus;
}
