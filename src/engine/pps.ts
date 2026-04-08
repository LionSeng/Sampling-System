import type { Province, City, County, District, Town } from '../types/sampling';
import { SeededRandom } from '../utils/random';

/**
 * PPS (Probability Proportional to Size) 抽样
 * 按人口规模的比例概率抽样，大人口区域被抽中的概率更高
 */
export function ppsSample(items: Province[], n: number, rng: SeededRandom): Province[] {
  if (n >= items.length) return [...items];
  if (n <= 0) return [];

  const totalPop = items.reduce((s, p) => s + p.population, 0);
  if (totalPop === 0) return rng.sample(items, n);

  // 累积规模法 (Cumulative Size Method)
  const cumulative: number[] = [];
  let cumSum = 0;
  for (const item of items) {
    cumSum += item.population;
    cumulative.push(cumSum);
  }

  const selected: Province[] = [];
  const usedIndices = new Set<number>();

  // 生成随机起点和间隔（系统PPS抽样）
  const interval = totalPop / n;
  const start = rng.nextFloat() * interval;

  for (let i = 0; i < n; i++) {
    let target = start + i * interval;
    if (target >= totalPop) target -= totalPop;

    // 二分查找定位
    let lo = 0, hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }

    // 如果已被选中，尝试附近
    let idx = lo;
    let attempts = 0;
    while (usedIndices.has(idx) && attempts < items.length) {
      idx = (idx + 1) % items.length;
      attempts++;
    }

    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      selected.push(items[idx]);
    }
  }

  // 如果因重复导致不足，补充随机抽取
  if (selected.length < n) {
    const remaining = items.filter((_, i) => !usedIndices.has(i));
    const extra = rng.sample(remaining, n - selected.length);
    selected.push(...extra);
  }

  return selected;
}

/**
 * 从列表中简单随机抽取
 */
export function simpleRandomSample<T>(items: T[], n: number, rng: SeededRandom): T[] {
  return rng.sample(items, n);
}

/**
 * 省内分层抽样
 * 每个省抽取：1个省会 + n个地级市 + m个农村县
 */
export function stratifiedProvinceSample(
  province: Province,
  capitalCount: number,
  prefectureCount: number,
  ruralCountyCount: number,
  rng: SeededRandom,
): {
  capitals: City[];
  prefectures: City[];
  ruralCounties: County[];
} {
  // 省会城市（通常只有1个）
  const capitals = [province.capital];
  
  // 地级市
  const prefectures = simpleRandomSample(province.prefectures, prefectureCount, rng);
  
  // 农村县
  const ruralCounties = simpleRandomSample(province.ruralCounties, ruralCountyCount, rng);

  return { capitals, prefectures, ruralCounties };
}

/**
 * 城市/县内抽样 - 抽取街道或乡镇
 */
export function areaSample(
  area: City | County,
  n: number,
  rng: SeededRandom,
): District[] | Town[] {
  if (area.type === 'capital' || area.type === 'prefecture') {
    return simpleRandomSample((area as City).districts, n, rng);
  }
  return simpleRandomSample((area as County).towns, n, rng);
}
