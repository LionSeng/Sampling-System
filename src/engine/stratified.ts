import type { AgeGenderGroup, SampledPerson } from '../types/sampling';
import type { CensusDistribution } from '../types/sampling';
import { SeededRandom } from '../utils/random';

/**
 * 分层随机抽样 - 按年龄×性别交叉分层
 * 各层按人口比例分配样本量，层内简单随机抽样
 */
export function stratifiedPersonSample(
  census: CensusDistribution,
  sampleSize: number,
  provinceName: string,
  cityName: string,
  areaName: string,
  townName: string,
  rng: SeededRandom,
): SampledPerson[] {
  const totalPopulation = census.groups.reduce(
    (s, g) => s + g.male + g.female,
    0,
  );

  const persons: SampledPerson[] = [];
  let personId = 0;

  for (const group of census.groups) {
    const groupTotal = group.male + group.female;
    const groupRatio = groupTotal / totalPopulation;
    const groupSampleSize = Math.round(groupRatio * sampleSize);

    // 按性别再分配
    const maleRatio = group.male / groupTotal;
    const maleCount = Math.round(groupSampleSize * maleRatio);
    const femaleCount = groupSampleSize - maleCount;

    // 生成男性样本
    for (let i = 0; i < maleCount; i++) {
      persons.push({
        id: `P-${personId++}`,
        ageRange: group.ageRange,
        gender: 'male',
        province: provinceName,
        city: cityName,
        area: areaName,
        town: townName,
      });
    }

    // 生成女性样本
    for (let i = 0; i < femaleCount; i++) {
      persons.push({
        id: `P-${personId++}`,
        ageRange: group.ageRange,
        gender: 'female',
        province: provinceName,
        city: cityName,
        area: areaName,
        town: townName,
      });
    }
  }

  // 打乱顺序
  return rng.shuffle(persons);
}

/**
 * 计算分层样本分布（用于预览）
 */
export function calculateStratifiedDistribution(
  census: CensusDistribution,
  sampleSize: number,
): { ageRange: string; male: number; female: number; total: number; percentage: number }[] {
  const totalPopulation = census.groups.reduce(
    (s, g) => s + g.male + g.female,
    0,
  );

  return census.groups.map(group => {
    const groupTotal = group.male + group.female;
    const groupRatio = groupTotal / totalPopulation;
    const groupSampleSize = Math.round(groupRatio * sampleSize);
    const maleRatio = group.male / groupTotal;
    const maleCount = Math.round(groupSampleSize * maleRatio);
    const femaleCount = groupSampleSize - maleCount;

    return {
      ageRange: group.ageRange,
      male: maleCount,
      female: femaleCount,
      total: maleCount + femaleCount,
      percentage: groupRatio * 100,
    };
  });
}
