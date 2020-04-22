# Exemplu de login cu Google implementat pe forms.html din proiect.

Nu functioneaza direct din HTML, trebuie hostat (XAMPP works).

Probabil va fi merged cand/daca avem si login cu Facebook

## Probleme

- foloseste un buton generat, n-are cea mai buna incadrare
- pentru un altfel de buton trebuie schimbata o parte din script (TODO frontend/eu)
- partea de sign-out se comporta cum trebuie numai pe Chrome (posibil si de la hostarea locala)
- login token-ul primit trebuie validat de server si abia apoi facuta autentificarea (TODO backend I guess?)

## Documentatie

https://developers.google.com/identity/sign-in/web/sign-in

https://developers.google.com/identity/sign-in/web/reference

https://github.com/google/google-api-javascript-client