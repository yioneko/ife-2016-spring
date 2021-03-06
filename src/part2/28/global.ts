import Spaceship from "./spaceship";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const msgTryInfo = document.querySelector(".msg .try-info") as HTMLElement;
const msgCommand = document.querySelector(".msg .command") as HTMLElement;

interface Command {
    id: number;
    operation: keyof typeof operation;
}

enum operation {
    create,
    start,
    stop,
    destroy,
}

const spaceships: [
    Spaceship | null,
    Spaceship | null,
    Spaceship | null,
    Spaceship | null
] = [null, null, null, null];

interface energySelection {
    readonly name: string;
    readonly fuelChargeSpeed: number;
    readonly description: string;
}

const energySelections: energySelection[] = [
    {
        name: "劲量型",
        fuelChargeSpeed: 2,
        description: "劲量型（补充能源速度2%/s）",
    },
    {
        name: "光能型",
        fuelChargeSpeed: 3,
        description: "劲量型（补充能源速度2%/s）",
    },
    {
        name: "永久型",
        fuelChargeSpeed: 4,
        description: "永久型（补充能源速度4%/s）",
    },
];

interface dynamicSelection {
    readonly name: string;
    readonly speed: number;
    readonly fuelConsumptionSpeed: number;
    readonly description: string;
}

const dynamicSelections: dynamicSelection[] = [
    {
        name: "前进号",
        speed: 30,
        fuelConsumptionSpeed: 5,
        description: "前进号（速率30px/s,能耗5%/s）",
    },
    {
        name: "奔腾号",
        speed: 50,
        fuelConsumptionSpeed: 7,
        description: "奔腾号（速率50px/s,能耗7%/s）",
    },
    {
        name: "超越号",
        speed: 80,
        fuelConsumptionSpeed: 9,
        description: "超越号（速率80px/s,能耗9%/s）",
    },
];

export {
    canvas,
    ctx,
    msgTryInfo,
    msgCommand,
    dynamicSelections,
    energySelections,
    Command,
    operation,
    spaceships
};

