import React from 'react';
import { useSamplingStore } from '../../store/useSamplingStore';
import { calculateStratifiedDistribution } from '../../engine/stratified';
import { getCensusByProvinceCode } from '../../data/census';

const Step4Person: React.FC = () => {
  const { config, setPersonsPerDistrict, step2Preview, result, runSampling } = useSamplingStore();

  // 计算预估分布
  const distribution = calculateStratifiedDistribution(
    getCensusByProvinceCode('000000'),
    config.personsPerDistrict,
  );

  const totalEstimated = step2Preview
    ? step2Preview.reduce((a, s2) =>
        a + (1 + s2.selectedPrefectures.length + s2.selectedRuralCounties.length) * config.districtsPerCity * config.personsPerDistrict,
        0,
      )
    : 0;

  const maleTotal = distribution.reduce((s, d) => s + d.male, 0);
  const femaleTotal = distribution.reduce((s, d) => s + d.female, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-light rounded-xl p-4">
        <h3 className="text-white text-sm font-semibold mb-1">第四阶段 · 个人分层抽样</h3>
        <p className="text-gray-400 text-xs">按年龄×性别交叉分层，每个街道/乡镇抽取指定人数</p>
      </div>

      {/* 每街道样本量 */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white text-sm font-medium">每街道/乡镇样本量</span>
            <p className="text-gray-500 text-xs mt-0.5">按年龄性别分层后各层人数之和</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">人数:</span>
          <div className="flex gap-1">
            {[100, 150, 200, 250, 300, 500].map(n => (
              <button
                key={n}
                onClick={() => setPersonsPerDistrict(n)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  config.personsPerDistrict === n
                    ? 'bg-primary text-white'
                    : 'bg-dark-hover text-gray-400 hover:text-white border border-dark-border'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-gray-500 text-xs">
          当前: 每个街道/乡镇 <span className="text-primary-light font-semibold">{config.personsPerDistrict}</span> 人
        </div>
      </div>

      {/* 年龄性别分层预览 */}
      <div className="glass-light rounded-xl p-4">
        <h4 className="text-gray-300 text-xs font-medium mb-3">年龄性别分层预览（全国数据）</h4>

        {/* 性别概览 */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-blue-500/10 rounded-lg p-2 text-center">
            <span className="text-blue-400 text-sm font-bold">{maleTotal}</span>
            <p className="text-gray-500 text-xs">男性</p>
          </div>
          <div className="flex-1 bg-pink-500/10 rounded-lg p-2 text-center">
            <span className="text-pink-400 text-sm font-bold">{femaleTotal}</span>
            <p className="text-gray-500 text-xs">女性</p>
          </div>
        </div>

        {/* 分层明细 */}
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {distribution.map(d => (
            <div key={d.ageRange} className="flex items-center gap-2 text-xs">
              <span className="w-14 text-gray-400 text-right flex-shrink-0">{d.ageRange}</span>
              <div className="flex-1 flex h-3 rounded overflow-hidden bg-dark/50">
                <div
                  className="bg-blue-500/70 transition-all duration-500"
                  style={{ width: `${(d.male / (maleTotal + femaleTotal)) * 200}%` }}
                />
                <div
                  className="bg-pink-500/70 transition-all duration-500"
                  style={{ width: `${(d.female / (maleTotal + femaleTotal)) * 200}%` }}
                />
              </div>
              <span className="w-8 text-gray-500 flex-shrink-0">{d.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 预估总样本量 */}
      <div className={`rounded-xl p-4 border ${totalEstimated > 0 ? 'bg-primary/10 border-primary/30 glow-primary' : 'bg-dark-card border-dark-border'}`}>
        <div className="text-center">
          <span className="text-gray-400 text-xs">预估总样本量</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-3xl font-bold gradient-text">{totalEstimated.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">人</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {step2Preview?.length || 0} 省 × 每省{1 + (step2Preview?.[0]?.selectedPrefectures.length || 0) + (step2Preview?.[0]?.selectedRuralCounties.length || 0)} 市县 × {config.districtsPerCity} 街道 × {config.personsPerDistrict} 人
          </p>
        </div>
      </div>

      {/* 执行抽样按钮 */}
      <button
        onClick={() => runSampling()}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-lighter text-white font-semibold text-sm hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2"
      >
        🎯 执行完整抽样
      </button>

      {/* 分层说明 */}
      <div className="glass-light rounded-xl p-3">
        <h4 className="text-primary-lighter text-xs font-semibold mb-1">💡 个人分层抽样说明</h4>
        <p className="text-gray-400 text-xs leading-relaxed">
          每个街道/乡镇内，按2020年人口普查的年龄×性别交叉分层，各层按人口比例分配样本量。这确保了最终样本在年龄和性别维度上与总体分布一致。
        </p>
      </div>
    </div>
  );
};

export default Step4Person;
