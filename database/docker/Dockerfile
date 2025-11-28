FROM postgres:13

# Copiar scripts de inicialización
COPY init.sql /docker-entrypoint-initdb.d/

# Saludable para contenedor
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD pg_isready -U admin -d gymdb

EXPOSE 5432