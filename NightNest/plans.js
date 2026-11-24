const toast = document.querySelector("#toast");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
};

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.plan} is a sample plan. Subscriptions aren't connected in this prototype.`);
  });
});
