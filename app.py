from flask import Flask, render_template, jsonify
import requests
from sqlalchemy import create_engine, Column, String, Integer, DateTime, asc
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import datetime
from sqlalchemy.orm import Session
from hashlib import md5

app = Flask(__name__)

# Configure the database connection
DATABASE_URL = 'sqlite:///adopt_me.db'
engine = create_engine(DATABASE_URL)
Base = declarative_base()

def has_image_content(url):
    try:
        response = requests.get(url, allow_redirects=True)
        
        if not response.url.endswith("no_pic_d.jpg"):
            return True
        
        return False
    except requests.RequestException:
        return False

# Define your SQLAlchemy model
class RowData(Base):
    __tablename__ = 'rows'
    id = Column(Integer, primary_key=True, autoincrement=True)
    animal_id = Column(String)
    name = Column(String)
    age = Column(Integer)
    animal_type = Column(String)
    intake_type = Column(String)
    in_date = Column(String)
    size = Column(String)
    sex = Column(String)
    link = Column(String)
    color = Column(String)
    breed = Column(String)
    has_image = Column(String)

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

json_url = "https://data.montgomerycountymd.gov/api/views/e54u-qx42/rows.json?accessType=DOWNLOAD"
response = requests.get(json_url)
data = response.json()



columns = []
for x in data["meta"]["view"]["columns"]:
    columns.append(x["name"])

for item in data['data']:
    animal_id = item[columns.index("Animal ID")]
    name = item[columns.index("Pet name")]  
    age = item[13]
    animal_type = item[columns.index("Animal Type")]
    intake_type = item[columns.index("Intake Type")]
    in_date = str(item[columns.index("In Date")])
    size = item[columns.index("Pet Size")]
    sex = item[columns.index("Sex")]
    link_list = item[columns.index("URL Link ")]
    color = item[columns.index("Color")]
    breed =  item[columns.index("Breed")]
    link = str(link_list[0])  # Take the first URL if available
    has_image = str(has_image_content(link_list[0]))

    row = RowData(animal_id=animal_id, name=name, in_date=in_date, age=age, animal_type=animal_type, intake_type=intake_type,  size=size, sex=sex , link=link, color=color, breed=breed, has_image=has_image)
    session.add(row)
    session.commit()
session.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/get_data')
def get_data():
    session = Session()
    results = session.query(RowData).all()
    session.close()
    results_list = []
    for row in results:
        row_dict = {
            "animal_id": row.animal_id,
            "name": row.name,
            "age": row.age,
            "animal_type": row.animal_type,
            "intake_type": row.intake_type,
            "in_date": row.in_date,
            "size": row.size,
            "sex": row.sex,
            "color": row.color,
            "breed": row.breed,
            "link": row.link,
            "hasImage": row.has_image
            
        }
        results_list.append(row_dict)

    return jsonify(results_list)

@app.route('/api/pet_names')
def pet_names():
    session = Session()
    results = session.query(RowData.name)
    session.close()
    results_list = [row[0] for row in results]
    return results_list

@app.route('/api/pet_age')
def pet_age():
    session = Session()
    results = session.query(RowData.age).order_by(asc(RowData.age))
    unique_age = []
    results_list = [row[0] for row in results]
    for result in results_list:
        if result not in unique_age:
            unique_age.append(result)
    session.close()
    
    return unique_age

@app.route('/api/pet_types')
def pet_type():
    session = Session()
    results = session.query(RowData.animal_type)
    results_list = [row[0] for row in results]
    unique_pets= []
    for result in results_list:
        if result not in unique_pets:
            unique_pets.append(result)
    session.close()
    return unique_pets

@app.route('/api/size')
def pet_size():
    session = Session()
    results = session.query(RowData.size)
    results_list = [row[0] for row in results]
    unique_size= []
    for result in results_list:
        if result not in unique_size:
            unique_size.append(result)
    session.close()
    return unique_size

@app.route('/api/sex')
def pet_sex():
    session = Session()
    results = session.query(RowData.sex)
    results_list = [row[0] for row in results]
    unique_sex= []
    for result in results_list:
        if result not in unique_sex:
            unique_sex.append(result)
    session.close()
    return unique_sex

@app.route('/api/intake_type')
def pet_intake_type():
    session = Session()
    results = session.query(RowData.intake_type)
    results_list = [row[0] for row in results]
    unique_intake_type= []
    for result in results_list:
        if result not in unique_intake_type:
            unique_intake_type.append(result)
    session.close()
    return unique_intake_type



if __name__ == '__main__':
    app.run(debug=True)
