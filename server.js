const express = require("express");
const app = express();
const fetch = require("node-fetch");
const fs = require("fs");
const p = require("./pokemon.json");
const ejs = require("ejs");
const types = require("./type.json");
const pokes = [];
Object.keys(p).forEach((e)=>{
  let pp = p[e];
  pokes.push(pp);
});


let f = require("./spots.json");
let f2 = require("./spots2.json");

const htmlstart = "<!doctype html><html><head>";
const htmlend = "</head></html><body>See the Embed in Discord!</body>";
const meta = d => {
  let dat = "";
  d.forEach(da => {
    dat += `<meta property="${da[0]}" content="${da[1]}"/>`;
  });
  return dat;
};
const html = d => htmlstart + meta(d) + htmlend;

const dd = d => {
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"/><meta name="theme-color" content="#00adb5" /><meta content="${d.desc}" property="og:description"/><meta name="url" content="${d.url}"/><title>${d.desc}</title><script>window.location.href="${d.url}";</script></head></html>`;
};

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/q/:query/:search", (req, res) => {
  if (req.params.query.toLowerCase() == "poke") {
    res.redirect("https://promap.djdev.tech/?poke=" + req.params.search);
  } else if (req.params.query.toLowerCase() == "loc") {
    res.redirect("https://promap.djdev.tech/?poke=" + req.params.search);
  } else {
    res.redirect("https://promap.djdev.tech");
  }
});

app.get("/f", (req, res) => {
  res.redirect(
    "https://pokemonrevolution.net/forum/index.php?threads/tool-pro-map-spawn-explorer-by-me-djdeveloper-and-scara.147627/"
  );
});

app.get("/spots", (req, res) => {
  res.json(f);
});

app.get("/spots2", (req, res) => {
  f2 = require("./spots2.json");
  res.json(f2);
});

app.get("/spots3", (req, res) => {
  let f3 = require("./spots3.json");
  res.json(f3);
});

app.get("/bosses", (req, res) => {
  let f3 = require("./boss.json");
  res.json(f3);
});

app.get("/notcodedjson", (req, res) => {
  let f3 = require("./notcoded.json");
  res.json(f3);
});  

app.get("/dex/:pname", (req,res)=>{
  let s = req.params.pname;
  let poke = pokes.find(p=>(p.national_id+"")==(s+"")) || pokes.find(p=>p.names.en.toLowerCase()==s.toLowerCase())||pokes.find(p=>p.names.en.toLowerCase().includes(s.toLowerCase()));
  if(!poke) return res.send("<h1>Pokémon Not Found.</h1>")
  poke.col = types[poke.types[0]].color;
  let evos = "" + poke.names.en + "";

    const evo = (obj) => {
        if (!obj) return "";
        if (obj.level) {
            return `Lv. ${obj.level} → ${obj.to}`;
        } else if (obj.happiness) {
            return `Happiness → ${obj.to}`;
        } else if (obj.item) {
            return `${obj.item} → ${obj.to}`;
        } else {
            return obj.to;
        }
    };

    if (poke.evolution_from) {
        evos = poke.evolution_from + ` → ${evos}`;
    }
    if (poke.evolutions && poke.evolutions.map(e => evo(e)).filter(e => e != "").size != 0) {
        evos += " → " + poke.evolutions.map(e => evo(e)).filter(e => e != "").join(" → ");
    }

    evos = evos.trim();

    //if (evos.endsWith("**>**")) {
    evos = evos.split("→").map(e => e.trim()).filter(e => (e || "").trim() != "").join(" → ");
  poke.evos = evos;
  poke.desc = poke.pokedex_entries[Object.keys(poke.pokedex_entries)[Object.keys(poke.pokedex_entries).length-1]].en;
  let fc = fs.readFileSync("./pokemon.ejs")+"";
  res.send(ejs.render(fc, { poke }));
});

app.get("/notcoded", (req,res)=>{
  let f3 = require("./notcoded.json");
  res.send("<ul>"+f3.map((e,i)=>{
    if(e.move && e.type  == 0) return "<li>["+(i+1)+"] Move (Not Coded): "+e.move+"</li>";
    if(e.ability && e.type  == 0) return "<li>["+(i+1)+"] Ability (Not Coded): "+e.ability+"</li>";
    if(e.move && e.type == 1) return "<li>["+(i+1)+"] Move (Broken): "+e.move+" - "+e.desc+"</li>";
    if(e.ability && e.type == 1) return "<li>["+(i+1)+"] Ability (Broken): "+e.ability+" - "+e.desc+"</li>"
  }).join("<br>")+"</ul>");
});

app.get("/b/:name", (req, res) => {
  let file = require("./boss.json");
  let boss = file.find(
    b =>
      b.name.toLowerCase() == req.params.name.toLowerCase().replace(/\++/g, " ")
  );
  if (!boss)
    res.send(
      html([["theme-color", "#ff0000"], ["og:title", "Boss - Not Found"]])
    );
  res.send(
    html([
      ["og:site_name", boss.name + " - Boss"],
      ["theme-color", "#1e9eed"],
      ["og:title", "Location: " + boss.location],
      [
        "og:description",
        `Requirements: ${boss.reqs.join(",")}\nCooldown: ${
          boss.cooldown
        }\nRewards: ${boss.rewards.join(", ")}\nThird Time Rewards: ${
          boss.thirdRewards.length == 0 ? "None" : boss.thirdRewards.join(", ")
        }
\nTeam\n
${boss.teams
  .map(
    (t, i) =>
      "#" +
      (i + 1) +
      " Team" +
      t.map(te => te.name + " (" + t.moves + ")").join("\n")
  )
  .join("\n\n")}
`
      ]
    ])
  );
});

app.get("/locs", (req, res) => {
  let f3 = require("./loc.json");
  res.json(f3);
});

app.get("/headbutt", (req, res) => {
  let f3 = require("./headbutt.json");
  res.json(f3);
});

app.get("/digspot", (req, res) => {
  let f3 = require("./dig.json");
  res.json(f3);
});

app.get("/spot", (req, res) => {
  res.sendFile(__dirname + "/views/spot.html");
});

app.get("/lspawns", async (req, res) => {
  let data = await fetch(
    "https://pokemonrevolution.net/spawns/land_spawns.json"
  );
  data = await data.json();
  let data2 = await fetch(
    "https://pokemonrevolution.net/spawns/surf_spawns.json"
  );
  data2 = await data2.json();
  res.json([...data, ...data2]);
});

async function setSpots() {
  let locs = [];
  let data = await fetch(
    "https://pokemonrevolution.net/spawns/land_spawns.json"
  );
  data = await data.json();
  data.forEach(d => {
    find = locs.find(m => m == d.Map);
    if (!find) {
      locs.push(d.Map);
    }
  });
  let dat = {};
  locs.forEach(l => {
    dat[l] = { x: 0, y: 0 };
  });
  dat = JSON.stringify(dat);
  //console.log(dat);
}  

let ff = require("./redirect.json");
ff.forEach((red)=>{
  //console.log(`Load: ${red.name}`);
  app.get("/p/"+red.name.replace("/",""), (req,res)=>{
    res.send(dd(red));
    console.log(red.name);
  });
});

app.get("/p", (req,res)=>{
  res.send(ff.map(e=>`<head><meta charset="utf-8"/><title>PRO Map - List of Redirects</title><meta name="theme-color" content="#00adb5" /><meta content="List of all redirects." property="og:description"/></head><a href="${e.url}">/p/${e.name}</a>`).join("<br>"));
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Listening on PORT: " + listener.address().port);
});
