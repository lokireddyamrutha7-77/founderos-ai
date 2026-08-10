from database.db import Base

# Import all models here so they register on the same Base/metadata,
# and Base.metadata.create_all() picks up every table.
from models.user import User
from models.memory import Memory