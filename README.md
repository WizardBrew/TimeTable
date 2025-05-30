# 🌟 Interactive Muslim Housewife Daily Timetable 🌟

Welcome to the **Interactive Housewife Daily Timetable** project! This is a dynamic, web-based scheduling tool built with HTML, CSS, and JavaScript. It lets you easily manage your daily tasks using interactive drag-and-drop features, alarms, and automatic time adjustments. Whether it's prayer times or everyday activities, this timetable keeps everything in order with a modern, attractive design. 🚀

---
![image](https://github.com/user-attachments/assets/e5b3f6b7-0791-499e-8200-d222801e5e1d)

## 📌 Features

- **Dynamic Scheduling 📅**  
  - Automatically calculates task **start ("From")** and **end ("To")** times beginning at **5:30 AM**.
  - Web notifications (or alerts) with a 1‑second beep sound when alarms go off.
    
![image](https://github.com/user-attachments/assets/de46b475-9f55-456d-a4ae-e14b23be7cab)

- **Interactive Drag & Drop 🔄**  
  - **Non-prayer tasks** can be rearranged freely.
  - **Prayer rows** (Fajr, Dhuhr, Asr, Maghrib) snap in place so they can only be moved one row up or down.
  - Enforced time thresholds ensure, for example:
    - **Fajr** starts before 7:00 AM.
    - **Dhuhr** is between 12:00 PM and 4:00 PM.
    - **Asr** is between 3:00 PM and 7:30 PM.
    - **Maghrib** is between 7:30 PM and 8:00 PM.
  - Any violation of these thresholds reverts the change. ❌

- **Fixed Rows 🔒**  
  - The **Isha Prayer** row (8:30 PM–8:45 PM) is fixed and cannot be moved.
  - The **Sleep** row remains fixed at the bottom.

- **Modern Look & Feel 🎨**  
  - A striking gradient background with modern fonts.
  - Stylish table design with alternating row colors.
  - Consistent light‑green backgrounds for prayer rows and a light‑yellow background for fixed rows.
  - Rounded buttons with smooth hover effects and clean input fields.

---

## 🛠️ Files

- **index.html**  
  Contains the structure of the timetable with headers and rows for tasks, prayer times, fixed rows, etc.

- **styles.css**  
  Provides the modern, polished styling including the gradient background, table aesthetics, and responsiveness.  
  Prayer rows always remain light green, while fixed rows have their distinct light yellow appearance.

- **script.js**  
  Implements:
  - Alarm functionality with notifications and a 1‑second beep.
  - Complex drag-and-drop with smooth snapping and one‑row movement restriction for prayer rows.
  - Automatic recalculation of the timetable after every drop.
  - Fixed row handling so that certain rows (Isha and Sleep) do not move.

---

## ⚙️ Getting Started

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/yourusername/interactive-timetable.git
