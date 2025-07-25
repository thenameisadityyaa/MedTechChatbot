document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomForm");
  const symptomInput = document.getElementById("symptomInput");
  const suggestionsBox = document.getElementById("suggestions");
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");
  const voiceBtn = document.getElementById("voiceBtn");
  const voiceStatus = document.getElementById("voice-status");

  // 🔍 Auto-Suggestion
  symptomInput.addEventListener("input", async () => {
    const lastSymptom = symptomInput.value.split(',').pop().trim().toLowerCase();
    if (!lastSymptom || lastSymptom.length < 2) {
      suggestionsBox.classList.add("hidden");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/suggestions?q=${lastSymptom}`);
      const suggestions = await res.json();
      if (!suggestions.length) {
        suggestionsBox.classList.add("hidden");
        return;
      }

      suggestionsBox.innerHTML = "";
      suggestions.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        li.addEventListener("click", () => {
          const parts = symptomInput.value.split(',');
          parts[parts.length - 1] = ` ${s}`;
          symptomInput.value = parts.join(',').trim();
          suggestionsBox.classList.add("hidden");
        });
        suggestionsBox.appendChild(li);
      });
      suggestionsBox.classList.remove("hidden");
    } catch (err) {
      console.error("❌ Suggestion error:", err);
      suggestionsBox.classList.add("hidden");
    }
  });

  // 🎤 Voice recognition
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      voiceStatus.classList.remove("hidden");
      voiceStatus.textContent = "🎙️ Listening...";
    };

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim().toLowerCase().replace(/\s+/g, ", ");
      symptomInput.value = transcript;
      voiceStatus.classList.add("hidden");
      form.requestSubmit(); // Auto submit
    };

    recognition.onerror = (event) => {
      voiceStatus.textContent = "❌ Mic error.";
      console.error("Mic error:", event.error);
      setTimeout(() => voiceStatus.classList.add("hidden"), 2000);
    };

    recognition.onend = () => {
      voiceStatus.classList.add("hidden");
    };

    voiceBtn.addEventListener("click", () => {
      recognition.start();
    });
  } else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = "🎤 Not supported";
  }

  // 📬 Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = symptomInput.value.trim();
    if (!input) {
      result.classList.remove("hidden");
      result.innerHTML = "<span style='color:red;'>Please enter symptoms.</span>";
      return;
    }

    result.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
      const predictRes = await fetch("http://127.0.0.1:5000/api/ml_predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: input }),
      });

      const predictData = await predictRes.json();
      if (!predictRes.ok) throw new Error(predictData.error || "Prediction failed");

      const detailRes = await fetch(`http://127.0.0.1:5000/api/details?disease=${encodeURIComponent(predictData.predicted_disease)}`);
      const detailData = await detailRes.json();
      if (!detailRes.ok) throw new Error(detailData.error || "Details fetch failed");

      loading.classList.add("hidden");
      result.classList.remove("hidden");
      result.innerHTML = `
        <strong>🤖 Predicted Disease:</strong> ${predictData.predicted_disease}<br>
        <strong>Possibility:</strong> ${predictData.confidence}<br><br>
        <strong>Description:</strong> ${detailData.description}<br>
        <strong>Medicine:</strong> ${detailData.medicine.join(", ")}<br>
        <strong>Precautions:</strong> ${detailData.precautions.join(", ")}<br>
        <strong>Diet:</strong> ${detailData.diet.join(", ")}<br>
        <strong>Workout:</strong> ${detailData.workout}<br>
        <strong>Recommended Specialist:</strong> ${detailData.specialist}
      `;

      // 🧠 Store result in localStorage for health history
      const healthHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd

      healthHistory.push({
        date: formattedDate,
        symptoms: input,
        severity: "Not specified",
        medicines: detailData.medicine.join(", "),
        dosage: "N/A",
        feedback: "",
      });

      localStorage.setItem("healthHistory", JSON.stringify(healthHistory));

    } catch (err) {
      loading.classList.add("hidden");
      result.classList.remove("hidden");
      result.innerHTML = `<span style="color:red;">Error: ${err.message}</span>`;
    }
  });
});
