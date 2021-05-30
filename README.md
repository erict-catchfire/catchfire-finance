# catchfire-finance
Catchfire Finance Project Repository 

## Built With

* [React](https://reactjs.org/)
* [Redux]
* [d3]
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)
* [SQLAlchemy](https://www.sqlalchemy.org/)

## /server Contains the Backend

0. **Go into /server.**
   ```
   sudo apt install redis-server
   pip install pipenv
   ```

1. **Go into /server.**
   ```
   cd server
   ```

2. **Open Python Venv Shell**
   ```
   pipenv shell
   ```

### Setup
3. **Download python dependencies**
   ```
   pipenv install
   ```

4. **Export Environment Variables; Add to load-step scripts for permanence**
   ```
   (optional) export FLASK_DEBUG=1
   export FLASK_APP=cff
   export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/catchfire'
   
   # Log in to IEX Cloud:
   export IEX_SANDBOX='<sandbox_token>'
   export IEX_PROD='<token>' 
   
   # For right now:
   export PYTHONPATH=.
   ```
   
5. **Setup Timescaledb**
   ```
   sudo add-apt-repository ppa:timescale/timescaledb-ppa
   sudo apt update
   sudo apt install timescaledb-2-postgresql-13
   
   # Tune Timescale; Choose defaults for now
   sudo timescaledb-tune
   
   # Restart Postgres
   sudo service postgresql restart
   
   # Set "postgres" user password
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'password';
   ```
   
6. **Generate Database**
   ```
   cd server
   python manage.py db upgrade
   ```
   
7. **[SNAPSHOT DATA] Populate Database**
   
   _NOTE: Skip this step, if you would prefer to just grab_
   ```
   cd server
   
   1) flask defaults all
   -> which contains: "flask defaults sites", and "flask defaults tickers"
   2) flask twitter db_seed (add: --seed_sentiment=True, to seed sentiments)
   ```
   **Seed Data**
   
   We currently have 4 Hashtags/Cashtags with seed data; All data is based on March 2021.
   
   Google, Microsoft, and Amazon are the entire month of march. 
   
   Gamestop is ridiculous, and has 4-5x tweets, the other 3 combined, in a week period - so we only have a week.
   ```
   # Google
   snscrape --jsonl --progress --since 2021-03-01 twitter-search "'#GOOG OR $GOOG' \ 
        -is:retweet lang:en until:2021-04-01" > goog_march_2021.json
   
   # Microsoft
   snscrape --jsonl --progress --since 2021-03-01 twitter-search "'#MSFT OR $MSFT' \
        -is:retweet lang:en until:2021-04-01" > msft_march_2021.json
   
   # Amazon
   snscrape --jsonl --progress --since 2021-03-01 twitter-search "'#AMZN OR $AMZN' \
        -is:retweet lang:en until:2021-04-01" > amzn_march_2021.json
   
   # Gamestop
   snscrape --jsonl --progress --since 2021-03-24 twitter-search "'#GME OR $GME' \
        -is:retweet lang:en until:2021-04-01" > gme_last_week_of_march_2021.json
   ```
   
   I'm not entirely certain that the `-is:retweet` is actually preventing retweets from being picked up, or maybe
   there just aren't many retweets in the tags we're looking for. I've tried running with and without.
   We need a couple tweaks to correctly ingest retweets and the data around them - but we can figure that out later.


7. **[LIVE DATA INGESTION] Start ingestion jobs**
   **Add new ticker:**
   ```
   cd server
   flask twitter add_ticker <ticker> [<ticker> <ticker>...]
   > Do you want to save the following tickers: [<ticker list>]? (y/n)
        - Y; Saves a database row for the new ticker
        - N; Skip
   > Trigger historical data gathering for: [<ticker list>]? (y/n)
        - Y; Triggers background job to scrape for all past tweets
        - N; Skip
   > Trigger realtime data gathering for: [<ticker list>]? (y/n)
        - Y; Triggers background job for maintaining "live" tweet data
        - N; Skip
   ```
   **Save the ticker:**
   - Only say "Y" when it is a brand new ticker; It won't do anything if you try to save a ticker again.

   **Historical data gathering:**
   - This triggers a job chain that will passively populate the entire history of tweets for a ticker. 
   - This is relatively lightweight and reliable:
     - 500 tweets are scraped and saved into a temporary file 
     - then processed, and the temporary file is removed,
     - then the document objects are saved, and another job is kicked off to get the next 500.
       
   **"Realtime" data gathering:**
   - Depending on how many tweets have been posted since the last run, the behavior may very:
   - Query for 500 tweets; Ingest; Save 
        1) If exactly 500 tweets were found -> immediately trigger another job, because there are potentially more.
        2) If less than 500 were found -> Queue a job to check again in 30 minutes.


### Run
   ```
   flask run & rq-dashboard & rq worker historical --with-scheduler & rq worker realtime & --with-scheduler
   ```
   **To manage background tasks:**
   ```
   # Find them
   jobs
   
   # Kill them
   kill %<job_number>
   ```

### Useful Functions
#### Code formatting
- Python Config: `pyproject.toml`
- Python Formatting
  ```
  # Check files to be touched
  black --check .
  
  # Run formatter on touched files
  black .
  ```
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
   
2. Install dependencies
   ```
   npm i
   ```

3. Start Site
   ```
   npm start
   ```
