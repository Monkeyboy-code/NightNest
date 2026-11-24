const toast = document.querySelector("#toast");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
};

const lockButton = document.querySelector("#lock-button");
const lockPanel = document.querySelector(".lock-panel");
const lockStatus = document.querySelector("#lock-status");
let appsLocked = false;

lockButton.addEventListener("click", () => {
  appsLocked = !appsLocked;
  lockPanel.classList.toggle("is-locked", appsLocked);
  lockStatus.textContent = appsLocked ? "BEDTIME MODE ON" : "NOT LOCKED";
  lockButton.innerHTML = appsLocked
    ? '<span aria-hidden="true">✓</span> Turn bedtime mode off'
    : '<span aria-hidden="true">☾</span> Lock apps for bedtime';
  showToast(appsLocked
    ? "Bedtime mode is on in this demo. Device app locking needs a compatible companion app."
    : "Bedtime mode is off in this demo.");
});

const routineItems = Array.from(document.querySelectorAll(".routine-item"));
const routineCount = document.querySelector("#routine-count");
const routineProgress = document.querySelector(".routine-progress i");

const updateRoutineProgress = () => {
  if (!routineCount || !routineProgress) return;
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
if (routineItems.length > 0) updateRoutineProgress();

document.querySelector("#add-child").addEventListener("click", () => {
  showToast("Adding child profiles is a preview feature. A family account will link each child's day here.");
});

const editRoutineButton = document.querySelector("#edit-routine");
if (editRoutineButton) {
  editRoutineButton.addEventListener("click", () => {
    showToast("Your routine is ready to personalise. Routine editing is coming soon.");
  });
}

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.plan} is a sample plan. Subscriptions aren't connected in this prototype.`);
  });
});

document.querySelectorAll(".side-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach((item) => item.classList.toggle("active", item === link));
  });
});
