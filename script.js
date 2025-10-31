const canvas = document.getElementById("ladyCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("savePdfBtn"); // "Save"
const clearBtn = document.getElementById("clearBtn");
const signArea = document.getElementById("signArea");
const pdfNotice = document.getElementById("pdfNotice");

let drawing = false;

// --- Canvas setup ---
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- Drawing Logic ---
function startDraw(e) {
  drawing = true;
  draw(e);
}
function endDraw() {
  drawing = false;
  ctx.beginPath();
}
function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// --- Event Listeners for Drawing ---
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchmove", draw);

// --- Clear signature before saving ---
clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// --- Save signature permanently ---
saveBtn.addEventListener("click", () => {
  const signatureImg = canvas.toDataURL("image/png");

  // Create image element
  const signatureElement = document.createElement("img");
  signatureElement.src = signatureImg;
  signatureElement.style.width = "160px";
  signatureElement.style.height = "60px";
  signatureElement.style.display = "block";
  signatureElement.style.margin = "0 auto";
  signatureElement.style.marginBottom = "-40px"; // lowered slightly

  // Place signature above Dane Morrey’s name
  const ladySection = document.querySelector(".signatureSection div:nth-child(1)");
  ladySection.insertBefore(signatureElement, ladySection.firstChild);

  // Save permanently (no reset option)
  localStorage.setItem("ladySignature", signatureImg);
  localStorage.setItem("ladySigned", "true");

  // Hide sign area and show notice
  signArea.classList.add("hidden");
  pdfNotice.classList.remove("hidden");
});

// --- Restore signature on reload ---
window.onload = () => {
  const savedSignature = localStorage.getItem("ladySignature");
  if (savedSignature) {
    const signatureElement = document.createElement("img");
    signatureElement.src = savedSignature;
    signatureElement.style.width = "160px";
    signatureElement.style.height = "60px";
    signatureElement.style.display = "block";
    signatureElement.style.margin = "0 auto";
    signatureElement.style.marginBottom = "-40px"; // keep consistent placement

    const ladySection = document.querySelector(".signatureSection div:nth-child(1)");
    ladySection.insertBefore(signatureElement, ladySection.firstChild);
  }

  if (localStorage.getItem("ladySigned") === "true") {
    signArea.classList.add("hidden");
    pdfNotice.classList.remove("hidden");
  }
};
