import { text, hinweis } from "../pt.mjs";

// Rechtstexte der DEMO. Sie trennen den Betreiber der Demo (Nick Holzbecher) vom dargestellten Unternehmen (Altec Elektro GmbH).
// Grundlage: DSG (SR 235.1, in Kraft seit 1. September 2023), UWG Art. 3 Abs. 1 Bst. s (SR 241). Nicht anwaltlich geprüft.
export default [
  {
    slug: "impressum", titel: "Impressum", art: "rechtliches", stand: "25. September 2026",
    seoBeschreibung: "Impressum der Verkaufs-Demo für die Altec Elektro GmbH: Betreiber der Demo, dargestelltes Unternehmen, Bild- und Markenrechte, Haftung.",
    alteUrls: [],
    hero: { variante: "kompakt", titel: "Impressum" },
    bausteine: [
      hinweis(`Diese Website ist ein **unverbindlicher Gestaltungsvorschlag (Verkaufs-Demo)** und nicht die offizielle Website der Altec Elektro GmbH. Das Unternehmen hat diese Demo nicht in Auftrag gegeben und ist für sie nicht verantwortlich.`, "wichtig"),
      text(`## Betreiber dieser Demo-Website

**Nick Holzbecher**
E-Mail: [holzbechernick@gmail.com](mailto:holzbechernick@gmail.com)

Für Inhalt und Betrieb dieser Demo ist ausschliesslich der oben genannte Betreiber verantwortlich. Die Demo wird auf GitHub Pages (GitHub, Inc., USA) veröffentlicht. Die Postanschrift des Betreibers wird auf Anfrage mitgeteilt und vor einer allfälligen Übergabe ergänzt.

## Dargestelltes Unternehmen

**Altec Elektro GmbH**
Hedwigstrasse 12
8032 Zürich

Telefon: [+41 44 840 07 70](tel:+41448400770)
Fax: +41 44 840 07 71
E-Mail: [info@altec-elektro.ch](mailto:info@altec-elektro.ch)

Geschäftsführer laut bisheriger Website: Alek Mjekici. Fachkundiger Leiter: Ulrich Küttel.

Die Angaben zum dargestellten Unternehmen stammen von der bisherigen Website altec-elektro.ch (Stand 25. September 2026). Diese Website enthält kein Impressum; Handelsregister-Angaben (UID, Sitz, Rechtsform im Detail), die verantwortliche Person für den Inhalt und eine Datenschutz-Kontaktstelle sind vor einem Go-Live durch das Unternehmen zu ergänzen und zu bestätigen. Nach Art. 3 Abs. 1 Bst. s UWG sind vollständige Angaben zu Identität und Kontaktadresse (einschliesslich E-Mail) verpflichtend, sobald Waren, Werke oder Leistungen im elektronischen Geschäftsverkehr angeboten werden; diese Website bietet keine Online-Bestellung an.

## Inhalte, Bilder, Marken

Texte, Fotos und Partnerlogos wurden von der bisherigen Website altec-elektro.ch übernommen (Herkunftsnachweis in der Projektdokumentation). Die Rechte daran liegen bei der Altec Elektro GmbH bzw. bei den jeweiligen Urhebern und Partnern; die Verwendung in dieser Demo dient ausschliesslich der Präsentation eines Gestaltungsvorschlags. Das Logo ist eine Vektor-Nachbildung der bestehenden Bildmarke. Marken Dritter (Gira, KNX, Protectas, Otto Fischer, Komma3, Heinz von Heiden, ATC Treuhand, Winterhalder Fenner) gehören ihren jeweiligen Inhabern.

## Haftung

Die Inhalte dieser Demo wurden mit Sorgfalt übernommen, sind aber bis zur Bestätigung durch das Unternehmen unverbindlich. Für die Inhalte externer Links (Partner-Websites, Google Maps) sind ausschliesslich deren Betreiber verantwortlich. Es besteht kein Anspruch auf Vollständigkeit, Richtigkeit oder Aktualität.`, { breite: "schmal" }),
    ],
  },
  {
    slug: "datenschutz", titel: "Datenschutzerklärung", art: "rechtliches", stand: "25. September 2026",
    seoBeschreibung: "Datenschutzerklärung der Verkaufs-Demo: Hosting auf GitHub Pages, Kontakt per E-Mail-Programm, keine Cookies, keine Analyse-Dienste, Rechte nach DSG.",
    alteUrls: [],
    hero: { variante: "kompakt", titel: "Datenschutzerklärung" },
    bausteine: [
      hinweis(`Diese Erklärung beschreibt die **tatsächliche technische Umsetzung dieser Demo**. Sie ist eine redaktionelle Fassung, **nicht anwaltlich geprüft**, und ersetzt nicht die Datenschutzerklärung der Altec Elektro GmbH für deren eigene Website und Geschäftsprozesse.`, "wichtig"),
      text(`## 1. Verantwortliche Stelle

Verantwortlich für die Datenbearbeitung auf dieser Demo-Website ist der Betreiber der Demo: Nick Holzbecher, E-Mail [holzbechernick@gmail.com](mailto:holzbechernick@gmail.com) (siehe Impressum). Die Altec Elektro GmbH betreibt diese Demo nicht. Eine Datenschutz-Kontaktstelle des Unternehmens ist erst mit einem Go-Live zu ergänzen.

Massgebend ist das Schweizer Bundesgesetz über den Datenschutz (DSG, SR 235.1, in Kraft seit 1. September 2023) mit der Datenschutzverordnung (DSV). Diese Erklärung erfüllt die Informationspflicht nach Art. 19 DSG. Die Demo richtet sich an Personen in der Schweiz; die EU-Datenschutz-Grundverordnung (DSGVO) wird nur berücksichtigt, soweit sie im Einzelfall auf Besucherinnen und Besucher aus dem EU/EWR-Raum anwendbar ist.

## 2. Was beim Besuch dieser Website passiert

### 2.1 Hosting auf GitHub Pages

Die Demo wird als statische Website auf **GitHub Pages** ausgeliefert, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf einer Seite übermittelt Ihr Browser technisch bedingt Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, den Browsertyp und die zuvor besuchte Seite (Referrer) an die Server von GitHub. GitHub kann diese Angaben in Server-Protokollen speichern, um den Dienst sicher und stabil zu betreiben. Der Betreiber der Demo hat auf diese Protokolle keinen Zugriff und wertet sie nicht aus. Die USA gelten für die Schweiz seit dem 15. September 2024 als Staat mit angemessenem Datenschutz für Unternehmen, die nach dem Swiss-U.S. Data Privacy Framework zertifiziert sind; GitHub, Inc. führt sich nach eigenen Angaben unter diesem Rahmen. Ob und in welchem Umfang die Zertifizierung den Dienst GitHub Pages umfasst, ist vor einem Go-Live anhand der offiziellen Liste (dataprivacyframework.gov) zu prüfen. Einzelheiten: [Datenschutzerklärung von GitHub](https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement).

### 2.2 Keine Cookies, keine Analyse, keine Werbung

Diese Website setzt **keine Cookies**, keine Analyse- oder Statistik-Dienste (kein Google Analytics, kein Facebook-Pixel), keine Werbenetzwerke und keine Schriften von Google. Schriften, Skripte und Bilder werden von derselben Adresse wie die Website geladen. Deshalb zeigt die Website auch kein Cookie-Banner: Es gibt nichts, wozu Sie einwilligen müssten.

Sollten später optionale Dienste Dritter ergänzt werden (zum Beispiel eine eingebettete Karte), werden sie erst nach Ihrer ausdrücklichen Einwilligung geladen. Ihre Entscheidung würde dann ausschliesslich in Ihrem Browser (localStorage) gespeichert und liesse sich jederzeit über die Fusszeile widerrufen. Die dafür vorgesehene Funktion ist vorbereitet, aber derzeit nicht aktiv.

### 2.3 Kontaktformular («E-Mail vorbereiten»)

Das Kontaktformular sendet nichts an einen Server. Beim Absenden öffnet es Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht (Name, E-Mail-Adresse, optionale Telefonnummer, Anliegen, Nachricht) an info@altec-elektro.ch. Erst wenn Sie diese Nachricht in Ihrem E-Mail-Programm absenden, werden die Angaben übermittelt, und zwar direkt an die Altec Elektro GmbH, die sie zur Beantwortung Ihrer Anfrage verwendet; für diese Bearbeitung ist die Altec Elektro GmbH verantwortlich, nicht der Betreiber der Demo. Die Website speichert Ihre Eingaben nicht, weder auf einem Server noch im Browser. Bitte senden Sie keine sensiblen Angaben über das Formular.

### 2.4 Telefon- und E-Mail-Links

Links wie «Notfalldienst anrufen» oder E-Mail-Adressen öffnen die entsprechende Anwendung auf Ihrem Gerät. Dabei werden keine Daten an diese Website übermittelt.

### 2.5 Externe Links

Die Website verlinkt auf Websites von Partnern (Komma3, ATC Treuhand) und auf Google Maps (Routenlink). Beim Anklicken verlassen Sie diese Website; es gelten die Datenschutzbestimmungen der jeweiligen Anbieter. Google Maps ist **nicht eingebettet**; beim blossen Besuch dieser Website werden keine Daten an Google übermittelt.

## 3. Sanity und Vercel (nicht aktiv)

Der Quellcode dieser Demo ist so vorbereitet, dass Inhalte später über das Redaktionssystem Sanity (Sanity AS, Norwegen) gepflegt und die Website bei Vercel (Vercel Inc., USA) betrieben werden könnten. **Beides ist in dieser Demo nicht eingerichtet und nicht aktiv.** Es werden keine Daten an Sanity oder Vercel übermittelt. Sollte das Unternehmen diese Dienste später nutzen, ist diese Erklärung entsprechend zu ergänzen.

## 4. Ihre Rechte

Nach dem DSG haben Sie das Recht auf Auskunft (Art. 25 DSG); je nach Voraussetzungen können insbesondere Ansprüche auf Berichtigung, Löschung, Einschränkung der Bearbeitung sowie auf Herausgabe oder Übertragung Ihrer Daten (Art. 28 DSG) bestehen, und Sie können einer Bearbeitung widersprechen. Da diese Demo selbst keine Personendaten speichert, betreffen Anfragen an den Demo-Betreiber in der Regel nur E-Mails, die Sie ihm direkt gesendet haben; wenden Sie sich dazu an die unter Ziffer 1 genannte Adresse. Für Anfragen, die Sie über das Kontaktformular an die Altec Elektro GmbH gesendet haben, ist das Unternehmen selbst zuständig (Kontaktangaben im Impressum). Aufsichtsbehörde ist der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB), Feldeggweg 1, 3003 Bern.

## 5. Sicherheit

Die Website wird ausschliesslich über HTTPS ausgeliefert. Sie enthält keine Anmeldung, keine Konten und keine Datenbank.

## 6. Änderungen

Diese Datenschutzerklärung wird angepasst, wenn sich die technische Umsetzung ändert, zum Beispiel bei einer späteren Einbindung optionaler Dienste oder beim Wechsel zu Sanity und Vercel. Das Datum des aktuellen Standes steht am Seitenanfang.`, { breite: "schmal" }),
    ],
  },
];
