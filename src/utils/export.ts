import * as XLSX from 'xlsx';
import type { SamplingResult, SampledPerson } from '../types/sampling';

/**
 * 导出抽样结果为Excel文件
 */
export function exportToExcel(result: SamplingResult): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: 抽样概览
  const overviewData = [
    ['多阶段分层抽样结果报告'],
    [],
    ['抽样配置'],
    ['随机种子', result.config.seed],
    ['每大区抽取省数', result.config.regionSelections.map(r => `${r.regionCode}: ${r.provincesToSample}`).join('; ')],
    ['每省省会数', result.config.citiesPerProvince.capital],
    ['每省地级市数', result.config.citiesPerProvince.prefecture],
    ['每省农村县数', result.config.citiesPerProvince.ruralCounty],
    ['每市县街道/乡镇数', result.config.districtsPerCity],
    ['每街道样本量', result.config.personsPerDistrict],
    [],
    ['抽样统计'],
    ['总样本量', result.totalSampleSize],
    ['覆盖省份数', result.step2.length],
    ['覆盖市县数', result.step3.length],
    ['覆盖街道/乡镇数', result.step4.length],
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, '抽样概览');

  // Sheet 2: 第一阶段 - 大区PPS抽样
  const step1Data = [
    ['大区', '大区人口(万)', '抽中省份', '省份人口(万)'],
  ];
  for (const s1 of result.step1) {
    for (const p of s1.selectedProvinces) {
      step1Data.push([s1.region.name, s1.region.population, p.name, p.population]);
    }
  }
  const wsStep1 = XLSX.utils.aoa_to_sheet(step1Data);
  XLSX.utils.book_append_sheet(wb, wsStep1, '第一阶段-大区PPS抽样');

  // Sheet 3: 第二阶段 - 省内分层抽样
  const step2Data = [
    ['省份', '省会', '地级市', '农村县'],
  ];
  for (const s2 of result.step2) {
    step2Data.push([
      s2.province.name,
      s2.capital.name,
      s2.selectedPrefectures.map(c => c.name).join(', '),
      s2.selectedRuralCounties.map(c => c.name).join(', '),
    ]);
  }
  const wsStep2 = XLSX.utils.aoa_to_sheet(step2Data);
  XLSX.utils.book_append_sheet(wb, wsStep2, '第二阶段-省内分层抽样');

  // Sheet 4: 第三阶段 - 市县内抽样
  const step3Data = [
    ['区域名称', '区域类型', '抽中街道/乡镇'],
  ];
  for (const s3 of result.step3) {
    const names = s3.areaType === 'city'
      ? s3.selectedDistricts.map(d => d.name).join(', ')
      : s3.selectedTowns.map(t => t.name).join(', ');
    step3Data.push([s3.areaName, s3.areaType === 'city' ? '城市' : '农村县', names]);
  }
  const wsStep3 = XLSX.utils.aoa_to_sheet(step3Data);
  XLSX.utils.book_append_sheet(wb, wsStep3, '第三阶段-市县内抽样');

  // Sheet 5: 个人样本清单
  const personData: SampledPerson[][] = [];
  const allPersons = result.step4.flatMap(s4 => s4.persons);
  const personHeader = ['序号', '年龄组', '性别', '省份', '城市', '区域', '街道/乡镇'];
  
  const personRows = allPersons.map((p, i) => [
    i + 1,
    p.ageRange,
    p.gender === 'male' ? '男' : '女',
    p.province,
    p.city,
    p.area,
    p.town,
  ]);
  
  const wsPerson = XLSX.utils.aoa_to_sheet([personHeader, ...personRows]);
  XLSX.utils.book_append_sheet(wb, wsPerson, '个人样本清单');

  // 下载
  const filename = `抽样结果_${new Date().toISOString().slice(0, 10)}_seed${result.config.seed}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * 导出为CSV
 */
export function exportToCSV(result: SamplingResult): void {
  const allPersons = result.step4.flatMap(s4 => s4.persons);
  const header = '序号,年龄组,性别,省份,城市,区域,街道/乡镇\n';
  const rows = allPersons.map((p, i) =>
    `${i + 1},${p.ageRange},${p.gender === 'male' ? '男' : '女'},${p.province},${p.city},${p.area},${p.town}`
  ).join('\n');

  const csvContent = '\uFEFF' + header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `抽样结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
