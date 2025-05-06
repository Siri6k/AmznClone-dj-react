#Stage 1: Build Frontend
FROM node:20 as build-stage


WORKDIR /code

COPY ./Frontend/ecommerce_inventory/ /code/Frontend/ecommerce_inventory/

WORKDIR /code/Frontend/ecommerce_inventory/ 

#Installing packages
RUN yarn install

#Building the frontend
RUN yarn run build

#Stage 2: Build BAckend
FROM python:3.12.5

#Set Environnement variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the Django project (submodule) to the container
COPY ./BAckend/EcommerceInventory/ /code/BAckend/EcommerceInventory/

# Upgrade pip and setuptools
RUN pip install --upgrade pip setuptools

# Install the required packages
RUN pip install -r /code/BAckend/EcommerceInventory/requirements.txt 
COPY --from=build-stage ./code/Frontend/ecommerce_inventory/build /code/BAckend/EcommerceInventory/static/
COPY --from=build-stage ./code/Frontend/ecommerce_inventory/build/static /code/BAckend/EcommerceInventory/static/
COPY --from=build-stage ./code/Frontend/ecommerce_inventory/build/index.html /code/BAckend/EcommerceInventory/EcommerceInventory/templates/index.html

# Configure secret key
ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY


#Run Migration command
RUN python ./BAckend/EcommerceInventory/manage.py migrate

#Run Django CollectStatic
RUN python ./BAckend/EcommerceInventory/manage.py collectstatic --noinput

#Expose the port
EXPOSE 80

WORKDIR /code/BAckend/EcommerceInventory

#Run the Django Server
CMD ["gunicorn", "EcommerceInventory.wsgi:application", "--config", "gunicorn.conf.py"]