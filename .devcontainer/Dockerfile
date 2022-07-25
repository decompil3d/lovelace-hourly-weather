FROM ghcr.io/ludeeus/devcontainer/integration:latest
WORKDIR /workspaces
COPY .devcontainer/install-node.sh /tmp/install-node.sh
RUN bash /tmp/install-node.sh
RUN pip install thefuck
RUN apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install --no-install-recommends \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 xauth xvfb
EXPOSE 8123
EXPOSE 5555
