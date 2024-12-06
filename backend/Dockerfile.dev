FROM python:3.11

WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# CHANGE THIS WHEN DEPLOYING PLS
ENV OAUTHLIB_INSECURE_TRANSPORT=1

CMD flask run --host='0.0.0.0' --debug
