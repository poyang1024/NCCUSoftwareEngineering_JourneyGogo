import pytest
import random
from app.config.config import settings
from app.db.models.models import Attraction, Comment, ListBase, SavedAttraction
from sqlalchemy import and_

from ..utils import (
    generate_random_email,
    generate_random_string,
    create_test_normal_user,
    generate_test_user_auth_headers,
    get_test_user_auth_headers,
    pick_city,
    pick_keyword
)

def test_get_attraction_by_id_without_login(client, session):
    attraction_id = random.randint(1, 100)
    response = client.get(f'{settings.API_V1_STR}/attractions/{attraction_id}')
    assert response.status_code == 200

    result = response.json()
    assert result
    assert result['attraction']['id'] == attraction_id
    assert result['favorite'] == 0

    comments = session.query(Comment).filter(Comment.attraction_id==attraction_id).all()
    assert len(result['comments']) == len(comments)
    
def test_get_attraction_by_id_after_login(client, session):
    # 補情境
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)

    attraction_id = random.randint(1, 100)
    response = client.get(f'{settings.API_V1_STR}/attractions/{attraction_id}', headers=auth_token)
    assert response.status_code == 200

    result = response.json()
    assert result
    assert result['attraction']['id'] == attraction_id

    saved_lists = session.query(ListBase).filter(ListBase.user_id==user.uuid).all()
    liked = 0
    for saved_list in saved_lists:
        record = session.query(SavedAttraction).\
            filter(and_(SavedAttraction.saved_list==saved_list.id,
                        SavedAttraction.attraction==attraction_id)).first()
        if record:
            liked = 1
            break
    assert result['favorite'] == liked

# test with keyword and city
# can use pick_city and pick_keyword to generate random choice