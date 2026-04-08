import type {
  Region,
  Province,
  City,
  County,
  Step1Result,
  Step2Result,
  Step3Result,
  Step4Result,
  SamplingConfig,
  SamplingResult,
} from '../types/sampling';
import { SeededRandom } from '../utils/random';
import { ppsSample, stratifiedProvinceSample, simpleRandomSample } from './pps';
import { stratifiedPersonSample } from './stratified';
import { getCensusByProvinceCode } from '../data/census';
import type { District, Town } from '../types/sampling';

/**
 * 四阶段抽样编排引擎
 */

// 第一阶段：大区级PPS抽样
export function executeStep1(
  regions: Region[],
  config: SamplingConfig,
  rng: SeededRandom,
): Step1Result[] {
  const results: Step1Result[] = [];

  for (const regionSel of config.regionSelections) {
    const region = regions.find(r => r.code === regionSel.regionCode);
    if (!region) continue;

    const selectedProvinces = ppsSample(
      region.provinces,
      regionSel.provincesToSample,
      rng,
    );

    results.push({ region, selectedProvinces });
  }

  return results;
}

// 第二阶段：省内分层抽样
export function executeStep2(
  step1Results: Step1Result[],
  config: SamplingConfig,
  rng: SeededRandom,
): Step2Result[] {
  const results: Step2Result[] = [];

  for (const s1 of step1Results) {
    for (const province of s1.selectedProvinces) {
      const { capitals, prefectures, ruralCounties } = stratifiedProvinceSample(
        province,
        config.citiesPerProvince.capital,
        config.citiesPerProvince.prefecture,
        config.citiesPerProvince.ruralCounty,
        rng,
      );

      results.push({
        province,
        capital: capitals[0] || province.capital,
        selectedPrefectures: prefectures,
        selectedRuralCounties: ruralCounties,
      });
    }
  }

  return results;
}

// 第三阶段：城市/县内街道乡镇抽样
export function executeStep3(
  step2Results: Step2Result[],
  config: SamplingConfig,
  rng: SeededRandom,
): Step3Result[] {
  const results: Step3Result[] = [];

  for (const s2 of step2Results) {
    // 省会城市
    const capitalDistricts = simpleRandomSample(
      s2.capital.districts,
      config.districtsPerCity,
      rng,
    );
    results.push({
      area: s2.capital,
      areaName: s2.capital.name,
      areaType: 'city',
      selectedDistricts: capitalDistricts,
      selectedTowns: [],
    });

    // 地级市
    for (const city of s2.selectedPrefectures) {
      const districts = simpleRandomSample(
        city.districts,
        config.districtsPerCity,
        rng,
      );
      results.push({
        area: city,
        areaName: city.name,
        areaType: 'city',
        selectedDistricts: districts,
        selectedTowns: [],
      });
    }

    // 农村县
    for (const county of s2.selectedRuralCounties) {
      const towns = simpleRandomSample(
        county.towns,
        config.districtsPerCity,
        rng,
      );
      results.push({
        area: county,
        areaName: county.name,
        areaType: 'county',
        selectedDistricts: [],
        selectedTowns: towns,
      });
    }
  }

  return results;
}

// 第四阶段：个人级年龄性别分层抽样
export function executeStep4(
  step3Results: Step3Result[],
  step2Results: Step2Result[],
  config: SamplingConfig,
  rng: SeededRandom,
): Step4Result[] {
  const results: Step4Result[] = [];

  for (const s3 of step3Results) {
    // 找到该区域所属的省份
    const province = findProvinceForArea(s3, step2Results);
    const census = province
      ? getCensusByProvinceCode(province.code)
      : getCensusByProvinceCode('000000');

    const provinceName = province?.name || '未知';
    const cityName = s3.areaName;

    // 对于城市区域，取街道；对于农村县，取乡镇
    if (s3.areaType === 'city') {
      for (const district of s3.selectedDistricts) {
        const persons = stratifiedPersonSample(
          census,
          config.personsPerDistrict,
          provinceName,
          cityName,
          district.name,
          district.name,
          rng,
        );
        results.push({
          town: { code: district.code, name: district.name },
          townName: district.name,
          sampleSize: persons.length,
          persons,
        });
      }
    } else {
      for (const town of s3.selectedTowns) {
        const persons = stratifiedPersonSample(
          census,
          config.personsPerDistrict,
          provinceName,
          cityName,
          town.name,
          town.name,
          rng,
        );
        results.push({
          town,
          townName: town.name,
          sampleSize: persons.length,
          persons,
        });
      }
    }
  }

  return results;
}

// 辅助：查找区域所属省份
function findProvinceForArea(
  step3Result: Step3Result,
  step2Results: Step2Result[],
): Province | null {
  for (const s2 of step2Results) {
    if (s2.capital.code === step3Result.area.code) return s2.province;
    if (s2.selectedPrefectures.some(c => c.code === step3Result.area.code)) return s2.province;
    if (s2.selectedRuralCounties.some(c => c.code === step3Result.area.code)) return s2.province;
  }
  return null;
}

// 完整四阶段抽样
export function executeFullSampling(
  regions: Region[],
  config: SamplingConfig,
): SamplingResult {
  const rng = new SeededRandom(config.seed);

  const step1 = executeStep1(regions, config, rng);
  const step2 = executeStep2(step1, config, rng);
  const step3 = executeStep3(step2, config, rng);
  const step4 = executeStep4(step3, step2, config, rng);

  const totalSampleSize = step4.reduce((s, r) => s + r.sampleSize, 0);

  return { step1, step2, step3, step4, totalSampleSize, config };
}
