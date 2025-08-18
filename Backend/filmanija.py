from flask import Flask, request, jsonify
from flask_cors import CORS
from pony.orm import *
import json
from datetime import datetime

app = Flask(__name__)
CORS(app) 

db = Database()

class Fotograf(db.Entity):
    id = PrimaryKey(int, auto=True)
    Ime = Required(str)
    Prezime = Required(str)
    naziv = Required(str)
    Grad = Required(str)
    Opis = Optional(str)
    Cijena_po_slici = Required(float)
    zahtjevi = Set('Zahtjev')

class Zahtjev(db.Entity):
    id = PrimaryKey(int, auto=True)
    fotograf = Required(Fotograf)
    Datum_radnje = Required(str)
    Kolicina_slika = Required(int)
    Dogadaj = Required(str)


db.bind(provider='sqlite', filename='filmanija.db', create_db=True)
db.generate_mapping(create_tables=True)


@db_session
def setup_database():
    if not Fotograf.exists():
        Fotograf(Ime="Ivan", Prezime="Ivić", naziv="Ivini_Slike", Grad="Zagreb", Opis="Specijalist za vjenčanja", Cijena_po_slici=15.50)
        Fotograf(Ime="Petra", Prezime="Petrić", naziv="Petrin_Objektiv", Grad="Rijeka", Opis="Portreti i modna fotografija", Cijena_po_slici=20.00)
        Fotograf(Ime="Marko", Prezime="Markić", naziv="Marko_Foto", Grad="Split", Opis="Event i koncertna fotografija", Cijena_po_slici=12.00)
        commit()

setup_database()


@app.route('/api/fotografi', methods=['GET'])
@db_session
def get_fotografi():
    fotografi = Fotograf.select()
    result = [p.to_dict() for p in fotografi]
    return jsonify(result)

@app.route('/api/zahtjevi', methods=['GET'])
@db_session
def get_zahtjevi():
    zahtjevi = Zahtjev.select()
    result = []
    for z in zahtjevi:
        zahtjev_dict = z.to_dict()
        zahtjev_dict['fotograf_ime'] = f"{z.fotograf.Ime} {z.fotograf.Prezime}"
        result.append(zahtjev_dict)
    return jsonify(result)

@app.route('/api/zahtjevi', methods=['POST'])
@db_session
def create_zahtjev():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        
        fotograf_id = data.get('id_fotografa')
        datum_radnje = data.get('Datum_radnje')
        kolicina_slika = data.get('Kolicina_slika')
        dogadaj = data.get('Događaj')

        if not all([fotograf_id, datum_radnje, kolicina_slika, dogadaj]):
            return jsonify({"error": "Nedostaju podaci u zahtjevu"}), 400

        try:
            fotograf_id = int(fotograf_id)
        except (ValueError, TypeError):
            return jsonify({"error": "ID fotografa mora biti broj"}), 400

        try:
            kolicina_slika = int(kolicina_slika)
        except (ValueError, TypeError):
            return jsonify({"error": "Količina slika mora biti broj"}), 400

        try:
            fotograf = Fotograf[fotograf_id]
        except ObjectNotFound:
            return jsonify({"error": "Fotograf s tim ID-om ne postoji"}), 404

        Zahtjev(
            fotograf=fotograf,
            Datum_radnje=datum_radnje,
            Kolicina_slika=kolicina_slika,
            Dogadaj=dogadaj
        )
        commit()
        return jsonify({"message": "Zahtjev uspješno poslan"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing key in JSON: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/zahtjevi/<int:zahtjev_id>', methods=['DELETE'])
@db_session
def delete_zahtjev(zahtjev_id):
    try:
        zahtjev = Zahtjev[zahtjev_id]
        zahtjev.delete()
        commit()
        return jsonify({"message": f"Zahtjev s ID {zahtjev_id} je obrisan"}), 200
    except ObjectNotFound:
        return jsonify({"error": f"Zahtjev s ID {zahtjev_id} ne postoji"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/zahtjevi/<int:zahtjev_id>', methods=['PATCH'])
@db_session
def update_zahtjev(zahtjev_id):
    try:
        zahtjev = Zahtjev[zahtjev_id]
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        if 'Datum_radnje' in data:
            zahtjev.Datum_radnje = data['Datum_radnje']
        if 'Kolicina_slika' in data:
            try:
                zahtjev.Kolicina_slika = int(data['Kolicina_slika'])
            except (ValueError, TypeError):
                return jsonify({"error": "Količina slika mora biti broj"}), 400
        if 'Dogadaj' in data:
            zahtjev.Dogadaj = data['Dogadaj']

        commit()
        return jsonify({"message": f"Zahtjev s ID {zahtjev_id} je ažuriran"}), 200
    except ObjectNotFound:
        return jsonify({"error": f"Zahtjev s ID {zahtjev_id} ne postoji"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)