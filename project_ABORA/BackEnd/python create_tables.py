# create_tables.py
from app.db import Base, engine
Base.metadata.create_all(bind=engine)