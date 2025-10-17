# NoteApp
A simple Django note-taking application that allows users to create, edit, share and manage personal or collaborative notes.
- Frontend: vanilla JavaScript with Django Templates.
- Backend: Django REST Framework (`DRF`) with `pytest` test suite.
## Features
The following features are currently implemented:
- CRUD operations on notes and shares.
- Filter notes by content, ownership or permissions.
- Share notes with other users via DAC-style permissions.
- Authentication and authorization using JWT.
## Installation
1. Download or clone repository:  
    ```
    git clone https://github.com/ptayur/note-app.git    
    cd note-app
    ```
2. Create virtual environment and activate it:  
    ```
    python -m venv venv
    ```  
    - On Linux:  
        ```
        source venv/bin/activate
        ```  
    - On Windows:  
        ```
        venv/Scripts/activate
        ```  
3. Install dependencies:  
    ```
    pip install -r requirements.txt
    ```
4. Create a `.env` file in `/note-app/config/`:
    ```markdown
    # .env example  
    SECRET_KEY=your_secret_key # Can be generated with 'django.core.management.utils.get_random_secret_key'
    
    # Optional DB settings
    DB_ENGINE=your_engine_name
    DB_NAME=your_db_name
    DB_USER=your_user_name
    DB_PASSWORD=your_user_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    ```
5. Setup Django:  
    ```
    python manage.py migrate 
    python manage.py runserver
    ```
## License
MIT License &copy; 2025 Yurii Ptashnyk