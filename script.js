// ====================
// Alarm Functionality
// ====================
if ("Notification" in window && Notification.permission !== "granted") {
	Notification.requestPermission();
}

function setAlarm(time, task) {
	let now = new Date();
	let alarmTime = new Date();

	let timeParts = time.match(/(\d+):(\d+)\s(AM|PM)/);
	if (!timeParts) {
		alert("Invalid time format");
		return;
	}
	let hours = parseInt(timeParts[1], 10);
	let minutes = parseInt(timeParts[2], 10);
	let period = timeParts[3];
	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;
	alarmTime.setHours(hours, minutes, 0, 0);

	if (alarmTime < now) {
		alarmTime.setDate(alarmTime.getDate() + 1);
	}
	let timeDifference = alarmTime - now;
	if (timeDifference > 0) {
		setTimeout(() => {
			if (Notification.permission === "granted") {
				new Notification("Alarm", { body: `Time for ${task}!` });
			} else {
				alert(`⏰ Time for ${task}!`);
			}
			playAlarmSound();
		}, timeDifference);
		alert(`Alarm set for ${task} at ${time}.`);
	} else {
		alert("Cannot set alarm for a past time.");
	}
}

function toggleStatus(element) {
	element.textContent = element.textContent === "🔴" ? "✅" : "🔴";
}

function playAlarmSound() {
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const context = new AudioContext();
	const oscillator = context.createOscillator();
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(440, context.currentTime);
	oscillator.connect(context.destination);
	oscillator.start();
	oscillator.stop(context.currentTime + 1);
}

// ====================
// Time Sequence Recalculation
// ====================
function parseTime(str) {
	let parts = str.match(/(\d+):(\d+)\s*(AM|PM)/);
	if (!parts) return null;
	let hours = parseInt(parts[1], 10);
	let minutes = parseInt(parts[2], 10);
	let period = parts[3];
	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;
	let d = new Date();
	d.setHours(hours, minutes, 0, 0);
	return d;
}

function formatTime(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let period = hours >= 12 ? "PM" : "AM";
	hours %= 12;
	if (hours === 0) hours = 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return `${hours}:${minutes} ${period}`;
}

// Modified recalcTimeSequence: for fixed rows, we update currentTime to the fixed row’s "To" time.
function recalcTimeSequence() {
	const baseStartTime = parseTime("5:30 AM");
	if (!baseStartTime) return;
	let currentTime = new Date(baseStartTime.getTime());
	const rows = document.querySelectorAll("#timetable tbody tr");
	rows.forEach(function (row) {
		// If row is fixed, do not recalc its time – instead, update currentTime to its "To" value.
		if (
			row.classList.contains("fixed-row") ||
			row.cells[3].textContent.includes("Sleep")
		) {
			let fixedToStr = row.cells[1].textContent;
			let fixedEnd = parseTime(fixedToStr);
			if (fixedEnd) currentTime = fixedEnd;
			return;
		}
		const duration = parseInt(row.getAttribute("data-duration"), 10);
		const fromCell = row.cells[0];
		const spanElem = fromCell.querySelector("span");
		spanElem.textContent = formatTime(currentTime);
		const button = fromCell.querySelector("button");
		const taskName = row.cells[3].textContent.trim();
		button.setAttribute(
			"onclick",
			`setAlarm('${formatTime(currentTime)}','${taskName}')`
		);
		let toTime = new Date(currentTime.getTime());
		toTime.setMinutes(currentTime.getMinutes() + duration);
		row.cells[1].textContent = formatTime(toTime);
		currentTime = toTime;
	});
}

// ====================
// Drag & Drop Functionality with Snap & Fixed-Row Handling
// ====================
let dragSrcEl = null;

function handleDragStart(e) {
	// Do not allow dragging fixed rows or Sleep row.
	if (
		this.classList.contains("fixed-row") ||
		this.cells[3].textContent.includes("Sleep")
	) {
		alert("This row is fixed and cannot be moved.");
		e.preventDefault();
		return;
	}
	dragSrcEl = this;
	this.style.opacity = "0.4";
	if (this.classList.contains("prayer-row")) {
		const siblings = Array.from(this.parentNode.children);
		this.startIndex = siblings.indexOf(this);
	}
	e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
	if (e.preventDefault) e.preventDefault();
	return false;
}

function handleDragEnter(e) {
	if (!this.classList.contains("fixed-row")) {
		this.classList.add("over");
	}
}

function handleDragLeave(e) {
	this.classList.remove("over");
}

function handleDrop(e) {
	if (e.stopPropagation) e.stopPropagation();

	if (
		this.classList.contains("fixed-row") ||
		this.cells[3].textContent.includes("Sleep")
	) {
		alert("Cannot drop onto a fixed row.");
		return false;
	}

	const parent = this.parentNode;
	const siblings = Array.from(parent.children);
	const rect = this.getBoundingClientRect();
	const mouseY = e.clientY;
	let insertBefore = mouseY < rect.top + rect.height / 2;
	let intendedIndex = siblings.indexOf(this);
	if (!insertBefore) {
		intendedIndex++;
	}

	// For prayer rows, only allow moving one row relative to the start index.
	if (dragSrcEl.classList.contains("prayer-row")) {
		let displacement = intendedIndex - dragSrcEl.startIndex;
		let allowedDisplacement = displacement > 0 ? 1 : -1;
		intendedIndex = dragSrcEl.startIndex + allowedDisplacement;
	}

	// Prevent crossing a fixed row
	const fixedRow = document.querySelector("#timetable tbody .fixed-row");
	if (fixedRow) {
		const fixedIndex = Array.from(parent.children).indexOf(fixedRow);
		if (intendedIndex === fixedIndex) {
			alert("Cannot cross the fixed row.");
			return false;
		}
	}

	parent.removeChild(dragSrcEl);
	const updatedSiblings = Array.from(parent.children);
	if (intendedIndex >= updatedSiblings.length) {
		parent.appendChild(dragSrcEl);
	} else {
		parent.insertBefore(dragSrcEl, updatedSiblings[intendedIndex]);
	}

	recalcTimeSequence();
	addDragAndDropHandlers();
	return false;
}

function handleDragEnd(e) {
	this.style.opacity = "1";
	document.querySelectorAll("#timetable tbody tr").forEach(function (row) {
		row.classList.remove("over");
	});
}

function addDragAndDropHandlers() {
	const rows = document.querySelectorAll("#timetable tbody tr");
	rows.forEach(function (row) {
		if (row.classList.contains("fixed-row")) return;
		row.removeEventListener("dragstart", handleDragStart, false);
		row.removeEventListener("dragenter", handleDragEnter, false);
		row.removeEventListener("dragover", handleDragOver, false);
		row.removeEventListener("dragleave", handleDragLeave, false);
		row.removeEventListener("drop", handleDrop, false);
		row.removeEventListener("dragend", handleDragEnd, false);

		row.addEventListener("dragstart", handleDragStart, false);
		row.addEventListener("dragenter", handleDragEnter, false);
		row.addEventListener("dragover", handleDragOver, false);
		row.addEventListener("dragleave", handleDragLeave, false);
		row.addEventListener("drop", handleDrop, false);
		row.addEventListener("dragend", handleDragEnd, false);
	});
}

document.addEventListener("DOMContentLoaded", function () {
	addDragAndDropHandlers();
	recalcTimeSequence();
});
