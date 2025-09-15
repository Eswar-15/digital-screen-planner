document.addEventListener("DOMContentLoaded", () => {
  const startSessionForm = document.getElementById("start-session-form");
  const historyContainer = document.getElementById("session-history-container");

  // --- Function to fetch and display all sessions ---
  const fetchAndDisplaySessions = async () => {
    const response = await fetch("/api/sessions");
    const sessions = await response.json();

    historyContainer.innerHTML = ""; // Clear existing sessions

    if (sessions.length === 0) {
      historyContainer.innerHTML =
        "<p>No sessions logged yet. Start a new one above!</p>";
      return;
    }

    sessions.forEach((session) => {
      const sessionArticle = document.createElement("article");
      let content = `
                <header>
                    <strong>Intention:</strong> ${session.intention} 
                    <em>(Planned: ${session.planned_duration} min)</em>
                </header>
            `;

      if (session.actual_duration !== null) {
        // Session is complete, show the results
        const distraction = session.actual_duration - session.planned_duration;
        content += `
                    <p><strong>Reality:</strong> ${session.actual_activity} (${session.actual_duration} min)</p>
                    <p><strong>Feeling:</strong> ${session.feeling}</p>
                    <footer><strong>Distraction Score:</strong> ${distraction} min</footer>
                `;
      } else {
        // Session is active, show the form to end it
        content += `
                    <form class="end-session-form" data-session-id="${session.id}">
                        <label>Actual Activity:</label>
                        <input type="text" name="actual_activity" required>
                        <label>Actual Duration (min):</label>
                        <input type="number" name="actual_duration" min="0" required>
                        <label>Feeling:</label>
                        <select name="feeling">
                            <option value="Productive">Productive</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Distracted">Distracted</option>
                        </select>
                        <button type="submit">End Session</button>
                    </form>
                `;
      }
      sessionArticle.innerHTML = content;
      historyContainer.appendChild(sessionArticle);
    });
  };

  // --- Event Listener for starting a new session ---
  startSessionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(startSessionForm);
    const data = {
      intention: formData.get("intention"),
      planned_duration: parseInt(formData.get("planned_duration")),
    };

    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    startSessionForm.reset();
    fetchAndDisplaySessions(); // Refresh the list
  });

  // --- Event Listener for ending a session (using event delegation) ---
  historyContainer.addEventListener("submit", async (e) => {
    if (e.target.classList.contains("end-session-form")) {
      e.preventDefault();
      const form = e.target;
      const sessionId = form.dataset.sessionId;
      const formData = new FormData(form);
      const data = {
        actual_activity: formData.get("actual_activity"),
        actual_duration: parseInt(formData.get("actual_duration")),
        feeling: formData.get("feeling"),
      };

      await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      fetchAndDisplaySessions(); // Refresh the list
    }
  });

  // --- Initial load of sessions ---
  fetchAndDisplaySessions();
});
// --- Code for Scheduled Intentions ---
const scheduleForm = document.getElementById("schedule-intention-form");
const upcomingContainer = document.getElementById(
  "upcoming-intentions-container"
);

const fetchAndDisplayScheduled = async () => {
  const response = await fetch("/api/schedule");
  const intentions = await response.json();
  upcomingContainer.innerHTML = "";

  if (intentions.length === 0) {
    upcomingContainer.innerHTML =
      "<p>No upcoming intentions. Plan your day!</p>";
    return;
  }

  intentions.forEach((intention) => {
    const article = document.createElement("article");
    const scheduledTime = new Date(intention.scheduled_time).toLocaleString();
    article.innerHTML = `
            <p>
                <strong>${intention.title}</strong> (${
      intention.planned_duration
    } min)
                <br>
                <em>Scheduled for: ${scheduledTime}</em>
                ${
                  intention.is_completed
                    ? "<span>- ✅ Completed</span>"
                    : `<a href="/focus/${intention.id}" role="button">Start Focus Mode</a>`
                }
            </p>
        `;
    upcomingContainer.appendChild(article);
  });
};

scheduleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(scheduleForm);
  const data = {
    title: formData.get("title"),
    scheduled_time: formData.get("scheduled_time"),
    planned_duration: parseInt(formData.get("planned_duration")),
  };

  await fetch("/api/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  scheduleForm.reset();
  fetchAndDisplayScheduled();
});

// Also call this function when the page loads
fetchAndDisplayScheduled();
