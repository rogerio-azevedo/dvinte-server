#!/bin/bash

# Criar diretórios para uploads
mkdir -p /var/app/current/tmp/uploads/portraits
mkdir -p /var/app/current/tmp/uploads/tokens

# Definir permissões
chmod 755 /var/app/current/tmp/uploads/portraits
chmod 755 /var/app/current/tmp/uploads/tokens

# Garantir que o processo Node.js pode escrever
chown -R webapp:webapp /var/app/current/tmp/uploads/ 