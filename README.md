## Generar JWT_SECRET
openssl rand -base64 64

## Instalaciones
npm install --save @nestjs/typeorm typeorm pg @nestjs/config
npm install class-validator class-transformer
npm add @nestjs/mapped-types

# Instalar el paquete de encriptación
npm add bcrypt 
npm add -D @types/bcrypt

# Instalar JWT
npm add jsonwebtoken
npm add -D @types/jsonwebtoken

## Users
nest g mo modules/users/users --flat --no-spec
nest g s modules/users/services/users --flat --no-spec
nest g co modules/users/controllers/users --flat --no-spec

## Authentication
nest g mo modules/auth/auth --flat --no-spec
nest g s modules/auth/services/auth --flat --no-spec
nest g co modules/auth/controllers/auth --flat --no-spec

## Migrations
npm run migration:generate
npm run migration:run

## Guard
nest g gu modules/auth/guard/auth --flat --no-spec
nest g gu modules/auth/guard/access-level --flat --no-spec

## Devices
nest g mo modules/devices/devices --flat --no-spec
nest g s modules/devices/services/devices --flat --no-spec
nest g co modules/devices/controllers/devices --flat --no-spec

