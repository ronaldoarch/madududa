#!/bin/bash

echo "========================================"
echo "   Página K18 - Servidor Local"
echo "========================================"
echo ""
echo "Iniciando servidor Python na porta 8000..."
echo ""
echo "Acesse: http://localhost:8000"
echo ""
echo "Para parar o servidor, pressione Ctrl+C"
echo "========================================"
echo ""

python3 -m http.server 8000
