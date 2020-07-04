var MODE = "loc";
const spawns = document.getElementById("data");
const loc = document.getElementById("locname");
const lod = document.getElementById("loading");
const poke = document.getElementById("pokename");
const spots = document.getElementById("spots");
var dat = [];
var locs = [];
var pokes = [];
var cs = [];

function setMode(m) {
  MODE = m
  if (MODE == "poke") {
    loc.style.display = "none";
    poke.style.display = "block";
  } else {
    loc.style.display = "block";
    poke.style.display = "none";
    if(cs.length != 0){
      cs.forEach((e)=>{
        e.style.opacity = 0.0;
      });
      cs = [];
    }
  }
}

window.addEventListener("keydown", (evt)=>{
  if(evt.key.toLowerCase() == 'p'){
    setMode("poke");
  } else if (evt.key.toLowerCase() == "l"){
    setMode("loc");
  } else if (evt.key.toLowerCase() == "d"){
    document.getElementById("model-data").scrollIntoView();
  }
});

const daytime = (inp)=>{
	let M = inp[0] == 1;
	let D = inp[1] == 1;
	let N = inp[2] == 1;
	
	let res = "";
	if(M == true && D == true && N == true){
		res = "M/D/N";
	} else if (M == true && D == true && N == false) {
		res = "M/D";
	} else if (M == true && D == false && N == true) {
		res = "M/N";
	} else if (M == true && D == false && N == false) {
		res = "M";
	} else if (M == false && D == false && N == true) {
		res = "N";
	} else if (M == false && D == true && N == true) {
		res = "D/N";
	} else if (M == false && D == true && N == false) {
		res = "D";
	} else {
		res = "Ugh"
	}
	
	return res;
};

const gotoRegion = ()=>{
	const reg = document.getElementById("region");
	const sel = reg.options[reg.selectedIndex].value;
	const dataa = {"kanto":{"y":0,"x":273},"johto":{"y":0,"x":153},"hoenn":{"x":0,"y":237},"sinnoh":{"x":0,"y":475},"sevii":{"x":273,"y":320}};
	const mod = document.getElementById("model-map");
	mod.scrollTop = dataa[sel].y;
	mod.scrollLeft = dataa[sel].x;
};

function remp (spot){
	spot = spot.replace(/p1/, "").trim();
    spot = spot.replace(/p2/, "").trim();
    spot = spot.replace(/p3/, "").trim();
    spot = spot.replace(/p4/, "").trim();
    spot = spot.replace(/p5/, "").trim();
    spot = spot.replace(/p6/, "").trim();
    spot = spot.replace(/p7/, "").trim();
	spot = spot.replace(/p8/, "").trim();
	spot = spot.replace(/p9/, "").trim();
	spot = spot.replace(/p10/, "").trim();
	return spot;
}

async function addSpots() {
  let data = await fetch(window.location.protocol+"//"+window.location.host+"/lspawns");
  dat = await data.json();
  locations();
  pokemons();
  let spots = await fetch(window.location.protocol+"//"+window.location.host+"/spots3");
  spots = await spots.json();
  makeSpots(spots);
}

async function makeSpots(data) {
  let htmlDat = "";
  for (var spot in data) {
    let dat = data[spot];
    if (dat.x == 0 && dat.y == 0) {
    } else {
      spot = remp(spot);
      htmlDat += `<div class="spot" title="${spot}" onclick="getSpotData('${spot}')" style="position: absolute; top:${dat.y}px; left:${dat.x}px; opacity:0.0001; z-index: 2;"></div>`;
    }
  }
  spots.innerHTML += htmlDat;
  lod.style.display = "none";
}

async function getSpotData(spot) {
	setMode('loc');
  loc.innerText = "Location: " + spot+"*";
  let find;
  if(!spot.startsWith("Route")){
 	find = dat.find(d => d.Map.startsWith(spot));
  } else {
	//alert("hi");
	find = dat.find(d => d.Map === remp(spot));
  }
  if (!find) return spawns.innerHTML = "None.";
  loc.innerText = "Location: " + spot;
  let sp;
  if(!spot.startsWith("Route")){
	 sp = dat.filter(d =>{
		return d.Map.toLowerCase().startsWith((find.Map.toLowerCase()));
	});
  } else {
	 sp = dat.filter(d =>{
		return d.Map.toLowerCase() == ((find.Map.toLowerCase()));
	});
  }
  sp = sp.sort((a,b)=>b.Tier-a.Tier);
  let dt = "<table style=\"position: absolute; top: 80px; left: 18px;\" class=\"steelBlueCols\">"+"<thead><tr><th>Dex ID</th><th>Pokémon</th><th>Level Range</th><th>Tier</th><th>Item</th><th>Daytime</th><th>MS</th><th>Origin</th></tr></thead>"+sp
    .map(
      d =>
        `
		<tbody>
		<tr>
			<td>${d.MonsterID}</td>
			<td><a onclick="getPokeData('${d.MonsterID}')">${d.Pokemon}</a></td>
			<td>${d.MinLVL} to ${d.MaxLVL}</td>
			<td>${d.Tier}</td>
			<td>${d.Item||"None"}</td>
			<td>${daytime(d.Daytime)}</td>
			<td>${d.MemberOnly==true ? "Yes" : "No"}</td>
			<td>${d.Fishing != undefined ? "Surf/Fish" : "Land"}</td>
		</tr>
		</tbody>
		`
    )
    .join("<br/>")+"</table>";
  spawns.innerHTML = `<h2 style="color: var(--col-bluish);">${spot}</h2>`;
  spawns.innerHTML += dt;
}

async function locations() {
  dat.forEach(d => {
    find = locs.find(m => m == d.Map);
    if (!find) {
      locs.push(d.Map);
    }
  });
}

async function pokemons() {
  dat.forEach(d => {
    find = pokes.find(m => m == d.Pokemon);
    if (!find) {
      pokes.push(d.Pokemon);
    }
  });
  pokes = pokes.sort();
  poke.innerHTML = pokes
    .map(p => `<option value="${p}">${p}</option>`)
    .join("");
  //poke.innerHTML = poke.innerText.slice()
}

const getPokeData = async(id)=>{
  let pdat = await P.getPokemonByName(id); 
  if(!pdat) return;
  console.log(pdat);
  bootbox.alert({
    title: `${pdat.species.name[0].toUpperCase()+pdat.species.name.slice(1)}`,
    size: "small",
    message: `<center><img src="${pdat.sprites.front_default}"/></center><br>ID: ${pdat.id}<br>
              Types: ${pdat.types.map(a=>`${a.type.name}`).join(", ")}<br>
              Abilities: ${pdat.abilities.map(a=>`${a.ability.name}`).join(", ")}<br>
              Base Exp.: ${pdat.base_experience}<br><hr>
              <center><b>Stats</b><table style="transform: translateY(-90px); border: solid 1px black;"><thead><th style="min-width: 70px;">Stat</th><th style="min-width: 70px;">EV</th><th style="min-width: 70px;">Base</th></thead><tbody>${pdat.stats.map(s=>`<tr><td>${s.stat.name.toUpperCase()}</td><td>${s.effort}</td><td>${s.base_stat}</td></tr>`).join("<br>")+"</tbody></table></center>"}
              `,
  });
};

async function setPokemon(){
  if(cs.length != 0){
      cs.forEach((e)=>{
        e.style.opacity = 0.0;
      });
      cs = [];
    }
  spawns.innerHTML = "Searching...";
  let sel = poke.options[poke.selectedIndex].value;
  let sps = dat.filter(p=>p.Pokemon == sel);
  let bs = [...spots.children];
  spawns.innerHTML = `<h2 style="color: var(--col-bluish);">${sel}</h2>`;
  sps.forEach((s)=>{
	let f;
	if(!s.Map.startsWith("Route")){
		f = bs.find(sp=>s.Map.toLowerCase().startsWith(sp.title.toLowerCase()));
	} else {
		f = bs.find(sp=>s.Map.toLowerCase() == remp(sp.title.toLowerCase()));
	}
    if(!f) return;
    if(s.Pokemon == sel){
      f.style.opacity = "0.6";
      f.Tier = s.Tier;
      f.MemberOnly = s.MemberOnly;
      f.Map = s.Map;
      f.Fishing = s.Fishing;
      cs.push(f);
    }
  });
  cs = [... new Set(cs)];
  cs = cs.sort((a,b)=>a.Tier-b.Tier);
  spawns.innerHTML += "<div><table style=\"position: absolute; top: 80px; left: 18px;\" class=\"steelBlueCols\">"+"<thead><tr><th>S. No.</th><th>Map</th><th>Level Range</th><th>Tier</th><th>Item</th><th>Daytime</th><th>MS</th><th>Origin</th></tr></thead>"+sps
    .map(
      (d,i) =>
        `
		<tbody>
		<tr>
			<td>${i+1}</td>
			<td>${d.Map}</td>
			<td>${d.MinLVL} to ${d.MaxLVL}</td>
			<td>${d.Tier}</td>
			<td>${d.Item||"None"}</td>
			<td>${daytime(d.Daytime)}</td>
			<td>${d.MemberOnly==true ? "Yes" : "No"}</td>
			<td>${d.Fishing != undefined ? "Surf/Fish" : "Land"}</td>
		</tr>
		</tbody>
		`
    )
    .join("<br/>")+"</table></div>";
}

addSpots();
