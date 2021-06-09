# Windesheim Discord

## T.L.D.R.

Discord server voor het hele Windesheim. Wanneer je de server joined word je gevraagd om wat informatie in te vullen. Hier wordt geverifieerd of je echt een student/docent bent op het Windesheim. Wanneer je deze informatie hebt ingevuld krijg je verschillende roles in de server die jou afbakenen met jouw gekozen opleiding.

De bedoeling is dat je in deze server makkelijk hulp kan vragen aan iedereen waaronder docenten en waar je ook met je groepje in een privé kanaal kan zitten.

Je kan bijvoorbeeld bij de bot informatie opvragen over je studiekeuze en andere dingen.

De server is ook een plek waar je nieuwsberichten of soortgelijke dingen die van het Windesheim zelf komen, kan inzien.

## Features

- Custom bot
- Opleiding, klas, groep & leraren roles
- Werk, chill channels
- Inloggen met school email, met formulier

https://classcord.me/commands
https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/tracking-used-invites.md

## Opleidingen

[Endpoint](https://www.windesheim.nl/opleidingoverviewpage/json?showAll=true)

```javascript
fetch("https://cors-anywhere.herokuapp.com/https://www.windesheim.nl/opleidingoverviewpage/json?showAll=true")
  .then(res => res.json())
  .then(data => {
    const opleidingen = data.items
      .filter(opleiding => opleiding.location == "Zwolle")
      .map(opleiding => {
        const url = "https://www.windesheim.nl";
        return {
          title: opleiding.title,
          level: opleiding.level,
          type: opleiding.type,
          imageUrl: url + opleiding.imageUrl,
          url: url + opleiding.url,
          price: opleiding.price,
          duration: opleiding.duration,
        };
      });
    return opleidingen;
  })
  .then(console.log);
```
