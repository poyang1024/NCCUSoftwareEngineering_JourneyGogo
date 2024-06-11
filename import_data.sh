COPY attractions(id, city, tag, name, url, rating, comment_amount, address, phone, pic_url, business_hour)
FROM '/tmp/attractions_info_all.csv'
DELIMITER ','
CSV HEADER;

COPY comment(id, attraction_id, content)
FROM '/tmp/comment_all.csv'
DELIMITER ','
CSV HEADER;

\q