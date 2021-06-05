# Windesheim Discord

- Custom bot
- Opleiding, klas, groep & leraren roles
- Werk, chill channels

## Opleidingen

[Endpoint](https://www.windesheim.nl/opleidingoverviewpage/json?showAll=true)

```javascript
fetch("https://www.windesheim.nl/opleidingoverviewpage/json?showAll=true")
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
