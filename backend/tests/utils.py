import random
import string

from app.db.models.models import User
from app.config.config import settings
from app.auth.auth import get_hashed_password, create_access_token


# necessary test elements setup

def generate_random_string(lowercase=False, n=16) -> str:
    # if lowercase = True
    # specify the string consists of Lowercase letters and Numbers, like email address
    # the string is combined with Uppercase, Lowercase letters and Numbers By Default
    chars = (string.ascii_lowercase + string.digits) if lowercase else (string.ascii_letters + string.digits)
    return "".join(random.choices(chars, k = n))


def generate_random_email() -> str:
    return f'{generate_random_string(lowercase=True)}@{generate_random_string(lowercase=True, n=8)}.com'

def create_test_normal_user(session):
    test_email = generate_random_email()
    test_pw = get_hashed_password(generate_random_string())
    user = User(email=test_email,
                hashed_password=test_pw,
                last_name=f'test_user{random.randint(1,999)}')
    
    session.add(user)
    session.commit()
    session.refresh(user)

    return user

def create_test_superuser(session):
    superuser = User(email=settings.FIRST_SUPERUSER, 
                     hashed_password=get_hashed_password(settings.FIRST_SUPERUSER_PASSWORD),
                     last_name='test_admin',
                     is_superuser=True)
    session.add(superuser)
    session.commit()
    session.refresh(superuser)
    return superuser

def generate_test_user_auth_headers(user):
    token = create_access_token(user.uuid)
    return {"Authorization": f'Bearer {token}'}

def get_test_user_auth_headers(client, email, password):
    data = {'username': email,
            'password': password}
    
    response = client.post(f'{settings.API_V1_STR}/login/access-token', data=data)
    token = response.json()['access_token']

    return {"Authorization": f'Bearer {token}'}

def pick_city():
    citys = ['連江縣', '新竹縣', '台北市', '台南市', '新北市', '高雄市', '苗栗縣', '宜蘭縣', '澎湖縣',
       '嘉義市', '南投縣', '桃園市', '金門', '基隆市', '新竹市', '台中市', '台東縣', '雲林縣',
       '屏東縣', '花蓮縣', '彰化縣', '嘉義縣']
    i = random.randint(0, len(citys) - 1)
    return citys[i]

def pick_keyword():
    keywords = ['飯店', '民宿', '商旅', '酒店', 'Hotel','Bar', '烤肉', '食堂', '博物館', '農場', '溫泉',
                '火鍋', '餐廳', '觀光工廠', '文化園區', '公園', '咖啡廳', '海鮮', '老街', '餐酒館', '步道',
                '鐵板燒', '日式料理']
    i = random.randint(0, len(keywords) - 1)
    return keywords[i]
