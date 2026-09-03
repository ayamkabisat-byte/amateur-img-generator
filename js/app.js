(() => {
  'use strict';
  const D = window.ASU_DATA, P = window.ASU_PROFILES;
  const $ = id => document.getElementById(id);
  const clone = x => JSON.parse(JSON.stringify(x));
  const STORAGE_KEY = 'asu5-state-v1';

  const defaults = {
    peopleCount: 2, era:'AUTO', region:'INDONESIA', scene:'AUTO', device:'AUTO', shot:'AUTO', aesthetic:'AMATEUR_DEFAULT', lighting:'AUTO',
    composition:'NONE', time:'AUTO', weather:'AUTO', event:'NONE', customScenario:'',
    videoAudio:'SILENT', videoMotion:'NATURAL', videoCameraMotion:'HANDHELD', activeTab:'natural',
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
    SELFIE_STANDARD:['front-camera selfie','eye-level, arm-length selfie','front-facing phone lens','direct eye contact with the lens','casual arm-length pose'],
    SELFIE_05X:['0.5× ultra-wide selfie','extreme high-angle top-down perspective with strong foreshortening','0.5× smartphone ultra-wide lens','looking directly up toward the lens','arms extended, playful distorted perspective, feet and body receding into frame'],
    SELFIE_HIGH:['high-angle selfie','camera held above eye line','front-facing phone lens','looking upward toward the lens','casual compact pose'],
    SELFIE_LOW:['low-angle selfie','camera slightly below chin level','front-facing phone lens','looking slightly down toward the lens','casual close handheld pose'],
    SELFIE_CLOSE:['close-up selfie','very close eye-level framing','front-facing phone lens','direct lens contact','face fills much of frame, visible natural skin texture'],
    MIRROR:['mirror selfie','straight-on reflected viewpoint','phone or compact camera visible only as part of the reflection','looking at reflected screen/camera','casual outfit-check pose'],
    MIRROR_FACELESS:['faceless mirror selfie','straight-on reflected viewpoint','phone covers the subject’s face','face intentionally obscured by device','casual outfit-check pose'],
    PORTRAIT_CLOSE:['close portrait','eye-level close framing','consumer camera standard/portrait field of view','looking toward camera or slightly off-camera','shoulders-up natural portrait'],
    MEDIUM:['medium shot','eye-level waist-up framing','consumer standard lens','natural gaze','relaxed standing or seated pose'],
    FULL_BODY:['full-body shot','eye-level head-to-toe framing','consumer standard-to-wide lens','natural gaze','casual standing pose with imperfect body placement'],
    WIDE:['wide environmental shot','eye-level environmental framing','consumer wide lens','not necessarily looking at camera','subject smaller in frame, environment visible'],
    HIGH_ANGLE:['high-angle shot','camera above subject looking down','consumer wide/standard lens','looking up or away','pose adjusted naturally to angle'],
    LOW_ANGLE:['low-angle shot','camera below subject looking upward','consumer wide/standard lens','looking down or away','natural low-angle posture'],
    BIRD:['bird’s-eye shot','direct overhead top-down view','wide consumer lens','gaze optional','subject seated/lying/standing within overhead geometry'],
    FROG:['worm’s-eye shot','extreme low viewpoint near ground','wide consumer lens','gaze optional','full body exaggerated by perspective'],
    DUTCH:['Dutch-angle shot','intentionally tilted horizon','consumer standard lens','natural gaze','casual pose with imperfect off-balance framing'],
    CANDID:['true candid snapshot','eye-level observation from nearby','consumer standard lens','averted gaze, unaware of camera','mid-action natural body language'],
    CANDID_OTS:['over-the-shoulder candid','viewed past a foreground shoulder/object','consumer standard lens','focused elsewhere','mid-conversation-like body language without speaking'],
    CANDID_TELE:['distant candid snapshot','observed from farther away','consumer zoom/tele field of view','unaware of camera','natural ongoing activity'],
    ACCIDENTAL:['accidental snapshot','slightly mistimed or off-level framing','consumer camera lens','gaze uncontrolled','partial crop, motion softness or awkward timing allowed'],
    POV:['first-person POV','viewer perspective','consumer wide lens','subject looks toward viewer or activity','viewer hand/arm may enter edge of frame'],
    FISHEYE:['fisheye snapshot','close exaggerated curved perspective','consumer fisheye/ultra-wide','playful or candid gaze','edge distortion and imperfect framing'],
    CCTV:['CCTV surveillance frame','high fixed corner viewpoint','fixed security-camera lens','subjects generally unaware','ordinary activity under surveillance-like framing'],
    MATCH_REFERENCE:['reference-matched composition','preserve pose, gaze, framing, perspective and camera angle from provided reference','reference-derived field of view','preserve reference gaze','preserve reference body pose and hand placement']
  };

  const LIGHT_DESC={
    AUTO:'contextual practical lighting, never studio-perfect',DIRECT_FLASH:'harsh frontal direct flash with hard cast shadows and fast foreground falloff',SUBTLE_FLASH:'small frontal flash mixed with visible ambient light',PHONE_LED:'weak phone LED flash with noisy underexposed surroundings',FLUORESCENT:'harsh overhead fluorescent lighting with imperfect skin color',TROPICAL_SUN:'hard tropical daylight with bright highlights and deep practical shadows',OVERCAST:'flat overcast daylight with low-contrast natural exposure',MIXED_NIGHT:'mixed street/room lighting with imperfect white balance',NEON:'messy neon and signage light mixed with practical ambient exposure',WARM_ROOM:'warm household bulb lighting with uneven color temperature',WINDOW:'ordinary window light without studio shaping',DARK_AMBIENT:'dark ambient background lit mainly by consumer-camera flash'};
  const SCENE_DESC={
    JAKARTA_STREET:'a lived-in Jakarta street or sidewalk',MINIMARKET:'a bright neighborhood convenience store/minimarket',WARTEG:'a casual Indonesian warteg or everyday eatery',MALL:'an ordinary shopping mall interior',KOS_ROOM:'a small lived-in kos room',BEDROOM:'a believable untidy-to-normal bedroom',BATHROOM_MIRROR:'a practical bathroom with a usable mirror',CAFE:'a casual everyday cafe',NIGHTLIFE:'a nightlife venue entrance or messy night street',CONCERT:'a crowded concert environment',BACKSTAGE:'a cramped backstage area',PARKING:'a concrete parking area',GAS_STATION:'a gas station forecourt',ELEVATOR:'an elevator interior',LAUNDROMAT:'a laundromat',PUBLIC_TRANSIT:'a bus, commuter train or metro environment',AIRPORT:'an airport terminal',CAR_INTERIOR:'inside an ordinary car',MOTORBIKE:'a roadside stop around a motorbike',CROSSWALK:'a busy urban crosswalk',BEACH:'a casual beach setting',POOL:'a poolside area',HOTEL:'a practical budget hotel or motel room',HOUSE_PARTY:'a lived-in house party',WEDDING_GUEST:'a wedding or kondangan guest area',STADIUM:'a stadium seating or concourse area',SCHOOL:'a school or campus environment',OFFICE:'a casual non-luxury office',THRIFT:'a thrift/vintage store',ARCADE:'an arcade or game center',PHOTOBOOTH:'a photobooth area',ROOFTOP:'an accessible urban rooftop',ALLEY:'a narrow lived-in alley',MARKET:'a traditional market',RIVER:'a riverside public area',PARK:'a public park',SNOW_STREET:'a snowy cold-climate street',TOKYO_NIGHT:'a dense East Asian night street with practical signage',SEOUL_STREET:'a contemporary Seoul-like street',GULF_MALL:'a Gulf-region shopping mall',EURO_CAFE:'a European sidewalk cafe',US_SUBURB:'a North American suburban street'};

  function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed, salt=''){let a=(Number(seed)||1)^hash(String(salt));return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function pick(arr, seed, salt){const r=rng(seed,salt);return arr[Math.floor(r()*arr.length)]}
  function randomSeed(){return Math.floor(10000+Math.random()*89999)}
  function option(select, items){select.innerHTML='';items.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;select.appendChild(o)})}
  function label(items,val){return items.find(x=>x[0]===val)?.[1]||val}

  function loadState(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return p?{...clone(defaults),...p,seeds:{...defaults.seeds,...(p.seeds||{})}}:clone(defaults)}catch{return clone(defaults)}}
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}

  function initSelects(){
    option($('peopleCount'),[[1,'1 Orang'],[2,'2 Orang'],[3,'3 Orang'],[4,'4 Orang'],[5,'5 Orang'],[6,'6 Orang']].map(x=>[String(x[0]),x[1]]));
    [['era','eras'],['region','regions'],['scene','scenes'],['device','devices'],['shot','shots'],['aesthetic','aesthetics'],['lighting','lighting'],['composition','compositions'],['time','times'],['weather','weather'],['event','events'],['videoAudio','videoAudio'],['videoMotion','videoMotion'],['videoCameraMotion','videoCameraMotion']].forEach(([id,k])=>option($(id),D[k]));
    ['peopleCount','era','region','scene','device','shot','aesthetic','lighting','composition','time','weather','event','videoAudio','videoMotion','videoCameraMotion'].forEach(id=>{$(id).value=String(state[id])});
    $('customScenario').value=state.customScenario||'';
  }

  function defaultSubject(i){
    const genders = state.peopleCount===2 ? ['FEMALE','MALE'] : ['FEMALE','MALE'];
    return {id:'s'+(i+1),gender:genders[i%2],identitySource:'GENERATED',age:'YOUNG',appearance:'AUTO',faceCharacter:'DISTINCTIVE',skinTone:'AUTO',hair:'AUTO',body:'AUTO',referenceDescriptor:'',scope:['identity','hair'],locked:false,faceSeed:state.seeds.faces+i*9973};
  }
  function ensureSubjects(){
    const n=Number(state.peopleCount)||1;
    while(state.subjects.length<n) state.subjects.push(defaultSubject(state.subjects.length));
    if(state.subjects.length>n) state.subjects.length=n;
    state.subjects.forEach((s,i)=>{s.id='s'+(i+1); if(!s.faceSeed)s.faceSeed=state.seeds.faces+i*9973; if(!Array.isArray(s.scope))s.scope=['identity','hair']});
  }

  function faceDNA(s,i){
    if(s.identitySource==='REFERENCE') return referenceIdentityLine(s,i);
    const r=rng(s.faceSeed||state.seeds.faces,`face-${i}`);
    const eye=pick(['almond-shaped eyes','slightly hooded eyes','round-to-almond eyes','deep-set eyes','soft monolid eyes'],Math.floor(r()*999999),'eye');
    const nose=pick(['straight medium-width nose','slender straight nose','soft rounded nose','defined bridge with natural tip','compact proportional nose'],Math.floor(r()*999999),'nose');
    const lips=pick(['balanced natural lips','moderately full lips','soft narrow upper lip with fuller lower lip','natural medium lips'],Math.floor(r()*999999),'lips');
    const detail=pick(['minor eyebrow-height asymmetry','slight smile-line asymmetry','subtle cheek asymmetry','small natural variation between eyelids','slight jaw asymmetry'],Math.floor(r()*999999),'detail');
    return `${APPEAR_DESC[s.appearance]}, ${AGE_DESC[s.age]}, ${SKIN_DESC[s.skinTone]}, ${FACE_DESC[s.faceCharacter]}, ${eye}, ${nose}, ${lips}, ${detail}, ${HAIR_DESC[s.hair]}, visible natural skin texture`;
  }

  function referenceIdentityLine(s){
    const g=GENDER_DESC[s.gender]||'person';
    const d=(s.referenceDescriptor||'').trim();
    const anchor=d?`the ${g} with ${d}`:`the ${g} visible in the provided reference material`;
    const scope=[];
    if(s.scope.includes('identity'))scope.push('identity and facial structure');
    if(s.scope.includes('hair'))scope.push('hairstyle');
    if(s.scope.includes('accessories'))scope.push('accessories');
    if(s.scope.includes('body'))scope.push('body proportions');
    if(s.scope.includes('pose'))scope.push('body pose and hand placement');
    if(s.scope.includes('gaze'))scope.push('gaze direction');
    if(s.scope.includes('composition'))scope.push('framing and composition');
    if(s.scope.includes('camera'))scope.push('camera angle and perspective');
    return `Preserve ${scope.length?scope.join(', '):'identity'} of ${anchor}. Do not reinterpret this reference identity.`;
  }

  function renderSubjects(){
    ensureSubjects(); const root=$('subjects'); root.innerHTML='';
    state.subjects.forEach((s,i)=>{
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
      <div class="dna"><b>${s.identitySource==='REFERENCE'?'Reference Lock':'Face DNA'}:</b> ${escapeHTML(faceDNA(s,i))}</div>`;
      card.querySelectorAll('[data-act]').forEach(el=>el.addEventListener('change',ev=>handleSubjectChange(i,ev.target)));
      root.appendChild(card);
    }); saveState();
  }
  function selectHTML(act,title,items,value){return `<label class="field"><span>${title}</span><select data-act="${act}">${items.map(([v,l])=>`<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('')}</select></label>`}
  function handleSubjectChange(i,el){const s=state.subjects[i]; if(el.dataset.act==='lock'){s.locked=el.checked;render();return} if(s.locked && !['lock'].includes(el.dataset.act)){render();return}
    const a=el.dataset.act;if(a==='source')s.identitySource=el.value; else if(a==='scope'){if(el.checked&&!s.scope.includes(el.value))s.scope.push(el.value);if(!el.checked)s.scope=s.scope.filter(x=>x!==el.value)} else if(a==='referenceDescriptor')s.referenceDescriptor=el.value; else s[a]=el.value;
    if(s.identitySource==='REFERENCE' && s.body==='MATCH_REFERENCE' && !s.scope.includes('body'))s.scope.push('body'); render();
  }

  function resolve(){
    let scene=state.scene==='AUTO'?pick(D.scenes.filter(x=>x[0]!=='AUTO').map(x=>x[0]),state.seeds.scene,'scene-pick'):state.scene;
    let era=state.era==='AUTO'?pick(['2020S','2020S','2010S','2000S','1990S','TIMELESS'],state.seeds.scene,'era'):state.era;
    let device=state.device==='AUTO'?deviceForEra(era,state.seeds.camera):state.device;
    let shot=state.shot==='AUTO'?pick(['CANDID','SELFIE_STANDARD','SELFIE_05X','MEDIUM','FULL_BODY','ACCIDENTAL','MIRROR','PORTRAIT_CLOSE'],state.seeds.camera,'shot'):state.shot;
    if((shot==='MIRROR'||shot==='MIRROR_FACELESS')&&!['BATHROOM_MIRROR','BEDROOM','KOS_ROOM','ELEVATOR','MALL','THRIFT','HOTEL'].includes(scene)) scene='BATHROOM_MIRROR';
    if(shot==='CCTV')device='CCTV';
    const refPose=state.subjects.some(s=>s.identitySource==='REFERENCE'&&(s.scope.includes('pose')||s.scope.includes('composition')||s.scope.includes('camera')));
    if(state.shot==='MATCH_REFERENCE'||refPose) shot='MATCH_REFERENCE';
    let aesthetic=state.aesthetic;
    let lighting=state.lighting==='AUTO'?lightingFor(scene,aesthetic,state.seeds.camera):state.lighting;
    let time=state.time==='AUTO'?timeFor(scene,state.seeds.scene):state.time;
    let weather=state.weather==='AUTO'?weatherFor(state.region,scene,state.seeds.scene):state.weather;
    let comp=state.composition;
    if(refPose && state.subjects.some(s=>s.scope.includes('composition'))) comp='MATCH_REFERENCE';
    return {scene,era,device,shot,aesthetic,lighting,time,weather,composition:comp,event:state.event,region:state.region,customScenario:state.customScenario.trim(),seed:clone(state.seeds)};
  }
  function deviceForEra(era,seed){const map={
    '2020S':['IPHONE_MODERN','ANDROID_BUDGET','CCD_DIGICAM'],'2010S':['IPHONE_MODERN','ANDROID_BUDGET','OLD_SMARTPHONE','CCD_DIGICAM'],'2000S':['CCD_DIGICAM','POINT_SHOOT_DIGITAL','NOKIA_PHONE','FLIP_PHONE'],'1990S':['DISPOSABLE','FILM_35MM','POLAROID'],'1980S':['FILM_35MM','POLAROID','DISPOSABLE'],TIMELESS:['IPHONE_MODERN','CCD_DIGICAM','FILM_35MM']};return pick(map[era]||map.TIMELESS,seed,'device')}
  function lightingFor(scene,aes,seed){if(['DIRECT_FLASH','PARTY_FLASH','OVEREXPOSED_FLASH','Y2K_DIGICAM','DISPOSABLE_FILM'].includes(aes))return 'DIRECT_FLASH';if(['NIGHTLIFE','CONCERT','BACKSTAGE','HOUSE_PARTY','TOKYO_NIGHT'].includes(scene))return pick(['DIRECT_FLASH','MIXED_NIGHT','NEON','DARK_AMBIENT'],seed,'light-night');if(['MINIMARKET','MALL','WARTEG','PUBLIC_TRANSIT','GULF_MALL'].includes(scene))return 'FLUORESCENT';if(['BEACH','POOL','JAKARTA_STREET','CROSSWALK'].includes(scene))return 'TROPICAL_SUN';return pick(['SUBTLE_FLASH','WINDOW','WARM_ROOM','OVERCAST'],seed,'light')}
  function timeFor(scene,seed){if(['NIGHTLIFE','CONCERT','BACKSTAGE','HOUSE_PARTY','TOKYO_NIGHT'].includes(scene))return pick(['NIGHT','LATE_NIGHT','EVENING'],seed,'time-night');return pick(['MORNING','NOON','AFTERNOON','EVENING','NIGHT'],seed,'time')}
  function weatherFor(region,scene,seed){if(scene==='SNOW_STREET'||region==='WINTER')return 'SNOW';if(region==='TROPICAL'||region==='INDONESIA'||region==='SOUTHEAST_ASIA')return pick(['HUMID','CLEAR','CLOUDY','RAIN'],seed,'weather-trop');return pick(['CLEAR','CLOUDY','RAIN'],seed,'weather')}

  function subjectCanonical(s,i){return {index:i+1,gender:s.gender,identity_source:s.identitySource,identity_instruction:s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):faceDNA(s,i),age:s.age,appearance:s.appearance,face_character:s.faceCharacter,skin_tone:s.skinTone,hair:s.hair,body:s.body,reference_scope:s.identitySource==='REFERENCE'?s.scope:[],locked:!!s.locked}}
  function validator(r){const issues=[]; if(r.weather==='SNOW'&&['INDONESIA','TROPICAL','SOUTHEAST_ASIA'].includes(r.region)&&r.scene!=='SNOW_STREET')issues.push('Snow conflicts with tropical region unless intentionally overridden.'); if(r.device==='CCTV'&&!['CCTV','WIDE','CANDID'].includes(r.shot))issues.push('CCTV device conflicts with selected close/selfie framing.'); if(r.era==='1990S'&&['IPHONE_MODERN','ANDROID_BUDGET','OLD_SMARTPHONE'].includes(r.device))issues.push('1990s era conflicts with modern smartphone capture device.'); if(r.era==='2000S'&&r.device==='IPHONE_MODERN')issues.push('2000s era conflicts with modern iPhone camera-roll capture.'); if(r.shot==='MATCH_REFERENCE'&&!state.subjects.some(s=>s.identitySource==='REFERENCE'))issues.push('Match Reference camera/pose selected but no subject is reference-bound.'); if(state.subjects.filter(s=>s.identitySource==='REFERENCE').length>1){const byGender={};state.subjects.filter(s=>s.identitySource==='REFERENCE').forEach(s=>{byGender[s.gender]=(byGender[s.gender]||0)+1});Object.entries(byGender).forEach(([g,n])=>{if(n>1&&state.subjects.filter(s=>s.identitySource==='REFERENCE'&&s.gender===g&&!s.referenceDescriptor.trim()).length)issues.push(`Multiple ${g.toLowerCase()} reference subjects need visual descriptors to prevent identity swapping.`)})} return issues}

  function amateurNegative(){return ['cinematic studio lighting','professional beauty retouching','porcelain skin','plastic skin','over-smoothed face','luxury commercial polish','perfect symmetrical face','excessive HDR','impossible bokeh for device','DSLR look unless explicitly requested','visible extra camera in selfie/POV','duplicated face','identity blending','face swapping between subjects','extra fingers','deformed hands','text artifacts'].join(', ')}

  function naturalOutput(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM; const subjects=state.subjects.map((s,i)=>`${i+1}. ${s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):`Generate an independent ${GENDER_DESC[s.gender]} with ${faceDNA(s,i)}; ${BODY_DESC[s.body]}.`}`).join('\n');
    const isolation=state.subjects.some(s=>s.identitySource==='REFERENCE')&&state.subjects.some(s=>s.identitySource==='GENERATED')?'Reference isolation is mandatory: generated subjects must not inherit, blend, duplicate, or borrow facial features, hairstyle, body identity, or accessories from any referenced subject.':'';
    return `AUTHENTIC AMATEUR PHOTOGRAPH. ${P.aesthetics[r.aesthetic]||P.aesthetics.AMATEUR_DEFAULT}.\n\nSUBJECTS (${state.subjects.length}):\n${subjects}\n${isolation?`\n${isolation}`:''}\n\nSCENE: ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}${r.customScenario?`; ${r.customScenario}`:''}. Region: ${label(D.regions,r.region)}. Era: ${label(D.eras,r.era)}. ${label(D.times,r.time)}, ${label(D.weather,r.weather)}.\n\nCAPTURE: ${P.devices[r.device]||label(D.devices,r.device)}. ${sh[0]}; ${sh[1]}; ${sh[2]}. Pose: ${sh[4]}. Gaze: ${sh[3]}. Lighting: ${LIGHT_DESC[r.lighting]}. Composition: ${label(D.compositions,r.composition)}.\n\nKeep skin pores, minor asymmetry, consumer-camera limitations, imperfect crop/exposure and believable real-world texture. The image must feel like a real camera-roll or family snapshot, not a professional photoshoot.\n\nNEGATIVE: ${amateurNegative()}`;
  }
  function imageJSON(r){const sh=SHOTS[r.shot]||SHOTS.MEDIUM;return JSON.stringify({ENGINE:'AMATEUR_REALISM_V5',SCENE:{REGION:r.region,LOCATION:r.scene,ERA:r.era,TIME:r.time,WEATHER:r.weather,EVENT:r.event,CUSTOM:r.customScenario||null},SUBJECTS:state.subjects.map(subjectCanonical),CAPTURE:{DEVICE:r.device,DEVICE_DNA:P.devices[r.device]||null,SHOT:r.shot,ANGLE:sh[1],LENS_CHARACTER:sh[2],COMPOSITION:r.composition,LIGHTING:r.lighting},AESTHETIC:{ID:r.aesthetic,DNA:P.aesthetics[r.aesthetic],REALISM_RULE:'consumer-camera amateur realism; natural imperfections are intentional'},REFERENCE_POLICY:{BIND_BY:'subject gender + visual descriptor when same-gender references coexist',FORBIDDEN_LABELS:['Image A','Image B','Reference 1','Reference 2'],ISOLATE_GENERATED_IDENTITIES:true},NEGATIVE_PROMPT:amateurNegative()},null,2)}
  function videoOutput(r){
    const sh=SHOTS[r.shot]||SHOTS.MEDIUM; const audio=state.videoAudio==='SILENT'?'NO DIALOGUE. NO SPEECH. NO LIP-SYNC. NO VOCALIZATION.':state.videoAudio==='AMBIENT'?'Ambient environmental sound only. NO DIALOGUE, NO SPEECH, NO LIP-SYNC.':'Dialogue may occur only when naturally required.';
    const motion={NATURAL:'Natural micro-movements only: blinking, breathing, slight gaze changes, small posture shifts, fabric/hair reacting naturally.',CANDID:'Spontaneous candid movement: shifting weight, looking away, small gestures, silent laughter or reactions without spoken performance.',POSED:'Subtle posed movement: slight chin/shoulder changes, tiny posture adjustment, natural blinking.',WALK:'Subjects walk naturally through the environment with unscripted body rhythm.',STILL:'Almost still, like a photograph gently coming alive: breathing, blinking and minimal environmental motion.'}[state.videoMotion];
    const cam={HANDHELD:'Subtle imperfect handheld drift from a consumer camera.',STATIC:'Mostly static consumer-camera framing with tiny operator instability.',FOLLOW:'Loose imperfect handheld follow, not stabilized like a commercial gimbal.',PUSH:'Very subtle handheld push-in, no cinematic dolly perfection.',SHAKY:'Noticeable but believable amateur handheld shake.'}[state.videoCameraMotion];
    const ids=state.subjects.map((s,i)=>s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):`Subject ${i+1}, the generated ${GENDER_DESC[s.gender]}, keeps the exact same generated Face DNA throughout the clip: ${faceDNA(s,i)}.`).join('\n');
    return `AMATEUR VIDEO CONTINUATION\n\n${ids}\n\nScene remains ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}. Preserve ${P.devices[r.device]||label(D.devices,r.device)} and ${P.aesthetics[r.aesthetic]}. Framing remains ${sh[0]} / ${sh[1]}.\n\nMOTION: ${motion}\nCAMERA: ${cam}\nAUDIO: ${audio}\n\nDo not introduce new people, do not change identity, hairstyle, wardrobe, age, body proportions, camera medium, lighting direction, or location between frames. Generated subjects must stay independent from reference identities. Avoid cinematic stabilization, dialogue animation, beauty retouching, face morphing, identity swap and temporal flicker.`;
  }
  function universalOutput(r){const sh=SHOTS[r.shot]||SHOTS.MEDIUM;const subs=state.subjects.map((s,i)=>s.identitySource==='REFERENCE'?referenceIdentityLine(s,i):`${GENDER_DESC[s.gender]}, ${AGE_DESC[s.age]}, ${APPEAR_DESC[s.appearance]}, ${FACE_DESC[s.faceCharacter]}, ${HAIR_DESC[s.hair]}`).join('; ');return `${subs}. ${SCENE_DESC[r.scene]||label(D.scenes,r.scene)}${r.customScenario?`, ${r.customScenario}`:''}. ${P.devices[r.device]||''}. ${sh[0]}, ${sh[1]}. ${LIGHT_DESC[r.lighting]}. ${P.aesthetics[r.aesthetic]}. Natural skin texture, imperfect consumer-camera exposure and framing, authentic amateur realism, no professional studio polish. ${state.subjects.some(s=>s.identitySource==='REFERENCE')?'Preserve each referenced identity using gender/visual cues; never use file-order labels and never blend reference identity into generated subjects.':''}`}
  function debugOutput(r){const issues=validator(r);return `${issues.length?'VALIDATOR WARNINGS':'VALIDATOR OK'}\n${issues.length?issues.map((x,i)=>`${i+1}. ${x}`).join('\n'):'No major scene/device/reference contradictions detected.'}\n\nResolved scene:\n${JSON.stringify(r,null,2)}\n\nPrecedence:\n1. Reference scopes\n2. Locked subject / explicit user choice\n3. Custom scenario\n4. Compatibility resolver\n5. Era / scene rules\n6. Seeded random defaults`}

  function renderOutput(){const r=resolve();const tab=state.activeTab||'natural';$('output').textContent=tab==='natural'?naturalOutput(r):tab==='image'?imageJSON(r):tab==='video'?videoOutput(r):tab==='universal'?universalOutput(r):debugOutput(r);$('seedLabel').textContent=`Seeds: ${Object.values(state.seeds).join(' · ')}`}
  function render(){ensureSubjects();renderSubjects();renderOutput();saveState()}

  function bind(){
    const ids=['peopleCount','era','region','scene','device','shot','aesthetic','lighting','composition','time','weather','event','videoAudio','videoMotion','videoCameraMotion'];
    ids.forEach(id=>$(id).addEventListener('change',e=>{state[id]=id==='peopleCount'?Number(e.target.value):e.target.value;if(id==='peopleCount')ensureSubjects();render()}));
    $('customScenario').addEventListener('input',e=>{state.customScenario=e.target.value;saveState();renderOutput()});
    $('newSeedBtn').addEventListener('click',()=>{Object.keys(state.seeds).forEach(k=>state.seeds[k]=randomSeed());state.subjects.forEach((s,i)=>{if(!s.locked&&s.identitySource==='GENERATED')s.faceSeed=state.seeds.faces+i*9973});render()});
    $('rerollSceneBtn').addEventListener('click',()=>{state.seeds.scene=randomSeed();render()});
    $('rerollCameraBtn').addEventListener('click',()=>{state.seeds.camera=randomSeed();render()});
    $('rerollFacesBtn').addEventListener('click',()=>{state.seeds.faces=randomSeed();state.subjects.forEach((s,i)=>{if(!s.locked&&s.identitySource==='GENERATED')s.faceSeed=state.seeds.faces+i*9973});render()});
    $('resetBtn').addEventListener('click',()=>{state=clone(defaults);ensureSubjects();initSelects();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab==='natural'));render()});
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{state.activeTab=btn.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));renderOutput();saveState()}));
    document.querySelector('[data-copy="output"]').addEventListener('click',async e=>{try{await navigator.clipboard.writeText($('output').textContent);const old=e.target.textContent;e.target.textContent='Copied ✓';setTimeout(()=>e.target.textContent=old,1200)}catch{const ta=document.createElement('textarea');ta.value=$('output').textContent;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}});
  }
  function pretty(s){return s.charAt(0).toUpperCase()+s.slice(1).replaceAll('_',' ')}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function escapeAttr(s){return escapeHTML(s)}

  initSelects();ensureSubjects();bind();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===state.activeTab));render();
})();