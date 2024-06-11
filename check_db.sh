#!/bin/bash

# Variables
PGUSER="postgres"
PGDB="app"

# Connect to PostgreSQL and check tables
psql -U $PGUSER -d $PGDB <<EOF
-- Check all tables
\dt

-- Check data in attractions table
SELECT * FROM attractions LIMIT 5;

-- Check data in comment table
SELECT * FROM comment LIMIT 5;
EOF
