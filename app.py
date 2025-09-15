import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

# --- APP & DATABASE CONFIGURATION ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'a_very_secret_key_that_should_be_changed' # Change this!
basedir = os.path.abspath(os.path.dirname(__file__))
# Ensure the instance folder exists
instance_path = os.path.join(basedir, 'instance')
os.makedirs(instance_path, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'database.db')
db = SQLAlchemy(app)

# --- FLASK-LOGIN CONFIGURATION ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- DATABASE MODELS ---
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    sessions = db.relationship('UsageSession', backref='owner', lazy=True)
    scheduled_intentions = db.relationship('ScheduledIntention', backref='owner', lazy=True)

class UsageSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    intention = db.Column(db.String(300), nullable=False)
    planned_duration = db.Column(db.Integer, nullable=False)
    actual_duration = db.Column(db.Integer, nullable=True)
    actual_activity = db.Column(db.Text, nullable=True)
    feeling = db.Column(db.String(50), nullable=True)

class ScheduledIntention(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(300), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    planned_duration = db.Column(db.Integer, nullable=False)
    is_completed = db.Column(db.Boolean, default=False)

# --- AUTHENTICATION ROUTES ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Your login logic will go here
    pass

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if username already exists
        user = User.query.filter_by(username=username).first()
        if user:
            # You would typically flash a message here
            return redirect(url_for('register'))

        # Hash the password for security
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        # Create a new user and save to the database
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        # Log the user in and redirect to the dashboard
        login_user(new_user)
        return redirect(url_for('dashboard'))
    
    return render_template('register.html')
    pass

@app.route('/logout')
@login_required
def logout():
    # Your logout logic will go here
    pass

# --- RENDER TEMPLATE ROUTES ---
@app.route('/')
@login_required
def dashboard():
    return render_template('index.html')

@app.route('/focus/<int:intention_id>')
@login_required
def focus_mode(intention_id):
    # Your logic to get the intention and render the focus page
    return render_template('focus.html')

# --- API ENDPOINTS ---
# API for Manual Session Journaling
@app.route('/api/sessions', methods=['GET', 'POST'])
@login_required
def handle_sessions():
    if request.method == 'POST':
        # Logic to CREATE a new session (log intention)
        pass
    else: # GET
        # Logic to READ all sessions for the dashboard
        pass

@app.route('/api/sessions/<int:session_id>', methods=['PUT'])
@login_required
def update_session(session_id):
    # Logic to UPDATE a session (log reality)
    pass

# API for Scheduled Intentions
@app.route('/api/schedule', methods=['GET', 'POST'])
@login_required
def handle_schedule():
    if request.method == 'POST':
        # Logic to CREATE a new scheduled intention
        pass
    else: # GET
        # Logic to READ all scheduled intentions
        pass

@app.route('/api/schedule/<int:intention_id>/complete', methods=['PUT'])
@login_required
def complete_intention(intention_id):
    # Logic to mark a scheduled intention as complete
    pass

# --- DATABASE CREATION & APP RUN ---
if __name__ == '__main__':
    with app.app_context():
        # This will create the 'instance' folder and the database file if they don't exist
        db.create_all()
    app.run(debug=True)