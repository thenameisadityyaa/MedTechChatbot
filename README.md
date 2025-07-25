# 🏥 HealthAssist – Medicine Recommendation & AI Chat Assistant

## 🚀 Problem Statement 3 – AI-Powered Diagnostic Chatbot for Rural Healthcare Accessibility

In rural areas, timely healthcare access is limited, impacting the quality of medical interventions. **HealthAssist** is our solution — an accessible, AI-driven chatbot platform (voice or text-based) that interactively assesses basic health symptoms, categorizes potential health issues, generates detailed preliminary diagnostic reports, and provides referrals to qualified medical practitioners in nearby urban centers.

---

## 🎯 Core Objectives

- ✅ Simplified, multilingual, interactive user interface  
- ✅ Accurate AI-driven initial diagnosis and reporting  
- ✅ Integration of referral mechanisms for specialized medical care  
- ✅ Accessible via basic mobile devices for broad reach  

---

## 🧠 About the Project

**HealthAssist** is an intelligent, web-based health assistant that provides:

- 📊 Symptom-based disease predictions  
- 💊 Personalized medicine & precautionary recommendations  
- 🤖 AI-driven chat support via LLaMA3 model running locally  
- 🎤 Voice input & output for hands-free accessibility

---

## 🔑 Key Features

### 🤖 AI Chat Assistant
Engage with a conversational assistant powered by the **LLaMA3** large language model via **Ollama**. It answers health-related questions, provides general advice, and guides users across the platform.

### 🩺 Symptom-Based Disease Prediction
Users can input symptoms and receive a list of possible diseases with **confidence scores** using data-driven prediction.

### 💡 Personalized Recommendations
Each diagnosis comes with:
- Recommended medicines  
- Precautionary steps  
- Dietary guidelines  
- Workout suggestions  
- Specialist referrals  

### 🗣️ Voice Interaction
Supports **speech-to-text** (voice input) and **text-to-speech** (voice output), increasing accessibility for all users.

### 📚 Comprehensive Medical Datasets
Structured CSV datasets for:
- Symptoms  
- Diseases  
- Medications  
- Diets  
- Workouts  
- Precautions  

---

## 🛠️ Tech Stack

### Frontend
- **HTML, CSS, JavaScript** – Responsive and interactive UI  
- **Web Speech API** – Voice recognition and synthesis  
- **Fetch API** – API communication  

### Backend
- **Python (Flask)** – Main backend with RESTful APIs  
- **Pandas** – Data processing for CSV datasets  
- **Flask-CORS** – Enable secure frontend-backend interaction  
- **Requests** – Interface with Ollama LLM  

### AI/LLM Integration
- **Ollama** – Runs **LLaMA3** model locally  
- **LLaMA3** – For intelligent, real-time conversational responses  

### Data Storage
- **CSV files** – Store medical data used for predictions and suggestions  

---

## 🗂️ Project Structure

📁 dataset/ # All medical CSV datasets
├── diseases.csv
├── symptoms.csv
├── precautions.csv
├── diets.csv
├── medications.csv
├── workouts.csv

📁 backend/
└── app.py # Flask application with API routes

📁 frontend/
├── chat.html # Chat UI
├── chat.css # Styling
├── chat.js # Chat logic
├── home.html # Home page
├── about.html # About section
└── contact.html # Contact page



---

## 💡 Why HealthAssist?

> **Bridging rural healthcare gaps** with a powerful blend of medical data and conversational AI.

- 🌐 Accessible anytime, anywhere — even in low-connectivity areas  
- 🧬 Combines rule-based prediction with smart AI interaction  
- 🛡️ Ensures user privacy by keeping LLMs local  
- 🔄 Continuously extensible with more data and features  

---

## 📢 Future Enhancements

- 🌍 Multilingual language support  
- 📱 Android/iOS PWA version  
- 🧑‍⚕️ Real-time doctor connectivity via API  
- 📊 User health dashboard & progress tracking  

---

## 👥 Team

**Team ID:** `TEAM(MB6)3-NO:-3RD_TEAM_164`

**Team Members:**
- 🧠 Pragnya Samal  
- 💡 Sayed Golam Kibriya  
- 🔍 AMLANPRATIK  
- 🛠️ Aditya Sharma  

> Built with ❤️ by a passionate team of innovators for the **Learnathon 4.0**.

---

## 📎 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Repository

[🔗 GitHub Repo – MedTechChatbot](https://github.com/thenameisadityyaa/MedTechChatbot)

---

## 📷 Demo Preview

![HealthAssist Preview](./assets/demo-preview.png)

---