import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const cards = [
  {
    name: "Charizard",
    type: "FIRE",
    hp: 120,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "4/102",
    image: "/cards/charizard.png",
    value: "$4,200",
    color: "#ff774e",
    weight: 1,
  },
  {
    name: "Blastoise",
    type: "WATER",
    hp: 100,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "2/102",
    image: "/cards/blastoise.png",
    value: "$1,180",
    color: "#72d7ff",
    weight: 2,
  },
  {
    name: "Venusaur",
    type: "GRASS",
    hp: 100,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "15/102",
    image: "/cards/venusaur.png",
    value: "$910",
    color: "#9dde69",
    weight: 2,
  },
  {
    name: "Pikachu",
    type: "LIGHTNING",
    hp: 40,
    rarity: "COMMON",
    set: "BASE SET",
    number: "58/102",
    image: "/cards/pikachu.png",
    value: "$42",
    color: "#ffe35c",
    weight: 4,
  },
  {
    name: "Mewtwo",
    type: "PSYCHIC",
    hp: 60,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "10/102",
    image: "/cards/mewtwo.png",
    value: "$94",
    color: "#cb8cff",
    weight: 4,
  },
  {
    name: "Gengar",
    type: "PSYCHIC",
    hp: 80,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "5/62",
    image: "/cards/gengar.png",
    value: "$176",
    color: "#9d79df",
    weight: 4,
  },
  {
    name: "Alakazam",
    type: "PSYCHIC",
    hp: 80,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "1/102",
    image: "/cards/alakazam.png",
    value: "$49",
    color: "#d6a1ff",
    weight: 4,
  },
  {
    name: "Gyarados",
    type: "WATER",
    hp: 100,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "6/102",
    image: "/cards/gyarados.png",
    value: "$31",
    color: "#55b8f0",
    weight: 4,
  },
  {
    name: "Nidoking",
    type: "GRASS",
    hp: 90,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "11/102",
    image: "/cards/nidoking.png",
    value: "$29",
    color: "#9ecb62",
    weight: 5,
  },
  {
    name: "Raichu",
    type: "LIGHTNING",
    hp: 80,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "14/102",
    image: "/cards/raichu.png",
    value: "$42",
    color: "#ffd54d",
    weight: 4,
  },
  {
    name: "Zapdos",
    type: "LIGHTNING",
    hp: 90,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "16/102",
    image: "/cards/zapdos.png",
    value: "$35",
    color: "#f6df4f",
    weight: 3,
  },
  {
    name: "Dragonite",
    type: "COLORLESS",
    hp: 100,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "4/62",
    image: "/cards/dragonite.png",
    value: "$62",
    color: "#f1b968",
    weight: 2,
  },
  {
    name: "Articuno",
    type: "WATER",
    hp: 70,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "2/62",
    image: "/cards/articuno.png",
    value: "$32",
    color: "#8de5ff",
    weight: 3,
  },
  {
    name: "Snorlax",
    type: "COLORLESS",
    hp: 90,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "11/64",
    image: "/cards/snorlax.png",
    value: "$48",
    color: "#a8c8af",
    weight: 3,
  },
  {
    name: "Jolteon",
    type: "LIGHTNING",
    hp: 70,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "4/64",
    image: "/cards/jolteon.png",
    value: "$58",
    color: "#ffe55e",
    weight: 3,
  },
  {
    name: "Vaporeon",
    type: "WATER",
    hp: 80,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "12/64",
    image: "/cards/vaporeon.png",
    value: "$37",
    color: "#67d3e9",
    weight: 3,
  },
  {
    name: "Flareon",
    type: "FIRE",
    hp: 70,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "3/64",
    image: "/cards/flareon.png",
    value: "$49",
    color: "#ff8b55",
    weight: 3,
  },
  {
    name: "Scyther",
    type: "GRASS",
    hp: 70,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "10/64",
    image: "/cards/scyther.png",
    value: "$34",
    color: "#9bda62",
    weight: 4,
  },
  {
    name: "Lapras",
    type: "WATER",
    hp: 80,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "10/62",
    image: "/cards/lapras.png",
    value: "$26",
    color: "#78cfee",
    weight: 4,
  },
  {
    name: "Eevee",
    type: "COLORLESS",
    hp: 50,
    rarity: "COMMON",
    set: "JUNGLE",
    number: "51/64",
    image: "/cards/eevee.png",
    value: "$5",
    color: "#d9b98c",
    weight: 5,
  },
  {
    name: "Bulbasaur",
    type: "GRASS",
    hp: 40,
    rarity: "COMMON",
    set: "BASE SET",
    number: "44/102",
    image: "/cards/bulbasaur.png",
    value: "$8",
    color: "#79d59d",
    weight: 6,
  },
  {
    name: "Squirtle",
    type: "WATER",
    hp: 40,
    rarity: "COMMON",
    set: "BASE SET",
    number: "63/102",
    image: "/cards/squirtle.png",
    value: "$7",
    color: "#72cbe8",
    weight: 6,
  },
  {
    name: "Growlithe",
    type: "FIRE",
    hp: 60,
    rarity: "UNCOMMON",
    set: "BASE SET",
    number: "28/102",
    image: "/cards/growlithe.png",
    value: "$3",
    color: "#f6a05e",
    weight: 7,
  },
  {
    name: "Abra",
    type: "PSYCHIC",
    hp: 30,
    rarity: "COMMON",
    set: "BASE SET",
    number: "43/102",
    image: "/cards/abra.png",
    value: "$2",
    color: "#e1b377",
    weight: 7,
  },
  {
    name: "Clefairy",
    type: "COLORLESS",
    hp: 40,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "5/102",
    image: "/cards/clefairy.png",
    value: "$31",
    color: "#ffb7dd",
    weight: 4,
  },
  {
    name: "Chansey",
    type: "COLORLESS",
    hp: 120,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "3/102",
    image: "/cards/chansey.png",
    value: "$36",
    color: "#ffbfd8",
    weight: 4,
  },
  {
    name: "Hitmonchan",
    type: "FIGHTING",
    hp: 70,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "7/102",
    image: "/cards/hitmonchan.png",
    value: "$28",
    color: "#e59b68",
    weight: 5,
  },
  {
    name: "Machamp",
    type: "FIGHTING",
    hp: 100,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "8/102",
    image: "/cards/machamp.png",
    value: "$22",
    color: "#b7a482",
    weight: 5,
  },
  {
    name: "Magneton",
    type: "LIGHTNING",
    hp: 60,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "9/102",
    image: "/cards/magneton.png",
    value: "$26",
    color: "#e7d96a",
    weight: 5,
  },
  {
    name: "Ninetales",
    type: "FIRE",
    hp: 80,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "12/102",
    image: "/cards/ninetales.png",
    value: "$24",
    color: "#ff9666",
    weight: 4,
  },
  {
    name: "Poliwrath",
    type: "WATER",
    hp: 90,
    rarity: "HOLO RARE",
    set: "BASE SET",
    number: "13/102",
    image: "/cards/poliwrath.png",
    value: "$25",
    color: "#6dc8ef",
    weight: 5,
  },
  {
    name: "Kangaskhan",
    type: "COLORLESS",
    hp: 90,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "5/64",
    image: "/cards/kangaskhan.png",
    value: "$18",
    color: "#d2b48c",
    weight: 5,
  },
  {
    name: "Mr. Mime",
    type: "PSYCHIC",
    hp: 40,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "6/64",
    image: "/cards/mr-mime.png",
    value: "$24",
    color: "#ef91ce",
    weight: 4,
  },
  {
    name: "Nidoqueen",
    type: "GRASS",
    hp: 90,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "7/64",
    image: "/cards/nidoqueen.png",
    value: "$21",
    color: "#86ce72",
    weight: 4,
  },
  {
    name: "Pidgeot",
    type: "COLORLESS",
    hp: 80,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "8/64",
    image: "/cards/pidgeot.png",
    value: "$23",
    color: "#d8ba82",
    weight: 4,
  },
  {
    name: "Pinsir",
    type: "GRASS",
    hp: 60,
    rarity: "HOLO RARE",
    set: "JUNGLE",
    number: "9/64",
    image: "/cards/pinsir.png",
    value: "$19",
    color: "#8acb63",
    weight: 5,
  },
  {
    name: "Aerodactyl",
    type: "FIGHTING",
    hp: 60,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "1/62",
    image: "/cards/aerodactyl.png",
    value: "$29",
    color: "#a98dd8",
    weight: 3,
  },
  {
    name: "Ditto",
    type: "COLORLESS",
    hp: 50,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "3/62",
    image: "/cards/ditto.png",
    value: "$27",
    color: "#dca7e8",
    weight: 3,
  },
  {
    name: "Haunter",
    type: "PSYCHIC",
    hp: 50,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "6/62",
    image: "/cards/haunter.png",
    value: "$25",
    color: "#a47be5",
    weight: 4,
  },
  {
    name: "Moltres",
    type: "FIRE",
    hp: 70,
    rarity: "HOLO RARE",
    set: "FOSSIL",
    number: "12/62",
    image: "/cards/moltres.png",
    value: "$39",
    color: "#ff7759",
    weight: 2,
  },
  {
    name: "Jigglypuff",
    type: "COLORLESS",
    hp: 60,
    rarity: "COMMON",
    set: "JUNGLE",
    number: "54/64",
    image: "/cards/jigglypuff.png",
    value: "$3",
    color: "#ffaed8",
    weight: 6,
  },
  {
    name: "Meowth",
    type: "COLORLESS",
    hp: 50,
    rarity: "COMMON",
    set: "JUNGLE",
    number: "56/64",
    image: "/cards/meowth.png",
    value: "$3",
    color: "#ead091",
    weight: 7,
  },
  {
    name: "Psyduck",
    type: "WATER",
    hp: 50,
    rarity: "COMMON",
    set: "FOSSIL",
    number: "53/62",
    image: "/cards/psyduck.png",
    value: "$4",
    color: "#f4d85f",
    weight: 7,
  },
  {
    name: "Slowpoke",
    type: "PSYCHIC",
    hp: 50,
    rarity: "COMMON",
    set: "FOSSIL",
    number: "55/62",
    image: "/cards/slowpoke.png",
    value: "$3",
    color: "#e99ab9",
    weight: 7,
  },
  {
    name: "Cubone",
    type: "FIGHTING",
    hp: 40,
    rarity: "COMMON",
    set: "JUNGLE",
    number: "50/64",
    image: "/cards/cubone.png",
    value: "$4",
    color: "#c8a071",
    weight: 7,
  },
  {
    name: "Dratini",
    type: "COLORLESS",
    hp: 40,
    rarity: "UNCOMMON",
    set: "BASE SET",
    number: "26/102",
    image: "/cards/dratini.png",
    value: "$5",
    color: "#8ed1e9",
    weight: 6,
  },
  {
    name: "Magikarp",
    type: "WATER",
    hp: 30,
    rarity: "UNCOMMON",
    set: "BASE SET",
    number: "35/102",
    image: "/cards/magikarp.png",
    value: "$4",
    color: "#ef8a57",
    weight: 8,
  },
  {
    name: "Ivysaur",
    type: "GRASS",
    hp: 60,
    rarity: "UNCOMMON",
    set: "BASE SET",
    number: "30/102",
    image: "/cards/ivysaur.png",
    value: "$7",
    color: "#79c77e",
    weight: 6,
  },
  {
    name: "Charmander",
    type: "FIRE",
    hp: 50,
    rarity: "COMMON",
    set: "BASE SET",
    number: "46/102",
    image: "/cards/charmander.png",
    value: "$18",
    color: "#ff9c57",
    weight: 7,
  },
  {
    name: "Charmeleon",
    type: "FIRE",
    hp: 80,
    rarity: "UNCOMMON",
    set: "BASE SET",
    number: "24/102",
    image: "/cards/charmeleon.png",
    value: "$34",
    color: "#ff754d",
    weight: 5,
  },
];

const packs = [
  {
    id: "base-signal",
    name: "Base Signal",
    subtitle: "THE ORIGINAL 102",
    color: "#c7ff4f",
    accent: "#ff7256",
    cost: 0.05,
    holo: 20,
    art: "/pack-art/pikachu.png",
    pokemon: "PIKACHU",
    pool: [3, 9, 10, 28, 20, 21, 48, 47, 49],
  },
  {
    id: "holo-rush",
    name: "Holo Rush",
    subtitle: "RARE ENERGY",
    color: "#ffdc58",
    accent: "#8d72ff",
    cost: 0.1,
    holo: 55,
    art: "/pack-art/mewtwo.png",
    pokemon: "MEWTWO",
    pool: [4, 6, 24, 25, 26, 27, 23, 40],
  },
  {
    id: "vault-zero",
    name: "Vault Zero",
    subtitle: "GRAIL PROTOCOL",
    color: "#9b83ff",
    accent: "#65e2ff",
    cost: 0.25,
    holo: 85,
    art: "/pack-art/charizard.png",
    pokemon: "CHARIZARD",
    pool: [0, 1, 2, 7, 8, 33, 22, 41],
  },
  {
    id: "shadow-pulse",
    name: "Shadow Pulse",
    subtitle: "NIGHT SHIFT",
    color: "#9d6bff",
    accent: "#39f5c7",
    cost: 0.08,
    holo: 40,
    art: "/pack-art/gengar.png",
    pokemon: "GENGAR",
    pool: [5, 38, 36, 37, 44, 42, 43, 46],
  },
  {
    id: "sky-breaker",
    name: "Sky Breaker",
    subtitle: "DRAGON SIGNAL",
    color: "#ff9a4d",
    accent: "#67d5ff",
    cost: 0.16,
    holo: 70,
    art: "/pack-art/dragonite.png",
    pokemon: "DRAGONITE",
    pool: [11, 12, 39, 34, 17, 35, 45, 29],
  },
  {
    id: "prism-wild",
    name: "Prism Wild",
    subtitle: "FULL SPECTRUM",
    color: "#ff86d7",
    accent: "#74f6ff",
    cost: 0.5,
    holo: 95,
    art: "/pack-art/eevee.png",
    pokemon: "EEVEE",
    pool: [13, 14, 15, 16, 18, 19, 30, 31, 32],
  },
];

const isHolo = (item) => item.rarity === "HOLO RARE";

function cardChance(pack, item) {
  const pool = pack.pool.map((index) => cards[index]).filter((cardItem) => isHolo(cardItem) === isHolo(item));
  const poolWeight = pool.reduce((sum, cardItem) => sum + cardItem.weight, 0);
  const tierChance = isHolo(item) ? pack.holo : 100 - pack.holo;
  return (tierChance * item.weight) / poolWeight;
}

let saved;
try {
  saved = JSON.parse(localStorage.getItem("pokegen-v2"));
} catch {}
const state = {
  tab: "home",
  collectionFilter: "all",
  machineIndex: 1,
  machineFilter: "all",
  energy: 1500,
  owned: [],
  claimDate: "",
  vaultToken: "",
  vaultWallet: "",
  sessionToken: "",
  sessionWallet: "",
  ...saved,
};
if (!["home", "packs", "collection"].includes(state.tab)) state.tab = "home";
state.machineIndex = Math.min(Math.max(Number(state.machineIndex) || 0, 0), packs.length - 1);
if (!["all", "holo", "uncommon", "common"].includes(state.machineFilter)) state.machineFilter = "all";
if (!state.vaultToken || !state.vaultWallet) state.owned = [];
state.owned = Array.from(
  { length: cards.length },
  (_, index) => state.owned[index] || 0,
);
let openingPack = null;
let pulledCard = null;
let walletAddress = null;
let walletBalance = null;

function persist() {
  localStorage.setItem("pokegen-v2", JSON.stringify(state));
}

function card(card, index, className = "") {
  const owned = state.owned[index] || 0;
  return `<article class="tcg-card ${owned ? "is-owned" : "is-missing"} ${className}" style="--card:${card.color}">
    <div class="slab-head"><span>PG / ${String(index + 1).padStart(3, "0")}</span><strong>${owned ? `ARCHIVED ×${owned}` : "SEALED"}</strong></div>
    <div class="card-slab">
      <div class="slab-rail"><span>${card.type}</span><i></i><small>${card.rarity}</small></div>
      <div class="tcg-image"><img src="${card.image}" alt="Original ${card.name} ${card.set} Pokémon card" loading="lazy">${owned ? "" : `<div class="unknown-card"><strong>${String(index + 1).padStart(3, "0")}</strong><span>UNDISCOVERED CARD</span></div>`}</div>
      <div class="slab-cert"><span>POKÉGEN ARCHIVE</span><b>${card.set} / ${card.number}</b></div>
    </div>
    <div class="tcg-title"><div><small>${card.type} · ${card.hp} HP</small><h3>${owned ? card.name : "Unknown card"}</h3></div><strong>${owned ? card.value : "—"}</strong></div>
    <div class="tcg-foot"><span>${owned ? "ORIGINAL CARD SCAN" : "OPEN A PACK TO REVEAL"}</span><span>${card.rarity}</span></div>
  </article>`;
}

function homeView() {
  const previewCards = [cards[5], cards[0], cards[1], cards[4], cards[2]];
  const howSteps = [
    {
      no: "01",
      title: "Open the pack",
      copy: "Choose a machine and see the exact odds before the pull",
      visual: `<div class="how-visual how-pack-visual"><div class="how-orbit"></div><img src="/reference-packs/pack-2.webp" alt="Sealed Holo Rush pack"><span>SELECTED / HOLO RUSH</span></div>`,
    },
    {
      no: "02",
      title: "Meet your card",
      copy: "The server reveals one original Kanto card",
      visual: `<div class="how-visual how-reveal-visual"><div class="reveal-burst"><i></i><i></i><i></i></div><div class="reveal-wrapper"><img class="wrapper-left" src="/reference-packs/pack-2.webp" alt=""><img class="wrapper-right" src="/reference-packs/pack-2.webp" alt=""></div><img class="reveal-card" src="${cards[4].image}" alt="Original Mewtwo card"><b>HOLO RARE</b><span>55% HOLO POOL</span></div>`,
    },
    {
      no: "03",
      title: "Make it yours",
      copy: "Your signed pull lands in the connected binder",
      visual: `<div class="how-visual how-binder-visual"><div class="mini-binder-count"><strong>03</strong><small>OF 50<br>FOUND</small></div><div class="mini-binder-cards">${[3,1,5].map((index)=>`<img src="${cards[index].image}" alt="${cards[index].name}">`).join("")}</div><span>PERSONAL VAULT</span></div>`,
    },
  ];
  return `<div class="penny-home">
    <section class="ref-hero">
      <img class="ref-hero-bg" src="/pokegen-banner.webp" alt="">
      <div class="ref-hero-copy"><span>LIVE ON SOLANA</span><h1>RIP THE PACK<br>OWN THE PULL</h1><p>Original Kanto cards. Weighted pulls. Every hit saved to your vault.</p><button data-tab="packs">OPEN A PACK</button></div>
      <div class="ref-pack-fan" aria-hidden="true">${[packs[3],packs[1],packs[5]].map((pack,index)=>`<article class="ref-pack ref-pack-${index+1}"><img class="reference-pack-image" src="/reference-packs/pack-${[4,2,3][index]}.webp" alt=""></article>`).join("")}</div>
    </section>
    <section class="machine-market">
      <div class="market-title"><div><span>CHOOSE YOUR ODDS</span><h2>Find your next pull</h2></div><button data-tab="packs">VIEW ALL MACHINES</button></div>
      <div class="machine-grid">${packs.map((pack,index)=>`<article class="market-pack pack-${pack.id}" style="--pack:${pack.color};--accent:${pack.accent}"><div class="market-pack-art"><img class="reference-pack-image" src="/reference-packs/pack-${[1,2,3,4,2,3][index]}.webp" alt="${pack.name} sealed pack"></div><div class="market-pack-copy"><h3>${pack.name}</h3><strong>${pack.cost} SOL</strong></div><div class="pack-roster"><small>IN THIS PACK · ${pack.pool.length} CARDS</small><div>${pack.pool.map((cardIndex)=>`<span>${cards[cardIndex].name}</span>`).join("")}</div></div><div class="pack-quantity"><button type="button" aria-label="Increase quantity">+</button><span>01</span><button type="button" aria-label="Decrease quantity">−</button></div><button data-tab="packs">OPEN PACK</button></article>`).join("")}</div>
    </section>
    <section class="ref-live-pull"><div class="ref-section-title"><span>POOL PREVIEW</span><h2>Someone could pull this</h2></div><div class="ref-card-spread">${previewCards.map((item,index)=>`<img class="spread-${index+1}" src="${item.image}" alt="${item.name} original Pokémon card">`).join("")}</div><div class="ref-pull-caption"><span>FEATURED HIT</span><strong>${previewCards[2].name} · ${previewCards[2].set}</strong><button data-tab="packs">SEE THE POOL</button></div></section>
    <section class="market-how"><div class="how-heading"><span>HOW IT WORKS</span><h2>One pack<br>three ways<br>to collect</h2></div>${howSteps.map(({no,title,copy,visual})=>`<article><span>${no}</span>${visual}<div class="how-copy"><h3>${title}</h3><p>${copy}</p></div></article>`).join("")}</section>
    <section class="ref-vault-feature"><div><span>KEEP YOUR PULLS</span><h2>Your collection.<br>Always within reach.</h2><p>Every discovered card stays attached to your wallet vault and reveals its original color in the binder.</p><button data-tab="collection">OPEN BINDER</button></div><div class="ref-vault-stack">${[["01","SECURELY VAULTED","Your pulls stay bound to the connected wallet"],["02","FULLY REVEALED","Owned cards return to their original color"],["03","READY WORLDWIDE","Open the collection from any screen"]].map(([no,title,copy])=>`<article><span>${no}</span><div><strong>${title}</strong><p>${copy}</p></div></article>`).join("")}</div></section>
    <section class="ref-final-cta"><img src="/pokegen-banner.webp" alt=""><div><span>THE NEXT CARD</span><h2>Your next pull<br>is waiting</h2><p>Six machines. Fifty original cards. One signed vault.</p><button data-tab="packs">OPEN A PACK</button></div></section>
    <section class="market-foot"><div><strong>POKÉGEN</strong><span>SOLANA MAINNET · DROP 001</span></div><p>Fan-made prototype using original Pokémon TCG artwork<br>Wallet and payment requests target Solana mainnet</p></section>
  </div>`;
}

function collectionView() {
  const ownedSpecies = state.owned.filter(Boolean).length;
  const featuredOwned = cards
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => state.owned[index])
    .slice(0, 3);
  const collectionItems = cards
    .map((item, index) => ({ item, index, owned: state.owned[index] || 0 }))
    .filter(({ owned }) =>
      state.collectionFilter === "owned"
        ? owned
        : state.collectionFilter === "missing"
          ? !owned
          : true,
    );
  return `<section class="inner-page collection-page">
    <div class="binder-stage"><div class="binder-copy"><div class="kicker"><span></span> PERSONAL VAULT / ${String(ownedSpecies).padStart(2,"0")} FOUND</div><h1>CARD<br><strong>ARCHIVE</strong></h1><p>Color marks an owned card<br>Grey cards remain in the hunt<br>Every pull stays attached to your vault</p><div class="binder-actions"><button class="solid" data-tab="packs">OPEN A PACK</button><span>${state.owned.reduce((a,b)=>a+b,0)} TOTAL PULLS</span></div></div><div class="binder-showcase"><div class="binder-progress" style="--progress:${(ownedSpecies/cards.length)*360}deg"><div><strong>${String(ownedSpecies).padStart(2,"0")}</strong><span>OF ${cards.length}<br>FOUND</span></div></div>${featuredOwned.length ? `<div class="binder-fan">${featuredOwned.map(({item},i)=>`<img class="fan-${i+1}" src="${item.image}" alt="${item.name}">`).join("")}</div>` : `<div class="binder-empty"><strong>EMPTY VAULT</strong><span>OPEN A PACK TO REVEAL YOUR FIRST CARD</span></div>`}<div class="binder-caption"><span>CURRENT CARDS</span><strong>${featuredOwned.length ? featuredOwned.map(({item})=>item.name.toUpperCase()).join(" · ") : "NONE YET"}</strong></div></div></div>
    <div class="vault-bar"><div><span>YOUR VAULT</span><strong>${state.owned.reduce((a, b) => a + b, 0)} cards · ${ownedSpecies}/${cards.length} species</strong></div><div class="vault-progress" aria-label="${ownedSpecies} of ${cards.length} cards discovered"><i style="width:${(ownedSpecies/cards.length)*100}%"></i></div><span>BASE · JUNGLE · FOSSIL</span></div>
    <div class="collection-index-title"><div><span>THE COMPLETE INDEX</span><h2>Kanto, card by card</h2></div><small>DISCOVERED CARDS REVEAL THEIR ORIGINAL COLOR</small></div><div class="collection-controls"><div class="collection-filters">${[
      ["all", `ALL ${cards.length}`],
      ["owned", `OWNED ${ownedSpecies}`],
      ["missing", `MISSING ${cards.length - ownedSpecies}`],
    ].map(([id, label]) => `<button data-collection-filter="${id}" class="${state.collectionFilter === id ? "active" : ""}" aria-pressed="${state.collectionFilter === id}">${label}</button>`).join("")}</div><div class="collection-key"><span><b class="found"></b> DISCOVERED</span><span><b></b> UNKNOWN</span></div></div>
    <div class="collection-grid">${collectionItems.length ? collectionItems.map(({ item, index }) => card(item, index)).join("") : `<div class="empty-vault"><strong>NO CARDS YET</strong><span>Open a pack and your first discovery will appear here.</span><button class="solid" data-tab="packs">OPEN A PACK</button></div>`}</div>
    <div class="collection-cta"><p>Missing something?</p><button class="solid dark" data-tab="packs">CRACK A FRESH PACK</button></div>
  </section>`;
}

function packsView() {
  const selectedIndex = Math.min(Number(state.machineIndex || 0), packs.length - 1);
  const pack = packs[selectedIndex];
  const packCards = pack.pool.map((index) => cards[index]);
  const standardCards = packCards.filter((item) => !isHolo(item));
  const standardWeight = standardCards.reduce((sum, item) => sum + item.weight, 0);
  const uncommonWeight = standardCards.filter((item) => item.rarity === "UNCOMMON").reduce((sum, item) => sum + item.weight, 0);
  const commonWeight = standardCards.filter((item) => item.rarity === "COMMON").reduce((sum, item) => sum + item.weight, 0);
  const tiers = [
    ["holo", "HOLO", pack.holo, packCards.filter(isHolo).length],
    ["uncommon", "UNCOMMON", ((100 - pack.holo) * uncommonWeight) / standardWeight, standardCards.filter((item) => item.rarity === "UNCOMMON").length],
    ["common", "COMMON", ((100 - pack.holo) * commonWeight) / standardWeight, standardCards.filter((item) => item.rarity === "COMMON").length],
  ];
  const visibleCards = pack.pool
    .map((index) => ({ item: cards[index], index, chance: cardChance(pack, cards[index]) }))
    .filter(({ item }) => {
      if (state.machineFilter === "holo") return isHolo(item);
      if (state.machineFilter === "uncommon") return item.rarity === "UNCOMMON";
      if (state.machineFilter === "common") return item.rarity === "COMMON";
      return true;
    })
    .sort((a, b) => b.chance - a.chance);
  return `<section class="inner-page machines-page-v2" style="--machine:${pack.color};--machine-accent:${pack.accent}">
    <header class="machine-page-head"><div><span>PACK MACHINES / KANTO 001</span><h1>Choose the machine</h1></div><p>Each machine has its own Pokémon pool.<br>Every listed card can drop from the selected pack.</p></header>
    <nav class="machine-tabs" aria-label="Pack machines">${packs.map((item, index) => `<button data-machine-select="${index}" class="${index === selectedIndex ? "active" : ""}" style="--tab:${item.color}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${item.name}</strong><small>${item.cost} SOL</small></button>`).join("")}</nav>
    <div class="machine-workbench">
      <aside class="machine-pull-panel">
        <div class="real-machine"><div class="machine-number">MACHINE ${String(selectedIndex + 1).padStart(2, "0")}</div><img src="/pack-vending-machine.webp" alt="Realistic vending machine filled with sealed trading card packs"><div class="machine-selection"><span>SELECTED PACK</span><strong>${pack.name}</strong><small>${pack.cost} SOL · ${pack.holo}% HOLO</small></div></div>
        <button class="machine-pull-button" data-open-pack="${selectedIndex}"><span>${walletAddress ? "OPEN THIS MACHINE" : "CONNECT TO OPEN"}</span><strong>${pack.cost} SOL</strong></button>
        <div class="machine-proof">SIGN ONCE / VERIFY PAYMENT / STORE CARD</div>
      </aside>
      <div class="machine-catalog">
        <div class="machine-description"><span>SELECTED / ${String(selectedIndex + 1).padStart(2, "0")}</span><h2>${pack.name}</h2><p>${pack.pool.length} exclusive Pokémon in this machine. One signed request returns one original card scan to your binder.</p></div>
        <div class="tier-strip">${tiers.map(([id, label, chance, count]) => `<button data-machine-filter="${id}" class="${state.machineFilter === id ? "active" : ""}"><span>${label}</span><strong>${chance.toFixed(1)}%</strong><small>${count} CARDS</small></button>`).join("")}</div>
        <div class="pool-heading"><div><span>INSIDE THE MACHINE</span><h3>${state.machineFilter === "all" ? "All cards" : state.machineFilter.toLowerCase()}</h3></div><div class="pool-filters">${[["all", `ALL ${pack.pool.length}`],["holo","HOLO"],["uncommon","UNCOMMON"],["common","COMMON"]].map(([id,label])=>`<button data-machine-filter="${id}" class="${state.machineFilter === id ? "active" : ""}">${label}</button>`).join("")}</div></div>
        <p class="pool-note">${visibleCards.length} cards · exact probability for ${pack.name} · sorted by pull chance</p>
        <div class="machine-card-grid">${visibleCards.map(({item,index,chance})=>`<article style="--pool-card:${item.color}"><div class="pool-card-image"><img src="${item.image}" alt="Original ${item.name} card" loading="lazy"><span>${item.rarity}</span></div><div><strong>${item.name}</strong><small>${item.set} · ${item.number}</small><b>${chance.toFixed(2)}%</b></div></article>`).join("")}</div>
      </div>
    </div>
  </section>`;
}

function overlay() {
  if (openingPack !== null) {
    const pack = packs[openingPack];
    return `<div class="pack-overlay opening" style="--pack:${pack.color};--accent:${pack.accent}"><div class="opening-color-wash" aria-hidden="true"><span></span><span></span></div><div class="opening-copy"><span>${pack.holo}% HOLO CHANCE</span><h2>BREAKING<br>THE SEAL</h2><p>${pack.name} · ${pack.cost} SOL preview</p></div><div class="opening-stage"><div class="opening-pack"><div class="opening-crimp"></div><span>POKÉGEN / DROP 001</span><strong>${pack.name}</strong><small>${pack.subtitle}</small><img src="${pack.art}" alt="${pack.pokemon}"><div class="tear-strip">SIGNED · VERIFIED · RIP HERE</div></div><div class="opening-status">OPENING PACK</div></div></div>`;
  }
  if (pulledCard === null) return "";
  const item = cards[pulledCard];
  return `<div class="pack-overlay result ${isHolo(item) ? "holo-result" : "standard-result"}" style="--pull:${item.color}"><div class="result-color-wash" aria-hidden="true"><span></span><span></span></div><div class="result-aura" aria-hidden="true"></div><div class="result-card"><div class="result-copy"><span>SERVER PULL / VERIFIED</span><strong>${item.rarity}</strong></div><div class="revealed-card"><img src="${item.image}" alt="${item.name} Pokémon card"><span class="foil-pass" aria-hidden="true"></span></div><div class="result-name"><div><small>YOU FOUND</small><h2>${item.name}</h2></div><span>${item.set}<br>${item.number} · ${item.hp} HP</span></div><button data-close-pack>LOCK IN VAULT</button></div><div class="pull-serial">PULL ${String(pulledCard + 1).padStart(3, "0")} / ${String(cards.length).padStart(3, "0")}</div></div>`;
}

function currentView() {
  if (state.tab === "collection") return collectionView();
  if (state.tab === "packs") return packsView();
  return homeView();
}

let revealObserver = null;
let scrollEffectHandler = null;
let scrollEffectFrame = 0;

function setupScrollEffects() {
  revealObserver?.disconnect();
  if (scrollEffectHandler) window.removeEventListener("scroll", scrollEffectHandler);
  cancelAnimationFrame(scrollEffectFrame);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("motion-ready", !reducedMotion);
  if (reducedMotion) return;

  const groups = [
    [".market-title", 0],
    [".machine-grid .market-pack", 85],
    [".market-how", 0],
    [".market-how article", 65],
    [".ref-live-pull", 0],
    [".ref-card-spread img", 70],
    [".ref-vault-feature", 0],
    [".ref-vault-stack article", 90],
    [".ref-final-cta", 0],
    [".market-foot", 0],
    [".machine-page-head", 0],
    [".machine-tabs", 0],
    [".machine-workbench", 0],
    [".machine-description", 0],
    [".tier-strip button", 75],
    [".pool-heading", 0],
    [".machine-card-grid article", 28],
    [".binder-stage", 0],
    [".vault-bar", 0],
    [".collection-index-title", 0],
    [".collection-grid .tcg-card", 34],
    [".collection-cta", 0],
  ];

  const revealNodes = [];
  groups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      node.classList.add("fx-reveal");
      node.style.setProperty("--fx-delay", `${Math.min(index % 10, 9) * stagger}ms`);
      revealNodes.push(node);
    });
  });

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("fx-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
  requestAnimationFrame(() => {
    revealNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top >= window.innerHeight * 0.96 || rect.bottom <= 0) return;
      node.classList.add("fx-in");
      revealObserver.unobserve(node);
    });
  });

  const updateDepth = () => {
    scrollEffectFrame = 0;
    document.documentElement.style.setProperty("--depth-logo", `${window.scrollY * 0.045}px`);
    document.documentElement.style.setProperty("--depth-word", `${window.scrollY * -0.025}px`);
    document.documentElement.style.setProperty("--depth-cyan-x", `${window.scrollY * 0.018}px`);
    document.documentElement.style.setProperty("--depth-cyan-y", `${window.scrollY * -0.018}px`);
    document.documentElement.style.setProperty("--depth-orange-x", `${window.scrollY * -0.014}px`);
    document.documentElement.style.setProperty("--depth-orange-y", `${window.scrollY * -0.012}px`);
    const hero = document.querySelector(".brand-hero");
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      hero.style.setProperty("--hero-image-shift", `${progress * 18}px`);
      hero.style.setProperty("--hero-image-scale", (1 + progress * 0.05).toFixed(3));
      hero.style.setProperty("--hero-copy-shift", `${progress * -52}px`);
      hero.style.setProperty("--hero-copy-opacity", (1 - progress * 0.82).toFixed(3));
      hero.style.setProperty("--hero-shade-opacity", (1 - progress * 0.18).toFixed(3));
    }
    const referenceHero = document.querySelector(".ref-hero");
    if (referenceHero) {
      const rect = referenceHero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      referenceHero.style.setProperty("--ref-bg-shift", `${progress * 78}px`);
      referenceHero.style.setProperty("--ref-pack-shift", `${progress * -34}px`);
      referenceHero.style.setProperty("--ref-copy-opacity", (1 - progress * 0.72).toFixed(3));
    }
  };
  scrollEffectHandler = () => {
    if (!scrollEffectFrame) scrollEffectFrame = requestAnimationFrame(updateDepth);
  };
  window.addEventListener("scroll", scrollEffectHandler, { passive: true });
  updateDepth();
}

function render() {
  document.querySelector("#app").innerHTML =
    `<div class="noise"></div><div class="site-backdrop" aria-hidden="true"><img class="backdrop-logo" src="/pokegen-logo.webp" alt=""><div class="backdrop-word">KANTO</div><i class="backdrop-band cyan"></i><i class="backdrop-band orange"></i><i class="backdrop-card card-a"></i><i class="backdrop-card card-b"></i><i class="backdrop-frame"></i></div><header class="site-header"><button class="site-brand" data-tab="home"><img src="/pokegen-logo.webp" alt="Pokégen"></button><nav>${[
      ["home", "MARKET"],
      ["packs", "MACHINES"],
      ["collection", "BINDER"],
    ]
      .map(
        ([id, label]) =>
          `<button data-tab="${id}" class="${state.tab === id ? "active" : ""}">${label}</button>`,
      )
      .join(
        "",
      )}</nav><div class="wallet"><span class="chain-status">MAINNET</span><button id="connect-wallet" class="wallet-button">${walletAddress ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}${walletBalance === null ? "" : ` · ${walletBalance.toFixed(2)} SOL`}` : "CONNECT WALLET"}</button><button id="help">?</button></div></header><main>${currentView()}</main>${overlay()}<div class="toast" role="status"></div>`;
  bind();
  setupScrollEffects();
}

function toast(message) {
  const node = document.querySelector(".toast");
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2800);
}

function switchTab(tab) {
  state.tab = tab;
  persist();
  render();
  window.scrollTo(0, 0);
}

async function apiPost(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Backend request failed");
  return result;
}

function signatureToBase64(signature) {
  let binary = "";
  for (const byte of signature) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function sessionIsActive() {
  if (!state.sessionToken || state.sessionWallet !== walletAddress) return false;
  try {
    const encoded = state.sessionToken.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const claim = JSON.parse(atob(padded));
    return claim.kind === "wallet-session" && claim.wallet === walletAddress && claim.expiresAt > Date.now() + 30_000;
  } catch {
    return false;
  }
}

async function ensureWalletSession(provider) {
  if (sessionIsActive()) return state.sessionToken;
  if (!provider?.signMessage) throw new Error("Your wallet does not support message signing");
  const auth = await apiPost("/api/auth/session", { wallet: walletAddress });
  toast("Approve once to open packs for 7 days");
  const signed = await provider.signMessage(new TextEncoder().encode(auth.message), "utf8");
  const signature = signed.signature || signed;
  const session = await apiPost("/api/auth/session", {
    wallet: walletAddress,
    challenge: auth.challenge,
    signature: signatureToBase64(signature),
  });
  state.sessionToken = session.sessionToken;
  state.sessionWallet = walletAddress;
  persist();
  return state.sessionToken;
}

async function submitPackPayment(provider, quote) {
  if (!quote?.required) return "";
  if (!quote.configured || !quote.treasury) {
    throw new Error("Live payments are not configured");
  }
  const endpoint = clusterApiUrl(
    quote.cluster === "mainnet-beta" ? "mainnet-beta" : "devnet",
  );
  const connection = new Connection(endpoint, "confirmed");
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: provider.publicKey,
      toPubkey: new PublicKey(quote.treasury),
      lamports: Number(quote.lamports),
    }),
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: new TextEncoder().encode(quote.memo),
    }),
  );
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  transaction.feePayer = provider.publicKey;
  transaction.recentBlockhash = blockhash;
  toast(`Approve ${quote.sol} SOL payment in Phantom`);
  const paymentSignature = await provider.sendTransaction(transaction, connection);
  await connection.confirmTransaction(
    { signature: paymentSignature, blockhash, lastValidBlockHeight },
    "confirmed",
  );
  return paymentSignature;
}

async function connectWallet() {
  const provider = window.phantom?.solana || window.solana;
  if (!provider?.isPhantom) {
    toast("Phantom wallet not found. Install Phantom to connect on Solana.");
    window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
    return false;
  }
  try {
    const response = await provider.connect();
    walletAddress = response.publicKey.toString();
    walletBalance = null;
    render();
    const balanceResponse = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [walletAddress],
      }),
    });
    const balanceData = await balanceResponse.json();
    walletBalance =
      typeof balanceData?.result?.value === "number"
        ? balanceData.result.value / 1e9
        : null;
    if (state.vaultToken && state.vaultWallet === walletAddress) {
      try {
        const vault = await apiPost("/api/vault", {
          wallet: walletAddress,
          vaultToken: state.vaultToken,
        });
        state.owned = Array.from(
          { length: cards.length },
          (_, index) => vault.owned[index] || 0,
        );
        persist();
      } catch {
        state.vaultToken = "";
        state.vaultWallet = "";
        persist();
      }
    }
    render();
    toast("Phantom connected. Server vault ready.");
    return true;
  } catch {
    toast("Wallet connection was cancelled.");
    return false;
  }
}

function bind() {
  document
    .querySelectorAll("[data-tab]")
    .forEach(
      (button) => (button.onclick = () => switchTab(button.dataset.tab)),
    );
  document.querySelectorAll("[data-collection-filter]").forEach(
    (button) =>
      (button.onclick = () => {
        state.collectionFilter = button.dataset.collectionFilter;
        persist();
        render();
      }),
  );
  document.querySelectorAll("[data-machine-select]").forEach(
    (button) =>
      (button.onclick = () => {
        state.machineIndex = Number(button.dataset.machineSelect);
        state.machineFilter = "all";
        persist();
        render();
      }),
  );
  document.querySelectorAll("[data-machine-filter]").forEach(
    (button) =>
      (button.onclick = () => {
        state.machineFilter = button.dataset.machineFilter;
        persist();
        render();
      }),
  );
  document.querySelector("#help").onclick = () =>
    toast(
      "Connect Phantom, sign a pack request and receive a server-signed vault receipt.",
    );
  document.querySelector("#connect-wallet").onclick = async () => {
    if (!walletAddress) return connectWallet();
    const provider = window.phantom?.solana || window.solana;
    await provider?.disconnect?.();
    walletAddress = null;
    walletBalance = null;
    render();
  };
  document.querySelectorAll("[data-open-pack]").forEach(
    (button) =>
      (button.onclick = async () => {
        const index = +button.dataset.openPack;
        const pack = packs[index];
        if (!walletAddress && !(await connectWallet())) return;
        const provider = window.phantom?.solana || window.solana;
        try {
          const sessionToken = await ensureWalletSession(provider);
          const auth = await apiPost("/api/auth/challenge", {
            wallet: walletAddress,
            packId: pack.id,
          });
          const paymentSignature = await submitPackPayment(provider, auth.quote);
          openingPack = index;
          render();
          const [result] = await Promise.all([
            apiPost("/api/packs/open", {
              challenge: auth.challenge,
              sessionToken,
              paymentSignature,
              vaultToken:
                state.vaultWallet === walletAddress ? state.vaultToken : "",
            }),
            new Promise((resolve) => setTimeout(resolve, 1250)),
          ]);
          pulledCard = result.card.index;
          state.owned = result.vault.owned;
          state.vaultToken = result.vaultToken;
          state.vaultWallet = walletAddress;
          openingPack = null;
          persist();
          render();
        } catch (error) {
          openingPack = null;
          if (/session/i.test(error.message || "")) {
            state.sessionToken = "";
            state.sessionWallet = "";
            persist();
          }
          render();
          toast(error.message || "Pack request failed.");
        }
      }),
  );
  document.querySelector("[data-close-pack]")?.addEventListener("click", () => {
    pulledCard = null;
    render();
  });
}

render();
