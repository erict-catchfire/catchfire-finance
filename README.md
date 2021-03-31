# catchfire-finance
Catchfire Finance Project Repository 

## Built With

* [React](https://reactjs.org/)
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)
* [SQLAlchemy](https://www.sqlalchemy.org/)

## /server Contains the Backend

1. Go into /server.
   ```
   cd server
   ```

2. Open Python Venv Shell
   ```
   pipenv shell
   ```

### Setup
3. Download python dependencies
   ```
   pipenv install
   ```

4. Export Enviromental Variables; Add to load-step scripts for permanence
   ```
   (optional) export FLASK_DEBUG=1
   export FLASK_APP=cff
   export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/catchfire'
   
   # For right now:
   export PYTHONPATH=.
   ```
   
5. Setup Timescaledb
   ```
   sudo add-apt-repository ppa:timescale/timescaledb-ppa
   sudo apt update
   sudo apt install timescaledb-2-postgresql-13
   
   # Tune Timescale; Choose defaults for now
   sudo timescaledb-tune
   
   # Restart Postgres
   sudo service postgresql restart
   ```
   
6. Generate Database
   ```
   cd server
   python manage.py db upgrade
   ```
   
7. Populate Database [IN PROGRESS]
   ```
   cd server
   flask defaults sites
   flask defaults tickers
   [MORE TO COME]
   ```

### Run
   ```
   flask run
   ```

### Useful Functions
#### Database operations
- Migrations
   ```
   # After adding any additional db.Model classes, or altering existing classes:
  
   python manage.py db migrate -m "<short message about what changed>"
   ```
- Upgrades
   ```
  # After creating a new migration, or pulling down code with a new migration:
  
  python manage.py db upgrade
  ```

#### Python Package Management [[pipenv]](https://pipenv.pypa.io/en/latest/#install-pipenv-today)
- Installing a new package
  ```
  pipenv install <package>
  ```
  _Do not bypass using pipenv, for pip or any other package manager. Libraries are tracked and maintained by pipenv._


- Download all packages specified in the lock files
  ```
  pipenv sync
  ```
## /client Contains the Frontend

1. Go into /client.
   ```
   cd client/react-catchfire
   ```

2. Start Site
   ```
   npm start
   ```
