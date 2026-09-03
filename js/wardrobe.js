(() => {
  'use strict';

  const D = window.ASU_DATA || {};
  const P = window.ASU_PROFILES || {};

  if (Array.isArray(D.referenceScopes) && !D.referenceScopes.includes('wardrobe')) D.referenceScopes.splice(3, 0, 'wardrobe');
  if (Array.isArray(D.aesthetics)) {
    if (!D.aesthetics.some(x => x[0] === 'SOUL_NATURAL')) D.aesthetics.splice(1, 0, ['SOUL_NATURAL','Natural Fashion Snapshot']);
    if (!D.aesthetics.some(x => x[0] === 'RAW_AMATEUR')) D.aesthetics.splice(2, 0, ['RAW_AMATEUR','Raw Amateur / Messy Snapshot']);
  }
  P.aesthetics = P.aesthetics || {};
  P.aesthetics.SOUL_NATURAL = 'natural fashion-aware snapshot with believable human texture, subtle asymmetry, ordinary real-world styling, casual directness, soft-to-direct practical light, slight framing imperfection and consumer-camera realism; attractive but never glossy studio perfection';
  P.aesthetics.RAW_AMATEUR = 'raw amateur snapshot, visibly imperfect timing and framing, uneven subject spacing, slight crop mistakes, hard consumer flash or practical ambient light, natural skin shine, noisy shadows, occasional motion softness, weak dynamic range and zero commercial polish';

  const ERA = {
    '1980S': {
      FEMALE:{tops:['simple cotton blouse with short sleeves','loose tucked-in T-shirt','light patterned button-up blouse','plain knit top'],bottoms:['high-waisted straight trousers','knee-length casual skirt','high-waisted straight jeans','simple pleated skirt'],shoes:['canvas sneakers','simple leather flats','low-heel sandals'],acc:['small analog wristwatch','simple shoulder bag','thin metal-frame glasses','no noticeable accessories']},
      MALE:{tops:['plain crew-neck T-shirt','short-sleeve patterned shirt','light polo shirt','simple tucked button-up shirt'],bottoms:['straight denim jeans','pleated casual trousers','high-waisted chinos','simple dark slacks'],shoes:['canvas sneakers','plain leather shoes','simple sandals'],acc:['analog wristwatch','simple belt','thin metal-frame glasses','no noticeable accessories']}
    },
    '1990S': {
      FEMALE:{tops:['fitted ribbed tank top','plain baby tee','oversized washed T-shirt','simple sleeveless cotton top','loose plaid overshirt over a basic tee','cropped knit top with modest 1990s cut'],bottoms:['high-waisted straight jeans','loose light-wash denim','simple black mini skirt with opaque tights','wide straight trousers','mid-rise denim skirt'],shoes:['worn canvas sneakers','simple platform sandals','plain white sneakers','black casual flats'],acc:['small pendant necklace','simple hoop earrings','thin shoulder bag','scrunchie on wrist','no noticeable accessories']},
      MALE:{tops:['washed oversized graphic band-style T-shirt','plain black crew-neck T-shirt','loose striped T-shirt','open plaid flannel over a basic tee','boxy short-sleeve button-up'],bottoms:['loose straight-leg jeans','faded denim jeans','dark cargo trousers','simple relaxed chinos'],shoes:['worn canvas sneakers','plain skate-style shoes','simple black sneakers'],acc:['simple chain necklace','analog wristwatch','small hoop earring','simple ring','no noticeable accessories']}
    },
    '2000S': {
      FEMALE:{tops:['fitted baby tee','ribbed spaghetti-strap tank','cropped zip hoodie over a camisole','graphic fitted T-shirt','simple halter-style top','layered tank tops'],bottoms:['low-rise straight jeans','denim mini skirt','cargo pants','bootcut jeans','sporty track pants'],shoes:['chunky casual sneakers','simple platform sandals','ballet flats','skate-style shoes'],acc:['small shoulder bag','thin butterfly pendant','simple hoop earrings','colorful hair clip','wired earphones']},
      MALE:{tops:['oversized graphic T-shirt','striped polo shirt','layered long-sleeve under a T-shirt','track jacket over a plain tee','boxy skate T-shirt'],bottoms:['baggy jeans','cargo pants','loose dark denim','track pants'],shoes:['skate-style sneakers','chunky running shoes','plain canvas sneakers'],acc:['wallet chain','simple silver chain','rubber wristband','wired earphones','baseball cap']}
    },
    '2010S': {
      FEMALE:{tops:['simple crop top','oversized knit sweater','plaid shirt over a tank top','basic fitted T-shirt','denim jacket over a plain top'],bottoms:['high-waisted skinny jeans','black leggings','denim shorts','skater skirt','mom jeans'],shoes:['canvas sneakers','ankle boots','plain running shoes','simple flats'],acc:['small crossbody bag','wired earphones','thin choker','simple watch','canvas tote bag']},
      MALE:{tops:['plain V-neck T-shirt','plaid overshirt','slim denim jacket over a tee','basic hoodie','graphic streetwear T-shirt'],bottoms:['slim jeans','dark chinos','jogger pants','straight denim'],shoes:['canvas sneakers','minimal trainers','casual boots'],acc:['simple watch','canvas backpack','wired earphones','baseball cap','thin bracelet']}
    },
    '2020S': {
      FEMALE:{tops:['plain fitted tank top','oversized cotton T-shirt','simple ribbed crop top','light cardigan over a basic top','boxy casual shirt'],bottoms:['relaxed straight jeans','wide-leg trousers','loose cargo pants','casual denim skirt','simple cotton shorts'],shoes:['ordinary lifestyle sneakers','flat sandals','canvas sneakers','simple loafers'],acc:['small shoulder bag','simple pendant necklace','minimal hoop earrings','canvas tote','phone in hand']},
      MALE:{tops:['oversized plain T-shirt','washed graphic T-shirt','light overshirt over a basic tee','simple polo shirt','boxy casual shirt'],bottoms:['relaxed straight jeans','loose cargo pants','casual chinos','straight dark trousers'],shoes:['ordinary lifestyle sneakers','canvas sneakers','simple loafers','sport sandals'],acc:['simple chain necklace','digital or simple wristwatch','crossbody sling bag','phone in hand','baseball cap']}
    },
    TIMELESS: {
      FEMALE:{tops:['plain cotton T-shirt','simple tank top','light casual blouse','basic knit top'],bottoms:['straight jeans','casual trousers','simple skirt','denim shorts'],shoes:['plain sneakers','simple flats','flat sandals'],acc:['small shoulder bag','simple necklace','plain watch','no noticeable accessories']},
      MALE:{tops:['plain cotton T-shirt','simple polo shirt','casual button-up shirt','basic crew-neck top'],bottoms:['straight jeans','casual chinos','simple trousers','relaxed shorts'],shoes:['plain sneakers','simple loafers','casual sandals'],acc:['plain watch','simple chain','small sling bag','no noticeable accessories']}
    }
  };

  const SCENE = {
    CONCERT:{all:{tops:['washed music graphic T-shirt','dark casual top'],acc:['event wristband','simple chain or wristband']},FEMALE:{bottoms:['dark jeans','casual mini skirt with practical footwear']},MALE:{bottoms:['dark loose jeans','cargo trousers']}},
    BACKSTAGE:{all:{tops:['dark worn T-shirt','casual layered top'],acc:['backstage lanyard','event wristband']}},
    NIGHTLIFE:{FEMALE:{tops:['simple fitted night-out top','dark camisole with light layer','minimal sleeveless top'],bottoms:['dark straight jeans','simple mini skirt','black trousers'],shoes:['simple heels','dark sneakers']},MALE:{tops:['dark fitted T-shirt','open casual shirt over a tee','simple black shirt'],bottoms:['dark jeans','casual black trousers']}},
    HOUSE_PARTY:{all:{tops:['casual going-out top','comfortable graphic T-shirt'],shoes:['ordinary sneakers','simple sandals'],acc:['plastic cup or canned drink in hand']}},
    BEACH:{FEMALE:{tops:['simple swim top under a light cover-up','loose linen shirt over swimwear','light cotton tank'],bottoms:['swim bottoms with cover-up shorts','light beach shorts','casual sarong'],shoes:['barefoot','flat sandals']},MALE:{tops:['open light shirt over a plain tank','simple tank top','loose tropical short-sleeve shirt'],bottoms:['swim shorts','light casual shorts'],shoes:['barefoot','simple sandals']}},
    POOL:{FEMALE:{tops:['simple swimsuit or swim top','light cover-up over swimwear'],bottoms:['swim bottoms','light shorts'],shoes:['pool slides','barefoot']},MALE:{tops:['plain tank top','bare upper body with towel nearby'],bottoms:['swim shorts'],shoes:['pool slides','barefoot']}},
    WEDDING_GUEST:{FEMALE:{tops:['modest modern kebaya-style blouse','simple formal blouse','subtle brocade top'],bottoms:['batik midi skirt','formal long skirt','tailored trousers'],shoes:['simple block heels','elegant flats'],acc:['small clutch','delicate earrings']},MALE:{tops:['long-sleeve batik shirt','plain formal shirt'],bottoms:['dark tailored trousers'],shoes:['plain leather shoes'],acc:['simple wristwatch']}},
    SCHOOL:{all:{tops:['plain campus T-shirt','casual button-up shirt','simple hoodie'],bottoms:['straight jeans','casual trousers'],shoes:['canvas sneakers','ordinary sneakers'],acc:['backpack','notebook or tote bag']}},
    OFFICE:{FEMALE:{tops:['simple office blouse','light knit top with cardigan'],bottoms:['straight office trousers','modest midi skirt']},MALE:{tops:['casual office shirt','simple polo shirt'],bottoms:['chinos','straight office trousers']},all:{shoes:['simple loafers','clean sneakers'],acc:['lanyard','laptop sleeve or tote']}},
    WARTEG:{all:{tops:['ordinary cotton T-shirt','simple casual shirt'],bottoms:['straight jeans','casual trousers'],shoes:['simple sandals','ordinary sneakers'],acc:['no styled accessory; everyday practical look']}},
    MINIMARKET:{all:{tops:['ordinary cotton T-shirt','simple casual top'],bottoms:['straight jeans','casual trousers'],shoes:['ordinary sneakers','simple sandals'],acc:['small shopping bag or phone in hand']}},
    MALL:{all:{tops:['clean casual top','simple layered streetwear'],bottoms:['straight jeans','casual trousers'],shoes:['ordinary lifestyle sneakers','simple flats'],acc:['small shopping bag','crossbody bag']}},
    CAFE:{all:{tops:['clean casual top','light overshirt or cardigan'],bottoms:['straight jeans','casual trousers'],shoes:['ordinary sneakers','simple flats'],acc:['iced drink','canvas tote or small bag']}},
    BEDROOM:{all:{tops:['oversized sleep T-shirt','soft cotton top','loose hoodie'],bottoms:['soft shorts','sweatpants'],shoes:['barefoot','socks only'],acc:['phone in hand','no styled accessory']}},
    KOS_ROOM:{all:{tops:['oversized home T-shirt','plain cotton tank','casual worn tee'],bottoms:['soft shorts','loose lounge pants'],shoes:['barefoot','simple house sandals'],acc:['phone in hand','mug or no accessory']}},
    BATHROOM_MIRROR:{all:{tops:['simple fitted casual top','ordinary T-shirt','home tank top'],bottoms:['straight jeans','casual shorts'],shoes:['simple sandals','barefoot'],acc:['phone held for mirror photo']}},
    PARKING:{all:{tops:['casual street T-shirt','washed everyday top','light overshirt over a basic tee'],bottoms:['straight or loose jeans','casual trousers'],shoes:['worn sneakers','canvas shoes'],acc:['simple jewelry only','keys or phone in hand']}},
    GAS_STATION:{all:{tops:['casual street T-shirt','light jacket over a tee'],bottoms:['jeans','cargo trousers'],shoes:['ordinary sneakers'],acc:['keys or phone in hand']}},
    MOTORBIKE:{all:{tops:['casual T-shirt with light jacket','simple long-sleeve top'],bottoms:['jeans','casual trousers'],shoes:['closed sneakers','casual boots'],acc:['helmet carried or resting nearby']}},
    PUBLIC_TRANSIT:{all:{tops:['ordinary commuting top','light overshirt or cardigan'],bottoms:['straight jeans','casual trousers'],shoes:['comfortable sneakers','simple flats'],acc:['backpack or tote bag','wired earphones for older eras']}},
    AIRPORT:{all:{tops:['comfortable travel top','light jacket or overshirt'],bottoms:['relaxed trousers','straight jeans'],shoes:['comfortable sneakers'],acc:['carry-on bag','passport or phone']}},
    MARKET:{all:{tops:['light practical cotton top','simple casual shirt'],bottoms:['comfortable trousers','straight jeans'],shoes:['simple sandals','ordinary sneakers'],acc:['shopping tote or woven bag']}},
    THRIFT:{all:{tops:['layered secondhand-style casual top','washed graphic T-shirt'],bottoms:['relaxed jeans','casual skirt or trousers'],shoes:['worn sneakers','canvas shoes'],acc:['canvas tote','thrifted jacket carried by hand']}},
    STADIUM:{all:{tops:['team-color casual T-shirt or jersey-like top','plain sporty T-shirt'],bottoms:['jeans','sporty trousers'],shoes:['comfortable sneakers'],acc:['simple cap','small sling bag']}},
    SNOW_STREET:{all:{tops:['warm knit sweater under a practical coat','insulated casual jacket'],bottoms:['thick trousers','straight jeans'],shoes:['weatherproof boots'],acc:['scarf','simple gloves']}},
    GULF_MALL:{FEMALE:{tops:['modest long-sleeve blouse','clean abaya-inspired outer layer over casual clothes'],bottoms:['wide-leg trousers','long skirt']},MALE:{tops:['clean polo or casual shirt','simple long-sleeve shirt'],bottoms:['tailored casual trousers']},all:{shoes:['clean sneakers','simple loafers'],acc:['small shopping bag or phone']}},
    TOKYO_NIGHT:{all:{tops:['layered urban casual top','light jacket over a basic tee'],bottoms:['straight jeans','loose trousers'],shoes:['walking sneakers'],acc:['small shoulder bag','phone in hand']}},
    SEOUL_STREET:{all:{tops:['clean layered casual top','simple knit or overshirt'],bottoms:['wide straight trousers','clean jeans'],shoes:['minimal sneakers'],acc:['small crossbody bag','phone in hand']}}
  };

  const EVENT = {
    EID:{FEMALE:{tops:['modest festive blouse','simple embroidered tunic'],bottoms:['long skirt','wide modest trousers'],acc:['delicate festive jewelry']},MALE:{tops:['simple long-sleeve koko-style shirt','clean modest shirt'],bottoms:['dark trousers'],acc:['simple watch']}},
    CHRISTMAS:{all:{tops:['casual festive-colored top','simple knit top'],acc:['small understated festive accessory']}},
    LUNAR_NEW_YEAR:{FEMALE:{tops:['simple red festive blouse','modern modest cheongsam-inspired top']},MALE:{tops:['clean red or dark festive shirt']},all:{acc:['small red envelope or subtle festive detail']}},
    GALUNGAN:{FEMALE:{tops:['modest white lace kebaya-style top'],bottoms:['traditional patterned sarong'],acc:['simple sash detail']},MALE:{tops:['clean white ceremonial shirt'],bottoms:['traditional patterned sarong'],acc:['udeng-style headcloth if contextually appropriate']}},
    DIWALI:{all:{tops:['festive traditional-inspired top with restrained detail'],bottoms:['coordinated traditional trousers or skirt'],acc:['small festive jewelry detail']}},
    HALLOWEEN:{all:{tops:['casual improvised costume top or dark party outfit'],acc:['small playful costume accessory']}},
    BIRTHDAY:{all:{tops:['casual going-out top'],acc:['small party prop or simple birthday accessory']}},
    CONCERT:{all:{tops:['washed music graphic T-shirt','dark casual event top'],acc:['event wristband']}}
  };

  function hash(str){let h=2166136261>>>0;for(let i=0;i<String(str).length;i++){h^=String(str).charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed,salt=''){let a=(Number(seed)||1)^hash(salt);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function pick(arr,seed,salt){if(!arr||!arr.length)return null;const r=rng(seed,salt);return arr[Math.floor(r()*arr.length)]}
  function mergePool(base, extra){const out={tops:[...(base.tops||[])],bottoms:[...(base.bottoms||[])],shoes:[...(base.shoes||[])],acc:[...(base.acc||[])]};if(extra)Object.keys(out).forEach(k=>out[k].push(...(extra[k]||[])));return out}
  function applyRule(pool, rule, gender){if(!rule)return pool;pool=mergePool(pool,rule.all);pool=mergePool(pool,rule[gender]);return pool}

  function resolve(subject, r, seed, index){
    const gender = subject.gender === 'FEMALE' ? 'FEMALE' : 'MALE';
    if (subject.identitySource === 'REFERENCE' && Array.isArray(subject.scope) && subject.scope.includes('wardrobe')) {
      return {mode:'REFERENCE_LOCKED',instruction:`Preserve the clothing, footwear and visible wearable styling of the referenced ${gender==='FEMALE'?'woman':'man'} exactly; do not borrow wardrobe from another subject.`,top:null,bottom:null,shoes:null,accessory:null,notes:['reference wardrobe locked']};
    }

    const era = ERA[r.era] || ERA.TIMELESS;
    let pool = mergePool(era[gender] || ERA.TIMELESS[gender]);
    pool = applyRule(pool, SCENE[r.scene], gender);
    if (r.event && r.event !== 'NONE' && r.event !== 'AUTO') pool = applyRule(pool, EVENT[r.event], gender);

    const notes=[];
    if (['INDONESIA','SOUTHEAST_ASIA','TROPICAL'].includes(r.region) || r.weather === 'HUMID') {
      pool.tops.push('light breathable cotton top','simple short-sleeve casual top');
      pool.bottoms.push('lightweight casual trousers','relaxed jeans');
      notes.push('breathable for humid tropical weather');
    }
    if (r.weather === 'RAIN') {
      pool.tops.push('light rain jacket over a casual top','thin windbreaker over a T-shirt');
      pool.shoes.push('practical sneakers suitable for wet pavement');
      pool.acc.push('small folded umbrella','slightly damp hair or clothing edges');
      notes.push('rain-aware practical clothing');
    }
    if (r.weather === 'SNOW' || r.region === 'WINTER') {
      pool.tops.push('warm layered coat over knitwear');
      pool.bottoms.push('warm thick trousers');
      pool.shoes.push('weatherproof winter boots');
      pool.acc.push('scarf','simple gloves');
      notes.push('cold-weather layering');
    }
    if (['NIGHT','LATE_NIGHT','EVENING'].includes(r.time) && ['PARKING','ALLEY','JAKARTA_STREET','NIGHTLIFE','HOUSE_PARTY','GAS_STATION'].includes(r.scene)) {
      pool.tops.push('casual evening streetwear top','light outer layer over a basic top');
      notes.push('believable evening streetwear');
    }
    if (subject.hair === 'HIJAB') {
      pool.tops.push('modest long-sleeve casual blouse','loose long-sleeve tunic','long cardigan over a basic top');
      pool.bottoms.push('wide-leg trousers','long skirt','loose straight jeans');
      notes.push('modest silhouette compatible with hijab');
    }

    const s = Number(seed)||1;
    const top=pick(pool.tops,s,`top-${index}-${r.era}-${r.scene}-${gender}`);
    const bottom=pick(pool.bottoms,s+41,`bottom-${index}-${r.era}-${r.scene}-${gender}`);
    const shoes=pick(pool.shoes,s+83,`shoes-${index}-${r.scene}-${gender}`);
    const accessory=pick(pool.acc,s+127,`acc-${index}-${r.scene}-${gender}`);

    return {mode:'AUTO_CONTEXTUAL',top,bottom,shoes,accessory,notes};
  }

  function describe(w){
    if (!w) return '';
    if (w.mode === 'REFERENCE_LOCKED') return w.instruction;
    const items=[];
    if(w.top)items.push(w.top);
    if(w.bottom)items.push(w.bottom);
    if(w.shoes)items.push(w.shoes);
    let text=`Wardrobe: ${items.join(', ')}`;
    if(w.accessory && !/no noticeable|no styled accessory/i.test(w.accessory)) text += `; ${w.accessory}`;
    if(w.notes?.length) text += `. Context fit: ${w.notes.join(', ')}`;
    return text+'.';
  }

  function canonical(w){
    if(!w)return null;
    if(w.mode==='REFERENCE_LOCKED')return {MODE:w.mode,INSTRUCTION:w.instruction};
    return {MODE:w.mode,TOP:w.top,BOTTOM:w.bottom,SHOES:w.shoes,ACCESSORY:w.accessory,CONTEXT_NOTES:w.notes||[]};
  }

  window.ASU_WARDROBE={resolve,describe,canonical};
})();