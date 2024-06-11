#!/bin/bash

# Variables
PGUSER="postgres"
PGDB="app"
ATTRACTIONS_FILE="/tmp/attractions_info_all.csv"
COMMENTS_FILE="/tmp/comment_all.csv"

# Import data
psql -U $PGUSER -d $PGDB <<EOF
COPY attractions(id, city, tag, name, url, rating, comment_amount, address, phone, pic_url, business_hour)
FROM '$ATTRACTIONS_FILE'
DELIMITER ','
CSV HEADER;

COPY comment(id, attraction_id, content)
FROM '$COMMENTS_FILE'
DELIMITER ','
CSV HEADER;
EOF
