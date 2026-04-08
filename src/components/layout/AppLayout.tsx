import React, { useState } from 'react';
import { useSamplingStore } from '../../store/useSamplingStore';
import Step1Region from '../steps/Step1Region';
import Step2Province from '../steps/Step2Province';
import Step3City from '../steps/Step3City';
import Step4Person from '../steps/Step4Person';
import { exportToExcel, exportToCSV } from '../../utils/export';

const StepProgress: React.FC = () => {
  const { currentStep } = useSamplingStore();

  const steps = [
    { num: 1, label: '大区PPS抽样', icon: '🗺️' },
    { num: 2, label: '省内分层抽样', icon: '🏙️' },
    { num: 3, label: '市县内抽样', icon: '🏘️' },
    { num: 4, label: '个人分层抽样', icon: '👥' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6">
      {steps.map((step, idx) => (
        <React.Fragment key={step.num}>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
              currentStep === step.num
                ? 'bg-primary/20 border border-primary/40 step-active-pulse'
                : currentStep > step.num
                ? 'bg-success/10 border border-success/30'
                : 'bg-dark-card border border-dark-border/50 opacity-60'
            }`}
            onClick={() => {
              if (step.num <= currentStep) {
                useSamplingStore.getState().setCurrentStep(step.num as 1 | 2 | 3 | 4);
              }
            }}
          >
            <span className="text-lg">{step.icon}</span>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold ${
                currentStep === step.num ? 'text-primary-light' : currentStep > step.num ? 'text-success' : 'text-gray-500'
              }`}>
                Step {step.num}
              </span>
              <span className={`text-xs ${
                currentStep === step.num ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 h-0.5 rounded transition-colors duration-300 ${
              currentStep > step.num ? 'bg-success/50' : 'bg-dark-border'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ConfigPanel: React.FC = () => {
  const { currentStep } = useSamplingStore();

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 animate-fade-in">
      {currentStep === 1 && <Step1Region />}
      {currentStep === 2 && <Step2Province />}
      {currentStep === 3 && <Step3City />}
      {currentStep === 4 && <Step4Person />}
    </div>
  );
};

const AppLayout: React.FC = () => {
  const { currentStep, nextStep, prevStep, runSampling, isCalculating, result } = useSamplingStore();
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-dark overflow-hidden">
      {/* 顶部导航 */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-dark-border/50 glass">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-lighter flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base tracking-tight">
              多阶段分层抽样系统
            </h1>
            <p className="text-gray-500 text-xs">基于2020年人口普查数据</p>
          </div>
        </div>
        <StepProgress />
        <div className="flex items-center gap-2">
          {result && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 rounded-lg bg-dark-hover border border-dark-border text-gray-300 text-sm hover:bg-dark-border/80 transition-all flex items-center gap-1.5"
              >
                📥 导出
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 glass rounded-lg py-1 z-50 animate-fade-in">
                  <button
                    onClick={() => { exportToExcel(result); setShowExportMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition-colors"
                  >
                    📊 导出 Excel
                  </button>
                  <button
                    onClick={() => { exportToCSV(result); setShowExportMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition-colors"
                  >
                    📄 导出 CSV
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => runSampling()}
            disabled={isCalculating}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCalculating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                计算中...
              </>
            ) : (
              <>🎯 执行抽样</>
            )}
          </button>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧配置面板 */}
        <div className="w-[380px] flex-shrink-0 border-r border-dark-border/50 bg-dark-card/50 flex flex-col">
          <div className="px-4 py-3 border-b border-dark-border/30">
            <h2 className="text-white text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              配置面板
            </h2>
          </div>
          <ConfigPanel />
        </div>

        {/* 右侧预览面板 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="已选大区"
              value={useSamplingStore(s => s.config.regionSelections.length)}
              suffix="/ 7"
              color="primary"
            />
            <StatCard
              title="已抽省份"
              value={useSamplingStore(s => s.step1Preview?.reduce((a, b) => a + b.selectedProvinces.length, 0) || 0)}
              color="success"
            />
            <StatCard
              title="已抽市县"
              value={useSamplingStore(s => s.step2Preview?.length || 0)}
              color="warning"
            />
            <StatCard
              title="总样本量"
              value={result?.totalSampleSize || 0}
              color="primary"
              highlight
            />
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 地图 */}
            <div className="glass rounded-2xl p-4 min-h-[400px]">
              <h3 className="text-white text-sm font-medium mb-3">区域分布图</h3>
              <div id="map-container" className="w-full h-[360px] flex items-center justify-center text-gray-500 text-sm">
                {result ? (
                  <RegionMap />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p>执行抽样后显示区域分布</p>
                  </div>
                )}
              </div>
            </div>

            {/* 分布图表 */}
            <div className="glass rounded-2xl p-4 min-h-[400px]">
              <h3 className="text-white text-sm font-medium mb-3">年龄性别分布</h3>
              <div className="w-full h-[360px] flex items-center justify-center text-gray-500 text-sm">
                {result ? (
                  <DistributionChart />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>执行抽样后显示分布图表</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 结果表格 */}
          {result && (
            <div className="glass rounded-2xl p-4 animate-slide-up">
              <h3 className="text-white text-sm font-medium mb-3">抽样结果明细</h3>
              <ResultSummary />
            </div>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <footer className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-dark-border/50 glass">
        <div className="flex items-center gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-5 py-2 rounded-lg bg-dark-hover border border-dark-border text-gray-300 text-sm hover:bg-dark-border/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 上一步
          </button>
          <button
            onClick={() => useSamplingStore.getState().reset()}
            className="px-3 py-2 rounded-lg bg-dark-hover border border-dark-border text-gray-500 text-sm hover:text-danger hover:border-danger/30 transition-all"
            title="重置所有配置"
          >
            🔄 重置
          </button>
        </div>
        <span className="text-gray-500 text-xs">
          步骤 {currentStep} / 4 · 种子: {useSamplingStore(s => s.config.seed)}
        </span>
        <button
          onClick={nextStep}
          disabled={currentStep === 4}
          className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          下一步 →
        </button>
      </footer>
    </div>
  );
};

// 统计卡片组件
const StatCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
  highlight?: boolean;
}> = ({ title, value, suffix, color, highlight }) => {
  const colorMap = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    success: 'from-success/20 to-success/5 border-success/30',
    warning: 'from-warning/20 to-warning/5 border-warning/30',
    danger: 'from-danger/20 to-danger/5 border-danger/30',
  };
  const textColorMap = {
    primary: 'text-primary-light',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className={`rounded-xl p-4 border bg-gradient-to-br ${colorMap[color]} card-hover ${highlight ? 'glow-primary' : ''}`}>
      <p className="text-gray-400 text-xs mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold number-animate ${textColorMap[color]}`}>
          {value.toLocaleString()}
        </span>
        {suffix && <span className="text-gray-500 text-xs">{suffix}</span>}
      </div>
    </div>
  );
};

// 简易区域地图展示（用列表代替复杂地图，后续可升级）
const RegionMap: React.FC = () => {
  const { step1Preview, step2Preview } = useSamplingStore();

  if (!step1Preview) return null;

  return (
    <div className="w-full h-full overflow-y-auto space-y-3">
      {step1Preview.map((s1, i) => (
        <div key={i} className="glass-light rounded-lg p-3 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-white text-sm font-medium">{s1.region.name}</span>
            <span className="text-gray-500 text-xs ml-auto">
              人口: {s1.region.population}万
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {s1.selectedProvinces.map(p => (
              <span key={p.code} className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary-light text-xs">
                {p.name} ({p.population}万)
              </span>
            ))}
          </div>
          {step2Preview && step2Preview
            .filter(s2 => s1.selectedProvinces.some(sp => sp.code === s2.province.code))
            .map((s2, j) => (
              <div key={j} className="mt-2 pl-4 border-l border-dark-border">
                <span className="text-gray-400 text-xs">{s2.province.name}: </span>
                <span className="text-gray-300 text-xs">
                  {s2.capital.name} + {s2.selectedPrefectures.map(c => c.name).join(', ')} + {s2.selectedRuralCounties.map(c => c.name).join(', ')}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

// 分布图表（简易版）
const DistributionChart: React.FC = () => {
  const { step4Preview } = useSamplingStore();

  if (!step4Preview || step4Preview.length === 0) return null;

  // 汇总所有年龄性别分布
  const ageDistribution: Record<string, { male: number; female: number }> = {};
  for (const s4 of step4Preview) {
    for (const person of s4.persons) {
      if (!ageDistribution[person.ageRange]) {
        ageDistribution[person.ageRange] = { male: 0, female: 0 };
      }
      if (person.gender === 'male') ageDistribution[person.ageRange].male++;
      else ageDistribution[person.ageRange].female++;
    }
  }

  const totalMale = Object.values(ageDistribution).reduce((s, v) => s + v.male, 0);
  const totalFemale = Object.values(ageDistribution).reduce((s, v) => s + v.female, 0);
  const total = totalMale + totalFemale;

  const maxCount = Math.max(...Object.values(ageDistribution).map(v => v.male + v.female));

  return (
    <div className="w-full h-full overflow-y-auto space-y-3">
      {/* 性别概览 */}
      <div className="flex gap-4">
        <div className="flex-1 glass-light rounded-lg p-3 text-center">
          <span className="text-blue-400 text-2xl font-bold">{totalMale.toLocaleString()}</span>
          <p className="text-gray-500 text-xs mt-1">男性 ({((totalMale/total)*100).toFixed(1)}%)</p>
        </div>
        <div className="flex-1 glass-light rounded-lg p-3 text-center">
          <span className="text-pink-400 text-2xl font-bold">{totalFemale.toLocaleString()}</span>
          <p className="text-gray-500 text-xs mt-1">女性 ({((totalFemale/total)*100).toFixed(1)}%)</p>
        </div>
      </div>

      {/* 年龄分布条形图 */}
      <div className="space-y-1.5">
        {Object.entries(ageDistribution).map(([age, counts]) => {
          const total = counts.male + counts.female;
          const malePct = (counts.male / maxCount) * 100;
          const femalePct = (counts.female / maxCount) * 100;

          return (
            <div key={age} className="flex items-center gap-2 text-xs">
              <span className="w-16 text-gray-400 text-right flex-shrink-0">{age}</span>
              <div className="flex-1 flex gap-0.5">
                <div
                  className="h-4 rounded-l bg-blue-500/60 transition-all duration-500"
                  style={{ width: `${malePct}%` }}
                />
                <div
                  className="h-4 rounded-r bg-pink-500/60 transition-all duration-500"
                  style={{ width: `${femalePct}%` }}
                />
              </div>
              <span className="w-10 text-gray-500 flex-shrink-0">{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 结果摘要
const ResultSummary: React.FC = () => {
  const { result } = useSamplingStore();
  if (!result) return null;

  return (
    <div className="space-y-4">
      {/* 第一阶段摘要 */}
      <div>
        <h4 className="text-primary-light text-xs font-semibold mb-2 uppercase tracking-wider">Stage 1 · 大区PPS抽样</h4>
        <div className="grid grid-cols-2 gap-2">
          {result.step1.map((s1, i) => (
            <div key={i} className="glass-light rounded-lg p-3">
              <span className="text-white text-xs font-medium">{s1.region.name}</span>
              <p className="text-gray-400 text-xs mt-1">
                → {s1.selectedProvinces.map(p => p.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 第二阶段摘要 */}
      <div>
        <h4 className="text-success text-xs font-semibold mb-2 uppercase tracking-wider">Stage 2 · 省内分层抽样</h4>
        <div className="grid grid-cols-3 gap-2">
          {result.step2.map((s2, i) => (
            <div key={i} className="glass-light rounded-lg p-3">
              <span className="text-white text-xs font-medium">{s2.province.name}</span>
              <p className="text-gray-400 text-xs mt-1">
                省会: {s2.capital.name}<br />
                地级市: {s2.selectedPrefectures.map(c => c.name).join(', ')}<br />
                农村县: {s2.selectedRuralCounties.map(c => c.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 统计摘要 */}
      <div className="flex gap-4 pt-2 border-t border-dark-border/30">
        <div className="text-center">
          <span className="text-2xl font-bold gradient-text">{result.totalSampleSize.toLocaleString()}</span>
          <p className="text-gray-500 text-xs">总样本量</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary-light">
            {result.step4.length}
          </span>
          <p className="text-gray-500 text-xs">抽样区域数</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-success">
            {result.step2.length}
          </span>
          <p className="text-gray-500 text-xs">覆盖省份</p>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
