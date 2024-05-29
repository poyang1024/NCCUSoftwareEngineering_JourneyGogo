from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text, Date, DateTime, DECIMAL, Float
from sqlalchemy.orm import relationship
from app.db.db_setup import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = 'users'

    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    provider = Column(String, nullable=True)
    picture = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    lists = relationship("ListBase", backref="user")

class Attraction(Base):
    __tablename__ = 'attractions'
    
    id = Column(Integer,primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    tag = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    url = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    comment_amount = Column(Integer, nullable=True)
    phone = Column(String(100), nullable=True)
    pic_url = Column(String, nullable=True)
    business_hour = Column(Text, nullable=True)

    comments = relationship("Comment", backref="attraction")

class ListBase(Base):
    __tablename__ = 'list_info'
   
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, default='我的最愛')
    user_id = Column(UUID(as_uuid=True), ForeignKey(User.uuid))
    description = Column(Text, nullable=True)
    type = Column(Integer, default=0) # 0 for favoriates, 1 for scheduling

    attractions = relationship("SavedAttraction", backref="attractions")

    __mapper_args__ = {
        "polymorphic_identity": 0, # attractions list = favoriates
        "polymorphic_on": type
    }

class Schedules(ListBase):
    __tablename__ = 'schedules'
    
    id = Column(Integer, ForeignKey(ListBase.id), primary_key=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": 1 # schedules
    }

class SavedAttraction(Base):
    __tablename__ = 'saved_attraction'

    id = Column(Integer, primary_key=True, autoincrement=True)
    saved_list = Column(Integer, ForeignKey(ListBase.id))
    attraction = Column(Integer, ForeignKey(Attraction.id))
    type = Column(Integer, default=0) # 0 for saved, 1 for scheduled

    __mapper_args__ = {
        "polymorphic_identity": 0, # saved attractions
        "polymorphic_on": type
    }

class ScheduledAttraction(SavedAttraction):
    __tablename__ = 'scheduled_attraction'

    id = Column(Integer, ForeignKey(SavedAttraction.id), primary_key=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)

    __mapper_args__ = {
        "polymorphic_identity": 1 # scheduled attraction
    }

class Comment(Base):
    __tablename__ = 'comment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    attraction_id = Column(Integer, ForeignKey(Attraction.id))
    content = Column(Text)


class Item(Base):
    __tablename__='items'
    id=Column(Integer,primary_key=True)
    name=Column(String(255),nullable=False,unique=True)
    description=Column(Text)
    price=Column(Integer,nullable=False)
    on_offer=Column(Boolean,default=False)

    def __repr__(self):
        return f"<Item name={self.name} price={self.price}>"
    