import {
    canvas,
    ctx,
    msgTryInfo,
    msgCommand,
    dynamicSelections,
    energySelections,
    spaceships,
} from "./global";
import Spaceship from "./spaceship";
import BUS from "./bus";

canvas.width = 1000;
canvas.height = 800;

function createRadioGroup(
    name: string,
    container: HTMLElement,
    selectionList: { description: string }[]
): void {
    for (let i = 0; i < selectionList.length; i++) {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.id = `type-${i}`;
        radio.value = i.toString();
        if (i === 0) radio.checked = true;

        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.innerHTML = selectionList[i].description;

        const selectionWrapper = document.createElement("div");
        selectionWrapper.className = radio.id;
        selectionWrapper.appendChild(radio);
        selectionWrapper.appendChild(label);
        container.appendChild(selectionWrapper);
    }
}

createRadioGroup(
    "dynamic",
    document.querySelector(".dynamic-select") as HTMLElement,
    dynamicSelections
);

createRadioGroup(
    "energy",
    document.querySelector(".energy-select") as HTMLElement,
    energySelections
);

const controlConsole = document.querySelector(
    ".control-console"
) as HTMLElement;
for (let i = 1; i <= 4; ++i) {
    const commands = document.createElement("div");
    commands.className = `spaceship${i}-commands destroyed`;
    const label = document.createElement("label");
    label.innerHTML = `对${i}号飞船下达指令：`;
    commands.appendChild(label);

    const startButton = document.createElement("button");
    startButton.innerHTML = "开始飞行";
    startButton.className = "start-button";
    startButton.addEventListener("click", () => {
        BUS.spreadCommand({
            id: i,
            operation: "start",
        });
    });
    commands.appendChild(startButton);

    const stopButton = document.createElement("button");
    stopButton.innerHTML = "停止飞行";
    stopButton.className = "stop-button";
    stopButton.addEventListener("click", () => {
        BUS.spreadCommand({
            id: i,
            operation: "stop",
        });
    });
    commands.appendChild(stopButton);

    const destroyButton = document.createElement("button");
    destroyButton.innerHTML = "销毁";
    destroyButton.className = "destroy-button";
    destroyButton.addEventListener("click", () => {
        BUS.spreadCommand({
            id: i,
            operation: "destroy",
        });
    });
    commands.appendChild(destroyButton);

    controlConsole.appendChild(commands);
}

const createConsole = document.querySelector('.create-console') as HTMLFormElement;
const dynamicRadiosGroup = createConsole["dynamic"] as RadioNodeList;
const energyRadiosGroup = createConsole["energy"] as RadioNodeList;
const createButton = document.querySelector(
    ".create-button"
) as HTMLButtonElement;
createButton.addEventListener("click", () => {
    for (let i = 0; i < 4; ++i) {
        if (spaceships[i] === null) {
            const dynamicSelectionId = parseInt(dynamicRadiosGroup.value);
            const energySelectionId = parseInt(energyRadiosGroup.value);
            const dynamicSelection = dynamicSelections[dynamicSelectionId];
            const energySelection = energySelections[energySelectionId];

            BUS.simulateTry(() => {
                spaceships[i] = new Spaceship(
                    i + 1,
                    (i + 1) * 90,
                    dynamicSelection.speed,
                    dynamicSelection.fuelConsumptionSpeed,
                    energySelection.fuelChargeSpeed,
                    dynamicSelectionId,
                    energySelectionId
                );
                msgCommand.innerHTML = `Create spaceship: ${i + 1}`;
                BUS.updateDom({
                    id: i + 1,
                    operation: "create",
                });
            });
            return;
        }
    }
    msgTryInfo.innerHTML = "";
    msgCommand.innerHTML = `No spaceship to create`;
});

let timer = 0;
function anim(timestamp: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#0353a4";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    for (const spaceship of spaceships) {
        spaceship?.updateState(timer ? timestamp - timer : 0);
    }
    timer = timestamp;

    requestAnimationFrame(anim);
}
requestAnimationFrame(anim);

export {};
