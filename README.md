## Generar JWT_SECRET
openssl rand -base64 64

## Instalaciones
npm install --save @nestjs/typeorm typeorm pg @nestjs/config
npm install class-validator class-transformer
npm add @nestjs/mapped-types

# Instalar el paquete de encriptación
npm add bcrypt 
npm add -D @types/bcrypt

## Users
nest g mo modules/users/users --flat --no-spec
nest g s modules/users/services/users --flat --no-spec
nest g co modules/users/controllers/users --flat --no-spec

## Migrations
npm run migration:generate
npm run migration:run

