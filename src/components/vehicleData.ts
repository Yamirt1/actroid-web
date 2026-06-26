//Vehicle Data
export interface ModelSpecs {
  years: number[];
  cylinders: number[];
  fuels: string[];
  transmissions: string[];
  types: string[];
  sizes: string[];
  drives: string[];
}

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = end; i >= start; i--) {
    result.push(i);
  }
  return result;
}

export const VEHICLE_DATA: Record<string, Record<string, ModelSpecs>> = {
  acura: {
    mdx: {
      years: range(2001, 2026),
      cylinders: [6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd', 'fwd']
    },
    rdx: {
      years: range(2007, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    tlx: {
      years: range(2015, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    integra: {
      years: [...range(2023, 2026), ...range(1986, 2001)],
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['sedan', 'coupe', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd']
    }
  },
  'alfa-romeo': {
    giulia: {
      years: range(2016, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['rwd', '4wd']
    },
    stelvio: {
      years: range(2017, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd', 'rwd']
    },
    '4c': {
      years: range(2013, 2020),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['sub-compact'],
      drives: ['rwd']
    }
  },
  'aston-martin': {
    vantage: {
      years: range(2005, 2026),
      cylinders: [8, 12],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd']
    },
    db9: {
      years: range(2004, 2016),
      cylinders: [12],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['coupe', 'convertible'],
      sizes: ['mid-size'],
      drives: ['rwd']
    }
  },
  audi: {
    a3: {
      years: range(1996, 2026),
      cylinders: [4],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'convertible'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    a4: {
      years: range(1994, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size'],
      drives: ['4wd', 'fwd']
    },
    a6: {
      years: range(1994, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan', 'wagon'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd', 'fwd']
    },
    q3: {
      years: range(2011, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['4wd', 'fwd']
    },
    q5: {
      years: range(2008, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd']
    },
    q7: {
      years: range(2005, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd']
    },
    r8: {
      years: range(2006, 2026),
      cylinders: [8, 10],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['4wd', 'rwd']
    }
  },
  bmw: {
    '3 series': {
      years: range(1980, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'wagon', 'convertible'],
      sizes: ['mid-size', 'compact'],
      drives: ['rwd', '4wd']
    },
    '5 series': {
      years: range(1980, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size', 'full-size'],
      drives: ['rwd', '4wd']
    },
    '7 series': {
      years: range(1980, 2026),
      cylinders: [6, 8, 12],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    },
    x1: {
      years: range(2009, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['4wd', 'fwd']
    },
    x3: {
      years: range(2003, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'compact'],
      drives: ['4wd', 'rwd']
    },
    x5: {
      years: range(1999, 2026),
      cylinders: [6, 8],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd', 'rwd']
    },
    i3: {
      years: range(2013, 2022),
      cylinders: [3, 4],
      fuels: ['electric', 'hybrid'],
      transmissions: ['automatic'],
      types: ['hatchback'],
      sizes: ['sub-compact'],
      drives: ['rwd']
    }
  },
  buick: {
    enclave: {
      years: range(2008, 2026),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['fwd', '4wd']
    },
    encore: {
      years: range(2013, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['sub-compact', 'compact'],
      drives: ['fwd', '4wd']
    },
    lacrosse: {
      years: range(2005, 2019),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    regal: {
      years: range(1980, 2020),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  cadillac: {
    escalade: {
      years: range(1999, 2026),
      cylinders: [8],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    cts: {
      years: range(2003, 2019),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'wagon'],
      sizes: ['mid-size'],
      drives: ['rwd', '4wd']
    },
    ats: {
      years: range(2013, 2019),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe'],
      sizes: ['compact'],
      drives: ['rwd', '4wd']
    },
    srx: {
      years: range(2004, 2016),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  chevrolet: {
    silverado: {
      years: range(1999, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    cruze: {
      years: range(2008, 2019),
      cylinders: [4],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    equinox: {
      years: range(2005, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    malibu: {
      years: range(1997, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd']
    },
    impala: {
      years: range(1980, 2020),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['fwd']
    },
    tahoe: {
      years: range(1995, 2026),
      cylinders: [8],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    corvette: {
      years: range(1980, 2026),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['mid-size', 'compact'],
      drives: ['rwd']
    },
    camaro: {
      years: range(1980, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['mid-size', 'compact'],
      drives: ['rwd']
    },
    bolt: {
      years: range(2017, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['hatchback', 'wagon', 'suv'],
      sizes: ['compact', 'sub-compact'],
      drives: ['fwd']
    }
  },
  chrysler: {
    '300': {
      years: range(2005, 2026),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    },
    'town & country': {
      years: range(1989, 2016),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['mini-van'],
      sizes: ['full-size'],
      drives: ['fwd']
    },
    pacifica: {
      years: range(2004, 2026),
      cylinders: [6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['mini-van', 'suv'],
      sizes: ['full-size'],
      drives: ['fwd', '4wd']
    },
    '200': {
      years: range(2011, 2017),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan', 'convertible'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  datsun: {
    '240z': {
      years: range(1980, 1985), // limited to 1980+ standard ranges
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe'],
      sizes: ['sub-compact', 'compact'],
      drives: ['rwd']
    },
    '280z': {
      years: range(1980, 1985),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe'],
      sizes: ['sub-compact', 'compact'],
      drives: ['rwd']
    }
  },
  dodge: {
    charger: {
      years: range(1980, 2026),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    },
    challenger: {
      years: range(1980, 2026),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe'],
      sizes: ['mid-size', 'full-size'],
      drives: ['rwd', '4wd']
    },
    'grand caravan': {
      years: range(1987, 2020),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['mini-van'],
      sizes: ['full-size'],
      drives: ['fwd']
    },
    durango: {
      years: range(1998, 2026),
      cylinders: [6, 8],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    journey: {
      years: range(2009, 2020),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  ferrari: {
    '458': {
      years: range(2009, 2015),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd']
    },
    '488': {
      years: range(2015, 2019),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd']
    },
    california: {
      years: range(2008, 2017),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['convertible', 'coupe'],
      sizes: ['compact'],
      drives: ['rwd']
    }
  },
  fiat: {
    '500': {
      years: range(2007, 2026),
      cylinders: [4],
      fuels: ['gas', 'electric'],
      transmissions: ['manual', 'automatic'],
      types: ['hatchback', 'convertible'],
      sizes: ['sub-compact'],
      drives: ['fwd']
    },
    '500x': {
      years: range(2014, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['4wd', 'fwd']
    }
  },
  ford: {
    'f-150': {
      years: range(1980, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel', 'hybrid', 'electric'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    mustang: {
      years: range(1980, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'electric'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe', 'convertible', 'suv'],
      sizes: ['mid-size', 'compact'],
      drives: ['rwd', '4wd']
    },
    explorer: {
      years: range(1990, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd', 'rwd', 'fwd']
    },
    escape: {
      years: range(2001, 2026),
      cylinders: [4, 6, 3],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    focus: {
      years: range(1998, 2018),
      cylinders: [4, 3],
      fuels: ['gas', 'electric'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    fusion: {
      years: range(2006, 2020),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    ranger: {
      years: range(1983, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd', 'rwd']
    },
    bronco: {
      years: range(1980, 2026),
      cylinders: [4, 6, 3],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['suv', 'offroad'],
      sizes: ['mid-size', 'compact'],
      drives: ['4wd']
    }
  },
  gmc: {
    sierra: {
      years: range(1999, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    yukon: {
      years: range(1992, 2026),
      cylinders: [8, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    terrain: {
      years: range(2010, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    acadia: {
      years: range(2007, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['fwd', '4wd']
    }
  },
  'harley-davidson': {
    'f-150 harley edition': {
      years: range(2000, 2012),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['pickup'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    custom: {
      years: range(1980, 2026),
      cylinders: [2, 4],
      fuels: ['gas'],
      transmissions: ['manual'],
      types: ['other'],
      sizes: ['sub-compact'],
      drives: ['rwd']
    }
  },
  honda: {
    civic: {
      years: range(1980, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    accord: {
      years: range(1980, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe'],
      sizes: ['mid-size', 'full-size'],
      drives: ['fwd']
    },
    'cr-v': {
      years: range(1997, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    pilot: {
      years: range(2003, 2026),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    odyssey: {
      years: range(1995, 2026),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['mini-van'],
      sizes: ['full-size'],
      drives: ['fwd']
    },
    ridgeline: {
      years: range(2006, 2026),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['pickup'],
      sizes: ['mid-size'],
      drives: ['4wd', 'fwd']
    },
    fit: {
      years: range(2001, 2020),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['hatchback'],
      sizes: ['sub-compact', 'compact'],
      drives: ['fwd']
    }
  },
  hyundai: {
    elantra: {
      years: range(1990, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'hatchback', 'coupe'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    sonata: {
      years: range(1989, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    tucson: {
      years: range(2004, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    'santa fe': {
      years: range(2001, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  infiniti: {
    g37: {
      years: range(2008, 2013),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'convertible'],
      sizes: ['mid-size', 'compact'],
      drives: ['rwd', '4wd']
    },
    q50: {
      years: range(2014, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['rwd', '4wd']
    },
    qx60: {
      years: range(2014, 2026),
      cylinders: [6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['fwd', '4wd']
    },
    qx80: {
      years: range(2014, 2026),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    }
  },
  jaguar: {
    xf: {
      years: range(2008, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size'],
      drives: ['rwd', '4wd']
    },
    xj: {
      years: range(1980, 2019),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    },
    'f-type': {
      years: range(2013, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd', '4wd']
    }
  },
  jeep: {
    'grand cherokee': {
      years: range(1993, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd', 'rwd']
    },
    wrangler: {
      years: range(1987, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['manual', 'automatic'],
      types: ['suv', 'offroad'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd']
    },
    cherokee: {
      years: range(1984, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd', 'fwd']
    },
    compass: {
      years: range(2007, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    patriot: {
      years: range(2007, 2017),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    }
  },
  kia: {
    soul: {
      years: range(2008, 2026),
      cylinders: [4],
      fuels: ['gas', 'electric'],
      transmissions: ['automatic', 'manual'],
      types: ['hatchback', 'suv', 'wagon'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    optima: {
      years: range(2000, 2020),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd']
    },
    sorento: {
      years: range(2002, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    sportage: {
      years: range(1993, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    }
  },
  'land rover': {
    'range rover': {
      years: range(1980, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd']
    },
    discovery: {
      years: range(1989, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd']
    },
    evoque: {
      years: range(2011, 2026),
      cylinders: [4],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv', 'convertible'],
      sizes: ['compact'],
      drives: ['4wd']
    }
  },
  lexus: {
    rx: {
      years: range(1998, 2026),
      cylinders: [6, 4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    es: {
      years: range(1989, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    is: {
      years: range(1998, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd', '4wd']
    },
    gx: {
      years: range(2002, 2026),
      cylinders: [8, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd']
    }
  },
  lincoln: {
    mkz: {
      years: range(2006, 2020),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    navigator: {
      years: range(1998, 2026),
      cylinders: [8, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    mkx: {
      years: range(2007, 2018),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    }
  },
  mazda: {
    '3': {
      years: range(2003, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    '6': {
      years: range(2002, 2021),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd']
    },
    'cx-5': {
      years: range(2012, 2026),
      cylinders: [4],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    'cx-9': {
      years: range(2006, 2023),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    'mx-5 miata': {
      years: range(1989, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['convertible'],
      sizes: ['sub-compact'],
      drives: ['rwd']
    }
  },
  'mercedes-benz': {
    'c-class': {
      years: range(1993, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'convertible'],
      sizes: ['compact', 'mid-size'],
      drives: ['rwd', '4wd']
    },
    'e-class': {
      years: range(1993, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan', 'coupe', 'wagon', 'convertible'],
      sizes: ['mid-size', 'full-size'],
      drives: ['rwd', '4wd']
    },
    gle: {
      years: range(2015, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd', 'rwd']
    },
    glc: {
      years: range(2015, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv', 'coupe'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd', 'rwd']
    },
    's-class': {
      years: range(1980, 2026),
      cylinders: [6, 8, 12],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['sedan', 'coupe', 'convertible'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    },
    sprinter: {
      years: range(1995, 2026),
      cylinders: [4, 6],
      fuels: ['diesel', 'gas'],
      transmissions: ['automatic'],
      types: ['van', 'bus'],
      sizes: ['full-size'],
      drives: ['rwd', '4wd']
    }
  },
  mercury: {
    'grand marquis': {
      years: range(1980, 2011),
      cylinders: [8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['full-size'],
      drives: ['rwd']
    },
    mountaineer: {
      years: range(1996, 2010),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd', 'rwd']
    }
  },
  mini: {
    cooper: {
      years: range(2001, 2026),
      cylinders: [3, 4],
      fuels: ['gas', 'electric'],
      transmissions: ['manual', 'automatic'],
      types: ['hatchback', 'convertible', 'coupe'],
      sizes: ['sub-compact', 'compact'],
      drives: ['fwd', '4wd']
    },
    countryman: {
      years: range(2010, 2026),
      cylinders: [3, 4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv', 'wagon'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    }
  },
  mitsubishi: {
    outlander: {
      years: range(2001, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'compact'],
      drives: ['fwd', '4wd']
    },
    lancer: {
      years: range(1980, 2017),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['sedan', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    mirage: {
      years: range(1980, 2026),
      cylinders: [3, 4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['hatchback', 'sedan'],
      sizes: ['sub-compact'],
      drives: ['fwd']
    }
  },
  nissan: {
    altima: {
      years: range(1992, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['sedan', 'coupe'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    sentra: {
      years: range(1982, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    rogue: {
      years: range(2007, 2026),
      cylinders: [4, 3],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    frontier: {
      years: range(1997, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['mid-size', 'compact'],
      drives: ['4wd', 'rwd']
    },
    pathfinder: {
      years: range(1985, 2026),
      cylinders: [6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['fwd', '4wd']
    },
    leaf: {
      years: range(2010, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['hatchback'],
      sizes: ['compact'],
      drives: ['fwd']
    }
  },
  pontiac: {
    'grand prix': {
      years: range(1980, 2008),
      cylinders: [6, 8],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['sedan', 'coupe'],
      sizes: ['mid-size', 'full-size'],
      drives: ['fwd']
    },
    g6: {
      years: range(2005, 2010),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'coupe', 'convertible'],
      sizes: ['mid-size'],
      drives: ['fwd']
    },
    vibe: {
      years: range(2002, 2010),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['wagon', 'hatchback'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    }
  },
  porsche: {
    '911': {
      years: range(1980, 2026),
      cylinders: [6],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['coupe', 'convertible'],
      sizes: ['compact'],
      drives: ['rwd', '4wd']
    },
    cayenne: {
      years: range(2002, 2026),
      cylinders: [6, 8],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd']
    },
    macan: {
      years: range(2014, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd']
    },
    taycan: {
      years: range(2019, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size'],
      drives: ['4wd', 'rwd']
    }
  },
  ram: {
    '1500': {
      years: range(2010, 2026),
      cylinders: [6, 8, 4],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    '2500': {
      years: range(2010, 2026),
      cylinders: [6, 8],
      fuels: ['diesel', 'gas'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    '3500': {
      years: range(2010, 2026),
      cylinders: [6, 8],
      fuels: ['diesel', 'gas'],
      transmissions: ['automatic'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    }
  },
  rover: {
    'range rover': {
      years: range(1980, 2005),
      cylinders: [8, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd']
    },
    discovery: {
      years: range(1989, 2005),
      cylinders: [8, 4, 6],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd']
    }
  },
  saturn: {
    vue: {
      years: range(2001, 2010),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    ion: {
      years: range(2003, 2007),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['sedan', 'coupe'],
      sizes: ['compact'],
      drives: ['fwd']
    }
  },
  subaru: {
    outback: {
      years: range(1994, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['wagon', 'suv'],
      sizes: ['mid-size'],
      drives: ['4wd']
    },
    forester: {
      years: range(1997, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['4wd']
    },
    impreza: {
      years: range(1992, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['manual', 'automatic'],
      types: ['sedan', 'hatchback', 'wagon'],
      sizes: ['compact'],
      drives: ['4wd', 'fwd']
    },
    legacy: {
      years: range(1989, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['4wd']
    },
    crosstrek: {
      years: range(2012, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv', 'hatchback'],
      sizes: ['compact'],
      drives: ['4wd']
    }
  },
  tesla: {
    'model 3': {
      years: range(2017, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['sedan'],
      sizes: ['compact', 'mid-size'],
      drives: ['rwd', '4wd']
    },
    'model y': {
      years: range(2020, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd', 'rwd']
    },
    'model s': {
      years: range(2012, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['sedan', 'hatchback'],
      sizes: ['full-size', 'mid-size'],
      drives: ['4wd', 'rwd']
    },
    'model x': {
      years: range(2015, 2026),
      cylinders: [4],
      fuels: ['electric'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd']
    }
  },
  toyota: {
    corolla: {
      years: range(1980, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'hatchback', 'wagon'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    camry: {
      years: range(1982, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    'rav4': {
      years: range(1994, 2026),
      cylinders: [4],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    highlander: {
      years: range(2000, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    prius: {
      years: range(1997, 2026),
      cylinders: [4],
      fuels: ['hybrid', 'electric'],
      transmissions: ['automatic'],
      types: ['hatchback', 'sedan'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    tacoma: {
      years: range(1995, 2026),
      cylinders: [4, 6],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['pickup', 'truck'],
      sizes: ['mid-size'],
      drives: ['4wd', 'rwd']
    },
    tundra: {
      years: range(1999, 2026),
      cylinders: [6, 8],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['pickup', 'truck'],
      sizes: ['full-size'],
      drives: ['4wd', 'rwd']
    },
    '4runner': {
      years: range(1984, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas'],
      transmissions: ['automatic', 'manual'],
      types: ['suv', 'offroad'],
      sizes: ['mid-size', 'full-size'],
      drives: ['4wd', 'rwd']
    },
    sienna: {
      years: range(1997, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'hybrid'],
      transmissions: ['automatic'],
      types: ['mini-van'],
      sizes: ['full-size'],
      drives: ['fwd', '4wd']
    }
  },
  volkswagen: {
    jetta: {
      years: range(1980, 2026),
      cylinders: [4, 5, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'wagon'],
      sizes: ['compact'],
      drives: ['fwd']
    },
    passat: {
      years: range(1980, 2022),
      cylinders: [4, 5, 6],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan', 'wagon'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    tiguan: {
      years: range(2007, 2026),
      cylinders: [4],
      fuels: ['gas'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['compact', 'mid-size'],
      drives: ['fwd', '4wd']
    },
    golf: {
      years: range(1980, 2026),
      cylinders: [4, 5],
      fuels: ['gas', 'diesel', 'electric'],
      transmissions: ['manual', 'automatic'],
      types: ['hatchback', 'wagon'],
      sizes: ['compact'],
      drives: ['fwd', '4wd']
    },
    beetle: {
      years: range(1980, 2019),
      cylinders: [4, 5],
      fuels: ['gas', 'diesel'],
      transmissions: ['automatic', 'manual'],
      types: ['coupe', 'convertible', 'hatchback'],
      sizes: ['sub-compact', 'compact'],
      drives: ['fwd']
    }
  },
  volvo: {
    xc90: {
      years: range(2002, 2026),
      cylinders: [4, 6, 8],
      fuels: ['gas', 'hybrid', 'diesel'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['full-size'],
      drives: ['4wd', 'fwd']
    },
    xc60: {
      years: range(2008, 2026),
      cylinders: [4, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic'],
      types: ['suv'],
      sizes: ['mid-size'],
      drives: ['4wd', 'fwd']
    },
    s60: {
      years: range(2000, 2026),
      cylinders: [4, 5, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['sedan'],
      sizes: ['mid-size'],
      drives: ['fwd', '4wd']
    },
    v60: {
      years: range(2010, 2026),
      cylinders: [4, 5, 6],
      fuels: ['gas', 'diesel', 'hybrid'],
      transmissions: ['automatic', 'manual'],
      types: ['wagon'],
      sizes: ['mid-size'],
      drives: ['4wd', 'fwd']
    }
  }
};

export const DEFAULT_SPECS: ModelSpecs = {
  years: range(1980, 2026),
  cylinders: [3, 4, 5, 6, 8, 10, 12],
  fuels: ['gas', 'diesel', 'hybrid', 'electric'],
  transmissions: ['automatic', 'manual', 'other'],
  types: ['sedan', 'suv', 'pickup', 'truck', 'coupe', 'hatchback', 'mini-van', 'convertible', 'van', 'wagon', 'offroad', 'bus', 'other'],
  sizes: ['sub-compact', 'compact', 'mid-size', 'full-size'],
  drives: ['fwd', 'rwd', '4wd']
};

export function getSpecs(brand: string, model: string): ModelSpecs {
  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();

  if (VEHICLE_DATA[brandLower] && VEHICLE_DATA[brandLower][modelLower]) {
    return VEHICLE_DATA[brandLower][modelLower];
  }

  if (VEHICLE_DATA[brandLower]) {
    const firstModel = Object.keys(VEHICLE_DATA[brandLower])[0];
    if (firstModel) {
      return VEHICLE_DATA[brandLower][firstModel];
    }
  }

  return DEFAULT_SPECS;
}
