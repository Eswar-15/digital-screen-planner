document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const completeBtn = document.getElementById("complete-btn");

  let timeLeft = plannedDuration * 60; // Convert minutes to seconds

  const timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
    }
  }, 1000);

  completeBtn.addEventListener("click", async () => {
    clearInterval(timerInterval); // Stop the timer

    await fetch(`/api/schedule/${intentionId}/complete`, {
      method: "PUT",
    });

    // Redirect back to dashboard after a short delay
    alert("Intention marked as complete! Redirecting...");
    window.location.href = "/";
  });
});
