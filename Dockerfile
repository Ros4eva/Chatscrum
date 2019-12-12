FROM centos:7
LABEL org.label-schema.schema-version="1.0" \
    org.label-schema.name="Selenium with Headless Chrome and CentOS" \
    org.label-schema.vendor="liguoliang.com" \
    org.label-schema.license="GPLv2" \
    org.label-schema.build-date="20180817"

# install necessary tools

RUN yum -y install wget epel-release
RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install httpd && \
    yum clean all

RUN yum install unzip -y
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN curl -O  https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
RUN yum install google-chrome-stable_current_x86_64.rpm -y
RUN yum install  -y https://centos7.iuscommunity.org/ius-release.rpm
RUN yum install  -y  python36u
RUN yum install  -y  python36u-pip
# install selenium
RUN /bin/pip3.6 install selenium

# download chromedriver
RUN mkdir /opt/chrome
RUN curl -O https://chromedriver.storage.googleapis.com/2.41/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip -d /bin
RUN mkdir /qa/
# copy the testing python script
ENV ENVIRONMENT=environment
COPY . /qa/
WORKDIR /qa/
CMD ./start.sh