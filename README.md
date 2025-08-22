# Filmania
Web servis koji nudi naručivanje fotografa za događaja. Npr Vjenčanje itd. 
Korisnik moći će kreirati i brisati zahtjeve fotografa, Moći će pregledavati opise pojedinačnoga fotografa i filtriranje fotografa po lokaciji. Napravio sam ovaj web servis kako bih olakšao naručivanje fotografa.
Ukinujući potrošeno vrijeme traženja spesifičnog fotografa za Vašu potrebu.


# Use case
Ovdje možete vidjeti moji [Use case](https://lucid.app/lucidchart/a2b3b26e-e5cf-4dcd-99d5-3afc9ce74420/edit?page=.Q4MUjXso07N&invitationId=inv_4a7e3534-620c-4bbe-86bd-9be1a58b416a#)
<img width="811" height="668" alt="image" src="https://github.com/user-attachments/assets/a17864a8-2259-48b7-b50e-52b5b8ea5dec" />


# Funkcijonalnosti
1. Izrada zahtjeva( Biranje fotografa,datum,mjesto,količina slika i događaj koji želite)
2. Brisanje zahtjeva
3. Izmjena zahtjeva
4. Vizualizacija svih događaja i koliko svakih fotograf ima zahtjeva


# Kako instalirati i pokrenuti servis?
Moji servis radi preko Docker-a, prvi korak bih bio instalirati Docker Desktop zatim.

1. Instalirajte moji web servis i spremite podatke u neki folder
2. Uđite u repozitorij Filmanie koristeći CMD i komandu 'cd'
3.  kad ste unutar repozitorij, Pokrenete servis pomoću komande 'docker-compose up --build'
4. Optovrite servis tako da upišite 'localhost' u Vaš web preglednik


