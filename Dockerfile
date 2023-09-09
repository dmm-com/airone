FROM ubuntu:22.04

RUN apt-get update \
    && apt-get install --no-install-recommends --yes \
    lsb-release

# hadolint ignore=DL3013, DL3008
RUN apt-get update \
    && apt-get install --no-install-recommends --yes \
    python3 \
    python3-dev \
    python3-pip \
    libldap2-dev \
    libsasl2-dev \
    libxmlsec1-dev \
    libmysqlclient-dev \
    pkg-config \
    screen \
    gettext \
    gcc \
    git \
    vim \
    && apt-get upgrade --yes \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir --upgrade \
    pip \
    setuptools \
    wheel \
    j2cli


# Make the user ID the same to share the directory with the host OS
ARG USER_ID=1000
RUN useradd -u $USER_ID -m -s /bin/bash ubuntu
USER ubuntu

WORKDIR /home/ubuntu

COPY requirements.txt /home/ubuntu/
COPY requirements-dev.txt /home/ubuntu/

RUN pip install --user -r requirements.txt
RUN pip install --user -r requirements-dev.txt
