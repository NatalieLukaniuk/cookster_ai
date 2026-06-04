import { z } from "zod";

export enum Complexity {
  simple = 1,
  medium = 2,
  difficult = 3,
}

export enum ComplexityDescription {
  "простий" = 1,
  "середній",
  "складний",
}

export enum DishType {
  "святкові страви" = 1,
  "соуси" = 2,
  "перші страви" = 3,
  "другі страви" = 4,
  "гарячі закуски" = 5,
  "холодні закуски" = 6,
  "салати" = 7,
  "заготовки на зиму" = 8,
  "десерти" = 9,
  "дитяче меню" = 10,
  "дієтичне меню" = 11,
  "вегетаріанські страви" = 12,
  "сніданок" = 13,
  "потребує попередньої підготовки" = 14,
  "м'ясна страва" = 15,
  "гостра страва" = 16,
  "приготування в духовці" = 17,
  "на грилі" = 18,
  "мультиварка" = 19,
  "на пару" = 20,
  "варіння" = 21,
  "без термообробки" = 22,
  "гарнір" = 23,
  "риба і морепродукти" = 24,
  "наука і здоровий глузд" = 25,
  "напій" = 26,
}

export enum MeasuringUnit {
  gr = 1,
  kg,
  l,
  ml,
  tableSpoon,
  dessertSpoon,
  teaSpoon,
  coffeeSpoon,
  pinch,
  bunch,
  item,
  cup,
  none,
  us_cup,
  oz,
  lb,
  cl,
}

export enum MeasuringUnitText {
  "гр" = 1,
  "кг",
  "л",
  "мл",
  "ст.л.",
  "дес.л.",
  "ч.л.",
  "коф.л.",
  "дрібка",
  "пучок",
  "шт.",
  "склянка",
  "за смаком",
  "cup",
  "oz",
  "lb",
  "cl",
}

export enum MeasuringUnitTextFull {
  "грами" = 1,
  "кілограми",
  "літри",
  "мілілітри",
  "столові ложки",
  "десертні ложки",
  "чайні ложки",
  "кофейні ложки",
  "дрібки",
  "пучок",
  "штуки",
  "склянка",
  "за смаком",
  "cup (240грамів)",
  "oz (унція)",
  "lb (фунт)",
  "cl (centiliter)",
}

export enum ProductType {
  fluid = 1,
  spice,
  herb,
  hardItem,
  hardHomogenious,
  granular,
}

export const MeasuringUnitOptions = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.l,
  MeasuringUnit.ml,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.bunch,
  MeasuringUnit.item,
  MeasuringUnit.cup,
  MeasuringUnit.none,
  MeasuringUnit.us_cup,
  MeasuringUnit.oz,
  MeasuringUnit.lb,
  MeasuringUnit.cl,
];

export const MeasuringUnitOptionsFluid = [
  MeasuringUnit.gr,
  MeasuringUnit.l,
  MeasuringUnit.ml,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.cup,
  MeasuringUnit.us_cup,
  MeasuringUnit.cl,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsSpice = [
  MeasuringUnit.gr,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.cup,
  MeasuringUnit.us_cup,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsHerbs = [
  MeasuringUnit.gr,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.bunch,
  MeasuringUnit.cup,
  MeasuringUnit.us_cup,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsHardItems = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.item,
  MeasuringUnit.oz,
  MeasuringUnit.lb,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsGranular = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.cup,
  MeasuringUnit.us_cup,
  MeasuringUnit.oz,
  MeasuringUnit.lb,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsHardHomogeneous = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.oz,
  MeasuringUnit.lb,
  MeasuringUnit.none,
];

export const ProductTypeOptions = [
  ProductType.fluid,
  ProductType.spice,
  ProductType.herb,
  ProductType.hardItem,
  ProductType.hardHomogenious,
  ProductType.granular,
];

export enum ProductTypeText {
  "рідкий продукт" = 1,
  "подрібнена спеція",
  "трава",
  "твердий продукт",
  "твердий однорідний",
  "сипучий продукт (крупа, борошно)",
}

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  density: z.number(),
  grInOneItem: z.number().optional(),
  calories: z.number(),
  defaultUnit: z.enum(MeasuringUnit),
  type: z.enum(ProductType),
  sizeChangeCoef: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;

export const IngredientSchema = z.object({
  product: z.string().describe("ID of the product in the database. Must match id of one of the products from the products array."),
  amount: z.number(),
  defaultUnit: z.enum(MeasuringUnit),
  group: z.string().optional(),
  ingredient: z.string().optional().describe("Must match the name of the product in the database."),
  prep: z.array(z.string()).optional(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const PreparationStepSchema = z.object({
  description: z.string(),
  timeActive: z.number(),
  timePassive: z.number(),
});

export type PreparationStep = z.infer<typeof PreparationStepSchema>;

export const NewRecipySchema = z.object({
  name: z.string(),
  ingrediends: z.array(IngredientSchema),
  steps: z.array(PreparationStepSchema),
  isSplitIntoGroups: z.boolean().default(false),
  complexity: z.enum(Complexity).default(Complexity.simple),
  type: z.array(z.enum(DishType)),
  photo: z.url().optional(),
  author: z.email().default("admin@cookster.net"),
  createdOn: z.number(),
  isBaseRecipy: z.boolean().default(false),
  source: z.url().optional(),
  portionSize: z.number().default(200).describe("Recommended portion size in grams"),
  notApproved: z.boolean().default(false),
  isCheckedAndApproved: z.boolean().default(false),
});

export type NewRecipy = z.infer<typeof NewRecipySchema>;

export const emptyRecipy: NewRecipy = {
  name: "",
  ingrediends: [],
  steps: [],
  isSplitIntoGroups: false,
  complexity: Complexity.simple,
  type: [],
  photo: "",
  author: "admin@cookster.net",
  createdOn: Date.now(),
  isBaseRecipy: false,
  source: "",
  portionSize: 200,
  notApproved: false,
  isCheckedAndApproved: false,
};