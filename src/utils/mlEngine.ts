// Helper mapping functions for client-side model features
export function map_size(s: string): number {
  if (s === 'sub-compact') return 0;
  if (s === 'compact') return 1;
  if (s === 'mid-size') return 2;
  if (s === 'full-size') return 3;
  return 2;
}

export function map_title_status(t: string): number {
  if (t === 'parts only') return 0;
  if (t === 'missing') return 1;
  if (t === 'salvage') return 2;
  if (t === 'rebuilt') return 3;
  if (t === 'lien') return 4;
  if (t === 'clean') return 5;
  return 5;
}

export function map_condition(c: string): number {
  if (c === 'salvage') return 0;
  if (c === 'fair') return 1;
  if (c === 'good') return 2;
  if (c === 'excellent') return 3;
  if (c === 'like new') return 4;
  if (c === 'new') return 5;
  return 3;
}

export function predictTree(tree: any[], features: number[]): number {
  let nodeIndex = 0;
  let count = 0;
  while (count < 1000) {
    const node = tree[nodeIndex];
    if (!node) return 0;
    const isLeaf = node[0];
    if (isLeaf) {
      return node[1]; // Leaf value is at index 1
    }
    const featureIdx = node[1];
    const threshold = node[2];
    const val = features[featureIdx];
    if (val <= threshold) {
      nodeIndex = node[3];
    } else {
      nodeIndex = node[4];
    }
    count++;
  }
  return 0;
}

export function predictForest(forest: any[][], features: number[]): { price: number; votes: number[] } {
  let sum = 0;
  let count = 0;
  const votes: number[] = [];
  for (let i = 0; i < forest.length; i++) {
    const p = predictTree(forest[i], features);
    if (p !== null && !isNaN(p)) {
      sum += p;
      votes.push(p);
      count++;
    }
  }
  return {
    price: count > 0 ? sum / count : 0,
    votes: votes
  };
}

export function getDemandStatus(formData: any): { text: string; colorClass: string; bgClass: string } {
  // Low demand: title is not clean, or mileage is extremely high (e.g. > 180,000 miles), or vehicle condition is salvage/fair
  const isLowDemand =
    ['rebuilt', 'salvage', 'lien', 'missing', 'parts only'].includes(formData.titleStatus) ||
    formData.mileage > 180000 ||
    ['salvage', 'fair'].includes(formData.condition);

  if (isLowDemand) {
    return { text: 'Baja', colorClass: 'text-red-400', bgClass: 'bg-red-500/10' };
  }

  // High demand: title is clean, low mileage, excellent or better condition, recent year, popular brand
  const popularBrands = ['toyota', 'honda', 'ford', 'chevrolet', 'jeep', 'nissan'];
  const isHighDemand =
    formData.titleStatus === 'clean' &&
    formData.mileage < 60000 &&
    ['excellent', 'like new', 'new'].includes(formData.condition) &&
    formData.year >= 2018 &&
    popularBrands.includes(formData.marca.toLowerCase());

  if (isHighDemand) {
    return { text: 'Alta', colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10' };
  }

  // Default
  return { text: 'Normal', colorClass: 'text-green-400', bgClass: 'bg-green-500/10' };
}
