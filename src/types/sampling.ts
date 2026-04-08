// ===== 行政区划类型 =====

export interface Region {
  code: string;
  name: string;
  population: number;
  provinces: Province[];
}

export interface Province {
  code: string;
  name: string;
  population: number;
  capital: City;
  prefectures: City[];
  ruralCounties: County[];
}

export interface City {
  code: string;
  name: string;
  type: 'capital' | 'prefecture';
  districts: District[];
}

export interface County {
  code: string;
  name: string;
  type: 'rural';
  towns: Town[];
}

export interface District {
  code: string;
  name: string;
  population?: number;
}

export interface Town {
  code: string;
  name: string;
  population?: number;
}

// ===== 人口普查类型 =====

export interface AgeGenderGroup {
  ageRange: string;
  ageMin: number;
  ageMax: number;
  male: number;
  female: number;
}

export interface CensusDistribution {
  provinceCode: string;
  provinceName: string;
  totalPopulation: number;
  groups: AgeGenderGroup[];
}

// ===== 抽样配置类型 =====

export interface SamplingConfig {
  seed: number;
  regionSelections: RegionSelection[];
  citiesPerProvince: CitySelectionConfig;
  districtsPerCity: number;
  personsPerDistrict: number;
}

export interface RegionSelection {
  regionCode: string;
  provincesToSample: number;
}

export interface CitySelectionConfig {
  capital: number;
  prefecture: number;
  ruralCounty: number;
}

// ===== 抽样结果类型 =====

export interface Step1Result {
  region: Region;
  selectedProvinces: Province[];
}

export interface Step2Result {
  province: Province;
  capital: City;
  selectedPrefectures: City[];
  selectedRuralCounties: County[];
}

export interface Step3Result {
  area: City | County;
  areaName: string;
  areaType: 'city' | 'county';
  selectedDistricts: District[];
  selectedTowns: Town[];
}

export interface Step4Result {
  town: Town;
  townName: string;
  sampleSize: number;
  persons: SampledPerson[];
}

export interface SampledPerson {
  id: string;
  ageRange: string;
  gender: 'male' | 'female';
  province: string;
  city: string;
  area: string;
  town: string;
}

export interface SamplingResult {
  step1: Step1Result[];
  step2: Step2Result[];
  step3: Step3Result[];
  step4: Step4Result[];
  totalSampleSize: number;
  config: SamplingConfig;
}

// ===== UI状态类型 =====

export type StepNumber = 1 | 2 | 3 | 4;

export interface StepStatus {
  current: StepNumber;
  completed: Set<StepNumber>;
}
