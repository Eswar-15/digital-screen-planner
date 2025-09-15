# Digital Screen Planner

**Digital Screen Planner** is a full-stack web application designed to help users build a more mindful and intentional relationship with their technology.
Instead of passively tracking screen time, this tool empowers users to proactively plan their digital sessions and reflect on their habits, 
bridging the gap between intention and action.

## ## Core Concept

The project's foundation is the principle of **Intention vs. Reality**. While standard screen time apps provide data, this application provides insight.
By having users log their intended use *before* a session and their actual use *after*, it generates a tangible **"Distraction Score"**, 
offering a unique and powerful tool for self-reflection and habit formation.

## ## Key Features

The application is built around three core, interconnected features:

### ### 1. Session Journaling (Reactive)
-   Log phone usage sessions after they occur by defining the original plan (intention and planned duration) and the outcome (actual activity and duration).
-   The app automatically calculates a **Distraction Score** (Actual Time - Planned Time) for each entry, quantifying the level of distraction.
-   Users can also add a feeling (e.g., Productive, Distracted) to add emotional context to their usage patterns.

### ### 2. Scheduled Intentions (Proactive)
-   Plan future phone usage by scheduling intentions with a specific goal, date, time, and planned duration.
-   View a list of all upcoming scheduled tasks on the main dashboard, encouraging proactive time management.
-   This feature shifts the user from a reactive to a proactive mindset.

### ### 3. Focus Mode
-   Launch a minimalist, distraction-free "Focus Mode" for any scheduled intention.
-   This mode displays the user's goal and a large, live countdown timer to foster accountability.
-   After the session, users can mark the intention as complete, which updates its status on the dashboard.

## ## Tech Stack

-   **Backend:** Python with the **Flask** framework.
-   **Database:** **SQLite**, a serverless, file-based database for simplicity and rapid development.
-   **ORM (Translator):** **Flask-SQLAlchemy** to manage database interactions using Pythonic code.
-   **Authentication:** **Flask-Login** for secure user session management.
-   **Security:** **Werkzeug** for securely hashing user passwords, ensuring they are never stored in plaintext.
-   **Frontend:** **HTML**, **CSS**, and vanilla **JavaScript** to create a dynamic and responsive user interface.
-   
## ## How to Run Locally

To get a local copy up and running, follow these simple steps.

### ### Prerequisites
-   Python 3 installed on your machine.
-   Git installed on your machine.

### ### Installation & Setup

1.  **Clone the repository** (replace `your-username` with your actual GitHub username):
    ```sh
    git clone [https://github.com/your-username/digital-screen-planner.git](https://github.com/your-username/digital-screen-planner.git)
    cd digital-screen-planner
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\Activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required packages:**
    ```sh
    pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug
    ```

4.  **Initialize the database:**
    -   (This step is only needed once.)
    ```sh
    flask shell
    ```
    -   Then, inside the shell, type:
    ```py
    from app import db
    db.create_all()
    exit()
    ```

5.  **Run the application:**
    ```sh
    flask run
    ```
    -   The application will be available at `http://127.0.0.1:5000`.
