const canvas = document.getElementById("ladyCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("savePdfBtn");
const clearBtn = document.getElementById("clearBtn");
const signArea = document.getElementById("signArea");
const pdfNotice = document.getElementById("pdfNotice");

let drawing = false;

// --- Always start fresh when hosted on GitHub Pages ---
if (window.location.hostname.includes("github.io")) {
  localStorage.removeItem("ladySigned");
  localStorage.removeItem("ladySignature");
}

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

// --- Drawing logic ---
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

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// --- Save signature directly to webpage ---
saveBtn.addEventListener("click", () => {
  const signatureImg = canvas.toDataURL("image/png");

  // Create signature image
  const signatureElement = document.createElement("img");
  signatureElement.src = signatureImg;
  signatureElement.style.width = "160px";
  signatureElement.style.height = "60px";
  signatureElement.style.display = "block";
  signatureElement.style.margin = "0 auto";
  signatureElement.style.marginBottom = "-25px"; // lower placement

  // Insert signature above name
  const ladySection = document.querySelector(".signatureSection div:nth-child(1)");
  ladySection.insertBefore(signatureElement, ladySection.firstChild);

  // Hide signature area and show confirmation
  signArea.classList.add("hidden");
  pdfNotice.classList.remove("hidden");

  // Save to localStorage (once only)
  localStorage.setItem("ladySignature", signatureImg);
  localStorage.setItem("ladySigned", "true");
});

// --- Restore saved signature on reload (only on same device) ---
window.onload = () => {
  const savedSignature = localStorage.getItem("ladySignature");
  if (savedSignature) {
    const signatureElement = document.createElement("img");
    signatureElement.src = savedSignature;
    signatureElement.style.width = "160px";
    signatureElement.style.height = "60px";
    signatureElement.style.display = "block";
    signatureElement.style.margin = "0 auto";
    signatureElement.style.marginBottom = "-25px";

    const ladySection = document.querySelector(".signatureSection div:nth-child(1)");
    ladySection.insertBefore(signatureElement, ladySection.firstChild);
  }

  if (localStorage.getItem("ladySigned") === "true") {
    signArea.classList.add("hidden");
    pdfNotice.classList.remove("hidden");
  }
};
