import { CocomoForm, CocomoOut, CocomoTwoForm, CocomoTwoOut } from "./models";
//import { Decimal } from 'decimal.js';
import varMode from "./utils";

export class MethodsService {
  public static cocomo(data: CocomoForm): CocomoOut {

    var set = varMode(data.mode);

    let esf = set.esf.a * (data.kdlc ** set.esf.b);

    esf = data.costDrivers.reduce((acc, value) => acc * value, esf);

    const tdes = set.tdes.a * (esf ** set.tdes.b);

    const esfCents = BigInt(Math.round(esf * 100));
    const cpmCents = BigInt(Math.round(data.cpm * 100));

    const costoCents = esfCents * cpmCents / BigInt(100);
    const costo = Number(costoCents) / 100;

    const trabajadores = esf / tdes;
    const productividad = data.kdlc / esf;
    const output: CocomoOut = {
      esf: esf,
      tdes: tdes,
      costo: costo,
      n: trabajadores,
      productividad: productividad,
    };

    return output;
  }

  static cocomoTwo(formData: CocomoTwoForm): CocomoTwoOut {
    const { kdlc, costDrivers, scaleDrivers, cpm } = formData;

    // Valores de calibración
    const A = 2.94; // valor de calibración estándar en COCOMO II
    const B = 0.91; // valor base para el factor de escala

    // Calcular E (factor de escala)
    const E = B + 0.01 * scaleDrivers.reduce((sum, driver) => sum + driver, 0);
    // console.log("E:",E)
    // Calcular esfuerzo
    const effort = A * Math.pow(kdlc, E) * costDrivers.reduce((product, driver) => product * driver, 1);

    // Para simplificar, supondremos que TDEV = 2.5 * PM^0.38
    const E2 = 0.28 + 0.2 * 0.01 * scaleDrivers.reduce((sum, driver) => sum + driver, 0);
    const duration = 3.67 * Math.pow(effort, E2);

    // Supongamos que la productividad es simplemente KDLC / ESF
    
    //Calcular la Productividad
    const productivity = kdlc / effort;

    // Calcular el costo asumiendo un costo por persona-mes
    const totalCost = effort * cpm;

    return {
        esf: effort,
        tdes: duration,
        n: effort / duration,
        productividad: productivity,
        costo: totalCost,
    };
}
}
