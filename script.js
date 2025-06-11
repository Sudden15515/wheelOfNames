const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let names = [
    "Adam", "Bella", "Chris", "David", "Elias",
    "Fanny", "Greger", "Hilda", "Jonatan", "Limpan", "Anders"
];

const protectedNames = ["Jonatan", "Limpan", "Anders"];
let remaining = names.filter(n => !protectedNames.includes(n));

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let total = remaining.length + protectedNames.length;
    let angleStep = 2 * Math.PI / total;
    let radius = canvas.width / 2;

    for (let i = 0; i < total; i++) {
        let angle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + angleStep);
        ctx.closePath();
        ctx.fillStyle = `hsl(${i * 360 / total}, 80%, 70%)`;
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + angleStep / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        let name = [...remaining, ...protectedNames][i];
        ctx.fillText(name, radius - 10, 5);
        ctx.restore();
    }
}

function spinWheel() {
    if (remaining.length === 0) {
        document.getElementById("result").innerText = "End of spin. Final three remain.";
        drawWheel();
        return;
    }

    let index = Math.floor(Math.random() * remaining.length);
    let chosen = remaining[index];

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `Vald: ${chosen} <br>
        <button onclick="removeName('${chosen}')">Remove</button>
        <button onclick="keepName()">Keep</button>`;
}

function removeName(name) {
    remaining = remaining.filter(n => n !== name);
    document.getElementById("result").innerText = "";
    drawWheel();
}

function keepName() {
    document.getElementById("result").innerText = "";
}

document.getElementById("spinButton").addEventListener("click", spinWheel);
drawWheel();
