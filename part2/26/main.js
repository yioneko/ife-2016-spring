const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 800;
const ctx = canvas.getContext('2d');
const console = document.querySelector('.console');
const msgState = document.querySelector('.msg .state');
const msgCommand = document.querySelector('.msg .command');
class Spaceship {
    constructor(id, radius) {
        this.id = id;
        this.fuel = 100;
        this.totalDistance = 0;
        this.speed = 20;
        this.radius = radius;
        this.flying = false;
        this.destroyed = true;
        this.fuelConsumptionSpeed = 5;
        this.fuelChargeSpeed = 2;
        this.width = 65;
        this.height = 30;
    }
    receiveCommand(command) {
        if (this.id === command.id) {
            if (command.operation === 'create' && this.destroyed) {
                this.initialize();
                return true;
            }
            else if (command.operation === 'start') {
                this.flying = true;
            }
            else if (command.operation === 'stop') {
                this.flying = false;
            }
            else if (command.operation === 'destroy') {
                this.destroyed = true;
                return true;
            }
        }
        return false;
    }
    updateState(time) {
        time /= 1000;
        if (!this.destroyed) {
            const ifValue = this.fuel - (this.fuelConsumptionSpeed - this.fuelChargeSpeed) * time;
            if (this.flying) {
                if (ifValue <= 0) {
                    this.flying = false;
                    const flyTime = this.fuel / (this.fuelConsumptionSpeed - this.fuelChargeSpeed);
                    this.totalDistance += flyTime * this.speed;
                    this.fuel = (time - flyTime) * this.fuelChargeSpeed;
                }
                else {
                    this.fuel = ifValue;
                    this.totalDistance += time * this.speed;
                }
            }
            else {
                this.fuel += this.fuelChargeSpeed * time;
            }
            this.fuel = Math.min(this.fuel, 100);
            this.draw();
        }
    }
    initialize() {
        this.fuel = 100;
        this.totalDistance = 0;
        this.flying = false;
        this.destroyed = false;
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.totalDistance / this.radius);
        ctx.translate(0, -this.radius);
        ctx.fillStyle = "#7d8597";
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.arc(this.width / 2, 0, this.height / 2, -Math.PI / 2, Math.PI / 2);
        ctx.arc(-this.width / 2, 0, this.height / 2, -Math.PI / 2, Math.PI / 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#0353a4";
        ctx.arc(-this.width / 2 + this.height / 2, 0, this.height / 2 * Math.sqrt(2), Math.PI / 4 * 3, Math.PI / 4 * 5);
        ctx.arc(-this.width / 2, 0, this.height / 2, -Math.PI / 2, Math.PI / 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#caf0f8";
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.id}号-${this.fuel.toFixed(0)}%`, 0, 0);
        ctx.restore();
    }
}
const spaceships = [
    new Spaceship(1, 100),
    new Spaceship(2, 150),
    new Spaceship(3, 200),
    new Spaceship(4, 250)
];
class Mediator {
    static spreadCommand(command) {
        if (Math.random() >= Mediator.failureRate) {
            msgState.toggleAttribute('fail', false);
            msgState.innerHTML = 'Success';
            for (const spaceship of spaceships) {
                setTimeout(() => {
                    if (spaceship.receiveCommand(command))
                        Mediator.updateDom(command);
                }, Mediator.spreadTime);
            }
        }
        else {
            msgState.toggleAttribute('fail', true);
            msgState.innerHTML = 'Fail';
        }
        msgCommand.innerHTML = JSON.stringify(command);
    }
    static updateDom(command) {
        const commands = console.querySelector(`.spaceship${command.id}-commands`);
        if (commands) {
            switch (command.operation) {
                case 'create':
                    commands.classList.remove('destroyed');
                    break;
                case 'destroy':
                    commands.classList.add('destroyed');
                    break;
            }
        }
    }
}
Mediator.failureRate = 0.3;
Mediator.spreadTime = 1000;
for (let i = 1; i <= 4; ++i) {
    const commands = document.createElement('div');
    commands.className = `spaceship${i}-commands destroyed`;
    const label = document.createElement('label');
    label.innerHTML = `对${i}号飞船下达指令：`;
    commands.appendChild(label);
    const startButton = document.createElement('button');
    startButton.innerHTML = '开始飞行';
    startButton.className = 'start-button';
    startButton.addEventListener('click', () => {
        Mediator.spreadCommand({
            id: i,
            operation: 'start'
        });
    });
    commands.appendChild(startButton);
    const stopButton = document.createElement('button');
    stopButton.innerHTML = '停止飞行';
    stopButton.className = 'stop-button';
    stopButton.addEventListener('click', () => {
        Mediator.spreadCommand({
            id: i,
            operation: 'stop'
        });
    });
    commands.appendChild(stopButton);
    const destroyButton = document.createElement('button');
    destroyButton.innerHTML = '销毁';
    destroyButton.className = 'destroy-button';
    destroyButton.addEventListener('click', () => {
        Mediator.spreadCommand({
            id: i,
            operation: 'destroy'
        });
    });
    commands.appendChild(destroyButton);
    console.appendChild(commands);
}
const createButton = document.createElement('button');
createButton.innerHTML = '新的飞船起飞';
createButton.className = 'destroy-button';
createButton.addEventListener('click', () => {
    for (let i = 0; i < 4; ++i) {
        if (spaceships[i].destroyed) {
            Mediator.spreadCommand({
                id: i + 1,
                operation: 'create'
            });
            return;
        }
    }
});
console.appendChild(createButton);
let timer = 0;
function anim(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#0353a4';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    for (const spaceship of spaceships) {
        spaceship.updateState(timer ? timestamp - timer : 0);
    }
    timer = timestamp;
    requestAnimationFrame(anim);
}
requestAnimationFrame(anim);
export {};
//# sourceMappingURL=main.js.map