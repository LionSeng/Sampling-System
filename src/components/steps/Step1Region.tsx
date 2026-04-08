import React from 'react';
import { useSamplingStore } from '../../store/useSamplingStore';

const Step1Region: React.FC = () => {
  const { regions, config, toggleRegion, setProvincesToSample, setSeed } = useSamplingStore();
  const selectedCodes = new Set(config.regionSelections.map(r => r.regionCode));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-light rounded-xl p-4">
        <h3 className="text-white text-sm font-semibold mb-1">第一阶段 · 大区PPS抽样</h3>
        <p className="text-gray-400 text-xs">选择参与抽样的大区，并设置每大区抽取省级区域的数量</p>
      </div>

      {/* 随机种子 */}
      <div className="glass-light rounded-xl p-4">
        <label className="text-gray-300 text-xs font-medium mb-2 block">随机种子（用于结果复现）</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={config.seed}
            onChange={e => setSeed(Number(e.target.value))}
            className="flex-1 bg-dark border border-dark-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 2147483647))}
            className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-gray-400 text-xs hover:text-white hover:border-primary/50 transition-all"
          >
            🎲
          </button>
        </div>
      </div>

      {/* 大区选择 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-gray-300 text-xs font-medium">选择大区</span>
          <span className="text-gray-500 text-xs">{config.regionSelections.length} / {regions.length}</span>
        </div>

        {regions.map(region => {
          const isSelected = selectedCodes.has(region.code);
          const selection = config.regionSelections.find(r => r.regionCode === region.code);
          const maxProvinces = region.provinces.length;

          return (
            <div
              key={region.code}
              className={`rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 border-primary/40 glow-primary'
                  : 'bg-dark-card border-dark-border/50 hover:border-dark-border'
              }`}
            >
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => toggleRegion(region.code)}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'bg-primary border-primary' : 'border-dark-border'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-white text-sm font-medium">{region.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-500 text-xs">{region.provinces.length}个省级区域</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{region.population}万人口</span>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-primary-light text-xs font-semibold">
                    抽{selection?.provincesToSample || 2}省
                  </span>
                )}
              </div>

              {/* PPS抽取数量配置 */}
              {isSelected && (
                <div className="px-3 pb-3 pt-0 animate-slide-up">
                  <div className="pl-8 flex items-center gap-3">
                    <span className="text-gray-400 text-xs">抽取省数:</span>
                    <div className="flex gap-1">
                      {[2, 3].map(n => (
                        <button
                          key={n}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (n <= maxProvinces) setProvincesToSample(region.code, n);
                          }}
                          disabled={n > maxProvinces}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                            selection?.provincesToSample === n
                              ? 'bg-primary text-white'
                              : 'bg-dark-hover text-gray-400 hover:text-white border border-dark-border'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs">(最多{maxProvinces}个)</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div className="flex gap-2">
        <button
          onClick={() => regions.forEach(r => {
            if (!selectedCodes.has(r.code)) toggleRegion(r.code);
          })}
          className="flex-1 px-3 py-2 rounded-lg bg-dark-hover border border-dark-border text-gray-400 text-xs hover:text-white transition-all"
        >
          全选
        </button>
        <button
          onClick={() => config.regionSelections.forEach(r => toggleRegion(r.regionCode))}
          className="flex-1 px-3 py-2 rounded-lg bg-dark-hover border border-dark-border text-gray-400 text-xs hover:text-white transition-all"
        >
          全不选
        </button>
      </div>

      {/* PPS抽样说明 */}
      <div className="glass-light rounded-xl p-3">
        <h4 className="text-primary-light text-xs font-semibold mb-1">💡 PPS抽样说明</h4>
        <p className="text-gray-400 text-xs leading-relaxed">
          概率比例规模抽样（PPS）会根据各省人口规模分配被抽中的概率。人口越多的省份，被抽中的概率越高，确保样本的代表性。
        </p>
      </div>
    </div>
  );
};

export default Step1Region;
