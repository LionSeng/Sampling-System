import React from 'react';
import { useSamplingStore } from '../../store/useSamplingStore';

const Step2Province: React.FC = () => {
  const { config, setCitiesPerProvince, step1Preview, runPartialSampling } = useSamplingStore();

  React.useEffect(() => {
    if (!step1Preview) runPartialSampling(1);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-light rounded-xl p-4">
        <h3 className="text-white text-sm font-semibold mb-1">第二阶段 · 省内分层抽样</h3>
        <p className="text-gray-400 text-xs">配置每个被抽中省份内的分层抽样规则</p>
      </div>

      {/* 省会城市 */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white text-sm font-medium">省会/特大城市</span>
            <p className="text-gray-500 text-xs mt-0.5">每个省固定抽取省会城市</p>
          </div>
          <span className="px-3 py-1 rounded-md bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold">
            {config.citiesPerProvince.capital} 个
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          省会城市自动包含，代表该省核心城市人口
        </div>
      </div>

      {/* 地级市 */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white text-sm font-medium">地级市</span>
            <p className="text-gray-500 text-xs mt-0.5">从各省地级市中随机抽取</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">抽取数量:</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setCitiesPerProvince('prefecture', n)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  config.citiesPerProvince.prefecture === n
                    ? 'bg-primary text-white'
                    : 'bg-dark-hover text-gray-400 hover:text-white border border-dark-border'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 text-gray-500 text-xs">
          当前: 每省抽 {config.citiesPerProvince.prefecture} 个地级市
        </div>
      </div>

      {/* 农村县 */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white text-sm font-medium">农村县</span>
            <p className="text-gray-500 text-xs mt-0.5">从各省农村县中随机抽取</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">抽取数量:</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setCitiesPerProvince('ruralCounty', n)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  config.citiesPerProvince.ruralCounty === n
                    ? 'bg-primary text-white'
                    : 'bg-dark-hover text-gray-400 hover:text-white border border-dark-border'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 text-gray-500 text-xs">
          当前: 每省抽 {config.citiesPerProvince.ruralCounty} 个农村县
        </div>
      </div>

      {/* 已选省份预览 */}
      {step1Preview && step1Preview.length > 0 && (
        <div className="glass-light rounded-xl p-4">
          <h4 className="text-gray-300 text-xs font-medium mb-2">已抽中的省份</h4>
          <div className="space-y-1.5">
            {step1Preview.map((s1, i) =>
              s1.selectedProvinces.map(p => (
                <div key={`${i}-${p.code}`} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-white">{p.name}</span>
                  <span className="text-gray-500">({p.population}万)</span>
                  <span className="text-gray-600 ml-auto">
                    {p.prefectures.length}地级市 · {p.ruralCounties.length}县
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="glass-light rounded-xl p-3">
        <h4 className="text-success text-xs font-semibold mb-1">💡 分层抽样说明</h4>
        <p className="text-gray-400 text-xs leading-relaxed">
          每个被抽中的省份按城市层级进行分层：省会城市代表核心城区、地级市代表一般城市、农村县代表乡村地区。这样确保不同层级都有样本覆盖。
        </p>
      </div>
    </div>
  );
};

export default Step2Province;
