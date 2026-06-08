import { Complexity, DishType, NewRecipy } from "./definitions";

export const mockRecipy: NewRecipy = {
  name: "Тестовий рецепт",
  ingrediends: [
    {
      product: "-NO4AqMbi72JYsQPDN24",
      ingredient: 'стегно куряче (з кісткою)',
      amount: 1,
      defaultUnit: 2,
    },
    {
      product: "-N6dDvHe3TDZQoXdS6SM",
      ingredient: 'лавровий лист',
      amount: 2,
      defaultUnit: 11,
    },
    {
      product: "-MuzkZy2nirf6qELBlSb",
      ingredient: 'соєвий соус',
      amount: 2,
      defaultUnit: 5,
    },
  ],
  steps: [
    {
        description: 'Пропустити часник через часникодавку, додати соєвий соус, перемішати, замаринувати курку хоча б на годину',
        timeActive: 10,
        timePassive: 0
    },
    {
        description: 'Добре розігріти сковороду з олією, обжарити курку по дві хвилини з обох боків',
        timeActive: 20,
        timePassive: 0
    },
  ],
  isSplitIntoGroups: false,
  complexity: Complexity.simple,
  type: [DishType.варіння, DishType.гарнір],
  author: "admin@cookster.net",
  createdOn: Date.now(),
  isBaseRecipy: false,
  source: "",
  portionSize: 200,
  notApproved: false,
  isCheckedAndApproved: true,
};
