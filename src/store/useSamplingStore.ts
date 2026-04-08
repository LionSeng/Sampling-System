import { create } from 'zustand';
import type {
  StepNumber,
  SamplingConfig,
  SamplingResult,
  Step1Result,
  Step2Result,
  Step3Result,
  Step4Result,
  RegionSelection,
} from '../types/sampling';
import { regions } from '../data/regions';
import { executeFullSampling, executeStep1, executeStep2, executeStep3, executeStep4 } from '../engine';
import { generateSeed, SeededRandom } from '../utils/random';

interface SamplingStore {
  regions: typeof regions;
  currentStep: StepNumber;
  config: SamplingConfig;
  result: SamplingResult | null;
  step1Preview: Step1Result[] | null;
  step2Preview: Step2Result[] | null;
  step3Preview: Step3Result[] | null;
  step4Preview: Step4Result[] | null;
  isCalculating: boolean;

  setCurrentStep: (step: StepNumber) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleRegion: (regionCode: string) => void;
  setProvincesToSample: (regionCode: string, count: number) => void;
  setSeed: (seed: number) => void;
  setCitiesPerProvince: (type: 'capital' | 'prefecture' | 'ruralCounty', count: number) => void;
  setDistrictsPerCity: (count: number) => void;
  setPersonsPerDistrict: (count: number) => void;
  runSampling: () => void;
  runPartialSampling: (upToStep: StepNumber) => void;
  reset: () => void;
}

const defaultConfig: SamplingConfig = {
  seed: generateSeed(),
  regionSelections: [
    { regionCode: 'R-HB', provincesToSample: 2 },
    { regionCode: 'R-DB', provincesToSample: 2 },
    { regionCode: 'R-HD', provincesToSample: 3 },
    { regionCode: 'R-HZ', provincesToSample: 2 },
    { regionCode: 'R-HN', provincesToSample: 2 },
    { regionCode: 'R-XN', provincesToSample: 2 },
    { regionCode: 'R-XB', provincesToSample: 2 },
  ],
  citiesPerProvince: { capital: 1, prefecture: 1, ruralCounty: 2 },
  districtsPerCity: 4,
  personsPerDistrict: 250,
};

export const useSamplingStore = create<SamplingStore>((set, get) => ({
  regions,
  currentStep: 1,
  config: { ...defaultConfig },
  result: null,
  step1Preview: null,
  step2Preview: null,
  step3Preview: null,
  step4Preview: null,
  isCalculating: false,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      const next = (currentStep + 1) as StepNumber;
      set({ currentStep: next });
      get().runPartialSampling(next);
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) set({ currentStep: (currentStep - 1) as StepNumber });
  },

  toggleRegion: (regionCode) => {
    const { config } = get();
    const exists = config.regionSelections.find(r => r.regionCode === regionCode);
    let newSelections: RegionSelection[];
    if (exists) {
      newSelections = config.regionSelections.filter(r => r.regionCode !== regionCode);
    } else {
      const region = regions.find(r => r.code === regionCode);
      const defaultCount = region && region.provinces.length >= 3 ? 2 : Math.min(region?.provinces.length || 1, 2);
      newSelections = [...config.regionSelections, { regionCode, provincesToSample: defaultCount }];
    }
    set({ config: { ...config, regionSelections: newSelections } });
  },

  setProvincesToSample: (regionCode, count) => {
    const { config } = get();
    const newSelections = config.regionSelections.map(r =>
      r.regionCode === regionCode ? { ...r, provincesToSample: count } : r,
    );
    set({ config: { ...config, regionSelections: newSelections } });
  },

  setSeed: (seed) => set(s => ({ config: { ...s.config, seed } })),

  setCitiesPerProvince: (type, count) => set(s => ({
    config: { ...s.config, citiesPerProvince: { ...s.config.citiesPerProvince, [type]: count } },
  })),

  setDistrictsPerCity: (count) => set(s => ({
    config: { ...s.config, districtsPerCity: count },
  })),

  setPersonsPerDistrict: (count) => set(s => ({
    config: { ...s.config, personsPerDistrict: count },
  })),

  runSampling: () => {
    set({ isCalculating: true });
    const { regions: regionData, config } = get();
    console.log('Running full sampling with config:', config);
    const result = executeFullSampling(regionData, config);
    set({
      result,
      step1Preview: result.step1,
      step2Preview: result.step2,
      step3Preview: result.step3,
      step4Preview: result.step4,
      isCalculating: false,
    });
  },

  runPartialSampling: (upToStep: StepNumber) => {
    const { regions: regionData, config } = get();
    const rng = new SeededRandom(config.seed);

    try {
      const s1 = executeStep1(regionData, config, rng);
      set({ step1Preview: s1 });

      if (upToStep >= 2) {
        const rng2 = new SeededRandom(config.seed);
        const s1b = executeStep1(regionData, config, rng2);
        const s2 = executeStep2(s1b, config, rng2);
        set({ step2Preview: s2 });
      }

      if (upToStep >= 3) {
        const rng3 = new SeededRandom(config.seed);
        const s1c = executeStep1(regionData, config, rng3);
        const s2c = executeStep2(s1c, config, rng3);
        const s3 = executeStep3(s2c, config, rng3);
        set({ step3Preview: s3 });
      }

      if (upToStep >= 4) {
        const result = executeFullSampling(regionData, config);
        set({
          result,
          step4Preview: result.step4,
        });
      }
    } catch (e) {
      console.error('Sampling error:', e);
    }
  },

  reset: () => set({
    currentStep: 1,
    config: { ...defaultConfig, seed: generateSeed() },
    result: null,
    step1Preview: null,
    step2Preview: null,
    step3Preview: null,
    step4Preview: null,
  }),
}));
