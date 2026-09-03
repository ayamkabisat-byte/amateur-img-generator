(() => {
  'use strict';
  const D = window.ASU_DATA, P = window.ASU_PROFILES, W = window.ASU_WARDROBE;
  const $ = id => document.getElementById(id);
  const clone = x => JSON.parse(JSON.stringify(x));
  const STORAGE_KEY = 'asu5-state-v1';

  const defaults = {
    peopleCount:2, era:'AUTO', region:'INDONESIA', scene:'AUTO', device:'AUTO', shot:'AUTO', aesthetic:'AMATEUR_DEFAULT', lighting:'AUTO',
    composition:'NONE', time:'AUTO', weather:'AUTO', event:'NONE', customScenario:'',
    videoAudio:'SILENT', videoMotion:'NATURAL', videoCameraMotion:'HANDHELD', activeTab:'natural',
    locks:{era:false,region:false,scene:false,device:false,shot:false,aesthetic:false,lighting:false}, lockedResolved:{},
    seeds:{scene:48121,camera:15577,faces:80191,wardrobe:36103,motion:77321}, subjects:[]
  };
  let state = loadState();

  const AGE_DESC={TEEN:'16–19 years old',YOUNG:'20–29 years old',ADULT:'30–39 years old',MATURE:'40+ years old'};
  const GENDER_DESC={FEMALE:'woman',MALE:'man',NONBINARY:'androgynous person'};
  const APPEAR_DESC={AUTO:'region-appropriate appearance',SE_ASIAN:'Southeast Asian',EAST_ASIAN:'East Asian',SOUTH_ASIAN:'South Asian',MIDDLE_EASTERN:'Middle Eastern',CENTRAL_ASIAN:'Central Asian',WHITE_EUROPEAN:'White / European',BLACK:'Black / African-descent',LATIN:'Latin / Mestizo',MIXED:'mixed or ethnically ambiguous'};
  const FACE_DESC={NATURAL:'natural everyday facial proportions with slight human asymmetry',SOFT:'soft oval-to-rounded features, gentle jawline and balanced proportions',SHARP:'defined jawline, stronger cheekbones and more angular facial structure',DISTINCTIVE:'distinctive non-generic facial proportions with subtle asymmetry and memorable individual character',YOUTHFUL:'youthful facial proportions with natural soft tissue and unretouched texture',MATURE:'mature facial character with believable age texture and structure',EDITORIAL:'editorial facial character while retaining pores, asymmetry and real-skin texture',RANDOM:'natural distinctive face'};
  const SKIN_DESC={AUTO:'natural skin tone',FAIR:'fair skin',LIGHT_MEDIUM:'light-medium skin',MEDIUM:'medium skin',TAN:'tan skin',BROWN:'brown skin',DEEP:'deep skin'};
  const HAIR_DESC={AUTO:'natural context-appropriate hair',LONG_DARK:'long dark hair',SHORT_DARK:'short dark hair',WAVY:'natural wavy hair',CURLY:'curly hair',BOB:'bob haircut',PIXIE:'short pixie haircut',BUZZ:'buzz cut',HIJAB:'hair covered with a hijab',BALD:'shaved or bald head'};
  const BODY_DESC={AUTO:'natural average body proportions',SLIM:'slim or petite body proportions',AVERAGE:'average body proportions',CURVY:'curvy or fuller body proportions',ATHLETIC:'athletic or toned body proportions',CHUBBY:'chubby or heavyset body proportions',MATCH_REFERENCE:'body proportions from the reference subject'};

  const SHOTS={
    SELFIE_STANDARD:['front-camera selfie','eye-level arm-length selfie','front-facing phone lens','direct eye contact with the lens','casual arm-length pose with imperfect spacing'],
    SELFIE_05X:['0.5× ultra-wide selfie','extreme high-angle top-down perspective with strong foreshortening','0.5× smartphone ultra-wide lens','looking directly up toward the lens','arms extended, playful distorted perspective, feet and body receding into frame'],
    SELFIE_HIGH:['high-angle selfie','camera held above eye line','front-facing phone lens','looking upward toward the lens','casual compact pose'],
    SELFIE_LOW:['low-angle selfie','camera slightly below chin level','front-facing phone lens','looking slightly down toward the lens','casual close handheld pose'],
    SELFIE_CLOSE:['close-up selfie','very close eye-level framing','front-facing phone lens','direct lens contact','face fills much of frame with small crop errors and visible natural skin texture'],
    MIRROR:['mirror selfie','straight-on reflected viewpoint','phone or compact camera visible only as part of the reflection','looking at reflected screen/camera','casual outfit-check pose'],
    MIRROR_FACELESS:['faceless mirror selfie','straight-on reflected viewpoint','phone covers the subject’s face','face intentionally obscured by device','casual outfit-check pose'],
    PORTRAIT_CLOSE:['close amateur portrait','eye-level close framing with slightly uneven head spacing','consumer camera standard field of view','one or both may acknowledge the camera; gaze need not be synchronized','shoulders-up snapshot with unequal distance to lens, slightly awkward crop and natural posture'],
    MEDIUM:['medium snapshot','eye-level waist-up framing','consumer standard lens','natural unsynchronized gaze','relaxed standing or seated posture with imperfect spacing'],
    FULL_BODY:['full-body snapshot','eye-level head-to-toe framing','consumer standard-to-wide lens','natural gaze','casual standing pose with imperfect body placement and practical surroundings'],
    WIDE:['wide environmental snapshot','eye-level environmental framing','consumer wide lens','not necessarily looking at camera','subject smaller in frame, environment visible'],
    HIGH_ANGLE:['high-angle snapshot','camera above subject looking down','consumer wide/standard lens','looking up or away','pose adjusted naturally to angle'],
    LOW_ANGLE:['low-angle snapshot','camera below subject looking upward','consumer wide/standard lens','looking down or away','natural low-angle posture'],
    BIRD:['bird’s-eye snapshot','direct overhead top-down view','wide consumer lens','gaze optional','subject seated/lying/standing within overhead geometry'],
    FROG:['worm’s-eye snapshot','extreme low viewpoint near ground','wide consumer lens','gaze optional','full body exaggerated by perspective'],
    DUTCH:['Dutch-angle snapshot','intentionally tilted horizon','consumer standard lens','natural gaze','casual pose with imperfect off-balance framing'],
    CANDID:['true candid snapshot','eye-level observation from nearby','consumer standard lens','averted gaze or brief accidental eye contact','mid-action natural body language, unsynchronized expressions'],
    CANDID_OTS:['over-the-shoulder candid','viewed past a foreground shoulder/object','consumer standard lens','focused elsewhere','mid-interaction body language without staged posing'],
    CANDID_TELE:['distant candid snapshot','observed from farther away','consumer zoom/tele field of view','unaware of camera','natural ongoing activity'],
    ACCIDENTAL:['accidental snapshot','slightly mistimed or off-level framing','consumer camera lens','gaze uncontrolled','partial crop, motion softness, blink, awkward timing or blocked edge allowed'],
    POV:['first-person POV','viewer perspective','consumer wide lens','subject looks toward viewer or activity','viewer hand/arm may enter edge of frame'],
    FISHEYE:['fisheye snapshot','close exaggerated curved perspective','consumer fisheye/ultra-wide','playful or candid gaze','edge distortion and imperfect framing'],
    CCTV:['CCTV surveillance frame','high fixed corner viewpoint','fixed security-camera lens','subjects generally unaware','ordinary activity under surveillance-like framing'],
    MATCH_REFERENCE:['reference-matched composition','preserve pose, gaze, framing, perspective and camera angle from provided reference','reference-derived field of view','preserve reference gaze','preserve reference body pose and hand placement']
  };

  const LIGHT_DESC={
    AUTO:'contextual practical lighting, never studio-perfect',
    DIRECT_FLASH:'harsh frontal direct flash with hard cast shadows, bright foreground and rapid background falloff',
    SUBTLE_FLASH:'small frontal flash mixed with visible ambient light, modest shine and imperfect falloff',
    PHONE_LED:'weak phone LED flash with uneven foreground light and noisy underexposed surroundings',
    FLUORESCENT:'harsh overhead fluorescent lighting with imperfect skin color and slight green cast',
    TROPICAL_SUN:'hard tropical daylight with bright highlights and deep practical shadows',
    OVERCAST:'flat overcast daylight with low-contrast natural exposure',
    MIXED_NIGHT:'mixed street or room lighting with uneven exposure and imperfect white balance',
    NEON:'messy signage/neon spill mixed with practical ambient exposure',
    WARM_ROOM:'warm household bulb lighting with uneven color temperature and darker corners',
    WINDOW:'ordinary available window light without studio shaping',
    DARK_AMBIENT:'dark ambient background lit mainly by consumer-camera flash'
  };
  const SCENE_DESC={
    JAKARTA_STREET:'a lived-in Jakarta street or sidewalk',MINIMARKET:'a bright neighborhood convenience store/minimarket',WARTEG:'a casual Indonesian warteg or everyday eatery',MALL:'an ordinary shopping mall interior',KOS_ROOM:'a small lived-in kos room',BEDROOM:'a believable untidy-to-normal bedroom',BATHROOM_MIRROR:'a practical bathroom with a usable mirror',CAFE:'a casual everyday cafe',NIGHTLIFE:'a nightlife venue entrance or messy night street',CONCERT:'a crowded concert environment',BACKSTAGE:'a cramped backstage area',PARKING:'a concrete parking area',GAS_STATION:'a gas station forecourt',ELEVATOR:'an elevator interior',LAUNDROMAT:'a laundromat',PUBLIC_TRANSIT:'a bus, commuter train or metro environment',AIRPORT:'an airport terminal',CAR_INTERIOR:'inside an ordinary car',MOTORBIKE:'a roadside stop around a motorbike',CROSSWALK:'a busy urban crosswalk',BEACH:'a casual beach setting',POOL:'a poolside area',HOTEL:'a practical budget hotel or motel room',HOUSE_PARTY:'a lived-in house party',WEDDING_GUEST:'a wedding or kondangan guest area',STADIUM:'a stadium seating or concourse area',SCHOOL:'a school or campus environment',OFFICE:'a casual non-luxury office',THRIFT:'a thrift/vintage store',ARCADE:'an arcade or game center',PHOTOBOOTH:'a photobooth area',ROOFTOP:'an accessible urban rooftop',ALLEY:'a narrow lived-in alley',MARKET:'a traditional market',RIVER:'a riverside public area',PARK:'a public park',SNOW_STREET:'a snowy cold-climate street',TOKYO_NIGHT:'a dense East Asian night street with practical signage',SEOUL_STREET:'a contemporary Seoul-like street',GULF_MALL:'a Gulf-region shopping mall',EURO_CAFE:'a European sidewalk cafe',US_SUBURB:'a North American suburban street'};

  function hash(str){let h=2166136261>>>0;for(let i=0;i<String(str).length;i++){h^=String(str).charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed,salt=''){let a=(Number(seed)||1)^hash(salt);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function pick(arr,seed,salt){if(!arr?.length)return null;const r=rng(seed,salt);return arr[Math.floor(r()*arr.length)]}
  function randomSeed(){return Math.floor(10000+Math.random()*89999)}
  function option(select,items){select.innerHTML='';items.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;select.appendChild(o)})}
  function label(items,val){return items.find(x=>x[0]===val)?.[1]||val}
  function pretty(s){return s.charAt(0).toUpperCase()+s.slice(1).replaceAll('_',' ')}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
  function escapeAttr(s){return escapeHTML(s)}

  function loadState(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return p?{...clone(defaults),...p,locks:{...defaults.locks,...(p.locks||{})},lockedResolved:{...(p.lockedResolved||{})},seeds:{...defaults.seeds,...(p.seeds||{})}}:clone(defaults)}catch{return clone(defaults)}}
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}

  function initSelects(){
    option($('peopleCount'),[[1,'1 Orang'],[2,'2 Orang'],[3,'3 Orang'],[4,'4 Orang'],[5,'5 Orang'],[6,'6 Orang']].map(x=>[String(x[0]),x[1]]));
    [['era','eras'],['region','regions'],['scene','scenes'],['device','devices'],['shot','shots'],['aesthetic','aesthetics'],['lighting','lighting'],['composition','compositions'],['time','times'],['weather','weather'],['event','events'],['videoAudio','videoAudio'],['videoMotion','videoMotion'],['videoCameraMotion','videoCameraMotion']].forEach(([id,k])=>option($(id),D[k]));
    ['peopleCount','era','region','scene','device','shot','aesthetic','lighting','composition','time','weather','event','videoAudio','videoMotion','videoCameraMotion'].forEach(id=>{$(id).value=String(state[id])});
    $('customScenario').value=state.customScenario||'';
  }

  function defaultSubject(i){
    const genders=['FEMALE','MALE'];
    return {id:'s'+(i+1),gender:genders[i%2],identitySource:'GENERATED',age:'YOUNG',appearance:'AUTO',faceCharacter:'DISTINCTIVE',skinTone:'AUTO',hair:'AUTO',body:'AUTO',referenceDescriptor:'',scope:['identity','hair'],locked:false,faceSeed:state.seeds.faces+i*9973,wardrobeSeed:state.seeds.wardrobe+i*7919};
  }
  function ensureSubjects(){
    const n=Number(state.peopleCount)||1;
    while(state.subjects.length<n)state.subjects.push(defaultSubject(state.subjects.length));
    if(state.subjects.length>n)state.subjects.length=n;
    state.subjects.forEach((s,i)=>{s.id='s'+(i+1);if(!s.faceSeed)s.faceSeed=state.seeds.faces+i*9973;if(!s.wardrobeSeed)s.wardrobeSeed=state.seeds.wardrobe+i*7919;if(!Array.isArray(s.scope))s.scope=['identity','hair']});
  }

  function faceDNA(s,i){
    if(s.identitySource==='REFERENCE')return referenceIdentityLine(s,i);
    const r=rng(s.faceSeed||state.seeds.faces,`face-${i}`);
    const eye=pick(['almond-shaped eyes','slightly hooded eyes','round-to-almond eyes','deep-set eyes','soft monolid eyes'],Math.floor(r()*999999),'eye');
    const nose=pick(['straight medium-width nose','slender straight nose','soft rounded nose','defined bridge with natural tip','compact proportional nose'],Math.floor(r()*999999),'nose');
    const lips=pick(['balanced natural lips','moderately full lips','soft narrow upper lip with fuller lower lip','natural medium lips'],Math.floor(r()*999999),'lips');
    const detail=pick(['minor eyebrow-height asymmetry','slight smile-line asymmetry','subtle cheek asymmetry','small natural variation between eyelids','slight jaw asymmetry'],Math.floor(r()*999999),'detail');
    return `${APPEAR_DESC[s.appearance]}, ${AGE_DESC[s.age]}, ${SKIN_DESC[s.skinTone]}, ${FACE_DESC[s.faceCharacter]}, ${eye}, ${nose}, ${lips}, ${detail}, ${HAIR_DESC[s.hair]}, visible natural skin texture`;
  }

  function referenceAnchor(s){const g=GENDER_DESC[s.gender]||'person';const d=(s.referenceDescriptor||'').trim();return d?`the ${g} with ${d}`:`the ${g} visible in the provided reference material`}
  function referenceIdentityLine(s){
    const anchor=referenceAnchor(s), scope=[];
    if(s.scope.includes('identity'))scope.push('identity and facial structure');
    if(s.scope.includes('hair'))scope.push('hairstyle');
    if(s.scope.includes('accessories'))scope.push('accessories');
    if(s.scope.includes('wardrobe'))scope.push('wardrobe and clothing');
    if(s.scope.includes('body'))scope.push('body proportions');
    if(s.scope.includes('pose'))scope.push('body pose and hand placement');
    if(s.scope.includes('gaze'))scope.push('gaze direction');
    if(s.scope.includes('composition'))scope.push('framing and composition');
    if(s.scope.includes('camera'))scope.push('camera angle and perspective');
    return `Preserve ${scope.length?scope.join(', '):'identity'} of ${anchor}. Do not reinterpret this identity. Identity fidelity must not preserve beauty retouching, studio lighting, skin smoothing or source-image color grading unless those are explicitly reference-locked; re-render the same person through the selected consumer camera medium.`;
  }

  function resolvedOrLocked(key,value){return state.locks?.[key]&&state.lockedResolved?.[key]?state.lockedResolved[key]:value}
  function regionForScene(scene){if(['TOKYO_NIGHT','SEOUL_STREET'].includes(scene))return 'EAST_ASIA';if(scene==='GULF_MALL')return 'MIDDLE_EAST';if(scene==='EURO_CAFE')return 'EUROPE';if(scene==='US_SUBURB')return 'NORTH_AMERICA';if(scene==='SNOW_STREET')return 'WINTER';return 'INDONESIA'}
  function deviceForEra(era,seed){const map={'2020S':['IPHONE_MODERN','ANDROID_BUDGET','CCD_DIGICAM'],'2010S':['OLD_SMARTPHONE','IPHONE_MODERN','ANDROID_BUDGET','CCD_DIGICAM'],'2000S':['CCD_DIGICAM','POINT_SHOOT_DIGITAL','NOKIA_PHONE','FLIP_PHONE'],'1990S':['DISPOSABLE','FILM_35MM','POLAROID'],'1980S':['FILM_35MM','POLAROID','DISPOSABLE'],TIMELESS:['IPHONE_MODERN','CCD_DIGICAM','FILM_35MM']};return pick(map[era]||map.TIMELESS,seed,'device')}
  function autoShot(seed){return pick(['CANDID','CANDID','ACCIDENTAL','SELFIE_STANDARD','SELFIE_05X','MEDIUM','FULL_BODY','MIRROR','CANDID_OTS','PORTRAIT_CLOSE'],seed,'shot-weighted')}
  function timeFor(scene,seed){if(['NIGHTLIFE','CONCERT','BACKSTAGE','HOUSE_PARTY','TOKYO_NIGHT'].includes(scene))return pick(['NIGHT','LATE_NIGHT','EVENING'],seed,'time-night');if(['OFFICE','SCHOOL','MARKET','WARTEG'].includes(scene))return pick(['MORNING','NOON','AFTERNOON'],seed,'time-day');return pick(['MORNING','AFTERNOON','EVENING','NIGHT'],seed,'time')}
  function weatherFor(region,scene,seed){if(scene==='SNOW_STREET'||region==='WINTER')return 'SNOW';if(['INDONESIA','TROPICAL','SOUTHEAST_ASIA'].includes(region))return pick(['HUMID','HUMID','CLEAR','CLOUDY','RAIN'],seed,'weather-trop');return pick(['CLEAR','CLOUDY','RAIN'],seed,'weather')}
  function eventFor(scene,seed){if(scene==='WEDDING_GUEST')return 'NONE';if(scene==='CONCERT')return 'CONCERT';return pick(['NONE','NONE','NONE','NONE','BIRTHDAY'],seed,'event-auto')}
  function compositionFor(seed){return pick(['NONE','NONE','NONE','THIRDS','CENTER','FILL'],seed,'comp-auto')}
  function lightingFor(scene,aes,time,weather,device,seed){
    if(['DIRECT_FLASH','PARTY_FLASH','OVEREXPOSED_FLASH','Y2K_DIGICAM','DISPOSABLE_FILM','RAW_AMATEUR'].includes(aes))return 'DIRECT_FLASH';
    if(aes==='SUBTLE_FLASH'||aes==='SOUL_NATURAL')return 'SUBTLE_FLASH';
    const isNight=['EVENING','NIGHT','LATE_NIGHT'].includes(time);
    const flashCamera=['DISPOSABLE','FILM_35MM','POLAROID','CCD_DIGICAM','CHEAP_DIGICAM','POINT_SHOOT_DIGITAL'].includes(device);
    if(isNight&&flashCamera)return pick(['DIRECT_FLASH','DIRECT_FLASH','SUBTLE_FLASH','DARK_AMBIENT'],seed,'night-flash-camera');
    if(isNight){if(['NIGHTLIFE','CONCERT','BACKSTAGE','HOUSE_PARTY','TOKYO_NIGHT'].includes(scene))return pick(['DIRECT_FLASH','MIXED_NIGHT','NEON','DARK_AMBIENT'],seed,'night-scene');if(['MINIMARKET','MALL','WARTEG','PUBLIC_TRANSIT','GULF_MALL','PARKING','GAS_STATION'].includes(scene))return pick(['SUBTLE_FLASH','FLUORESCENT','MIXED_NIGHT'],seed,'night-practical');return pick(['SUBTLE_FLASH','MIXED_NIGHT','WARM_ROOM','DARK_AMBIENT'],seed,'night-general')}
    if(weather==='RAIN')return pick(['OVERCAST','SUBTLE_FLASH','FLUORESCENT'],seed,'rain-light');
    if(['MINIMARKET','MALL','WARTEG','PUBLIC_TRANSIT','GULF_MALL','ELEVATOR','LAUNDROMAT'].includes(scene))return 'FLUORESCENT';
    if(['BEDROOM','KOS_ROOM','HOTEL','BATHROOM_MIRROR'].includes(scene))return pick(['WINDOW','WARM_ROOM','SUBTLE_FLASH'],seed,'room-light');
    if(['BEACH','POOL','JAKARTA_STREET','CROSSWALK','MARKET','PARK','RIVER'].includes(scene))return weather==='CLOUDY'?'OVERCAST':'TROPICAL_SUN';
    return pick(['SUBTLE_FLASH','WINDOW','OVERCAST'],seed,'light-day-general');
  }

  function resolveBase(){
    let scene=resolvedOrLocked('scene',state.scene==='AUTO'?pick(D.scenes.filter(x=>x[0]!=='AUTO').map(x=>x[0]),state.seeds.scene,'scene-pick'):state.scene);
    let era=resolvedOrLocked('era',state.era==='AUTO'?pick(['2020S','2020S','2010S','2000S','1990S','TIMELESS'],state.seeds.scene,'era'):state.era);
    let region=resolvedOrLocked('region',state.region==='AUTO'?regionForScene(scene):state.region);
    let device=resolvedOrLocked('device',state.device==='AUTO'?deviceForEra(era,state.seeds.camera):state.device);
    let shot=resolvedOrLocked('shot',state.shot==='AUTO'?autoShot(state.seeds.camera):state.shot);
    if((shot==='MIRROR'||shot==='MIRROR_FACELESS')&&!['BATHROOM_MIRROR','BEDROOM','KOS_ROOM','ELEVATOR','MALL','THRIFT','HOTEL'].includes(scene))scene='BATHROOM_MIRROR';
    if(shot==='CCTV')device='CCTV';
    const refPose=state.subjects.some(s=>s.identitySource==='REFERENCE'&&(s.scope.includes('pose')||s.scope.includes('composition')||s.scope.includes('camera')));
    if(state.shot==='MATCH_REFERENCE'||refPose)shot='MATCH_REFERENCE';
    const aesthetic=resolvedOrLocked('aesthetic',state.aesthetic);
    const time=state.time==='AUTO'?timeFor(scene,state.seeds.scene):state.time;
    const weather=state.weather==='AUTO'?weatherFor(region,scene,state.seeds.scene):state.weather;
    const event=state.event==='AUTO'?eventFor(scene,state.seeds.scene):state.event;
    let composition=state.composition==='AUTO'?compositionFor(state.seeds.camera):state.composition;
    if(refPose&&state.subjects.some(s=>s.scope.includes('composition')))composition='MATCH_REFERENCE';
    const lighting=resolvedOrLocked('lighting',state.lighting==='AUTO'?lightingFor(scene,aesthetic,time,weather,device,state.seeds.camera):state.lighting);
    return {scene,era,region,device,shot,aesthetic,lighting,time,weather,event,composition,customScenario:state.customScenario.trim(),seed:clone(state.seeds)};
  }
  function wardrobeFor(s,i,r){return W?.resolve?W.resolve(s,r,s.wardrobeSeed||state.seeds.wardrobe+i*7919,i):null}
  function resolve(){const r=resolveBase();r.wardrobes=state.subjects.map((s,i)=>wardrobeFor(s,i,r));return r}

  function renderSubjects(){
    ensureSubjects();const r=resolveBase(),root=$('subjects');root.innerHTML='';
    state.subjects.forEach((s,i)=>{
      const wardrobe=wardrobeFor(s,i,r);
      const card=document.createElement('article');card.className='subject-card';
      card.innerHTML=`<div class="subject-head"><div class="subject-title">Subject ${i+1}<span class="subject-badge ${s.identitySource==='REFERENCE'?'reference':'generated'}">${s.identitySource==='REFERENCE'?'📌 MATCH REFERENCE':'✦ AI GENERATED'}</span></div><label class="scope-chip"><input type="checkbox" data-act="lock" ${s.locked?'checked':''}> Lock Subject</label></div>
      <div class="subject-grid">
        ${selectHTML('source','Identity Source',[['GENERATED','AI Generated'],['REFERENCE','Match Reference']],s.identitySource)}
        ${selectHTML('gender','Gender',D.genders,s.gender)}
        ${selectHTML('age','Age',D.ages,s.age)}
        ${selectHTML('appearance','Appearance',D.appearances,s.appearance)}
        ${selectHTML('faceCharacter','Face Character',D.faceCharacters,s.faceCharacter)}
        ${selectHTML('skinTone','Skin Tone',D.skinTones,s.skinTone)}
        ${selectHTML('hair','Hair',D.hair,s.hair)}
        ${selectHTML('body','Body',D.bodies,s.body)}
      </div>
      <div class="reference-controls" style="display:${s.identitySource==='REFERENCE'?'block':'none'}">
        <label class="field"><span>Reference Visual Descriptor (pakai hanya jika reference punya gender yang sama)</span><input data-act="referenceDescriptor" value="${escapeAttr(s.referenceDescriptor||'')}" placeholder="contoh: long dark hair / short curly hair / wearing glasses — bukan Image A/B"></label>
        <div class="scope-row" style="margin-top:10px">${D.referenceScopes.map(k=>`<label class="scope-chip"><input data-act="scope" value="${k}" type="checkbox" ${s.scope.includes(k)?'checked':''}> ${pretty(k)}</label>`).join('')}</div>
      </div>
      <div class="dna"><b>${s.identitySource==='REFERENCE'?'Reference Lock':'Face DNA'}:</b> ${escapeHTML(faceDNA(s,i))}</div>
      <div class="dna"><b>Adaptive Wardrobe:</b> ${escapeHTML(W?.describe?W.describe(wardrobe):'Context wardrobe engine unavailable.')}</div>`;
      card.querySelectorAll('[data-act]').forEach(el=>el.addEventListener('change',ev=>handleSubjectChange(i,ev.target)));
      root.appendChild(card);
    });saveState();
  }
  function selectHTML(act,title,items,value){return `<label class="field"><span>${title}</span><select data-act="${act}">${items.map(([v,l])=>`<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('')}</select></label>`}
  function handleSubjectChange(i,el){const s=state.subjects[i];if(el.dataset.act==='lock'){s.locked=el.checked;render();return}if(s.locked){render();return}const a=el.dataset.act;if(a==='source')s.identitySource=el.value;else if(a==='scope'){if(el.checked&&!s.scope.includes(el.value))s.scope.push(el.value);if(!el.checked)s.scope=s.scope.filter(x=>x!==el.value)}else if(a==='referenceDescriptor')s.referenceDescriptor=el.value;else s[a]=el.value;if(s.identitySource==='REFERENCE'&&s.body==='MATCH_REFERENCE'&&!s.scope.includes('body'))s.scope.push('body');render()}

  function subjectCanonical(s,i,r,w){return {index:i+1,gender:s.gender,identity_source:s.identitySource,identity_instruction:s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):faceDNA(s,i),age:s.age,appearance:s.appearance,face_character:s.faceCharacter,skin_tone:s.skinTone,hair:s.hair,body:s.body,wardrobe:W?.canonical?W.canonical(w):null,reference_scope:s.identitySource==='REFERENCE'?s.scope:[],locked:!!s.locked}}
  function validator(r){
    const issues=[];
    if(r.weather==='SNOW'&&['INDONESIA','TROPICAL','SOUTHEAST_ASIA'].includes(r.region)&&r.scene!=='SNOW_STREET')issues.push('Snow conflicts with tropical region unless intentionally overridden.');
    if(r.device==='CCTV'&&!['CCTV','WIDE','CANDID'].includes(r.shot))issues.push('CCTV device conflicts with selected close/selfie framing.');
    if(r.era==='1990S'&&['IPHONE_MODERN','ANDROID_BUDGET','OLD_SMARTPHONE'].includes(r.device))issues.push('1990s era conflicts with modern smartphone capture device.');
    if(r.era==='2000S'&&r.device==='IPHONE_MODERN')issues.push('2000s era conflicts with modern iPhone capture.');
    if(['EVENING','NIGHT','LATE_NIGHT'].includes(r.time)&&['TROPICAL_SUN','OVERCAST'].includes(r.lighting))issues.push('Selected lighting is daylight-based but time is evening/night. Use Auto, flash, mixed night or practical light for stronger realism.');
    if(['DISPOSABLE','FILM_35MM','POLAROID'].includes(r.device)&&['NIGHT','LATE_NIGHT'].includes(r.time)&&!['DIRECT_FLASH','SUBTLE_FLASH','DARK_AMBIENT','MIXED_NIGHT'].includes(r.lighting))issues.push('Night consumer-film capture usually needs direct flash or very dark ambient exposure.');
    if(r.shot==='MATCH_REFERENCE'&&!state.subjects.some(s=>s.identitySource==='REFERENCE'))issues.push('Match Reference camera/pose selected but no subject is reference-bound.');
    if(state.subjects.filter(s=>s.identitySource==='REFERENCE').length>1){const byGender={};state.subjects.filter(s=>s.identitySource==='REFERENCE').forEach(s=>{byGender[s.gender]=(byGender[s.gender]||0)+1});Object.entries(byGender).forEach(([g,n])=>{if(n>1&&state.subjects.filter(s=>s.identitySource==='REFERENCE'&&s.gender===g&&!s.referenceDescriptor.trim()).length)issues.push(`Multiple ${g.toLowerCase()} reference subjects need visual descriptors to prevent identity swapping.`)})}
    return issues;
  }

  function amateurNegative(){return ['cinematic studio lighting','professional beauty retouching','porcelain skin','plastic skin','over-smoothed face','luxury commercial polish','perfect symmetrical face','perfectly coordinated couple styling','fashion editorial posing unless explicitly selected','excessive HDR','impossible bokeh for device','DSLR look unless explicitly requested','modern wardrobe that contradicts selected era','visible extra camera in selfie/POV','duplicated face','identity blending','face swapping between subjects','extra fingers','deformed hands','garbled text artifacts'].join(', ')}
  function amateurBehavior(r){
    const b=['Do not compose the people like a campaign or studio portrait. Keep human spacing, posture and expressions slightly unsynchronized. Allow small framing errors, uneven head height, mild perspective distortion, ordinary background clutter and imperfect exposure appropriate to the device.'];
    if(r.shot==='PORTRAIT_CLOSE'||r.shot==='MEDIUM')b.push('Even though the subjects may acknowledge the camera, the moment must feel casually taken in one or two seconds, not art-directed; avoid matching expressions, matched shoulder angles and perfect bilateral placement.');
    if(['DIRECT_FLASH','DARK_AMBIENT'].includes(r.lighting))b.push('Flash should expose the nearest skin and clothing more strongly than the background; preserve hard flash shadow, reflective skin shine and darker uncontrolled surroundings.');
    if(['DISPOSABLE','FILM_35MM','DRUGSTORE_FILM','POLAROID'].includes(r.device))b.push('Keep consumer-film limitations believable: grain and focus/exposure variation should be present but not exaggerated into a fake filter overlay.');
    if(['CCD_DIGICAM','CHEAP_DIGICAM','POINT_SHOOT_DIGITAL'].includes(r.device))b.push('Keep small-sensor digicam character: clipped highlights, modest noise, hard built-in flash behavior and cheap-lens rendering instead of modern HDR cleanliness.');
    return b.join(' ');
  }

  function subjectPrompt(s,i,w){const wardrobe=W?.describe?W.describe(w):'';if(s.identitySource==='REFERENCE')return `${i+1}. ${referenceIdentityLine(s,i)} ${s.scope.includes('wardrobe')?'':`The wardrobe is not taken from the reference; generate clothing from scene, era, region and weather. ${wardrobe}`}`;return `${i+1}. Generate an independent ${GENDER_DESC[s.gender]} with ${faceDNA(s,i)}; ${BODY_DESC[s.body]}. ${wardrobe}`}
  function naturalOutput(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM;
    const subjects=state.subjects.map((s,i)=>subjectPrompt(s,i,r.wardrobes[i])).join('\n');
    const isolation=state.subjects.some(s=>s.identitySource==='REFERENCE')&&state.subjects.some(s=>s.identitySource==='GENERATED')?'Reference isolation is mandatory: generated subjects must not inherit, blend, duplicate, or borrow facial features, hairstyle, body identity, wardrobe or accessories from any referenced subject.':'';
    return `AUTHENTIC AMATEUR PHOTOGRAPH. ${P.aesthetics[r.aesthetic]||P.aesthetics.AMATEUR_DEFAULT}.\n\nSUBJECTS (${state.subjects.length}):\n${subjects}\n${isolation?`\n${isolation}`:''}\n\nSCENE: ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}${r.customScenario?`; ${r.customScenario}`:''}. Region: ${label(D.regions,r.region)}. Era: ${label(D.eras,r.era)}. ${label(D.times,r.time)}, ${label(D.weather,r.weather)}${r.event&&r.event!=='NONE'?`. Event: ${label(D.events,r.event)}`:''}.\n\nCAPTURE: ${P.devices[r.device]||label(D.devices,r.device)}. ${sh[0]}; ${sh[1]}; ${sh[2]}. Pose: ${sh[4]}. Gaze: ${sh[3]}. Lighting: ${LIGHT_DESC[r.lighting]}. Composition: ${label(D.compositions,r.composition)}.\n\nAMATEUR BEHAVIOR: ${amateurBehavior(r)}\n\nKeep skin pores, minor asymmetry, consumer-camera limitations, imperfect crop/exposure and believable real-world texture. The image must feel like a real camera-roll, family snapshot, nightlife photo or friend-taken image—not a professional photoshoot.\n\nNEGATIVE: ${amateurNegative()}`;
  }
  function imageJSON(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM;
    return JSON.stringify({ENGINE:'AMATEUR_REALISM_V5_1',SCENE:{REGION:r.region,LOCATION:r.scene,ERA:r.era,TIME:r.time,WEATHER:r.weather,EVENT:r.event,CUSTOM:r.customScenario||null},SUBJECTS:state.subjects.map((s,i)=>subjectCanonical(s,i,r,r.wardrobes[i])),CAPTURE:{DEVICE:r.device,DEVICE_DNA:P.devices[r.device]||null,SHOT:r.shot,ANGLE:sh[1],LENS_CHARACTER:sh[2],COMPOSITION:r.composition,LIGHTING:r.lighting,LIGHTING_DNA:LIGHT_DESC[r.lighting]},AESTHETIC:{ID:r.aesthetic,DNA:P.aesthetics[r.aesthetic],AMATEUR_BEHAVIOR:amateurBehavior(r)},WARDROBE_POLICY:{ADAPT_TO:['ERA','REGION','SCENE','EVENT','WEATHER','TIME'],REFERENCE_WARDROBE_ONLY_WHEN_SCOPE_LOCKED:true},REFERENCE_POLICY:{BIND_BY:'subject gender + visual descriptor when same-gender references coexist',FORBIDDEN_LABELS:['Image A','Image B','Reference 1','Reference 2'],ISOLATE_GENERATED_IDENTITIES:true,IDENTITY_NOT_SOURCE_RETOUCHING:true},NEGATIVE_PROMPT:amateurNegative()},null,2);
  }
  function videoOutput(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM;
    const audio=state.videoAudio==='SILENT'?'NO DIALOGUE. NO SPEECH. NO LIP-SYNC. NO VOCALIZATION.':state.videoAudio==='AMBIENT'?'Ambient environmental sound only. NO DIALOGUE, NO SPEECH, NO LIP-SYNC.':'Dialogue may occur only when naturally required.';
    const motion={NATURAL:'Natural micro-movements only: blinking, breathing, slight gaze changes, small posture shifts, fabric and hair reacting naturally.',CANDID:'Spontaneous candid movement: shifting weight, looking away, small gestures, silent laughter or reactions without spoken performance.',POSED:'Subtle posed movement: slight chin or shoulder changes, tiny posture adjustment, natural blinking.',WALK:'Subjects walk naturally through the environment with unscripted body rhythm.',STILL:'Almost still, like a photograph gently coming alive: breathing, blinking and minimal environmental motion.'}[state.videoMotion];
    const cam={HANDHELD:'Subtle imperfect handheld drift from a consumer camera.',STATIC:'Mostly static consumer-camera framing with tiny operator instability.',FOLLOW:'Loose imperfect handheld follow, not stabilized like a commercial gimbal.',PUSH:'Very subtle handheld push-in, no cinematic dolly perfection.',SHAKY:'Noticeable but believable amateur handheld shake.'}[state.videoCameraMotion];
    const ids=state.subjects.map((s,i)=>`${s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):`Subject ${i+1}, the generated ${GENDER_DESC[s.gender]}, keeps the exact same generated Face DNA throughout the clip: ${faceDNA(s,i)}.`} ${W?.describe?W.describe(r.wardrobes[i]):''}`).join('\n');
    return `AMATEUR VIDEO CONTINUATION\n\n${ids}\n\nScene remains ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}. Preserve ${P.devices[r.device]||label(D.devices,r.device)} and ${P.aesthetics[r.aesthetic]}. Framing remains ${sh[0]} / ${sh[1]}. Lighting remains ${LIGHT_DESC[r.lighting]}.\n\nMOTION: ${motion}\nCAMERA: ${cam}\nAUDIO: ${audio}\n\n${amateurBehavior(r)}\n\nDo not introduce new people, do not change identity, hairstyle, wardrobe, age, body proportions, camera medium, lighting direction or location between frames. Generated subjects must stay independent from reference identities. Avoid cinematic stabilization, dialogue animation, beauty retouching, face morphing, identity swap and temporal flicker.`;
  }
  function universalOutput(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM;
    const subs=state.subjects.map((s,i)=>`${s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):`${GENDER_DESC[s.gender]}, ${AGE_DESC[s.age]}, ${APPEAR_DESC[s.appearance]}, ${FACE_DESC[s.faceCharacter]}, ${HAIR_DESC[s.hair]}`}; ${W?.describe?W.describe(r.wardrobes[i]):''}`).join(' | ');
    return `${subs}. ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}${r.customScenario?`, ${r.customScenario}`:''}. ${P.devices[r.device]||''}. ${sh[0]}, ${sh[1]}. ${LIGHT_DESC[r.lighting]}. ${P.aesthetics[r.aesthetic]}. ${amateurBehavior(r)} Natural skin texture and authentic consumer-camera realism; no professional studio polish. ${state.subjects.some(s=>s.identitySource==='REFERENCE')?'Preserve each referenced identity using gender and visual cues; never use file-order labels and never blend reference identity into generated subjects.':''}`;
  }
  function debugOutput(r){const issues=validator(r);return `${issues.length?'VALIDATOR WARNINGS':'VALIDATOR OK'}\n${issues.length?issues.map((x,i)=>`${i+1}. ${x}`).join('\n'):'No major scene/device/time/lighting/reference contradictions detected.'}\n\nResolved scene:\n${JSON.stringify(r,null,2)}\n\nPrecedence:\n1. Reference scopes\n2. Locked subject / explicit user choice\n3. Custom scenario\n4. Time + device + lighting compatibility\n5. Era / region / scene wardrobe rules\n6. Seeded random defaults`}

  function renderOutput(){const r=resolve();const tab=state.activeTab||'natural';$('output').textContent=tab==='natural'?naturalOutput(r):tab==='image'?imageJSON(r):tab==='video'?videoOutput(r):tab==='universal'?universalOutput(r):debugOutput(r);$('seedLabel').textContent=`Seeds: ${Object.values(state.seeds).join(' · ')}`}
  function render(){ensureSubjects();renderSubjects();renderOutput();saveState()}

  function bind(){
    const ids=['peopleCount','era','region','scene','device','shot','aesthetic','lighting','composition','time','weather','event','videoAudio','videoMotion','videoCameraMotion'];
    ids.forEach(id=>$(id).addEventListener('change',e=>{state[id]=id==='peopleCount'?Number(e.target.value):e.target.value;if(id==='peopleCount')ensureSubjects();render()}));
    $('customScenario').addEventListener('input',e=>{state.customScenario=e.target.value;saveState();renderOutput()});
    $('newSeedBtn').addEventListener('click',()=>{Object.keys(state.seeds).forEach(k=>state.seeds[k]=randomSeed());state.subjects.forEach((s,i)=>{if(!s.locked&&s.identitySource==='GENERATED')s.faceSeed=state.seeds.faces+i*9973;s.wardrobeSeed=state.seeds.wardrobe+i*7919});render()});
    $('rerollSceneBtn').addEventListener('click',()=>{state.seeds.scene=randomSeed();render()});
    $('rerollCameraBtn').addEventListener('click',()=>{state.seeds.camera=randomSeed();render()});
    $('rerollFacesBtn').addEventListener('click',()=>{state.seeds.faces=randomSeed();state.subjects.forEach((s,i)=>{if(!s.locked&&s.identitySource==='GENERATED')s.faceSeed=state.seeds.faces+i*9973});render()});
    const rw=$('rerollWardrobeBtn');if(rw)rw.addEventListener('click',()=>{state.seeds.wardrobe=randomSeed();state.subjects.forEach((s,i)=>s.wardrobeSeed=state.seeds.wardrobe+i*7919);render()});
    $('resetBtn').addEventListener('click',()=>{state=clone(defaults);ensureSubjects();initSelects();syncGlobalLocks();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab==='natural'));render()});
    document.querySelectorAll('[data-lock-key]').forEach(cb=>cb.addEventListener('change',()=>{const key=cb.dataset.lockKey;if(cb.checked){const current=resolveBase();state.locks[key]=true;state.lockedResolved[key]=current[key]}else{state.locks[key]=false;delete state.lockedResolved[key]}render()}));
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{state.activeTab=btn.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));renderOutput();saveState()}));
    document.querySelector('[data-copy="output"]').addEventListener('click',async e=>{try{await navigator.clipboard.writeText($('output').textContent);const old=e.target.textContent;e.target.textContent='Copied ✓';setTimeout(()=>e.target.textContent=old,1200)}catch{const ta=document.createElement('textarea');ta.value=$('output').textContent;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}});
  }
  function syncGlobalLocks(){document.querySelectorAll('[data-lock-key]').forEach(cb=>cb.checked=!!state.locks?.[cb.dataset.lockKey])}

  initSelects();ensureSubjects();bind();syncGlobalLocks();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===state.activeTab));render();
})();