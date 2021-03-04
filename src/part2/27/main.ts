export {};
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = 1000;
canvas.height = 800;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const msgTryInfo = document.querySelector(".msg .try-info") as HTMLElement;
const msgCommand = document.querySelector(".msg .command") as HTMLElement;
const controlConsole = document.querySelector(
    ".control-console"
) as HTMLElement;
const createConsole = document.querySelector(
    ".create-console"
) as HTMLFormElement;
const createButton = document.querySelector(
    ".create-button"
) as HTMLButtonElement;
const dynamicRadiosGroup = createConsole["dynamic"] as RadioNodeList;
const energyRadiosGroup = createConsole["energy"] as RadioNodeList;

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

class Spaceship {
    id: number;
    speed: number;
    fuel: number;
    radius: number;
    fuelConsumptionSpeed: number;
    fuelChargeSpeed: number;
    flying: boolean;
    totalDistance: number;
    width: number;
    height: number;

    constructor(
        id: number,
        radius: number,
        speed: number,
        fuelConsumptionSpeed: number,
        fuelChargeSpeed: number
    ) {
        this.id = id;
        this.fuel = 100;
        this.totalDistance = 0;
        this.speed = speed;
        this.radius = radius;
        this.flying = false;
        this.fuelConsumptionSpeed = fuelConsumptionSpeed;
        this.fuelChargeSpeed = fuelChargeSpeed;
        this.width = 65;
        this.height = 30;
    }

    receiveCommand(binaryCommand: number): boolean {
        const command = this.commandDecoder(binaryCommand);
        if (this.id === command.id) {
            if (command.operation === "start") {
                this.flying = true;
            } else if (command.operation === "stop") {
                this.flying = false;
            } else if (command.operation === "destroy") {
                spaceships[this.id - 1] = null;
                return true;
            }
        }
        return false;
    }

    updateState(time: number): void {
        time /= 1000;
        const ifValue =
            this.fuel -
            (this.fuelConsumptionSpeed - this.fuelChargeSpeed) * time;
        if (this.flying) {
            if (ifValue <= 0) {
                this.flying = false;
                const flyTime =
                    this.fuel /
                    (this.fuelConsumptionSpeed - this.fuelChargeSpeed);
                this.totalDistance += flyTime * this.speed;
                this.fuel = (time - flyTime) * this.fuelChargeSpeed;
            } else {
                this.fuel = ifValue;
                this.totalDistance += time * this.speed;
            }
        } else {
            this.fuel += this.fuelChargeSpeed * time;
        }
        this.fuel = Math.min(this.fuel, 100);
        this.draw();
    }

    private draw(): void {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.totalDistance / this.radius);
        ctx.translate(0, -this.radius);
        ctx.fillStyle = "#7d8597";
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.arc(this.width / 2, 0, this.height / 2, -Math.PI / 2, Math.PI / 2);
        ctx.arc(
            -this.width / 2,
            0,
            this.height / 2,
            -Math.PI / 2,
            Math.PI / 2,
            true
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#0353a4";
        ctx.arc(
            -this.width / 2 + this.height / 2,
            0,
            (this.height / 2) * Math.sqrt(2),
            (Math.PI / 4) * 3,
            (Math.PI / 4) * 5
        );
        ctx.arc(
            -this.width / 2,
            0,
            this.height / 2,
            -Math.PI / 2,
            Math.PI / 2,
            true
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#caf0f8";
        ctx.font = "15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${this.id}号-${this.fuel.toFixed(0)}%`, 0, 0);
        ctx.restore();
    }

    private commandDecoder(binaryCommand: number): Command {
        return {
            id: (binaryCommand >> 2) + 1,
            operation: operation[binaryCommand & 3] as keyof typeof operation,
        };
    }
}
const spaceships: [
    Spaceship | null,
    Spaceship | null,
    Spaceship | null,
    Spaceship | null
] = [null, null, null, null];

class BUS {
    static failureRate = 0.1;
    static spreadTime = 300;
    static retryInterval = 500;

    static simulateTry(successCallback: () => void): void {
        let tryTimes = 1;
        (function innerTry(): void {
            if (Math.random() < BUS.failureRate) {
                ++tryTimes;
                setTimeout(innerTry, BUS.retryInterval);
            } else {
                msgTryInfo.innerHTML = `Tried ${tryTimes} times:`;
                successCallback();
            }
        })();
    }

    static spreadCommand(command: Command): void {
        BUS.simulateTry(() => {
            for (const spaceship of spaceships) {
                if (spaceship) {
                    setTimeout(() => {
                        if (
                            spaceship.receiveCommand(
                                this.commandEncoder(command)
                            )
                        )
                            BUS.updateDom(command);
                    }, BUS.spreadTime);
                }
            }
            msgCommand.innerHTML = JSON.stringify(command);
        });
    }

    static updateDom(command: Command): void {
        const commands = controlConsole.querySelector(
            `.spaceship${command.id}-commands`
        );
        if (commands) {
            switch (command.operation) {
                case "create":
                    commands.classList.remove("destroyed");
                    break;
                case "destroy":
                    commands.classList.add("destroyed");
                    break;
            }
        }
    }

    private static commandEncoder(command: Command): number {
        return ((command.id - 1) << 2) | operation[command.operation];
    }
}

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

createButton.addEventListener("click", () => {
    let speed: number, fuelConsumptionSpeed: number, fuelChargeSpeed: number;
    for (let i = 0; i < 4; ++i) {
        if (spaceships[i] === null) {
            switch (dynamicRadiosGroup.value) {
                case "1":
                    speed = 30;
                    fuelConsumptionSpeed = 5;
                    break;
                case "2":
                    speed = 50;
                    fuelConsumptionSpeed = 7;
                    break;
                case "3":
                    speed = 80;
                    fuelConsumptionSpeed = 9;
                    break;
                default:
                    throw new Error("Unknown radio value");
            }

            switch (energyRadiosGroup.value) {
                case "1":
                    fuelChargeSpeed = 2;
                    break;
                case "2":
                    fuelChargeSpeed = 3;
                    break;
                case "3":
                    fuelChargeSpeed = 4;
                    break;
                default:
                    throw new Error("Unknown radio value");
            }
            BUS.simulateTry(() => {
                spaceships[i] = new Spaceship(
                    i + 1,
                    (i + 1) * 90,
                    speed,
                    fuelConsumptionSpeed,
                    fuelChargeSpeed
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
