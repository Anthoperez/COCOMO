export type CocomoForm = {
  mode: string;
  kdlc: number;
  cpm: number;
  costDrivers: number[];
};

export type CocomoOut = {
  esf:number;
  tdes:number;
  costo:number;
  n:number;
  productividad:number;
}

export interface CocomoTwoForm {
  kdlc: number;
  cpm: number;
  costDrivers: number[];
  scaleDrivers: number[];
}

export interface CocomoTwoOut {
  esf: number;
  tdes: number;
  costo: number;
  n: number;
  productividad: number;
}

export type esfVar = {
  a:number;
  b:number
}

export type tdesVar = {
  a:number;
  b:number
}

export type SetVar = {
  esf:esfVar
  tdes:tdesVar
  
}

export type StageType = "requerimientos" | "analisis" | "diseño" | "desarrollo" | "pruebas";

export interface StageValues {
    percentage: string;
    cost: string;
    disabled: boolean;
}

export interface StagePercentages {
    requerimientos: number;
    analisis: number;
    diseño: number;
    desarrollo: number;
    pruebas: number;
}