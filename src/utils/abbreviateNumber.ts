export interface INumberInfos {
    scale: number;
    suffix: string;
    max: number;
}

export const abbreviateNumber = (number: number): INumberInfos => {
    const SI_SYMBOL = [ '', 'k', 'M', 'G', 'T', 'P', 'E' ];
  
    // eslint-disable-next-line no-bitwise
    const tier = Math.log10(Math.abs(number)) / 3 | 0;
  
    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
  
    // scale the number
    const max = Math.ceil(number / scale)
  
    // format number and add suffix
    return { scale, suffix, max }
  }
  