const toast = document.querySelector("#toast");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
};

const profileForm = document.querySelector("#profile-form");
const profileName = document.querySelector("#child-name");
const profileNameDisplay = document.querySelector("#profile-name-display");
const profileAboutName = document.querySelector("#profile-about-name");
const profileAvatarInitial = document.querySelector("#profile-avatar-initial");
const profileScheduleName = document.querySelector("#profile-schedule-name");
const profileDeviceName = document.querySelector("#profile-device-name");
const profileHelpName = document.querySelector("#profile-help-name");
const ageInput = document.querySelector("#child-age");
const recommendedSleep = document.querySelector("#recommended-sleep-range");
const addChildTrigger = document.querySelector("#show-add-child");
const addChildPanel = document.querySelector("#add-child-panel");
const newChildName = document.querySelector("#new-child-name");
const newChildAge = document.querySelector("#new-child-age");
const deleteChildButton = document.querySelector("#delete-child");
const familyUsageList = document.querySelector("#family-usage-list");
const familyUsageWinner = document.querySelector("#family-usage-winner");
const children = {
  oliver: { name: "Oliver", age: "9", screenTimeMinutes: 134 },
  sam: { name: "Sam", age: "9", screenTimeMinutes: 102 }
};
let nextChildId = 1;

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Profile updated in this preview. Changes aren't saved yet.");
});

const bedtimeInput = document.querySelector("#bedtime-time");
const wakeInput = document.querySelector("#wake-time");
const sleepWindow = document.querySelector("#sleep-window-duration");
const sleepAssessment = document.querySelector("#sleep-window-assessment");
const sleepRanges = [
  { minimumAge: 1, maximumAge: 5, minimumHours: 10, maximumHours: 14 },
  { minimumAge: 6, maximumAge: 12, minimumHours: 9, maximumHours: 12 },
  { minimumAge: 13, maximumAge: 18, minimumHours: 8, maximumHours: 10 }
];

const getSleepRange = () => {
  const age = Number(ageInput.value);
  return sleepRanges.find((range) => age >= range.minimumAge && age <= range.maximumAge);
};

const updateProfileDisplay = () => {
  const child = children[profileName.value];
  const possessiveName = `${child.name}'s`;
  profileNameDisplay.textContent = possessiveName;
  profileAboutName.textContent = child.name;
  profileAvatarInitial.textContent = child.name.charAt(0).toUpperCase();
  profileScheduleName.textContent = possessiveName;
  profileDeviceName.textContent = possessiveName;
  profileHelpName.textContent = possessiveName;
  ageInput.value = child.age;
  deleteChildButton.disabled = Object.keys(children).length <= 1;
  updateSleepGuidance();
  renderFamilyUsage();
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return remainingMinutes ? `${hourLabel} ${remainingMinutes} min` : hourLabel;
};

const updateSleepWindow = () => {
  if (!bedtimeInput.value || !wakeInput.value) {
    sleepWindow.textContent = "Choose both times";
    sleepAssessment.dataset.status = "incomplete";
    sleepAssessment.textContent = "Enter a bedtime and wake-up time to compare the schedule.";
    return;
  }
  const [bedtimeHour, bedtimeMinute] = bedtimeInput.value.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeInput.value.split(":").map(Number);
  const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;
  const wakeMinutes = wakeHour * 60 + wakeMinute;
  const durationMinutes = (wakeMinutes - bedtimeMinutes + 1440) % 1440;
  if (!durationMinutes) {
    sleepWindow.textContent = "No overnight window";
    sleepAssessment.dataset.status = "incomplete";
    sleepAssessment.textContent = "Choose different bedtime and wake-up times.";
    return;
  }

  const sleepRange = getSleepRange();
  const durationLabel = formatDuration(durationMinutes);
  sleepWindow.textContent = durationLabel;
  if (!sleepRange) {
    sleepAssessment.dataset.status = "incomplete";
    sleepAssessment.textContent = "Choose an age to compare this schedule with the general sleep range.";
    return;
  }
  if (durationMinutes < sleepRange.minimumHours * 60) {
    sleepAssessment.dataset.status = "short";
    sleepAssessment.textContent = `This schedule allows ${durationLabel}, below the general ${sleepRange.minimumHours}–${sleepRange.maximumHours} hour range.`;
  } else if (durationMinutes > sleepRange.maximumHours * 60) {
    sleepAssessment.dataset.status = "long";
    sleepAssessment.textContent = `This schedule allows ${durationLabel}, above the general ${sleepRange.minimumHours}–${sleepRange.maximumHours} hour range.`;
  } else {
    sleepAssessment.dataset.status = "within";
    sleepAssessment.textContent = `This schedule allows ${durationLabel}, within the general ${sleepRange.minimumHours}–${sleepRange.maximumHours} hour range.`;
  }
};

const updateSleepGuidance = () => {
  const sleepRange = getSleepRange();
  if (!sleepRange) return;
  const age = Number(ageInput.value);
  const ageDescription = `${age}-year-old`;
  const hourRange = `${sleepRange.minimumHours}–${sleepRange.maximumHours} hours`;
  recommendedSleep.textContent = `A ${ageDescription} generally needs ${hourRange} of sleep per 24 hours.`;
  updateSleepWindow();
};

const renderFamilyUsage = () => {
  const entries = Object.entries(children).sort(([, first], [, second]) => {
    const firstHasData = Number.isFinite(first.screenTimeMinutes);
    const secondHasData = Number.isFinite(second.screenTimeMinutes);
    if (firstHasData !== secondHasData) return firstHasData ? -1 : 1;
    return (second.screenTimeMinutes || 0) - (first.screenTimeMinutes || 0);
  });
  const measuredEntries = entries.filter(([, child]) => Number.isFinite(child.screenTimeMinutes));
  const maximumMinutes = Math.max(1, ...measuredEntries.map(([, child]) => child.screenTimeMinutes));
  familyUsageList.replaceChildren();

  entries.forEach(([id, child], index) => {
    const hasData = Number.isFinite(child.screenTimeMinutes);
    const isLeader = hasData && index === 0;
    const entry = document.createElement("div");
    entry.className = "family-usage-entry";
    entry.setAttribute("role", "listitem");
    if (id === profileName.value) entry.classList.add("is-selected");
    if (isLeader) entry.classList.add("is-leader");

    const label = document.createElement("div");
    label.className = "family-usage-label";
    const name = document.createElement("strong");
    name.textContent = child.name;
    label.append(name);

    const detail = document.createElement("span");
    detail.className = "family-usage-detail";
    if (!hasData) {
      detail.textContent = "No data yet";
    } else {
      detail.textContent = formatDuration(child.screenTimeMinutes);
      if (isLeader) {
        const leaderTag = document.createElement("small");
        leaderTag.textContent = "MOST TODAY";
        label.append(leaderTag);
      }
    }
    label.append(detail);

    const track = document.createElement("div");
    track.className = "family-usage-track";
    const bar = document.createElement("span");
    bar.className = "family-usage-bar";
    if (hasData) bar.style.width = `${Math.max(4, child.screenTimeMinutes / maximumMinutes * 100)}%`;
    track.append(bar);
    entry.append(label, track);
    familyUsageList.append(entry);
  });

  if (measuredEntries.length) {
    const [leaderId, leader] = measuredEntries[0];
    familyUsageWinner.textContent = `${leader.name} has the most recorded screen time today: ${formatDuration(leader.screenTimeMinutes)}.`;
    familyUsageWinner.dataset.leader = leaderId;
  } else {
    familyUsageWinner.textContent = "Screen-time data will appear when a device is connected.";
    delete familyUsageWinner.dataset.leader;
  }
};

profileName.addEventListener("change", updateProfileDisplay);
ageInput.addEventListener("change", () => {
  children[profileName.value].age = ageInput.value;
  updateSleepGuidance();
});
addChildTrigger.addEventListener("click", () => {
  addChildPanel.hidden = false;
  addChildTrigger.setAttribute("aria-expanded", "true");
  newChildName.focus();
});
document.querySelector("#cancel-add-child").addEventListener("click", () => {
  addChildPanel.hidden = true;
  addChildTrigger.setAttribute("aria-expanded", "false");
  newChildName.value = "";
  addChildTrigger.focus();
});
document.querySelector("#add-child-submit").addEventListener("click", () => {
  const name = newChildName.value.trim();
  const age = Number(newChildAge.value);
  if (!name) {
    showToast("Enter a name for the child.");
    newChildName.focus();
    return;
  }
  if (!Number.isInteger(age) || age < 1 || age > 18) {
    showToast("Enter an age from 1 to 18.");
    newChildAge.focus();
    return;
  }
  if (Object.values(children).some((child) => child.name.toLowerCase() === name.toLowerCase())) {
    showToast("A child with that name is already in this preview.");
    newChildName.focus();
    return;
  }

  const childId = `child-${nextChildId++}`;
  children[childId] = { name, age: String(age), screenTimeMinutes: null };
  const option = document.createElement("option");
  option.value = childId;
  option.textContent = name;
  profileName.append(option);
  profileName.value = childId;
  updateProfileDisplay();
  addChildPanel.hidden = true;
  addChildTrigger.setAttribute("aria-expanded", "false");
  newChildName.value = "";
  newChildAge.value = "9";
  showToast(`${name} was added to the app locker preview. Changes aren't saved yet.`);
});
deleteChildButton.addEventListener("click", () => {
  const selectedId = profileName.value;
  const child = children[selectedId];
  if (Object.keys(children).length <= 1) {
    showToast("Keep at least one child profile in the app locker.");
    return;
  }
  if (!window.confirm(`Delete ${child.name}'s profile from this preview? This can't be undone.`)) return;

  delete children[selectedId];
  profileName.options[profileName.selectedIndex].remove();
  profileName.selectedIndex = 0;
  updateProfileDisplay();
  showToast(`${child.name}'s profile was removed from this preview. Changes aren't saved yet.`);
});
bedtimeInput.addEventListener("input", updateSleepWindow);
wakeInput.addEventListener("input", updateSleepWindow);

document.querySelector("#schedule-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const daysSelected = document.querySelectorAll(".profile-days input:checked").length;
  if (!daysSelected) {
    showToast("Choose at least one day for this schedule.");
    return;
  }
  updateSleepWindow();
  showToast("Schedule updated in this preview. Changes aren't saved yet.");
});

document.querySelector("#device-setup").addEventListener("click", () => {
  showToast("Device pairing isn't available in this prototype yet.");
});

updateProfileDisplay();
