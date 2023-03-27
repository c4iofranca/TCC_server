interface CurrentIteration {
  id: number;
  iteration: number;
}

interface Dataset {
  timestamp: Date | string;
  gtt: number;
  gtn: number;
  ggn: number;
  ts: number;
  tp: number;
  t48: number;
  t1: number;
  t2: number;
  p48: number;
  p1: number;
  p2: number;
  pexh: number;
  tic: number;
  mf: number;
}

export { CurrentIteration, Dataset }