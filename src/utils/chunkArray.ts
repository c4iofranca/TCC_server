import { INTERVAL_PREDICT_MODEL_EXECUTION } from "../constants";

export const chunkArray = (arr: any[], chunkSize: number) => {
  const res = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    
    const intervalSum = chunk.reduce(function (prev, curr) {
        return prev + (curr.fuel_flow * 60 * INTERVAL_PREDICT_MODEL_EXECUTION)
    }, 0)
    const initialDate = chunk[0].timestamp;
    const finalDate = chunk[chunk.length-1].timestamp;

    console.log(initialDate, finalDate)


    res.push({ initialDate, finalDate, intervalSum })
  }
  return res;
};
