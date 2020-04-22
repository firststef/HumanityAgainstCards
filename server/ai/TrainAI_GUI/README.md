
# Tool de antrenare al AI-ului

Acest tool va ofera o interfata grafica in care alegeti una din zece carti, care vi se par mai amuzante, pentru a face AI-ul mai eficient pe viitor (ipotetic). Daca nici un raspuns nu e amuzant, puteti alege butonul "Skip question".

Acum voi descrie pe scurt cum il compilati voi pentru ca eu nu am reusit sa il compilez intr-un .jar.
1. Deschideti pom.xml si dati import la dependinte (daca nu aveti deja setata optiunea auto-import).
2. Daca vreti sa folositi tool-ul trebuie sa imi dati un mesaj (Crainiciuc Calin) cu IP-ul vostru public ca sa puteti accesa baza de date din interiorul programului.
3. Deschideti folderul acesta in Intellij.
4. Intrati pe src/main/java/org.example/App. Daca apare o sageata verde in stanga liniei "class App", o apasati si dati run si gata. Daca nu apare sageata sau programul nu compileaza corect, continuati cu urmatorii pasi
5. Dati add configuration, +, application, Use classpath of module -> TrainAI.
6. File, project structure, project, Project SDK -> alegeti versiunea voastra de java.
7.  View, tool windows, maven. Pe fereastra din dreapta, TrainAI, Lifecycle, compile.
8. Daca tot nu puteti sa rulati programul, dati-mi un mesaj si vorbim. Spor la ales!
