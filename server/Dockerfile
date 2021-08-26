FROM python:3.8.1-slim

ENV FLASK_APP "cff"
ENV DATABASE_URL "postgresql://postgres:postgres@localhost:5432/catchfire"
ENV MODEL_FILE "electra_5_19_bert"
ENV TZ="America/Chicago"

ENV INSTALL_PATH "/app"
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    curl=7.64.0-4+deb10u2 \
    redis-server \
    git \ 
    gcc \
    linux-libc-dev \ 
    libc6-dev \
    && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV TINI_VERSION=v0.19.0
RUN curl -OLs https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini && \
    mv ./tini /usr/local/bin/tini && \
    chmod 0755 /usr/local/bin/tini && \
    chown root:root /usr/local/bin/tini

# Create and activate the venv
ENV VIRTUAL_ENV=/venv
RUN mkdir -p ${VIRTUAL_ENV} && \
    python -m venv ${VIRTUAL_ENV}
ENV PATH=${VIRTUAL_ENV}/bin:${PATH} \
    PYTHONPATH=${INSTALL_PATH}

# Install python dependencies
# RUN /venv/bin/pip install --upgrade pip
# RUN /venv/bin/pip install pipenv
RUN pip install --upgrade pip
RUN pip install pipenv
COPY Pipfile Pipfile.lock ${INSTALL_PATH}/
RUN pipenv install --system --deploy

COPY . .

EXPOSE 5000

ENTRYPOINT ["tini", "--"]
CMD gunicorn -c app_unicorn.py --name cff cff:app --access-logfile '-'
# CMD ["gunicorn", "-c", "app_unicorn.py" "--name", "cff", "cff:app" "--access-logfile", "'-'"]
