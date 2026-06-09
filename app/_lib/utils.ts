import { Ingredient, MeasuringUnit, NewRecipy, Product } from "./definitions";

export const mapProductsToArray = (res: object) => {
  const array = Object.entries(res);
  const products: Product[] = [];
  for (const entry of array) {
    const product: Product = {
      ...entry[1],
      id: entry[0],      
    };
    products.push(product);
  }
  products.reverse();
  return products;
};



function getAmountInL(unit: MeasuringUnit) {
  switch (unit) {
    case MeasuringUnit.l:
      return 1;
    case MeasuringUnit.ml:
      return 1000;
    case MeasuringUnit.tableSpoon:
      return 67;
    case MeasuringUnit.dessertSpoon:
      return 100;
    case MeasuringUnit.teaSpoon:
      return 203;
    case MeasuringUnit.cup:
      return 5;
    case MeasuringUnit.coffeeSpoon:
      return 405;
    case MeasuringUnit.cl:
      return 100;
    case MeasuringUnit.us_cup:
      return 4;
    default:
      return 1;
  }
}

function getDensity(productId: string, allProducts: Product[]) {
  let density = 0;
  for (const item of allProducts) {
    if (item.id === productId) {
      density = item.density;
    }
  }
  return density;
}

function OZToGr(amount: number) {
  return amount * 28.35;
}

function LbToGr(amount: number) {
  return amount * 453.6;
}

function kgToGR(amount: number) {
  return amount * 1000;
}

function bunchToGr(amount: number) {
  return amount * 40;
}

function pinchToGr(amount: number, density: number) {
  const conSp = coffeeSpoonsToGr(amount, density) / 23;
  return conSp;
}

function tableSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 18;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

function teaSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

function coffeeSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 2.5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

function glassToGr(amount: number, density: number) {
  // density is in kg/m3, glass can fit 200ml
  const ml = amount * 200;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

function itemsToGr(amount: number, grInOneItem: number) {
  return amount * grInOneItem;
}

function mlToL(amount: number) {
  return amount / 1000;
}

function getGrPerItem(productId: string, allProducts: Product[]) {
  let grInOneItem = 0;
  for (const item of allProducts) {
    if (item.id === productId) {
      grInOneItem = item.grInOneItem ? item.grInOneItem : 0;
    }
  }
  return grInOneItem;
}

function literToGr(amount: number, density: number) {
  // density is in kg/m3
  return amount * density;
}

export function transformToGr(
  ingrId: string,
  amount: number,
  unit: MeasuringUnit,
  allProducts: Product[]
): number {
  const density: number = getDensity(ingrId, allProducts);
  const grInOneItem: number = getGrPerItem(ingrId, allProducts);
  switch (unit) {
    case MeasuringUnit.gr:
      return amount;
    case MeasuringUnit.kg:
      return kgToGR(amount);
    case MeasuringUnit.bunch:
      return bunchToGr(amount);
    case MeasuringUnit.coffeeSpoon:
    case MeasuringUnit.dessertSpoon:
    case MeasuringUnit.tableSpoon:
    case MeasuringUnit.teaSpoon:
    case MeasuringUnit.ml:
    case MeasuringUnit.l:
    case MeasuringUnit.cup:
    case MeasuringUnit.cl:
    case MeasuringUnit.us_cup:
      return (amount * density) / getAmountInL(unit);
    case MeasuringUnit.pinch:
      return pinchToGr(amount, density);
    case MeasuringUnit.item:
      return itemsToGr(amount, grInOneItem);
    case MeasuringUnit.oz:
      return OZToGr(amount);
    case MeasuringUnit.lb:
      return LbToGr(amount);
    default:
      return 0;
  }
}

export function getCalorificValue(
  ingr: Ingredient,
  allProducts: Product[]
): number {
  const found = allProducts.find((product) => product.id == ingr.product);
  if (!found) {
    console.warn(`Product with id ${ingr.product} and name ${ingr.ingredient} not found in products array.`);
    return 0;
  }
  return found.calories;
}

export function countRecipyTotalCalories(ingreds: Ingredient[], allProducts: Product[]) {
    let calories = 0;
    ingreds.forEach((ingr) => {
      calories += ingr.amount / 100 * getCalorificValue(ingr, allProducts);
    });
    return calories;
  }

  export function countRecipyCalorificValue(ingreds: Ingredient[], allProducts: Product[]) {
    let calories = 0;
    let totalAmount = 0;
    ingreds.forEach((ingr) => {
      totalAmount += ingr.amount;
      calories += ingr.amount * getCalorificValue(ingr, allProducts);
    });
    return calories / totalAmount;
  }

  function fixIngredId(ingredient: Ingredient, allProducts: Product[]){
    const correctId = allProducts.find(item => item.name === ingredient.ingredient)?.id;
    if(correctId !== ingredient.product){
      console.log('fixed id for ' + ingredient.ingredient)
    }
    if(correctId){
      return {
        ...ingredient,
        product: correctId
      }
    } else {
      console.log('no correct id for ' + ingredient.ingredient)
      return {
        ...ingredient,
        product: ''
      }
    }
  }

  export function prepareReciyForDatabase(recipy: NewRecipy, allProducts: Product[]) {
    const recipyWithFixedIngredIds = {
      ...recipy,
      ingrediends: recipy.ingrediends.map((ingr: Ingredient) => fixIngredId(ingr, allProducts))
    }
    const recipyWithIngredsInGrams = {
      ...recipyWithFixedIngredIds,
      ingrediends: recipyWithFixedIngredIds.ingrediends.map((ingr: Ingredient) => ({
        ...ingr,
        amount: transformToGr(ingr.product, ingr.amount, ingr.defaultUnit, allProducts)
      }))
    };
    const calorificValue = countRecipyCalorificValue(recipyWithIngredsInGrams.ingrediends, allProducts);
    return { ...recipyWithIngredsInGrams, calorificValue };
  }