const appRows = Array.from(document.querySelectorAll(".select-app-row"));
const selectedCount = document.querySelector("#selected-count");
const capLabel = document.querySelector("#app-limit-cap");
const saveButton = document.querySelector("#save-app-limits");
const toast = document.querySelector("#toast");
const freePlanLimit = 10;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3600);
};

const updateAppSelection = () => {
  const selectedRows = appRows.filter((row) => row.querySelector("input").checked);
  selectedCount.textContent = String(selectedRows.length);
  capLabel.textContent = String(freePlanLimit);

  const atLimit = selectedRows.length >= freePlanLimit;
  appRows.forEach((row) => {
    const checkbox = row.querySelector("input");
    row.classList.toggle("at-cap", atLimit && !checkbox.checked);
    checkbox.disabled = atLimit && !checkbox.checked;
  });
};

appRows.forEach((row) => {
  row.querySelector("input").addEventListener("change", (event) => {
    if (event.currentTarget.checked) {
      const selectedTotal = appRows.filter((item) => item.querySelector("input").checked).length;
      if (selectedTotal > freePlanLimit) {
        event.currentTarget.checked = false;
        showToast("The Free plan supports bedtime locks for up to 10 apps.");
      }
    }
    updateAppSelection();
  });
});

saveButton.addEventListener("click", () => {
  const total = appRows.filter((row) => row.querySelector("input").checked).length;
  showToast(`${total} apps selected for this preview. Selections aren't saved yet.`);
});

updateAppSelection();
