const toast = document.querySelector("#toast");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
};

const routineItems = Array.from(document.querySelectorAll(".routine-item"));
const routineCount = document.querySelector("#routine-count");
const routineProgress = document.querySelector(".routine-progress i");

const updateRoutineProgress = () => {
  const completed = routineItems.filter((item) => item.querySelector("input").checked).length;
  routineCount.textContent = `${completed} of ${routineItems.length} done`;
  routineProgress.style.width = `${(completed / routineItems.length) * 100}%`;
  routineItems.forEach((item) => {
    const status = item.querySelector(".routine-complete");
    if (item.querySelector("input").checked && !status) {
      const done = document.createElement("span");
      done.className = "routine-complete";
      done.textContent = "DONE";
      item.append(done);
    } else if (!item.querySelector("input").checked && status) {
      status.remove();
    }
  });
};

routineItems.forEach((item) => item.querySelector("input").addEventListener("change", updateRoutineProgress));
updateRoutineProgress();

document.querySelector("#add-routine-step").addEventListener("click", () => {
  showToast("Custom routine steps are coming soon.");
});

document.querySelector("#save-routine").addEventListener("click", () => {
  showToast("Your routine is updated in this preview. Changes aren't saved yet.");
});

const lockButton = document.querySelector("#bedtime-lock-button");
const lockPanel = document.querySelector(".bedtime-lock-panel");
const lockStatus = document.querySelector("#bedtime-lock-status");
let bedtimeLockOn = false;

lockButton.addEventListener("click", () => {
  bedtimeLockOn = !bedtimeLockOn;
  lockPanel.classList.toggle("is-locked", bedtimeLockOn);
  lockStatus.textContent = bedtimeLockOn ? "BEDTIME MODE ON" : "NOT LOCKED";
  lockButton.innerHTML = bedtimeLockOn
    ? '<span aria-hidden="true">✓</span> Turn bedtime lock off'
    : '<span aria-hidden="true">☾</span> Turn bedtime lock on';
  showToast(bedtimeLockOn
    ? "Bedtime mode is on in this preview. Device app blocking needs OS permissions."
    : "Bedtime mode is off in this preview.");
});
