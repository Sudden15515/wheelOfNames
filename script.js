const protectedNames = ["Anders", "Jonatan", "Linus"];
let names = []; 
let selectedWinner = "";
let angle = 0;
let startAngle = 0; // FIX: global startvinkel
let spinning = false;
let angularVelocity = 0;
let targetAngle = 0;

let idleRotation = true; 
let idleSpeed = 0.004;    


function startSpin() {
  if (spinning) return;

  // Uppdatera namn från textarea
  const input = document.getElementById("nameInput").value;
  names = input
    .split("\n")
    .map(name => name.trim())
    .filter(name => name.length > 0);

  const total = names.length;
  const sliceAngle = 2 * Math.PI / total;

  // Kontrollera skyddade namn
  const allowedNames = names.filter(
    name => !protectedNames.some(p => p.toLowerCase() === name.toLowerCase())
  );

  if (allowedNames.length === 0) {
    alert("Det finns inga tillåtna namn att snurra på.");
    return;
  }

  // Välj slumpmässig tillåten vinnare
  selectedWinner = allowedNames[Math.floor(Math.random() * allowedNames.length)];
  const winnerIndex = names.findIndex(
    name => name.toLowerCase() === selectedWinner.toLowerCase()
  );

  const randomOffset = Math.random() * sliceAngle - sliceAngle / 2;
  targetAngle = 2 * Math.PI * 5 + (total - winnerIndex - 0.5) * sliceAngle + randomOffset;

  startAngle = angle % (2 * Math.PI); // FIX: spara startvinkel för easing
  angle = angle % (2 * Math.PI);
  spinning = true;
  spinStartTime = null;
  document.getElementById("clickMessage").style.display = "none";

  requestAnimationFrame(animate);
}

let spinStartTime;
let totalSpinTime = 5000; // 5 sekunder

function animate(timestamp) {
  if (!spinning) return;

  if (!spinStartTime) spinStartTime = timestamp;
  const elapsed = timestamp - spinStartTime;

  const progress = Math.min(elapsed / totalSpinTime, 1); // 0–1
  const easing = easeOutCubic(progress); // smidig inbromsning

  angle = startAngle + easing * (targetAngle - startAngle); // FIX

  drawWheel();

  if (progress < 1) {
    requestAnimationFrame(animate);
  } else {
    spinning = false;
    spinStartTime = null;
    angle = targetAngle % (2 * Math.PI);
    drawWheel();
    showResult(selectedWinner);
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

window.onload = () => {
  document.getElementById("wheel").addEventListener("click", startSpin);
  updateNames();
  drawWheel();
};

function updateNames() {
  const input = document.getElementById("nameInput").value;
  names = input
    .split("\n")
    .map(name => name.trim())
    .filter(name => name.length > 0);
  angle = 0;
  drawWheel();
}

function showResult(winner) {
  document.getElementById("winnerName").innerText = winner;
  document.getElementById("winnerModal").classList.remove("hidden");
  document.getElementById("clickMessage").style.display = "block";
}

function closeModal() {
  document.getElementById("winnerModal").classList.add("hidden");
}

function removeWinner() {
  const name = document.getElementById("winnerName").innerText;
  const index = names.findIndex(n => n.toLowerCase() === name.toLowerCase());
  if (index !== -1) {
    names.splice(index, 1);
  }

  document.getElementById("nameInput").value = names.join("\n");
  closeModal();
  updateNames();
}

function drawWheel() {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const total = names.length;
  const sliceAngle = 2 * Math.PI / total;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita det roterande hjulet
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(angle);

  for (let i = 0; i < total; i++) {
    const startAngle = i * sliceAngle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, startAngle + sliceAngle);
    ctx.fillStyle = ["#f44336", "#4caf50", "#2196f3", "#ffc107"][i % 4];
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.stroke();

    // Skriv namn
    ctx.save();
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(names[i], radius - 10, 5);
    ctx.restore();
  }

  // Vit cirkel i mitten
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.restore(); // <- avslutar roterande hjulet



  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2;

  ctx.beginPath();
  ctx.moveTo(cx + r + 20, cy - 35); // yttre topp (längre ut + högre upp)
  ctx.lineTo(cx + r + 20, cy + 35); // yttre botten (längre ut + längre ner)
  ctx.lineTo(cx + r - 35, cy);      // spets nära hjulet
  ctx.closePath();
  ctx.fillStyle = "#f2f2f2";        // nästan vit
  ctx.fill();
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 2;
  ctx.stroke();


}

function idleSpin() {
  if (!spinning && idleRotation) {
    angle += idleSpeed;
    drawWheel();
  }
  requestAnimationFrame(idleSpin);
}

window.onload = () => {
  document.getElementById("wheel").addEventListener("click", startSpin);
  updateNames();
  drawWheel();
  idleSpin(); 
};
