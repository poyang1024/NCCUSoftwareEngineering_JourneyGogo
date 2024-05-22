import pandas as pd

comments = pd.read_csv('台北市_all_comments.csv')
detailed = pd.read_csv('台北市_all_detailed_info.csv', index_col=0)

# rename the column name to make the column name of csv and model consistent
comments = comments.rename(columns={"spot_id": "attraction_id", "comment": "content"})
detailed = detailed.rename(columns={"spot_id": "id", "location": "city", "type": "tag"})

# convert comment_amount from string to int
detailed['comment_amount'] = detailed['comment_amount'].apply(lambda row: int(row.replace(',', '')))

# add serial number to comments
comments['id'] = range(1, len(comments)+1)
comments = comments.loc[: , ['id', 'attraction_id', 'content']]

# remove duplicated data
existing = {}
dup = []
for i in range(len(detailed['id'])):
    if detailed['id'][i] in existing:
        dup.append(i)
    else:
        existing[detailed['id'][i]] = i
detailed = detailed.drop(dup)

# export the adjusted version of csv
comments.to_csv('modified_taipei_comments.csv', index=False)
detailed.to_csv('modified_taipei_detailed_info.csv', index=False)

# print(len(detailed) == len(set(detailed['id'])))