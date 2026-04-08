import React from 'react';
import { useSamplingStore } from '../../store/useSamplingStore';

const Step3City: React.FC = () => {
  const { config, setDistrictsPerCity, step2Preview, runPartialSampling } = useSamplingStore();

  React.useEffect(() => {
    if (!step2Preview) runPartialSampling(2);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-light rounded-xl p-4">
        <h3 className="text-white text-sm font-semibold mb-1">第三阶段 · 市/县内抽样</h3>
        <p className="text-gray-400 text-xs">配置每个城市/县内抽取街道或乡镇的数量</p>
      </div>

      {/* 街道/乡镇抽取数量 */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white text-sm font-medium">街道/乡镇抽取数量</span>
            <p className="text-gray-500 text-xs mt-0.5">每个城市/县内随机抽取的街道或乡镇数</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">数量:</span>
          <div className="flex gap-1">
            {[2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => setDistrictsPerCity(n)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  config.districtsPerCity === n
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
          当前: 每个城市/县抽取 <span className="text-primary-light font-semibold">{config.districtsPerCity}</span> 个街道/乡镇
        </div>
      </div>

      {/* 抽样区域类型说明 */}
      <div className="glass-light rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-sm">🏙️</span>
          </div>
          <div>
            <span className="text-white text-xs font-medium">城市区域</span>
            <p className="text-gray-500 text-xs">省会和地级市内抽取「街道」（城区行政单元）</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 text-sm">🌾</span>
          </div>
          <div>
            <span className="text-white text-xs font-medium">农村区域</span>
            <p className="text-gray-500 text-xs">农村县内抽取「乡镇」（乡村行政单元）</p>
          </div>
        </div>
      </div>

      {/* 已抽市县预览 */}
      {step2Preview && step2Preview.length > 0 && (
        <div className="glass-light rounded-xl p-4">
          <h4 className="text-gray-300 text-xs font-medium mb-2">待抽样的城市/县</h4>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {step2Preview.map((s2, i) => (
              <div key={i} className="space-y-1">
                <div className="text-gray-400 text-xs font-medium">{s2.province.name}</div>
                <div className="pl-3 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                    <span className="text-blue-300">{s2.capital.name}</span>
                    <span className="text-gray-600">· 省会</span>
                  </div>
                  {s2.selectedPrefectures.map(c => (
                    <div key={c.code} className="flex items-center gap-1.5 text-xs">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      <span className="text-blue-300">{c.name}</span>
                      <span className="text-gray-600">· 地级市</span>
                    </div>
                  ))}
                  {s2.selectedRuralCounties.map(c => (
                    <div key={c.code} className="flex items-center gap-1.5 text-xs">
                      <span className="w-1 h-1 rounded-full bg-green-400" />
                      <span className="text-green-300">{c.name}</span>
                      <span className="text-gray-600">· 农村县</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 预估统计 */}
      <div className="glass-light rounded-xl p-4">
        <h4 className="text-gray-300 text-xs font-medium mb-2">预估统计</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded-lg bg-dark/50">
            <span className="text-primary-light text-lg font-bold">
              {step2Preview ? step2Preview.reduce((a, s2) => 
                a + 1 + s2.selectedPrefectures.length + s2.selectedRuralCounties.length, 0
              ) : 0}
            </span>
            <p className="text-gray-500 text-xs">城市/县数</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-dark/50">
            <span className="text-primary-light text-lg font-bold">
              {step2Preview ? step2Preview.reduce((a, s2) => 
                a + (1 + s2.selectedPrefectures.length + s2.selectedRuralCounties.length) * config.districtsPerCity, 0
              ) : 0}
            </span>
            <p className="text-gray-500 text-xs">街道/乡镇数</p>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div className="glass-light rounded-xl p-3">
        <h4 className="text-warning text-xs font-semibold mb-1">💡 市县内抽样说明</h4>
        <p className="text-gray-400 text-xs leading-relaxed">
          在每个被选中的城市或县内，使用简单随机抽样方法抽取指定数量的街道或乡镇。城区抽取街道，农村抽取乡镇，确保城乡都有代表性。
        </p>
      </div>
    </div>
  );
};

export default Step3City;
