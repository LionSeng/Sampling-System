// Seeded Pseudo-Random Number Generator (Mulberry32)
// 用于可复现的抽样结果

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  // Mulberry32算法 - 快速高质量的32位PRNG
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // 返回 [min, max) 范围内的随机整数
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // 返回 [0, 1) 范围内的随机浮点数
  nextFloat(): number {
    return this.next();
  }

  // 从数组中随机选择一个元素
  choice<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length)];
  }

  // Fisher-Yates洗牌算法（原地）
  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // 从数组中无放回抽取n个元素
  sample<T>(arr: T[], n: number): T[] {
    const shuffled = this.shuffle(arr);
    return shuffled.slice(0, Math.min(n, arr.length));
  }
}

// 生成随机种子
export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}
