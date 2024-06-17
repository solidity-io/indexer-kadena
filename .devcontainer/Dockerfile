ARG NODE_VERSION="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${NODE_VERSION}

ARG INSTALL_DOCKER_CLI="false"
RUN if [ "${INSTALL_DOCKER_CLI}" = "true" ]; then \
    sudo apt-get update \
    && sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && sudo apt-get update \
    && sudo apt-get install -y docker-ce-cli; \
    fi

ARG INSTALL_AWS_CLI="false"
RUN if [ "${INSTALL_AWS_CLI}" = "true" ]; then \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && sudo ./aws/install \
    && rm -rf awscliv2.zip ./aws; \
    fi

ARG INSTALL_TERRAFORM="false"
ARG TERRAFORM_VERSION="1.7.3"
RUN if [ "${INSTALL_TERRAFORM}" = "true" ]; then \
    wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && sudo mv terraform /usr/local/bin/ \
    && rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip; \
    fi