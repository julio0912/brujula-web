/* ═══ HELPERS ═══ */
const digs = n => String(Math.abs(n)).split('').map(Number);
const sumA = a => a.reduce((x,y) => x+y, 0);
const MASTER = n => n===11||n===22||n===33||n===44;
function red(n, m=true){ while(n>9){ if(m && MASTER(n)) break; n=sumA(digs(n)); } return n; }
function pd(v){ const [y,mo,d]=v.split('-').map(Number); return {y,mo,d}; }
function fmtD(v){ const [y,m,d]=v.split('-'); return `${d}/${m}/${y}`; }
function saveDate(v){ try{sessionStorage.setItem('bj_f',v)}catch(e){} }
function loadDate(){ try{return sessionStorage.getItem('bj_f')||''}catch(e){return ''} }
function saveName(v){ try{sessionStorage.setItem('bj_n',v)}catch(e){} }
function loadName(){ try{return sessionStorage.getItem('bj_n')||''}catch(e){return ''} }

/* scroll reveal + sticky */
const obs = new IntersectionObserver(ee=>ee.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
}),{threshold:.08});
document.querySelectorAll('.r').forEach(el=>obs.observe(el));
window.addEventListener('scroll',()=>document.getElementById('stk').classList.toggle('show',scrollY>500),{passive:true});

/* ═══ NUMEROLOGY CALCS ═══ */
function calcQuad(d, mo, y){
  const alma  = MASTER(d) ? d : red(d<10 ? d : sumA(digs(d)), true);
  const ego   = MASTER(mo) ? mo : red(mo<10 ? mo : sumA(digs(mo)), true);
  const don   = (()=>{ const l=y%100; return MASTER(l) ? l : red(l<10?l:sumA(digs(l)),true); })();
  const karma = (()=>{ const s=sumA(digs(y)); return MASTER(s) ? s : red(s, true); })();
  const all   = `${String(d).padStart(2,'0')}${String(mo).padStart(2,'0')}${y}`;
  const rawMis= sumA(all.split('').map(Number));
  const mision= MASTER(rawMis) ? rawMis : red(rawMis, true);
  return {alma, ego, don, karma, mision};
}

/* Arcano del año — fix: if birthday hasn't passed yet this year, use previous year */
function calcArcano(d, mo, fechaVal){
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth()+1;
  const todayDay = today.getDate();

  let yearToUse = todayYear;
  if(mo > todayMonth || (mo === todayMonth && d > todayDay)){
    yearToUse = todayYear - 1;
  }

  let n = sumA(digs(d)) + sumA(digs(mo)) + sumA(digs(yearToUse));
  while(n > 22){ n = sumA(digs(n)); }
  if(n === 0) n = 22;
  return { arc: n, yearUsed: todayYear };
}

const LV = {'a':1,'b':2,'c':3,'d':4,'e':5,'f':6,'g':7,'h':8,'i':9,'j':1,'k':2,'l':3,'m':4,'n':5,'ñ':5,'o':6,'p':7,'q':8,'r':9,'s':1,'t':2,'u':3,'v':4,'w':5,'x':6,'y':7,'z':8};
function calcExprNum(name){
  const sum = name.toLowerCase().split('').reduce((a,c)=>a+(LV[c]||0),0);
  return red(sum, true);
}

/* ═══ ARCANO NAMES ═══ */
const AN = {1:'El Mago',2:'La Sacerdotisa',3:'La Emperatriz',4:'El Emperador',5:'El Sumo Sacerdote',6:'Los Enamorados',7:'El Carro',8:'La Justicia',9:'El Ermitaño',10:'La Rueda de la Fortuna',11:'La Fuerza',12:'El Colgado',13:'La Muerte',14:'La Templanza',15:'El Diablo',16:'La Torre',17:'La Estrella',18:'La Luna',19:'El Sol',20:'El Juicio',21:'El Mundo',22:'El Loco'};

/* ═══ ARCANO DATA — rich descriptions + keywords + mision cross ═══ */
const ARCANOS = {
  1: {
    kw: ['Voluntad','Inicio','Herramientas','Decisión','Poder personal','Claridad','Acción'],
    body: `<p>El Mago tiene todo lo que necesita. El año del Mago no es el año de prepararse — es el año de usar lo que ya tienes. Tienes más recursos de los que reconoces. El obstáculo no es la falta de capacidad: es la decisión de actuar con lo que ya está en tus manos.</p>
<p><strong>Este es un año de alta capacidad de manifestación.</strong> Lo que pongas en movimiento tiene un potencial de materializarse que no siempre está disponible. La energía está, las herramientas están — lo que se necesita es que tú decidas activarlas.</p>
<p>La trampa del año del Mago es el perfeccionismo que pospone. Estudiar un poco más, prepararse un poco más, esperar el momento exacto. El Mago actúa. Esa es la diferencia.</p>`,
    cross: (mn,mn_n) => `El Mago activa tu <em>Misión de ${mn_n} (${mn})</em> de una forma muy específica este año: lo que viniste a aprender, este año tienes las herramientas para trabajarlo activamente. No hay excusa de "todavía no estoy listo". El Mago te dice que sí lo estás.`
  },
  2: {
    kw: ['Escucha','Intuición','Paciencia','Percepción','Dualidad','Profundidad','Espera activa'],
    body: `<p>La Sacerdotisa no habla — percibe. Este es un año en que la información más importante no va a venir de lo que analizas sino de lo que sientes, de lo que observas en silencio, de lo que captas antes de que nadie lo diga en voz alta.</p>
<p><strong>Las decisiones más importantes de este año se van a beneficiar de esperar un poco más antes de actuar.</strong> No porque haya que dudar — sino porque hay información que todavía está llegando y que una decisión prematura no dejaría entrar.</p>
<p>La trampa del año de la Sacerdotisa es confundir la espera necesaria con la parálisis por miedo. Hay una diferencia entre esperar porque percibes que algo falta, y esperar porque tienes miedo de lo que viene.</p>`,
    cross: (mn,mn_n) => `La Sacerdotisa y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde la clave no es hacer más — es percibir mejor. Lo que viniste a aprender tiene este año una puerta de acceso que se abre desde adentro, no desde afuera.`
  },
  3: {
    kw: ['Creación','Abundancia','Expresión','Fertilidad','Manifestación','Florecimiento','Expansión'],
    body: `<p>La Emperatriz es la energía de lo que crece cuando se le da espacio. Este es un año de creación, de expansión, de algo que florece si se lo cuidas. Puede ser un proyecto, una relación, una parte de ti que estaba dormida y que este año necesita salir al mundo.</p>
<p><strong>Lo que no expreses este año se va a quedar adentro como frustración.</strong> La Emperatriz no tolera la contención — lo que tiene para dar necesita salida, forma, presencia. Este no es el año de guardar lo que tienes para después.</p>
<p>La trampa es la dispersión — querer que todo florezca al mismo tiempo. La Emperatriz cuida una cosa a la vez con toda su atención. Qué es lo que más merece tu energía este año es la pregunta central.</p>`,
    cross: (mn,mn_n) => `La Emperatriz activa tu <em>Misión de ${mn_n} (${mn})</em> desde la creación y la expresión. Algo en lo que viniste a aprender tiene este año una oportunidad de manifestarse de forma concreta. No lo guardes — dale forma.`
  },
  4: {
    kw: ['Estructura','Fundamentos','Disciplina','Construcción','Método','Solidez','Responsabilidad'],
    body: `<p>El Emperador construye. Este es un año donde lo que no tiene base sólida se va a volver imposible de ignorar — y donde lo que se construye bien tiene potencial de durar años. La energía del Emperador no es glamorosa pero es la más productiva cuando se usa con intención.</p>
<p><strong>Este año premia la consistencia sobre el impulso.</strong> Lo que hagas de forma sostenida y metódica va a producir resultados desproporcionados. Lo que hagas por ráfagas de energía sin seguimiento, no.</p>
<p>La trampa del año del Emperador es la rigidez — construir un sistema tan controlado que no deja entrar lo nuevo. La estructura sirve a la vida, no al revés.</p>`,
    cross: (mn,mn_n) => `El Emperador y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender se trabaja desde la disciplina real. No hay atajo ni insight que reemplace el trabajo sostenido. Este año eso se hace visible de forma muy concreta.`
  },
  5: {
    kw: ['Movimiento','Cambio','Libertad','Adaptación','Búsqueda','Expansión','Ruptura de molde'],
    body: `<p>El Sumo Sacerdote en su vibración de 5 activa el año del cambio y el movimiento real. Lo que llevaba tiempo estático se va a mover. Lo que parecía permanente puede transformarse. Este no es un año de consolidar — es un año de navegar lo que se mueve.</p>
<p><strong>La pregunta central de este año no es qué va a pasar — sino si estás lo suficientemente suelto para recibir lo que llega de formas que no esperabas.</strong> La resistencia al cambio tiene este año un costo muy visible.</p>
<p>La trampa es buscar el siguiente movimiento antes de integrar el actual — dispersarse en tantas direcciones que no se llega profundo en ninguna.</p>`,
    cross: (mn,mn_n) => `El Sumo Sacerdote activa tu <em>Misión de ${mn_n} (${mn})</em> desde el movimiento y la búsqueda. Algo en lo que viniste a aprender este año se presenta de una forma que requiere que te sueltes de cómo creías que tenía que verse.`
  },
  6: {
    kw: ['Amor','Elección','Responsabilidad','Relaciones','Compromiso','Valores','Armonía'],
    body: `<p>Los Enamorados hablan de elecciones que importan de verdad — especialmente en el área de los vínculos. Este es un año donde las relaciones son el espejo central. Lo que das, cómo lo das, desde dónde lo das y con quién te comprometes va a estar bajo una claridad poco usual.</p>
<p><strong>El año de los Enamorados no es solo sobre el amor romántico — es sobre cualquier elección que implique comprometerte con algo o alguien desde tus valores más profundos.</strong> Las decisiones que hagas este año desde el miedo van a costar el doble. Las que hagas desde la claridad van a abrir puertas inesperadas.</p>
<p>La trampa es la evasión — este arcano pide que elijas, y no elegir también es una elección con consecuencias.</p>`,
    cross: (mn,mn_n) => `Los Enamorados y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde los vínculos son el camino de trabajo más directo. Lo que viniste a aprender se activa este año a través de cómo amas, cómo eliges y cómo te comprometes.`
  },
  7: {
    kw: ['Dirección','Voluntad','Movimiento','Control','Victoria','Determinación','Avance'],
    body: `<p>El Carro avanza. Este es un año de movimiento con dirección, de voluntad aplicada, de resultados que llegan cuando se mantiene el rumbo a pesar de la fricción. La energía del Carro no espera que las condiciones sean perfectas — se mueve de todas formas.</p>
<p><strong>Este año la determinación produce resultados que la duda no puede alcanzar.</strong> Lo que empieces con claridad de dirección y mantengas con consistencia tiene un potencial de llegar muy lejos. Lo que abandones al primer obstáculo, no.</p>
<p>La trampa del año del Carro es confundir velocidad con dirección. Avanzar rápido en la dirección equivocada no es éxito — es eficiencia mal aplicada.</p>`,
    cross: (mn,mn_n) => `El Carro y tu <em>Misión de ${mn_n} (${mn})</em> crean un año de avance real en lo que viniste a aprender. Hay un movimiento disponible este año que no siempre está — la clave es saber en qué dirección apuntarlo.`
  },
  8: {
    kw: ['Fortaleza','Paciencia','Dominio interno','Coraje','Resistencia','Presencia','Valentía suave'],
    body: `<p>La Justicia en el 8 habla de equilibrio, de causa y efecto, de lo que se cosecha después de lo que se sembró. Este es un año donde las consecuencias de las decisiones pasadas se hacen visibles — en ambas direcciones. Lo que construiste bien, da frutos. Lo que se sostuvo sobre bases falsas, se cae.</p>
<p><strong>Este no es el año de evitar las consecuencias — es el año de mirarlas de frente y ajustar.</strong> La Justicia no castiga — informa. Lo que este año te muestra sobre tus patrones es información que puedes usar para tomar mejores decisiones.</p>
<p>La trampa es la rigidez — aplicar el criterio de "lo correcto" sin sensibilidad al contexto. La justicia real incluye la humanidad.</p>`,
    cross: (mn,mn_n) => `La Justicia activa tu <em>Misión de ${mn_n} (${mn})</em> desde el equilibrio y la responsabilidad. Este año lo que viniste a aprender se trabaja a través de ver con claridad — sin distorsión — el impacto de tus patrones.`
  },
  9: {
    kw: ['Introspección','Sabiduría','Soledad elegida','Guía interior','Profundidad','Búsqueda','Iluminación'],
    body: `<p>El Ermitaño busca la verdad hacia adentro. Este es un año de profundidad, de introspección genuina, de desacelerar lo suficiente para escuchar lo que llevas tiempo ignorando. No es un año para la acción masiva — es un año para entender bien antes de actuar.</p>
<p><strong>Lo que comprendas genuinamente este año va a cambiar la calidad de todas tus decisiones de los próximos ciclos.</strong> No es pérdida de tiempo — es inversión en claridad. El Ermitaño que encuentra lo que busca no se queda solo: se convierte en guía.</p>
<p>La trampa es el aislamiento como evitación — retirarse del mundo no para entender sino para no tener que enfrentar. Hay una diferencia entre la soledad que ilumina y la que protege del dolor.</p>`,
    cross: (mn,mn_n) => `El Ermitaño y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde la profundidad interna es el camino de trabajo más directo. Lo que viniste a aprender tiene este año una puerta que solo se abre en silencio.`
  },
  10: {
    kw: ['Ciclos','Giro','Destino','Cambio inesperado','Oportunidad','Karma','Movimiento'],
    body: `<p>La Rueda de la Fortuna gira. Este es el año de los giros — lo que parecía estable puede moverse, y lo que parecía bloqueado puede abrirse de pronto. La energía de este arcano no avisa — simplemente llega. La flexibilidad es la única respuesta útil.</p>
<p><strong>Lo inesperado no es el problema este año — es el contenido.</strong> Las personas que más aprovechan el año de la Rueda son las que están suficientemente sueltas como para recibir lo que llega en formas que no habían planeado.</p>
<p>La trampa es aferrarse a cómo "debería ser" cuando la Rueda ya está girando. La resistencia al ciclo no lo detiene — solo hace más costoso el giro.</p>`,
    cross: (mn,mn_n) => `La Rueda de la Fortuna y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender llega de formas inesperadas. Estar abierto a que el aprendizaje llegue disfrazado de lo que no esperabas es la clave de este ciclo.`
  },
  11: {
    kw: ['Fortaleza interior','Paciencia','Dominio suave','Coraje','Presencia','Compasión','Resistencia'],
    body: `<p>La Fuerza no es la que empuja — es la que sostiene. Este es un año que va a requerir una fortaleza interior que no siempre necesitas mostrar. No es el año de los grandes gestos externos — es el año de mantenerse presente cuando todo lo demás se mueve.</p>
<p><strong>Lo que este año más necesita de ti no es brillantez ni esfuerzo máximo — es presencia sostenida.</strong> La capacidad de estar cuando es difícil, de no huir cuando el proceso se pone incómodo, de confiar cuando los resultados todavía no son visibles.</p>
<p>La trampa es confundir aguantar con fortaleza. La Fuerza real incluye saber cuándo soltar — con dignidad, sin dramatismo.</p>`,
    cross: (mn,mn_n) => `La Fuerza y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender requiere exactamente el tipo de valentía silenciosa que este arcano describe. No el héroe que gana — la persona que se queda.`
  },
  12: {
    kw: ['Pausa','Perspectiva diferente','Rendición','Soltar','Espera','Inversión','Revelación'],
    body: `<p>El Colgado ve el mundo desde otro ángulo — literalmente. Este es un año de perspectiva invertida. Lo que creías que era el camino puede no serlo. Lo que parecía pérdida puede ser exactamente lo que libera. Lo que parece una pausa puede ser la preparación más importante.</p>
<p><strong>Este año pide que pruebes ver lo mismo desde un ángulo que todavía no has usado.</strong> La resistencia a ese cambio de perspectiva es la única cosa que puede hacer este año realmente difícil.</p>
<p>La trampa es interpretar la pausa como fracaso. El Colgado está suspendido voluntariamente — no está atrapado. Hay una diferencia entre esperar que ilumina y esperar que evita.</p>`,
    cross: (mn,mn_n) => `El Colgado y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender se muestra desde un ángulo completamente nuevo. Si resistes el cambio de perspectiva, el aprendizaje no puede llegar. Si lo recibes, puede cambiarlo todo.`
  },
  13: {
    kw: ['Transformación','Final necesario','Renovación','Soltar','Cambio profundo','Renacimiento','Corte'],
    body: `<p>La Muerte no termina vidas — termina ciclos. Este es el año de la transformación profunda, del final de algo que ya cumplió su función. Puede ser una relación, una etapa profesional, una versión de ti mismo, una historia que te has estado contando. Algo que ya no eres va a soltarse este año.</p>
<p><strong>El dolor que puede traer este arcano no es señal de que algo salió mal — es exactamente lo que se siente cuando algo real termina.</strong> La Muerte no derrumba lo que sigue siendo necesario. Solo derrumba lo que ya terminó aunque todavía no lo hayas aceptado.</p>
<p>La trampa es resistir el final por miedo al vacío que viene después. Lo que se niega a terminar no puede comenzar de nuevo.</p>`,
    cross: (mn,mn_n) => `La Muerte y tu <em>Misión de ${mn_n} (${mn})</em> crean uno de los años de transformación más profunda disponibles en el ciclo. Algo en lo que viniste a resolver se completa este año. No lo retrases — es liberación, no pérdida.`
  },
  14: {
    kw: ['Integración','Equilibrio','Paciencia','Alquimia','Punto medio','Flujo','Moderación'],
    body: `<p>La Templanza mezcla lo que parecía incompatible. Este es el año de la integración — de encontrar el punto medio entre opuestos que has estado cargando por separado. Velocidad y pausa. Dar y recibir. Avanzar y soltar. Este año esos opuestos pueden coexistir.</p>
<p><strong>Lo que más necesita este año no es más esfuerzo ni más pausa — es la habilidad de hacer las dos cosas al mismo tiempo.</strong> La Templanza no elige un lado: alquimiza los dos en algo nuevo que ninguno de los dos podía ser solo.</p>
<p>La trampa es la impaciencia — la Templanza trabaja con tiempos que no siempre se pueden controlar. Forzar el proceso lo interrumpe.</p>`,
    cross: (mn,mn_n) => `La Templanza y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender requiere integrar partes de ti que llevas tiempo separando. El trabajo no es elegir — es aprender a sostener los dos.`
  },
  15: {
    kw: ['Sombra','Cadenas','Verdad incómoda','Liberación','Dependencia','Patrones','Honestidad radical'],
    body: `<p>El Diablo muestra las cadenas. Este es el año en que lo que te tiene atado va a ser visible con una claridad que puede ser muy incómoda. No como castigo — como información. Lo que ves con claridad, lo puedes trabajar. Lo que no ves, te sigue controlando.</p>
<p><strong>Las dependencias — de personas, de patrones, de historias que te cuentas sobre ti mismo — este año se hacen muy difíciles de ignorar.</strong> Eso es un regalo aunque no lo parezca: lo que se ve se puede elegir. Lo que está en la sombra, no.</p>
<p>La trampa es quedarse mirando las cadenas en lugar de preguntarse qué pasaría si se soltaran. El Diablo muestra — pero no encierra. Las cadenas del Diablo siempre están flojas.</p>`,
    cross: (mn,mn_n) => `El Diablo y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde los patrones que más frenan lo que viniste a aprender se hacen completamente visibles. Es incómodo. También es la única forma de trabajarlos de verdad.`
  },
  16: {
    kw: ['Derrumbe','Liberación','Verdad','Renovación','Crisis que libera','Ruptura','Lo que cae'],
    body: `<p>La Torre derrumba lo que no tenía base real. Este es el año de las revelaciones que cambian perspectivas, de las estructuras que caen porque estaban construidas sobre algo que no era sólido. No derrumba lo que realmente está bien construido — solo lo que nunca debió estar ahí.</p>
<p><strong>Lo que cae este año no es pérdida — es espacio.</strong> La Torre no destruye por destruir: libera lo que estaba atrapado debajo de algo que ya no debería estar ahí. El dolor del derrumbe es real. También lo es lo que queda cuando el polvo baja.</p>
<p>La trampa es intentar reconstruir lo mismo antes de entender por qué cayó. La Torre pide que primero se mire lo que quedó en pie.</p>`,
    cross: (mn,mn_n) => `La Torre y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde algo que frenaba lo que viniste a aprender se cae definitivamente. Duele. Y abre el espacio exacto que necesitabas para el siguiente paso.`
  },
  17: {
    kw: ['Esperanza','Renovación','Claridad','Guía','Fe','Inspiración','Apertura'],
    body: `<p>La Estrella ilumina después de la tormenta. Este es el año de la renovación genuina — no la esperanza ingenua, sino la que viene después de haber pasado por algo difícil y encontrado que todavía tienes recursos intactos. La Estrella no promete que todo va a ser fácil — muestra que hay un camino.</p>
<p><strong>Este año hay una apertura disponible que no siempre está ahí.</strong> Cosas que parecían bloqueadas pueden empezar a moverse. Relaciones que estaban en impasse pueden encontrar un ángulo nuevo. La clave es estar suficientemente abierto para recibirlo.</p>
<p>La trampa es la esperanza pasiva — esperar que la estrella lo resuelva sin poner de tu parte. La Estrella ilumina el camino, pero tú tienes que caminar.</p>`,
    cross: (mn,mn_n) => `La Estrella y tu <em>Misión de ${mn_n} (${mn})</em> crean un año de renovación en lo que viniste a aprender. Hay una apertura disponible para trabajar tu misión de vida que en otros años no estaba tan accesible. No la dejes pasar.`
  },
  18: {
    kw: ['Profundidades','Ilusión','Instinto','Sombra','Ciclos','Lo oculto','Intuición profunda'],
    body: `<p>La Luna ilumina lo que la luz del día no deja ver. Este es el año en que lo que no has querido ver va a subir — no como amenaza, sino como información que ya era hora de procesar. Las ilusiones que has mantenido activas, los miedos que han operado en segundo plano, los patrones que actúan cuando no estás mirando.</p>
<p><strong>Este año la intuición tiene acceso a capas que normalmente no están disponibles.</strong> Pero también hay más riesgo de confundir el miedo con el instinto, la ilusión con la verdad. El discernimiento es la herramienta central de este año.</p>
<p>La trampa es dejarse llevar por lo que emerge sin cuestionarlo. La Luna muestra — no certifica. Lo que sube a la superficie necesita ser examinado, no solo sentido.</p>`,
    cross: (mn,mn_n) => `La Luna y tu <em>Misión de ${mn_n} (${mn})</em> crean un año donde lo que viniste a aprender emerge desde las capas más profundas. Lo que estaba oculto — incluso para ti — se vuelve visible este año. Es el momento de mirarlo.`
  },
  19: {
    kw: ['Claridad','Vitalidad','Alegría','Reconocimiento','Éxito','Identidad','Luz'],
    body: `<p>El Sol ilumina todo. Este es el año de la claridad genuina, de la energía vital disponible, del reconocimiento que llega cuando lo que construiste empieza a verse. El Sol no esconde nada — lo que funciona brilla, y lo que no funciona también se ve con nitidez.</p>
<p><strong>Este año hay una vitalidad y una claridad de identidad disponibles que hacen las decisiones más fáciles.</strong> Sabes quién eres con más certeza. Lo que quieres con más claridad. Cómo quieres vivir con más convicción. Ese es el regalo del año del Sol.</p>
<p>La trampa es la soberbia — el Sol puede volverse cegador si se asume que lo que brilla siempre tiene razón. La claridad también puede revelar lo que necesita cambiar.</p>`,
    cross: (mn,mn_n) => `El Sol y tu <em>Misión de ${mn_n} (${mn})</em> crean uno de los años más fértiles para avanzar en lo que viniste a aprender. Hay energía, claridad y visibilidad disponibles. Este es el año de salir con lo que has estado trabajando en silencio.`
  },
  20: {
    kw: ['Llamado','Despertar','Rendición de cuentas','Propósito','Revelación','Respuesta','Trascendencia'],
    body: `<p>El Juicio llama. Este es el año en que algo que llevas tiempo sabiendo — sobre ti, sobre lo que quieres, sobre lo que ya no puedes seguir ignorando — va a exigir una respuesta. No es amenaza: es la vida preguntándote si ya estás listo para responder a lo que siempre supo que ibas a tener que enfrentar.</p>
<p><strong>Este año ya no es posible no ver.</strong> Lo que has pospuesto, lo que has evitado, lo que has racionalizado — este año llega a un punto donde la evasión tiene un costo demasiado visible. El Juicio no castiga — invita. Pero la invitación ya no puede declinarse.</p>
<p>La trampa es interpretar el llamado como condena. El Juicio no destruye — despierta. Y lo que se despierta este año puede cambiarlo todo.</p>`,
    cross: (mn,mn_n) => `El Juicio y tu <em>Misión de ${mn_n} (${mn})</em> crean el año más directo de todos para responder al propósito de vida. Lo que viniste a aprender este año llama desde adentro con una claridad que no habías sentido antes. La respuesta es tuya.`
  },
  21: {
    kw: ['Completud','Cierre de ciclo','Integración','Logro','Totalidad','Reconocimiento','Nuevo inicio'],
    body: `<p>El Mundo completa. Este es el año del cierre de un ciclo largo — puede ser de años, puede ser de toda una etapa de vida. Hay algo que reconocer, que celebrar, que integrar conscientemente antes de empezar de nuevo desde un lugar diferente.</p>
<p><strong>La completud del Mundo no es el final — es la llegada.</strong> Hay un logro real que reconocer este año, aunque no siempre sea visible desde afuera. Lo que se cierra bien deja espacio limpio para lo que sigue. Lo que se cierra sin reconocerse arrastra su peso al siguiente ciclo.</p>
<p>La trampa es no detenerse a reconocer lo que se completó — pasar directamente al siguiente capítulo sin honrar lo que costó llegar hasta aquí.</p>`,
    cross: (mn,mn_n) => `El Mundo y tu <em>Misión de ${mn_n} (${mn})</em> crean un año de integración profunda de lo que has estado aprendiendo. Algo en tu misión de vida se completa este año. No lo pases de largo — hay algo importante que ver en ese cierre.`
  },
  22: {
    kw: ['Umbral','Entre dos mundos','Soltar','Potencial puro','Inicio desde cero','Vacío fértil','Libertad'],
    body: `<p>El año 22 es el año cero — el más incómodo y el más fértil de todo el ciclo numerológico. Algo que fue definitivamente terminó. Lo nuevo todavía no tiene forma, nombre ni dirección clara. Estás entre dos mundos, y ese espacio tiene todo el potencial de lo que todavía no se ha cristalizado.</p>
<p><strong>La tentación más grande de este año es llenar el vacío con cualquier cosa antes de que lo nuevo pueda tomar su forma natural.</strong> La prisa por saber qué sigue es exactamente lo que puede interrumpir el proceso. Este año, no saber es parte del camino.</p>
<p>La trampa es regresar a lo que ya terminó solo porque lo nuevo todavía no está. El vacío no es ausencia — es espacio. Y el espacio es exactamente lo que necesita lo que viene.</p>`,
    cross: (mn,mn_n) => `El año cero y tu <em>Misión de ${mn_n} (${mn})</em> crean el momento de mayor potencial no cristalizado. Lo que viniste a aprender está a punto de iniciar un ciclo completamente nuevo. No lo apresures — lo que se gesta en silencio llega con más fuerza.`
  }
};

/* ═══ NUMBER DATA ═══ */

const ARCH_SYM = {0:'○',1:'♂',2:'☽',3:'♃',4:'♄',5:'☿',6:'♀',7:'⊕',8:'♈',9:'♆',11:'☿',22:'♄',33:'♃',44:'♂'};

const ND = {
  0:{n:'El Umbral',
  kws_mision:['Potencial puro','Entre dos mundos','Inicio absoluto','Vacío fértil','Todo es posible'],
  kws_alma:['Esencia sin forma','Origen','Silencio creador','Presencia sin definición','Lo que aún no es'],
  kws_ego:['Misterio proyectado','Presencia indefinible','Imagen que cambia','Difícil de categorizar','Fluido'],
  kws_don:['Adaptarse a cualquier forma','Contener multitudes','Empezar desde cero sin miedo','Potencial sin límite','Apertura total'],
  kws_karma:['Identidad sin ancla','Vacío sin dirección','Potencial sin materializar','Dispersión heredada','El que no termina de llegar'],
  luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una apertura y una flexibilidad que muy pocas personas tienen. Puedes entrar a cualquier espacio, adaptarte a cualquier contexto y comenzar desde cero sin el peso que otros cargan. Eso es un recurso real y escaso.',
  luz_alma:'Tu esencia más profunda tiene una cualidad de origen — algo en ti no termina de cristalizarse en una sola forma porque contiene demasiadas posibilidades. Eso que sientes como indefinición es en realidad potencial puro.',
  luz_ego:'Lo que proyectas es difícil de categorizar — y eso no es un defecto. Las personas que más te admiran son las que se quedan tiempo suficiente para ver todo lo que hay.',
  luz_don:'Tu talento más natural es la apertura total: entrar sin prejuicios, empezar sin miedo, contenerte en formas que otros no pueden.',
  luz_karma:'Cuando trabajas este karma, la libertad que ejerces es la más completa — la que no huye de nada sino que elige conscientemente dónde colocarse.',
  neg_mision:'El patrón que más frena esta misión: la dificultad para tomar forma. El potencial que nunca aterriza porque siempre hay otra posibilidad abierta. La identidad que cambia tanto que no deja huella.',
  neg_alma:'Cuando esta energía no está integrada: la sensación de no saber bien quién eres. La tendencia a ser lo que el entorno o las personas necesitan, perdiendo el hilo propio.',
  neg_ego:'La imagen fluida puede generar la experiencia de que nadie te conoce de verdad — porque cada persona tiene una versión diferente de ti y ninguna es completa.',
  neg_don:'El riesgo de este talento es quedarse en el potencial sin materializar nada. La apertura que nunca se cierra en algo concreto.',
  neg_karma:'Sin trabajar: la sensación de estar siempre empezando, nunca llegando. El ciclo de inicios sin cierres que deja una inquietud de fondo.',
  body_mision:'Viniste a aprender a tomar forma sin perder la libertad — a materializarte sin cerrarte. El desafío central de esta misión es que con tanto potencial disponible, elegir una dirección se siente como perder las demás.',
  body_alma:'Tu esencia más profunda tiene una cualidad de origen y apertura. Antes de cualquier forma, antes de cualquier definición — hay algo en ti que contiene todo lo que podría ser.',
  body_ego:'Lo que proyectas es difícil de categorizar. Eso puede sentirse como una desventaja — hasta que encuentras entornos donde esa fluidez es exactamente lo que se necesita.',
  body_don:'El talento con el que llegaste es la apertura absoluta: empezar desde cero sin el peso del pasado, entrar en cualquier contexto sin resistencia.',
  body_karma:'Traes patrones de identidad sin ancla o de potencial que nunca termina de materializarse. El aprendizaje es elegir una dirección sin sentir que pierdes todo lo demás.',
  kws_person_mision:['Potencial por materializar','Apertura consciente','Inicio real','Forma elegida','Libertad con dirección'],
  kws_person_alma:['Esencia fluida','Origen puro','Presencia sin límite','Contenedor de posibilidades','Lo que todavía puede ser'],
  kws_person_ego:['Imagen cambiante','Difícil de categorizar','Fluido y adaptable','Muchas caras reales','Misterio genuino'],
  kws_person_don:['Apertura total','Empezar sin miedo','Adaptarse a cualquier forma','Potencial real','Presencia sin prejuicios'],
  kws_person_karma:['Identidad en proceso','Materializar pendiente','Potencial por aterrizar','Forma por elegir','Dirección en construcción']
},
  1:{n:'El Pionero',
    kws_mision:['Liderazgo','Autonomía','Iniciativa','Autoridad propia','Independencia'],
    kws_alma:['Fuego interior','Impulso creativo','Autosuficiencia','Visión pionera','Arranque'],
    kws_ego:['Presencia fuerte','Seguridad proyectada','Determinación visible','Criterio propio','Imagen de fuerza'],
    kws_don:['Inicio','Creatividad pionera','Ver lo que no existe aún','Primeros pasos','Catálisis'],
    kws_karma:['Ego sin consciencia','Liderazgo no ético','Soledad heredada','Independencia forzada','Poder sin servicio'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una iniciativa y una claridad de dirección que pocas personas tienen. Puedes empezar cosas donde otros todavía están dudando. Tu liderazgo, cuando es auténtico, genera confianza sin que tengas que pedirla.',
    luz_alma:'Tu esencia más profunda tiene una energía de arranque genuina. Cuando confías en ella, hay una vitalidad que sorprende. Eres el tipo de persona que puede iniciar desde cero y hacer que funcione.',
    luz_ego:'Proyectas una presencia que comunica criterio y dirección. La gente confía en tu orientación antes de que hagas nada — tu energía ya habla por ti.',
    luz_don:'Tu talento más natural es ver lo que todavía no existe y encontrar el primer movimiento para crearlo. Donde otros ven "no se puede", tú ya estás viendo el punto de entrada.',
    luz_karma:'Cuando trabajas este karma, el liderazgo que emerge es el más limpio: el que no necesita demostrar nada, que no controla por miedo y que incluye a otros en lugar de dejarlos atrás.',
    neg_mision:'El patrón que más frena esta misión: buscar validación antes de actuar. Necesitar que alguien más confirme la dirección antes de moverse. También: arrogancia como escudo, el impulso de hacerlo solo cuando colaborar sería más inteligente.',
    neg_alma:'Cuando esta energía no está integrada: soledad disfrazada de autosuficiencia. La dificultad para pedir ayuda sin que se sienta como debilidad. El aislamiento que llega de creer que nadie más puede entender el nivel de la visión.',
    neg_ego:'La imagen de fortaleza puede convertirse en una armadura que nadie puede atravesar. Las personas asumen que no necesitas apoyo porque nunca lo muestras. La soledad que viene de nunca bajar la guardia.',
    neg_don:'El riesgo de este talento es usarlo sin escuchar — abrir caminos que nadie más estaba listo para tomar, empujar hacia adelante cuando el momento pedía esperar.',
    neg_karma:'Sin trabajar: ciclos de éxito y sabotaje que parecen inexplicables. La autodestrucción justo antes del umbral. El patrón de casi llegar y no terminar de llegar.',
    body_mision:'Viniste a aprender a actuar desde tu propia autoridad sin esperar que nadie te dé permiso. El patrón más recurrente de esta misión es buscar validación antes de moverse — como si la dirección interna no fuera suficiente. La libertad que buscas está en aprender que tu criterio tiene valor aunque nadie más lo vea todavía.',
    body_alma:'Tu esencia más profunda llegó con una energía de inicio y de independencia. Cuando operas desde ese lugar hay una vitalidad que sorprende. La trampa: cuando esta energía no se trabaja, se convierte en dificultad para pedir ayuda y en la soledad de creer que hay que hacerlo todo solo.',
    body_ego:'Lo que proyectas al mundo antes de que te conozcan de verdad es presencia, criterio y seguridad. La sombra de esa imagen es que nadie te ofrece apoyo porque asumen que no lo necesitas — porque nunca lo muestras.',
    body_don:'El talento con el que llegaste equipado es la iniciativa creativa: ver lo que todavía no existe y encontrar el primer paso para crearlo. Donde otros ven "no hay condiciones", tú ves el punto de entrada.',
    body_karma:'Traes patrones de liderazgo que no siempre fue consciente o ético, o de independencia que se volvió aislamiento. El aprendizaje es liderar desde el servicio y no desde la necesidad de reconocimiento o control.',
    kws_person_mision:['Líder natural','Iniciativa sin permiso','Claridad de dirección','Fuego de arranque','Autonomía real'],
    kws_person_alma:['Energía pionera','Impulso creador','Autosuficiencia genuina','Visión temprana','Motor interno'],
    kws_person_ego:['Proyecta seguridad','Imagen de fuerza','Presencia que dirige','Criterio visible','Referente natural'],
    kws_person_don:['Primeros pasos','Ver antes que otros','Creatividad pionera','Arrancar desde cero','Catalizador'],
    kws_person_karma:['Patrón de control','Sabotaje en el umbral','Soledad heredada','Independencia como escudo','Poder en proceso']
  },
  2:{n:'El Diplomático',
    kws_mision:['Equilibrio','Colaboración','Diplomacia','Relaciones profundas','Armonía real'],
    kws_alma:['Sensibilidad','Conexión','Empatía profunda','Escucha genuina','Percepción fina'],
    kws_ego:['Calidez proyectada','Disponibilidad','Mediador natural','Suavidad visible','Imagen de apoyo'],
    kws_don:['Escucha profunda','Crear puentes','Armonizar','Percibir lo no dicho','Conectar genuinamente'],
    kws_karma:['Codependencia','Invisibilidad','Sacrificio como amor','Ceder sin límites','Servilismo heredado'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una inteligencia relacional y una capacidad de conexión que muy pocos tienen. Puedes crear armonía donde otros solo crean conflicto, y leer las dinámicas de un grupo con una precisión que sorprende.',
    luz_alma:'Tu esencia tiene una capacidad de conexión genuina que la gente siente antes de que hagas nada. Eres de las personas que hacen que alguien se sienta visto sin necesitar decir nada extraordinario.',
    luz_ego:'Lo que proyectas crea ambientes de seguridad emocional. La gente se siente bien cerca de ti — y eso tiene un valor enorme que a veces das por sentado.',
    luz_don:'Tu talento más natural es crear puentes donde hay fracturas. Donde otros ven incompatibilidades irresolubles, tú encuentras el punto común.',
    luz_karma:'Cuando trabajas este karma, la conexión que ofreces es la más limpia: la que no necesita que el otro esté bien para que tú puedas estarlo, la que da desde la elección y no desde el miedo.',
    neg_mision:'El patrón que más frena esta misión: la indecisión crónica cuando hay presión de todos lados. Ceder para mantener la paz hasta perder el propio lugar. La dificultad para establecer límites sin sentir que se rompe todo.',
    neg_alma:'Cuando esta energía no está integrada: disolución en el otro. No saber dónde terminas tú y dónde empieza él/ella. Absorber las emociones del entorno como si fueran tuyas.',
    neg_ego:'La imagen de disponibilidad total puede convertirse en la expectativa de que siempre tienes espacio para todos. Nadie te pregunta cómo estás tú porque asumen que estás bien.',
    neg_don:'El riesgo de este talento es usarlo para evitar conflictos necesarios. No todos los puentes deberían construirse — a veces la fractura es la información más importante.',
    neg_karma:'Sin trabajar: relaciones donde das demasiado y recibes demasiado poco sin saber cómo cambiar ese patrón. La invisibilidad que viene de siempre poner al otro primero.',
    body_mision:'Viniste a aprender a relacionarte desde el equilibrio real — no desde la necesidad de que el otro esté bien para que tú puedas estarlo. El conflicto más recurrente de esta misión es ceder demasiado para mantener la paz y terminar sin lugar propio.',
    body_alma:'Tu esencia tiene una capacidad de conexión profunda que pocos tienen. La trampa es fusionarte con el otro hasta perder el hilo de quién eres tú. La pregunta más importante para tu alma en el amor: ¿cuándo terminas tú y cuándo empieza él/ella?',
    body_ego:'Lo que proyectas es calidez y disponibilidad total. Eso crea vínculos profundos — y también puede atraer a personas que buscan ser cuidadas sin corresponder.',
    body_don:'El talento con el que llegaste es la escucha profunda: la rara capacidad de hacer que alguien se sienta verdaderamente visto. Eso no tiene precio en un mundo donde casi nadie escucha de verdad.',
    body_karma:'Traes patrones de codependencia o de amor que exigía el sacrificio total. El aprendizaje es que la conexión real no requiere que te borres para que el otro se sienta bien.',
    kws_person_mision:['Equilibrio relacional','Mediador consciente','Diplomacia real','Conexión profunda','Armonía sin sacrificio'],
    kws_person_alma:['Empatía genuina','Sensibilidad fina','Escucha real','Percepción no dicha','Fusión emocional'],
    kws_person_ego:['Calidez visible','Disponible para todos','Imagen de apoyo','Mediador natural','Presencia suave'],
    kws_person_don:['Puentes reales','Conexión genuina','Armonizar sin forzar','Leer lo no dicho','Crear seguridad'],
    kws_person_karma:['Codependencia en proceso','Límites por aprender','Dar sin recibir','Invisibilidad heredada','Ceder como patrón']
  },
  3:{n:'El Creativo',
    kws_mision:['Expresión','Comunicación','Creatividad','Alegría auténtica','Conexión emocional'],
    kws_alma:['Vitalidad creativa','Alegría profunda','Necesidad de ser visto','Expresión como respiración','Carisma natural'],
    kws_ego:['Carisma visible','Originalidad proyectada','Humor como escudo','Brillo que conecta','Imagen entretenida'],
    kws_don:['Comunicar que mueve','Crear lo memorable','Transformar lo ordinario','Contagiar visiones','Expresión que impacta'],
    kws_karma:['Represión creativa','Expresión castigada','Dispersión heredada','Talentos bloqueados','Miedo al juicio'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una creatividad y una capacidad de comunicación que transforma lo ordinario en algo que vale la pena. La gente que te escucha o lee lo que creas siente algo — y eso es un talento real y escaso.',
    luz_alma:'Tu esencia tiene una vitalidad creativa y una alegría que transforma entornos. Cuando estás presente de forma auténtica, la energía de lo que hay alrededor cambia.',
    luz_ego:'Lo que proyectas es carisma y originalidad. La gente quiere estar cerca de ti porque en tu presencia las cosas se sienten más vivas.',
    luz_don:'Tu talento más natural es la comunicación que mueve: escribir, hablar, crear de una forma que la gente no puede ignorar. Donde otros informan, tú transformas.',
    luz_karma:'Cuando trabajas este karma, la expresión que emerge es la más auténtica: libre de la necesidad de aprobación, capaz de mostrarse vulnerable sin perder su poder.',
    neg_mision:'El patrón que más frena esta misión: usar el humor o la ligereza como escudo cuando las cosas se ponen profundas. Preferir ser querido a ser conocido de verdad. La dispersión creativa que produce muchos inicios y pocos cierres.',
    neg_alma:'Cuando esta energía no está integrada: la represión emocional disfrazada de alegría. La risa como forma de no ir al fondo de lo que duele. Desconectarse aunque el cuerpo esté presente.',
    neg_ego:'La imagen de brillo puede volverse la expectativa de que siempre tienes algo entretenido o interesante que ofrecer. La presión de no poder bajar la guardia.',
    neg_don:'El riesgo de este talento es usarlo para entretener en lugar de comunicar algo que importa. La facilidad de conectar superficialmente con todos sin profundizar con nadie.',
    neg_karma:'Sin trabajar: talentos eternamente bloqueados o expresados a medias por miedo al juicio o a la exposición. La pregunta "¿y si no soy tan bueno?" que detiene antes de empezar.',
    body_mision:'Viniste a aprender a expresarte sin pedir permiso — y sin usar el humor o la ligereza como escudo cuando las cosas se ponen difíciles. El patrón central: cuando el vínculo se vuelve profundo y vulnerable, el 3 a veces prefiere ser entretenido a ser visto.',
    body_alma:'Tu esencia busca expresión y conexión auténtica. Cuando te sientes juzgado o contenido, te desconectas aunque te quedes físicamente presente.',
    body_ego:'Lo que proyectas es carisma y originalidad. La sombra: el 3 a veces prefiere ser querido a ser conocido de verdad.',
    body_don:'El talento con el que llegaste es la comunicación que transforma: crear, escribir, hablar, enseñar de una forma que la gente no puede ignorar.',
    body_karma:'Traes patrones donde la expresión fue suprimida o castigada. El aprendizaje es que mostrarte vulnerable no te hace débil — te hace real.',
    kws_person_mision:['Expresión auténtica','Comunicación que mueve','Creatividad real','Alegría profunda','Conexión emocional'],
    kws_person_alma:['Vitalidad creativa','Necesidad de ser visto','Carisma genuino','Alegría como recurso','Expresión vital'],
    kws_person_ego:['Brillo natural','Carisma proyectado','Imagen entretenida','Originalidad visible','Presencia que anima'],
    kws_person_don:['Comunicar transformando','Crear memorias','Contagiar visión','Expresión impactante','Transformar lo ordinario'],
    kws_person_karma:['Represión creativa','Miedo al juicio','Dispersión por integrar','Expresión bloqueada','Vulnerabilidad en proceso']
  },
  4:{n:'El Constructor',
    kws_mision:['Estructura','Fundamentos','Materialización','Consistencia','Construcción duradera'],
    kws_alma:['Necesidad de solidez','Estabilidad como valor','Método interno','Disciplina natural','Base ante todo'],
    kws_ego:['Confiabilidad proyectada','Seriedad visible','Imagen de método','Presencia sólida','El que cumple'],
    kws_don:['Materializar','Convertir visión en realidad','Construir lo que dura','Método que funciona','Ejecutar de verdad'],
    kws_karma:['Rigidez heredada','Amor como provisión','Trabajo sin reconocimiento','Control como sustituto','Estructura asfixiante'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una consistencia y una capacidad de materialización que son extraordinariamente escasas. En un mundo de promesas vacías, alguien que cumple tiene un valor que muchos no ven hasta que se va.',
    luz_alma:'Tu esencia tiene una disciplina natural y una necesidad de solidez que cuando se orienta bien produce resultados reales. No necesitas motivación externa para hacer lo que te comprometiste a hacer.',
    luz_ego:'Lo que proyectas es confiabilidad y criterio estructurado. La gente siente que puede contar contigo — y esa es una de las formas más valiosas de presencia.',
    luz_don:'Tu talento más natural es la materialización: tomar una visión que otros tienen en la cabeza y convertirla en algo que existe y funciona de verdad en el mundo.',
    luz_karma:'Cuando trabajas este karma, la disciplina que emerge es libre de miedo — que construye porque ama, que sostiene porque elige, que da estructura como regalo en lugar de como control.',
    neg_mision:'El patrón que más frena esta misión: la rigidez disfrazada de método. El trabajo excesivo como forma de no sentir. El control como sustituto del amor o la confianza.',
    neg_alma:'Cuando esta energía no está integrada: el orden que se vuelve cárcel. La dificultad para adaptarse cuando la situación pide soltar el plan. El miedo al caos que genera más control del necesario.',
    neg_ego:'La imagen de confiabilidad puede volverse la expectativa de que siempre estás disponible para sostener lo que otros no quieren sostener. Sin límites, el rol de "el que cumple" se convierte en carga.',
    neg_don:'El riesgo de este talento es confundirlo con el control: querer que todo se construya exactamente como se imagina, sin dejar espacio a lo que emerge naturalmente.',
    neg_karma:'Sin trabajar: el trabajo excesivo como anestesia. Relaciones donde el amor se expresa solo a través de la provisión y nunca del calor. Estructuras tan rígidas que asfixian lo que deberían proteger.',
    body_mision:'Viniste a aprender a construir algo duradero sin confundir estructura con control — y sin sacrificar el calor por el orden.',
    body_alma:'Tu esencia busca estabilidad real. Cuando algo no tiene base, te desconectas aunque el amor sea genuino.',
    body_ego:'Lo que proyectas es confiabilidad y seriedad. Eso genera confianza duradera — y puede percibirse como frío o poco espontáneo.',
    body_don:'El talento con el que llegaste es la materialización: tomar una visión y convertirla en algo que existe y funciona de verdad.',
    body_karma:'Traes patrones de trabajo sin reconocimiento o de amor expresado solo a través de la provisión. El aprendizaje es añadir calor real a la estructura.',
    kws_person_mision:['Construir para que dure','Consistencia real','Fundamentos sólidos','Materialización consciente','Disciplina elegida'],
    kws_person_alma:['Solidez interna','Método natural','Estabilidad necesaria','Disciplina genuina','Base como valor'],
    kws_person_ego:['El que cumple','Confiabilidad visible','Presencia sólida','Seriedad proyectada','Imagen de método'],
    kws_person_don:['Materializar visiones','Convertir ideas en hechos','Construir lo que dura','Ejecutar de verdad','Método que funciona'],
    kws_person_karma:['Rigidez por soltar','Control como patrón','Amor por ampliar','Reconocimiento pendiente','Calidez en proceso']
  },
  5:{n:'El Aventurero',
    kws_mision:['Libertad','Adaptación','Movimiento','Variedad','Expansión sin límites'],
    kws_alma:['Inquietud genuina','Sed de experiencia','Necesidad de variedad','Motor de cambio','Libertad como oxígeno'],
    kws_ego:['Espontaneidad visible','Magnetismo proyectado','Imagen impredecible','Versatilidad mostrada','Presencia viva'],
    kws_don:['Adaptación rápida','Versatilidad real','Reinvención elegante','Funcionar en lo nuevo','Improvisar bien'],
    kws_karma:['Huida como patrón','Inestabilidad heredada','Cambio sin integración','Libertad forzada','Compromiso como miedo'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una adaptabilidad y una capacidad de reinvención que en un mundo que cambia constantemente es un recurso extraordinario. Encuentras la solución cuando todos los demás ya dieron por terminado.',
    luz_alma:'Tu esencia tiene una sed de experiencia y una necesidad de variedad que cuando se orienta bien produce una vida extraordinariamente rica. Tu capacidad de funcionar en lo nuevo y lo desconocido es un talento real.',
    luz_ego:'Lo que proyectas es magnetismo y espontaneidad. La gente quiere estar cerca de ti porque en tu presencia las cosas se sienten más vivas y posibles.',
    luz_don:'Tu talento más natural es la adaptación rápida: entrar a un contexto nuevo y funcionar en horas donde otros tardan meses.',
    luz_karma:'Cuando trabajas este karma, la libertad que ejerces es la más completa: la que no necesita huir de nada porque no hay nada que la retenga.',
    neg_mision:'El patrón que más frena esta misión: la huida como estrategia de vida. El siguiente cambio antes de integrar el anterior. Una inquietud crónica que ningún destino externo resuelve.',
    neg_alma:'Cuando esta energía no está integrada: la dispersión que lleva energía a veinte lugares sin profundizar en ninguno. La dificultad para comprometerse con algo que pida consistencia.',
    neg_ego:'La imagen de espontaneidad puede generar inestabilidad que los demás deben absorber sin que lo notes. La imprevisibilidad que a veces es energizante y otras veces es simplemente poco confiable.',
    neg_don:'El riesgo de este talento es dispersarlo en demasiadas direcciones sin que ninguna llegue a su profundidad real. La versatilidad que nunca profundiza.',
    neg_karma:'Sin trabajar: una inquietud interna que ningún cambio de ciudad, trabajo o relación puede calmar. El patrón de empezar con entusiasmo total y perder el interés cuando las cosas piden consistencia.',
    body_mision:'Viniste a aprender que la libertad y el compromiso no son incompatibles — pero requiere pedirlo en lugar de huir cuando te sientes encerrado.',
    body_alma:'Tu esencia necesita variedad y movimiento como condición, no como bonus. Sin ello, produces por debajo de tu nivel real.',
    body_ego:'Lo que proyectas es magnetismo y espontaneidad. Eso fascina — hasta que la otra persona quiere más consistencia.',
    body_don:'El talento con el que llegaste es la adaptación rápida: entrar a un contexto nuevo y funcionar donde otros tardan meses.',
    body_karma:'Traes patrones de libertad negada o de cambio constante sin elección propia. El aprendizaje es moverte desde la voluntad, no desde el miedo.',
    kws_person_mision:['Libertad real','Adaptación consciente','Movimiento con dirección','Variedad necesaria','Expansión elegida'],
    kws_person_alma:['Inquietud vital','Sed de experiencia','Cambio como naturaleza','Versatilidad genuina','Libertad como oxígeno'],
    kws_person_ego:['Magnetismo natural','Espontaneidad visible','Imagen impredecible','Presencia que activa','Versatilidad mostrada'],
    kws_person_don:['Adaptación rápida','Funcionar en lo nuevo','Reinventarse con gracia','Improvisar de verdad','Resolver en movimiento'],
    kws_person_karma:['Huida por integrar','Inquietud crónica','Compromiso en proceso','Inestabilidad heredada','Libertad sin miedo']
  },
  6:{n:'El Sanador',
    kws_mision:['Amor consciente','Cuidado con límites','Servicio elegido','Responsabilidad desde el amor','Sanación real'],
    kws_alma:['Amor profundo','Necesidad de nutrir','Cuidado genuino','Calor natural','Dar como lenguaje'],
    kws_ego:['Calidez total','Disponibilidad proyectada','Imagen de apoyo','Presencia que cuida','El que sostiene'],
    kws_don:['Crear seguridad','Nutrir entornos','Sanar dinámicas','Amor que transforma','Presencia que cura'],
    kws_karma:['Dar desde el miedo','Martirio silencioso','Amor condicional','Cuidado sin límites','Sacrificio heredado'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a un amor y una capacidad de cuidado que transforma entornos sin que nadie sepa exactamente cómo. Tu presencia tiene un efecto real en el bienestar de lo que te rodea.',
    luz_alma:'Tu esencia tiene una profundidad de amor y una necesidad de nutrir que cuando se orienta bien crea espacios donde las personas florecen de formas que en ningún otro lugar podrían.',
    luz_ego:'Lo que proyectas es calidez y disponibilidad. Eso crea seguridad emocional a tu alrededor — un regalo real en un mundo donde eso es escaso.',
    luz_don:'Tu talento más natural es crear espacios donde el otro puede ser exactamente como es, sin sentirse juzgado o apurado.',
    luz_karma:'Cuando trabajas este karma, el amor que ofreces es el más libre: el que da porque quiere, que sostiene porque elige, que cuida sin necesitar que el otro esté bien para que tú puedas estarlo.',
    neg_mision:'El patrón que más frena esta misión: el martirio silencioso que factura emocionalmente. Dar desde el miedo a que se vayan y después sentirte resentido porque nadie lo reconoció.',
    neg_alma:'Cuando esta energía no está integrada: la hiperresponsabilidad que nadie te pidió pero que asumir se siente inevitable. El agotamiento del que siempre cuida y raramente es cuidado.',
    neg_ego:'La imagen de disponibilidad total puede generar la expectativa de que siempre tienes espacio para todos — y la dificultad para decir que no sin sentirte mala persona.',
    neg_don:'El riesgo de este talento es usarlo para resolver lo que otros deberían resolver solos, creando dependencia en lugar de crecimiento.',
    neg_karma:'Sin trabajar: agotamiento crónico y relaciones profundamente desequilibradas donde das tanto que terminas resentido de haberlo dado.',
    body_mision:'Viniste a aprender a dar desde la plenitud y no desde el miedo a que se vayan — a cuidar con límites reales.',
    body_alma:'Tu esencia da con profundidad genuina. La trampa es hacerlo desde el miedo a que se vayan, no desde la elección.',
    body_ego:'Lo que proyectas es calidez y disponibilidad total. Eso crea vínculos profundos y también puede atraer a quienes buscan ser cuidados sin corresponder.',
    body_don:'El talento con el que llegaste es crear espacios donde el otro puede ser exactamente como es, sin sentirse juzgado.',
    body_karma:'Traes patrones donde cuidar al otro era la condición para ser amado. El aprendizaje es que mereces amor sin tener que ganártelo.',
    kws_person_mision:['Amor desde la plenitud','Cuidar con límites','Servicio elegido','Responsabilidad real','Sanación consciente'],
    kws_person_alma:['Amor profundo','Nutrir como naturaleza','Calor genuino','Dar como lenguaje','Cuidado real'],
    kws_person_ego:['El que sostiene','Calidez proyectada','Disponible siempre','Imagen de apoyo','Presencia cálida'],
    kws_person_don:['Crear seguridad','Nutrir entornos','Sanar lo roto','Amor que transforma','Presencia que cura'],
    kws_person_karma:['Martirio por sanar','Dar desde el miedo','Amor condicional','Sacrificio heredado','Límites en proceso']
  },
  7:{n:'El Sabio',
    kws_mision:['Profundidad','Verdad interior','Investigación','Sabiduría real','Conocimiento profundo'],
    kws_alma:['Mente analítica','Necesidad de sentido','Profundidad natural','Buscar la verdad','Silencio como recurso'],
    kws_ego:['Misterio proyectado','Inteligencia visible','Distancia aparente','Imagen analítica','Presencia que observa'],
    kws_don:['Ver debajo de la superficie','Análisis profundo','Encontrar la verdad oculta','Precisión','Investigar de verdad'],
    kws_karma:['Silencio como aislamiento','Saber sin compartir','Distancia emocional','Análisis como evitación','Conocimiento guardado'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una profundidad analítica que pocos pueden igualar. Ves las capas que los demás no alcanzan. Cuando compartes lo que encuentras, tiene un impacto real.',
    luz_alma:'Tu esencia tiene una necesidad de sentido y profundidad que cuando se orienta bien produce comprensiones que otros no pueden alcanzar por caminos más rápidos.',
    luz_ego:'Lo que proyectas es inteligencia y criterio. La gente confía en tu análisis antes de que digas nada — tu presencia ya comunica que has pensado las cosas a fondo.',
    luz_don:'Tu talento más natural es encontrar la verdad debajo de la superficie en cualquier sistema, situación o persona.',
    luz_karma:'Cuando trabajas este karma, la sabiduría que emerge es la que se comparte: la que no se guarda como poder sino que se ofrece como servicio.',
    neg_mision:'El patrón que más frena esta misión: el análisis que reemplaza la acción. La mente como refugio de lo que da miedo sentir. El aislamiento intelectual que se siente seguro pero que produce soledad real.',
    neg_alma:'Cuando esta energía no está integrada: el procesamiento eterno sin cierre. La dificultad para actuar mientras quede algo más por analizar.',
    neg_ego:'La imagen de misterio e inteligencia puede generar la percepción de que eres emocionalmente inalcanzable. No siempre es lo que quieres comunicar — pero es lo que muchos reciben.',
    neg_don:'El riesgo de este talento es acumular conocimiento sin compartirlo. La sabiduría que no se transmite muere con quien la tiene.',
    neg_karma:'Sin trabajar: la soledad intelectual que ninguna relación puede llenar porque nadie llega al nivel de profundidad que buscas — o al menos eso es lo que crees.',
    body_mision:'Viniste a aprender a confiar en lo que no puede medirse del todo — y a compartir lo que encuentras en lugar de guardarlo.',
    body_alma:'Tu esencia busca profundidad y sentido. En entornos sin nada que aprender, hay un apagamiento gradual que puede confundirse con desmotivación.',
    body_ego:'Lo que proyectas es misterio e inteligencia. Eso fascina — y puede generar la percepción de que eres emocionalmente inalcanzable.',
    body_don:'El talento con el que llegaste es encontrar la verdad debajo de la superficie en cualquier sistema o persona.',
    body_karma:'Traes patrones de conocimiento guardado como poder o de silencio emocional generacional. El aprendizaje es que la sabiduría que no se comparte muere contigo.',
    kws_person_mision:['Profundidad real','Verdad interior','Sabiduría genuina','Conocimiento profundo','Investigación seria'],
    kws_person_alma:['Mente analítica','Sentido como necesidad','Profundidad natural','Verdad ante todo','Silencio productivo'],
    kws_person_ego:['Misterio proyectado','Inteligencia visible','Observador natural','Imagen analítica','Presencia que piensa'],
    kws_person_don:['Ver debajo','Análisis real','Verdad oculta visible','Precisión natural','Investigar en profundidad'],
    kws_person_karma:['Aislamiento en proceso','Compartir pendiente','Análisis sin acción','Distancia emocional','Silencio por integrar']
  },
  8:{n:'El Ejecutivo',
    kws_mision:['Poder ético','Manifestación','Abundancia','Liderazgo consciente','Resultados reales'],
    kws_alma:['Ambición genuina','Necesidad de impacto','Motor de logros','Abundancia como valor','Resultados como lenguaje'],
    kws_ego:['Poder proyectado','Imagen de logro','Ambición visible','Presencia ejecutiva','El que produce'],
    kws_don:['Materialización a gran escala','Convertir visión en impacto','Ejecutar lo que importa','Liderazgo real','Abundancia creada'],
    kws_karma:['Poder sin ética','Sabotaje en el umbral','Ciclos de éxito y caída','Abundancia bloqueada','Control compulsivo'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una capacidad de manifestación y ejecución que pocos tienen. Haces que las cosas pasen de verdad — no solo en ideas, sino en resultados concretos y visibles.',
    luz_alma:'Tu esencia tiene una ambición genuina y una necesidad de impacto que cuando se orienta bien produce resultados que trascienden al individuo.',
    luz_ego:'Lo que proyectas es poder y capacidad de producir. En contextos que necesitan liderazgo real, tu presencia genera confianza inmediata.',
    luz_don:'Tu talento más natural es la materialización a gran escala: tomar visiones grandes y encontrar el camino para que existan en el mundo real.',
    luz_karma:'Cuando trabajas este karma, el poder que ejerces es el más limpio: el que construye en lugar de controlar, que comparte en lugar de acumular.',
    neg_mision:'El patrón que más frena esta misión: el sabotaje propio justo antes del umbral del éxito. La autodestrucción cuando el resultado ya está cerca. El control compulsivo disfrazado de exigencia.',
    neg_alma:'Cuando esta energía no está integrada: la obsesión con el resultado que impide disfrutar el proceso. El trabajo como identidad que no deja espacio a nada más.',
    neg_ego:'La imagen de poder puede generar dinámicas de control o de intimidación sin que lo notes. La dificultad para recibir feedback sin sentirlo como amenaza.',
    neg_don:'El riesgo de este talento es usarlo sin ética — la capacidad de producir resultados sin importar el costo humano o personal.',
    neg_karma:'Sin trabajar: ciclos de éxito y sabotaje que parecen inexplicables desde afuera. El patrón de casi llegar y desbaratarlo todo justo antes.',
    body_mision:'Viniste a aprender a manejar el poder de forma ética y consciente — y a saber que el éxito no requiere que te destruyas para llegar.',
    body_alma:'Tu esencia quiere construir algo que importe. En roles sin autonomía real, la frustración es profunda y visible.',
    body_ego:'Lo que proyectas es poder y ambición. Eso genera respeto y puede crear dinámicas de control sin que lo notes.',
    body_don:'El talento con el que llegaste es la materialización a gran escala: tomar visiones grandes y hacerlas existir.',
    body_karma:'Traes patrones de poder mal distribuido o de éxito saboteado. El aprendizaje es el liderazgo que construye en lugar de controlar.',
    kws_person_mision:['Poder ético','Manifestación real','Liderazgo consciente','Abundancia creada','Resultados con sentido'],
    kws_person_alma:['Ambición genuina','Impacto como necesidad','Motor de logros','Abundancia como valor','Ejecutar de verdad'],
    kws_person_ego:['Poder proyectado','Imagen ejecutiva','El que produce','Presencia de logro','Ambición visible'],
    kws_person_don:['Materializar en grande','Convertir visión en impacto','Liderazgo real','Ejecutar lo importante','Abundancia generada'],
    kws_person_karma:['Sabotaje en proceso','Poder por integrar','Ciclos por resolver','Control en transformación','Éxito sin destrucción']
  },
  9:{n:'El Humanista',
    kws_mision:['Soltar','Compasión universal','Legado','Cierre de ciclos','Servicio sin ego'],
    kws_alma:['Profundidad de sentimiento','Generosidad natural','Sabiduría acumulada','Amor que abarca todo','Sentir profundo'],
    kws_ego:['Compasión visible','Profundidad proyectada','Imagen de sabiduría','El que comprende todo','Presencia que contiene'],
    kws_don:['Visión de conjunto','Acompañar desde la experiencia','Generosidad sin ego','Sabiduría que trasciende','Dejar huella real'],
    kws_karma:['Aferramiento','Resistencia al cierre','Dar sin recibir','Duelo no procesado','Sacrificio heredado'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una sabiduría y una generosidad genuinas que pocas personas tienen. Puedes acompañar a otros desde la experiencia real sin necesitar ser el centro.',
    luz_alma:'Tu esencia tiene una profundidad de sentimiento y una capacidad de amor que cuando se orienta bien crea legados que duran más que el individuo.',
    luz_ego:'Lo que proyectas es profundidad y compasión. La gente se siente comprendida en tu presencia — y eso es uno de los regalos más raros que existen.',
    luz_don:'Tu talento más natural es la visión de conjunto: ver cómo las partes encajan en un todo y hacia dónde debe moverse el sistema.',
    luz_karma:'Cuando trabajas este karma, la generosidad que ofreces es la más libre: la que no necesita reconocimiento, que no espera nada a cambio, que da porque ese es su lenguaje natural.',
    neg_mision:'El patrón que más frena esta misión: la resistencia al cierre. Aferrarse a lo que ya terminó porque el vacío que viene después asusta más que el dolor que hay ahora.',
    neg_alma:'Cuando esta energía no está integrada: el peso de cargar con el dolor de todos sin saber filtrar. La dificultad para soltar lo que ya cumplió su ciclo.',
    neg_ego:'La imagen de profundidad y comprensión puede generar la expectativa de que siempre tienes espacio para todos — y que tú nunca necesitas nada.',
    neg_don:'El riesgo de este talento es sacrificarse por el legado, olvidando que tú también mereces vivir lo que estás construyendo.',
    neg_karma:'Sin trabajar: el peso del duelo eterno. La incapacidad de soltar lo que ya fue, sosteniendo relaciones, roles o versiones de uno mismo que ya terminaron.',
    body_mision:'Viniste a aprender a soltar. A cerrar ciclos con limpieza. A saber que el final de algo no es traición — es honrar lo que fue.',
    body_alma:'Tu esencia tiene una profundidad de sentimiento que puede ser abrumadora. El patrón más recurrente es aferrarte a lo que ya cumplió su ciclo.',
    body_ego:'Lo que proyectas es profundidad y compasión. Pocas veces alguien te pregunta cómo estás tú — asumen que siempre estás bien.',
    body_don:'El talento con el que llegaste es la visión de conjunto: ver cómo las partes encajan en un todo.',
    body_karma:'Traes patrones de dar sin recibir y de construir para otros sin reconocimiento. El aprendizaje es que tu contribución merece ser reconocida.',
    kws_person_mision:['Soltar con gracia','Compasión real','Legado genuino','Cierre consciente','Servicio sin ego'],
    kws_person_alma:['Sentir profundo','Generosidad natural','Sabiduría vivida','Amor universal','Profundidad emocional'],
    kws_person_ego:['Compasión visible','Profundidad proyectada','El que comprende','Imagen de sabiduría','Presencia contenedora'],
    kws_person_don:['Visión de conjunto','Acompañar desde la experiencia','Generosidad sin ego','Sabiduría que trasciende','Dejar huella real'],
    kws_person_karma:['Aferramiento por sanar','Cierre pendiente','Dar sin recibir','Duelo en proceso','Sacrificio heredado']
  },
  11:{n:'El Visionario',
    kws_mision:['Intuición como recurso','Visión más allá','Inspirar sin esfuerzo','Sensibilidad como inteligencia','Visionario consciente'],
    kws_alma:['Hipersensibilidad','Percepción profunda','Intensidad emocional','Ver lo invisible','Absorción energética'],
    kws_ego:['Profundidad proyectada','Intensidad visible','Misterio natural','Imagen que inspira','Presencia que eleva'],
    kws_don:['Inspirar','Encender en otros lo que no sabían que tenían','Intuición real','Visión que trasciende','Elevar entornos'],
    kws_karma:['Sensibilidad como herida','Visión ignorada','Ansiedad crónica','Absorción sin filtro','Luz apagada por miedo'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una visión y una capacidad de inspirar que van más allá del análisis. Tu presencia eleva lo que hay alrededor sin que sepas exactamente cómo.',
    luz_alma:'Tu esencia percibe lo que otros no ven — patrones, tensiones, posibilidades. Cuando confías en esa percepción, tienes acceso a información que ningún análisis puede producir.',
    luz_ego:'Lo que proyectas es profundidad e intensidad que no todo el mundo puede sostener. Los que se quedan son los que realmente pueden estar.',
    luz_don:'Tu talento más natural es la inspiración: encender algo en otros que no sabían que tenían.',
    luz_karma:'Cuando trabajas este karma, la sensibilidad que tienes se convierte en tu recurso más poderoso: una intuición confiable que orienta sin crear confusión.',
    neg_mision:'El patrón que más frena esta misión: la hipersensibilidad que paraliza. Absorber tanto del entorno que se pierde el hilo de lo que tú realmente sientes y necesitas.',
    neg_alma:'Cuando esta energía no está integrada: la ansiedad como estado de fondo. La dificultad para separar lo que sientes de lo que siente el entorno.',
    neg_ego:'La imagen de profundidad puede generar la expectativa de que siempre tienes algo profundo que decir o sentir. A veces solo quieres ser normal.',
    neg_don:'El riesgo de este talento es agotarse en inspirar a otros mientras se descuida la propia recarga.',
    neg_karma:'Sin trabajar: la ansiedad crónica y la sensibilidad que duele más de lo que ayuda.',
    body_mision:'Viniste a aprender a confiar en tu intuición sin dejar que la ansiedad la tape. A usar la sensibilidad como recurso, no como carga.',
    body_alma:'Tu esencia percibe lo que otros no ven. La pregunta más importante: ¿lo que sientes en este momento es tuyo o es del entorno?',
    body_ego:'Lo que proyectas es profundidad e intensidad. No todo el mundo puede sostener eso — y los que se quedan son los que realmente pueden estar.',
    body_don:'El talento con el que llegaste es la inspiración: encender algo en otros que no sabían que tenían.',
    body_karma:'Traes patrones de sensibilidad usada en tu contra o visión ignorada. El aprendizaje es que sentir intensamente no es un defecto.',
    kws_person_mision:['Intuición real','Visión que trasciende','Inspirar sin esfuerzo','Sensibilidad como recurso','Visionario en proceso'],
    kws_person_alma:['Percepción profunda','Hipersensibilidad genuina','Absorción energética','Ver lo invisible','Intensidad emocional'],
    kws_person_ego:['Profundidad proyectada','Intensidad visible','Presencia que eleva','Imagen inspiradora','Misterio natural'],
    kws_person_don:['Inspirar de verdad','Encender potencial','Intuición confiable','Visión amplia','Elevar entornos'],
    kws_person_karma:['Ansiedad por integrar','Absorción sin filtro','Sensibilidad en proceso','Visión por confiar','Luz en transformación']
  },
  22:{n:'El Arquitecto',
    kws_mision:['Construir lo extraordinario','Impacto a gran escala','Visión materializada','Legado estructurado','Arquitectura de sistemas'],
    kws_alma:['Ambición de grandeza','Visión vasta','Necesidad de impacto mayor','Perfeccionismo como motor','Construir para trascender'],
    kws_ego:['Visión proyectada','Grandeza visible','Imagen de largo plazo','Presencia de arquitecto','El que construye en grande'],
    kws_don:['Arquitectura de sistemas','Construir lo que trasciende','Visión + ejecución','Impacto real a gran escala','Materializar lo extraordinario'],
    kws_karma:['Perfeccionismo paralizante','Visión sin inicio','Grandiosidad sin sustancia','Construir para otros sin ser visto','Postergar por miedo'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a una capacidad de construcción a gran escala que pocas personas tienen. Puedes materializar lo que otros solo imaginan — y hacerlo con una estructura que dura.',
    luz_alma:'Tu esencia tiene una ambición de grandeza genuina y una visión que abarca más que el presente inmediato. Cuando la activas bien, produces cosas que trascienden al individuo.',
    luz_ego:'Lo que proyectas es visión de largo plazo y capacidad de construcción. En contextos que necesitan alguien que piense en grande, tu presencia es inmediatamente reconocible.',
    luz_don:'Tu talento más natural es la arquitectura de sistemas: diseñar estructuras que funcionan a largo plazo y a gran escala.',
    luz_karma:'Cuando trabajas este karma, lo que construyes tiene integridad: sirve a algo más grande que tu propio ego y deja espacio para que otros también crezcan en lo que creaste.',
    neg_mision:'El patrón que más frena esta misión: el perfeccionismo paralizante. La visión tan grande que nunca empieza. El peso de la responsabilidad que aplasta antes de que el proyecto crezca.',
    neg_alma:'Cuando esta energía no está integrada: la grandiosidad sin acción. Los proyectos eternamente en construcción que nunca se terminan.',
    neg_ego:'La imagen de grandeza puede generar la sensación en otros de que son piezas de tu proyecto en lugar de personas con sus propios mundos.',
    neg_don:'El riesgo de este talento es que el legado se convierta en una obsesión que consume la vida que se supone que está construyendo.',
    neg_karma:'Sin trabajar: proyectos eternamente en construcción. La visión perfecta que nunca llega a ser real.',
    body_mision:'Viniste a aprender a materializar lo que imaginas sin que el perfeccionismo lo impida — y sin sacrificar la vida que estás construyendo.',
    body_alma:'Tu esencia quiere construir algo extraordinario. El obstáculo más frecuente: esperar el momento perfecto para empezar.',
    body_ego:'Lo que proyectas es ambición y capacidad de construir en grande. Cuida que los demás no se sientan piezas de tu proyecto.',
    body_don:'El talento con el que llegaste es la arquitectura de sistemas que funcionan a largo plazo.',
    body_karma:'Traes patrones de visión sin ética o grandiosidad sin sustancia. El aprendizaje es construir con integridad.',
    kws_person_mision:['Construir lo extraordinario','Impacto a gran escala','Materializar la visión','Legado con integridad','Arquitectura de sistemas'],
    kws_person_alma:['Visión vasta','Ambición genuina','Perfeccionismo como motor','Construir para trascender','Grandeza en proceso'],
    kws_person_ego:['Arquitecto visible','Visión proyectada','Presencia de largo plazo','Imagen de grandeza','El que construye en grande'],
    kws_person_don:['Arquitectura real','Materializar lo extraordinario','Visión + acción','Impacto a gran escala','Construir lo que dura'],
    kws_person_karma:['Perfeccionismo por soltar','Postergar por integrar','Grandiosidad en transformación','Empezar sin esperar','Construir sin destruirse']
  },
  33:{n:'El Maestro',
    kws_mision:['Amor maestro','Enseñanza transformadora','Servicio consciente','Acompañar sin controlar','Sanar el linaje'],
    kws_alma:['Amor profundo','Dar sin límite','Presencia sanadora','Cuidado total','Amor que transforma'],
    kws_ego:['Calidez desbordante','Imagen de maestro','Presencia que sana','Disponible para todos','El que enseña con su ser'],
    kws_don:['Enseñar transformando','Acompañar que da libertad','Amor que no controla','Cambiar cómo alguien se ve','Presencia que sana'],
    kws_karma:['Sacrificio como identidad','Dar sin recibir','Mártir heredado','Cuidado que controla','Agotamiento crónico'],
    luz_mision:'Cuando operas desde esta misión con consciencia, tienes acceso a un amor y una capacidad de acompañamiento que pocas personas tienen. Lo que tocas con intención deja una huella real en la vida de otros.',
    luz_alma:'Tu esencia tiene una profundidad de amor que transforma entornos sin que nadie sepa exactamente cómo. Tu presencia tiene un efecto real.',
    luz_ego:'Lo que proyectas es una calidez que hace que la gente se sienta vista y acompañada. Eso tiene un valor enorme que a veces das por sentado.',
    luz_don:'Tu talento más natural es la enseñanza que cambia cómo alguien se ve a sí mismo — no la que transmite información, sino la que transforma.',
    luz_karma:'Cuando trabajas este karma, el amor que ofreces es el más libre: el que transforma sin controlar, que acompaña sin crear dependencia.',
    neg_mision:'El patrón que más frena esta misión: el agotamiento del que cuida a todos menos a sí mismo. El sacrificio como identidad que se vuelve resentimiento silencioso.',
    neg_alma:'Cuando esta energía no está integrada: perderse tan completamente en el dar que no queda nada para uno mismo.',
    neg_ego:'La imagen de maestro y cuidador puede generar la dinámica de que tú siempre das y los demás siempre reciben.',
    neg_don:'El riesgo de este talento es rescatar en lugar de acompañar — crear dependencia en lugar de autonomía.',
    neg_karma:'Sin trabajar: el agotamiento del que nunca tiene suficiente para dar y sigue dando de todas formas.',
    body_mision:'Viniste a aprender que servir genuinamente requiere primero ser completamente honesto contigo mismo.',
    body_alma:'Tu esencia da con una profundidad que pocos experimentan. La trampa: te pierdes tanto en el dar que terminas con nada para ti.',
    body_ego:'Lo que proyectas es una calidez que atrae a quienes más la necesitan. Cuida que "más la necesitan" no sea tu único criterio para elegir.',
    body_don:'El talento con el que llegaste es la enseñanza que cambia cómo alguien se ve a sí mismo.',
    body_karma:'Traes patrones de sacrificio como forma de amor. El aprendizaje es amar con libertad real.',
    kws_person_mision:['Amor maestro','Enseñar transformando','Servicio con límites','Acompañar sin controlar','Sanar el linaje'],
    kws_person_alma:['Amor profundo','Dar sin límite','Presencia sanadora','Cuidado total','Amor que transforma'],
    kws_person_ego:['Calidez desbordante','Imagen de maestro','El que enseña siendo','Presencia que sana','Disponible para todos'],
    kws_person_don:['Enseñar de verdad','Transformar cómo alguien se ve','Amor que libera','Acompañar con presencia','Sanar siendo'],
    kws_person_karma:['Sacrificio por integrar','Dar sin recibir','Martirio en transformación','Límites por aprender','Amor sin agotamiento']
  }
};

/* fallback for any number not in ND */
function getNDSafe(n){
  if(ND[n]) return ND[n];
  return {n:`Número ${n}`,sym:'✦',
    kws_mision:[`${n} · Misión`],kws_alma:[`${n} · Alma`],kws_ego:[`${n} · Ego`],kws_don:[`${n} · Don`],kws_karma:[`${n} · Karma`],
    luz_mision:`El ${n} en la Misión tiene fortalezas específicas que se revelan en profundidad en una sesión completa.`,
    luz_alma:`El ${n} en el Alma tiene recursos genuinos.`,luz_ego:`El ${n} en el Ego proyecta algo particular.`,luz_don:`El ${n} en el Don es un talento real.`,luz_karma:`El ${n} en el Karma tiene patrones trabajables.`,
    neg_mision:`La sombra del ${n} en la Misión es reconocible y trabajable.`,neg_alma:`La sombra del ${n} en el Alma.`,neg_ego:`La sombra del ${n} en el Ego.`,neg_don:`La sombra del ${n} en el Don.`,neg_karma:`La sombra del ${n} en el Karma.`,
    body_mision:`Tu misión de vida ${n} tiene un propósito específico.`,body_alma:`Tu alma ${n} opera de una forma particular.`,body_ego:`Tu ego ${n} proyecta algo al mundo.`,body_don:`Tu don ${n} es un recurso real.`,body_karma:`Tu karma ${n} tiene patrones por resolver.`,
    kws_person_mision:[`${n} · Misión`],kws_person_alma:[`${n} · Alma`],kws_person_ego:[`${n} · Ego`],kws_person_don:[`${n} · Don`],kws_person_karma:[`${n} · Karma`]
  };
}

/* ═══ INTEGRATED READING ENGINE ═══ */
function buildIntegrated(q, arc, exprNum, nombre){
  const d = getNDSafe(q.mision);
  const da = getNDSafe(q.alma);
  const de = getNDSafe(q.ego);
  const dd = getNDSafe(q.don);
  const dk = getNDSafe(q.karma);
  const arcNm = AN[arc]||`Arcano ${arc}`;
  const pn = nombre ? nombre.trim().split(' ')[0] : '';

  const tensionMap = {
    '11-9':`Tu <em>Misión de Visionario (11)</em> y tu <em>Alma de Humanista (9)</em> crean una de las combinaciones más complejas del sistema. Ves lo que otros no ven — patrones, conexiones, lo que está debajo de lo que parece — pero tu alma carga con el peso de lo que ya fue y la dificultad de soltarlo. Hay una parte tuya que mira adelante con una claridad casi incómoda, y otra que no puede terminar de cerrar lo anterior. La tensión no es un defecto — es el material de trabajo central de tu vida.`,
    '9-11':`Tu <em>Misión de Humanista (9)</em> y tu <em>Alma de Visionario (11)</em> son complementarios que a veces se contradicen. Tu misión pide que cierres, integres y sueltes. Tu alma percibe todo con una intensidad que hace ese cierre más difícil — porque sientes el peso de lo que fue con una profundidad que la mayoría no entiende. El resultado más frecuente: llevas más de lo que te corresponde durante más tiempo del necesario.`,
    '11-6':`Tu <em>Misión de Visionario (11)</em> combinada con tu <em>Alma de Sanador (6)</em> crea algo muy específico: tienes visión interior profunda que el mundo percibe como cuidado y calidez. Ves más de lo que muestras — pero lo que proyectas es alguien que acompaña, que sostiene, que cuida. La brecha entre lo que percibes internamente y lo que el mundo te pide que seas puede ser agotadora cuando no se trabaja con consciencia.`,
    '6-11':`Tu <em>Misión de Sanador (6)</em> y tu <em>Alma de Visionario (11)</em> crean una combinación donde el cuidado se vuelve profético. Cuidas desde una intuición que va más allá del análisis — percibes lo que el otro necesita antes de que lo pida. La sombra doble: das desde la empatía sin filtro y desde la obligación de sanar. Sin consciencia, ese patrón produce agotamiento real.`,
    '1-9':`Tu <em>Misión de Pionero (1)</em> y tu <em>Alma de Humanista (9)</em> crean una tensión directa y reconocible. Una parte tuya siempre está empezando algo nuevo. Otra siempre está tratando de cerrar lo anterior. El resultado más frecuente: proyectos que no terminan porque el impulso de iniciar llega antes que la voluntad de cerrar limpiamente.`,
    '9-1':`Tu <em>Misión de Humanista (9)</em> y tu <em>Alma de Pionero (1)</em> crean la batalla interna más frecuente del 9-1: no puedes soltar porque una parte de ti ya está pensando en lo que viene. Y no puedes empezar limpio porque otra parte no ha cerrado lo anterior. El resultado es el peso de dos ciclos activos al mismo tiempo.`,
    '3-7':`Tu <em>Misión de Creativo (3)</em> y tu <em>Alma de Sabio (7)</em> crean un perfeccionismo creativo específico: nunca terminas de analizar lo suficiente para sentirte listo para expresar. Tienes un talento enorme que el mundo ve a cuentagotas porque la profundidad del 7 siempre encuentra algo más por revisar.`,
    '7-3':`Tu <em>Misión de Sabio (7)</em> y tu <em>Alma de Creativo (3)</em> crean la dualidad entre profundidad y expresión. Tu alma quiere brillar y ser vista. Tu misión prefiere observar desde atrás. Cuando logras integrar los dos, produces algo que muy pocos pueden: profundidad que se comunica con gracia.`,
    '4-5':`Tu <em>Misión de Constructor (4)</em> y tu <em>Alma de Aventurero (5)</em> están en conflicto estructural. Construyes algo sólido y luego una parte tuya quiere tirarlo y empezar diferente. Ese ciclo es reconocible — y es la raíz de varios proyectos a medias.`,
    '5-4':`Tu <em>Misión de Aventurero (5)</em> y tu <em>Alma de Constructor (4)</em> crean la tensión entre la libertad que necesitas y la solidez que tu alma busca. Te mueves hacia lo nuevo pero necesitas que lo anterior quede bien terminado. Eso puede crear la sensación de estar siempre a medias entre dos mundos.`,
    '8-2':`Tu <em>Misión de Ejecutivo (8)</em> y tu <em>Alma de Diplomático (2)</em> crean una combinación donde el liderazgo tiene profundidad relacional. Por fuera construyes y diriges. Por adentro, tu alma sabe que las relaciones importan más que cualquier resultado. Cuando integras los dos — liderazgo con conexión genuina — produces algo que pocos líderes logran.`,
    '2-8':`Tu <em>Misión de Diplomático (2)</em> y tu <em>Alma de Ejecutivo (8)</em> crean una persona que en la superficie parece suave y colaborativa pero que internamente mide resultados e impacto constantemente. Esa tensión puede generar confusión — tuya y de los que te rodean. La integración produce liderazgo excepcional.`,
    '6-9':`Tu <em>Misión de Sanador (6)</em> y tu <em>Alma de Humanista (9)</em> crean una de las combinaciones de mayor profundidad empática del sistema. Das con una generosidad que pocos comprenden — y también cargas con más de lo que te corresponde. El patrón central: dar tanto que después no queda espacio para soltar lo que ya cumplió su función.`,
    '9-6':`Tu <em>Misión de Humanista (9)</em> y tu <em>Alma de Sanador (6)</em> crean un patrón de cuidado profundo que se dificulta a la hora de soltar. Tu misión pide cierre y tu alma quiere seguir dando. La tensión más frecuente: sostener relaciones o situaciones que ya terminaron porque todavía hay algo que quieres sanar en ellas.`
  };

  const key=`${q.mision}-${q.alma}`;
  const rkey=`${q.alma}-${q.mision}`;
  let p1 = tensionMap[key]||tensionMap[rkey]||
    `${pn?`<strong>${pn}</strong>, tu`:'Tu'} <em>Misión de ${d.n} (${q.mision})</em> define el aprendizaje central de tu vida — no lo que ya eres, sino lo que estás en proceso de convertirte. Tu <em>Alma de ${da.n} (${q.alma})</em> es lo que tu esencia más profunda ya es. Son números ${q.mision===q.alma?'iguales, lo que crea una coherencia interna poco común — lo que proyectas corresponde a lo que realmente eres. La trampa es dar ese recurso tan por sentado que nunca se desarrolla en su nivel más alto':'distintos, lo que crea una tensión interna específica: una parte de ti ya sabe lo que necesita hacer; otra parte todavía está aprendiendo a confiar en eso. El conflicto más recurrente que experimentas en distintas situaciones y con distintas personas tiene raíz en esa brecha'}.`;

  let p2;
  if(q.ego===q.don){
    p2=`Tu <em>Ego de ${de.n} (${q.ego})</em> y tu <em>Don Divino de ${dd.n} (${q.don})</em> son el mismo número — algo poco común. Lo que proyectas al mundo y el talento con el que llegaste equipado hablan el mismo idioma. No hay brecha entre imagen y esencia en ese aspecto. La trampa de esa alineación es tomar ese talento tan por sentado que nunca termina de desarrollarse en su nivel más alto.`;
  } else {
    p2=`Tu <em>Ego de ${de.n} (${q.ego})</em> es cómo te presentas al mundo antes de que te conozcan de verdad. Tu <em>Don Divino de ${dd.n} (${q.don})</em> es el talento con el que llegaste equipado. Son números distintos, lo que significa que lo que la gente percibe de ti no siempre corresponde con lo que realmente tienes para dar. Eso puede crear la experiencia de sentirte subestimado — o de que el mundo espera algo diferente de lo que tú tienes. Cuando alguien finalmente te ve como eres, la reacción suele ser: "no me imaginaba que tenías todo eso".`;
  }

  const p3=`Tu <em>Karma de ${dk.n} (${q.karma})</em> habla de los patrones que traes a resolver en esta vida. Son los más difíciles de ver porque se sienten como "tu forma de ser" — no como algo que llegó de afuera. ${dk[`body_karma`]||`El patrón del ${q.karma} es reconocible cuando se mira con claridad.`} Cuando este karma no está trabajado, aparece como el obstáculo más persistente e inexplicable. Cuando se trabaja conscientemente, se convierte en uno de tus recursos más profundos.`;

  let p4='';
  if(exprNum){
    const xd=getNDSafe(exprNum);
    if(exprNum===q.mision){
      p4=`Tu <em>Número de Expresión de ${xd.n} (${exprNum})</em> coincide con tu Misión de Vida. Cómo te manifiestas al mundo y hacia dónde vas son lo mismo. Esa coherencia es tu firma más visible — aunque a veces no la veas porque la das por sentada.`;
    } else if(exprNum===q.alma){
      p4=`Tu <em>Número de Expresión de ${xd.n} (${exprNum})</em> coincide con tu Alma. Lo que proyectas y lo que realmente eres hablan el mismo idioma. Las personas que te conocen de verdad tienen una experiencia contigo completamente diferente a la de quienes solo te han visto de lejos.`;
    } else {
      p4=`Tu <em>Número de Expresión de ${xd.n} (${exprNum})</em> agrega una capa específica. Es la forma en que te manifiestas hacia afuera — distinta a tu misión (${q.mision}) y a tu alma (${q.alma}). El mundo te percibe como <em>${xd.n}</em> antes de entender todo lo que hay adentro. Eso explica por qué la primera impresión que generas es diferente de la persona que realmente eres — y por qué quien te conoce de verdad te ve de una forma completamente distinta.`;
    }
  }

  const arcData = ARCANOS[arc]||ARCANOS[0];
  const crossText = arcData.cross(q.mision, d.n);
  const p5=`Este año, la energía del <strong>${arcNm} (${arc})</strong> activa directamente lo que más necesita trabajo en tu mapa. ${crossText}`;

  let out=`<p>${p1}</p><div class="int-divider"><span>✦</span></div><p>${p2}</p><p>${p3}</p>`;
  if(p4) out+=`<div class="int-divider"><span>☿</span></div><p>${p4}</p>`;
  out+=`<div class="int-divider"><span>☽</span></div><p>${p5}</p>`;
  return out;
}

/* ═══ RENDER QUADRANT — 2x2 LEFT + mission RIGHT ═══ */
function renderQuad(q){
  const M=n=>MASTER(n)?' master':'';
  document.getElementById('quad-wrap').innerHTML=`
    <div class="quad-wrap">
      <div class="quad-2x2">
        <div class="qcell" id="qa" onclick="clickCell('alma',${q.alma})">
          <span class="qv${M(q.alma)}">${q.alma}</span>
          <span class="qn">Número<br/>del Alma</span>
<span style="font-size:9px;color:var(--sage);opacity:.7;display:block;margin-top:4px;letter-spacing:.9px">toca el número</span>
        </div>
        <div class="qcell" id="qd" onclick="clickCell('don',${q.don})">
          <span class="qv${M(q.don)}">${q.don}</span>
          <span class="qn">Don<br/>Divino</span>
<span style="font-size:9px;color:var(--sage);opacity:.7;display:block;margin-top:4px;letter-spacing:.9px">toca el número</span>
        </div>
        <div class="qcell" id="qe" onclick="clickCell('ego',${q.ego})">
          <span class="qv${M(q.ego)}">${q.ego}</span>
          <span class="qn">Ego</span>
<span style="font-size:9px;color:var(--sage);opacity:.7;display:block;margin-top:4px;letter-spacing:.9px">toca el número</span>
        </div>
        <div class="qcell" id="qk" onclick="clickCell('karma',${q.karma})">
          <span class="qv${M(q.karma)}">${q.karma}</span>
          <span class="qn">Karma /<br/>Vida Pasada</span>
<span style="font-size:9px;color:var(--sage);opacity:.7;display:block;margin-top:4px;letter-spacing:.9px">toca el número</span>
        </div>
      </div>
      <div class="quad-mis" id="qm" onclick="clickCell('mision',${q.mision})">
        <span class="qv${M(q.mision)}">${q.mision}</span>
        <span class="qn">Misión<br/>de Vida<em>Toca para explorar</em></span>
<span style="font-size:9px;color:var(--sage);opacity:.7;display:block;margin-top:4px;letter-spacing:.9px">toca el número</span>
      </div>
    </div>`;
}

/* ═══ CELL CLICK ═══ */
const ROLES = {mision:'Misión de Vida',alma:'Número del Alma',ego:'Ego',don:'Don Divino',karma:'Karma / Vida Pasada'};
let _activeCell = null;
let _lastQuad = null;

function clickCell(key, val){
  _activeCell = key;
  ['qm','qa','qd','qe','qk'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.remove('active')});
  const idMap={mision:'qm',alma:'qa',don:'qd',ego:'qe',karma:'qk'};
  const el=document.getElementById(idMap[key]);if(el)el.classList.add('active');

  const data = getNDSafe(val);
  const sym = ARCH_SYM[val]||'✦';

  document.getElementById('cell-sym').textContent=sym;
  document.getElementById('cell-role').textContent=ROLES[key]||key;
  const numEl=document.getElementById('cell-num');
  numEl.textContent=val; numEl.className='cell-num'+(MASTER(val)?' master':'');
  document.getElementById('cell-arch').textContent=data.n||'';

  document.getElementById('cell-keywords').innerHTML = '';

  /* body — role-specific description */
  const bodyKey = 'body_'+key;
  const bodyText = data[bodyKey]||`Tu número ${val} en ${key}.`;
  document.getElementById('cell-body').innerHTML=`<p>${bodyText}</p>`;

  /* luz */
  const luzKey = 'luz_'+key;
  document.getElementById('cell-luz-txt').textContent = data[luzKey]||'';

  /* neg */
  const negKey = 'neg_'+key;
  document.getElementById('cell-neg-txt').textContent = data[negKey]||'';

  /* person keywords */
  const pkwKey = 'kws_person_'+key;
  const pkws = data[pkwKey]||[];
  const pkwEl = document.getElementById('cell-kw-person');
  if(pkws.length){
    pkwEl.innerHTML=`<span class="ckwp-lbl">Palabras clave para ti</span><div class="ckwp-tags">${pkws.map(k=>`<span class="ckwp-tag">${k}</span>`).join('')}</div>`;
    pkwEl.style.display='block';
  } else {
    pkwEl.innerHTML=''; pkwEl.style.display='none';
  }

  document.getElementById('cell-detail').classList.add('vis');
  setTimeout(()=>document.getElementById('cell-detail').scrollIntoView({behavior:'smooth',block:'nearest'}),50);
}

function closeCell(){
  _activeCell=null;
  ['qm','qa','qd','qe','qk'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.remove('active')});
  document.getElementById('cell-detail').classList.remove('vis');
}

/* ═══ MAIN CALC ═══ */
function calcAll(){
  const fv = document.getElementById('fecha').value;
  const nv = document.getElementById('nombre').value.trim();
  if(!fv){alert('Por favor ingresa tu fecha de nacimiento.');return;}
  saveDate(fv); if(nv) saveName(nv);

  document.getElementById('tool-form').style.display='none';
  document.getElementById('ldr').classList.add('on');

  setTimeout(()=>{
    const {y,mo,d} = pd(fv);
    const q = calcQuad(d,mo,y);
    const {arc, yearUsed} = calcArcano(d, mo, fv);
    const exprNum = nv ? calcExprNum(nv) : null;

    _lastQuad = q;

    /* arcano block */
    const arcData = ARCANOS[arc]||ARCANOS[0];
    const arcNm = AN[arc]||`Arcano ${arc}`;
    const misDat = getNDSafe(q.mision);
    document.getElementById('arc-eye').textContent=`Tu arcano del año ${yearUsed}`;
    document.getElementById('arc-title').textContent=arcNm;
    document.getElementById('arc-num').textContent=`Arcano ${arc}`;
    document.getElementById('arc-body').innerHTML=arcData.body;

    /* quad */
    renderQuad(q);

    /* integrated reading */
    const mis = misDat.n;
    document.getElementById('int-name').textContent=`${nv?nv+' · ':''}Misión de vida ${q.mision} — ${mis}`;
    document.getElementById('int-body').innerHTML=buildIntegrated(q,arc,exprNum,nv);

    /* wa link */
    const msg=`Hola Julio, calculé mi mapa en BRÚJULA. Misión: *${mis}* (${q.mision}), Arcano del año: *${arcNm}* (${arc}). Quiero una lectura completa.`;
    document.getElementById('res-wa').href=`https://wa.me/523314189814?text=${encodeURIComponent(msg)}`;
    window._resText=`${nv?nv+' · ':''}Misión ${mis} (${q.mision}) · Arcano ${arcNm} (${arc})`;

    document.getElementById('ldr').classList.remove('on');
    document.getElementById('result').classList.add('vis');
    setTimeout(()=>document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'}),50);
  },1700);
}

function resetTool(){
  document.getElementById('result').classList.remove('vis');
  document.getElementById('cell-detail').classList.remove('vis');
  document.getElementById('tool-form').style.display='block';
  document.getElementById('quad-wrap').innerHTML='';
  document.getElementById('fecha').value='';
  document.getElementById('nombre').value='';
  saveDate(''); saveName('');
  document.getElementById('saved-badge').classList.remove('vis');
  _lastQuad=null; _activeCell=null;
  setTimeout(()=>document.getElementById('tool-form').scrollIntoView({behavior:'smooth',block:'start'}),50);
}

/* ═══ SHARE ═══ */
function doShare(){
  const txt=window._resText||'Mi mapa en BRÚJULA';
  const s=`${txt}\n\nDescubre el tuyo: brujula.mx · @julio_sandv`;
  if(navigator.share){navigator.share({text:s}).catch(()=>{});}
  else if(navigator.clipboard){
    navigator.clipboard.writeText(s).then(()=>{
      const ok=document.getElementById('share-ok');ok.style.display='inline';
      setTimeout(()=>{ok.style.display='none';},2500);
    }).catch(()=>{});
  }
}

/* ═══ OPTIN + LIST ═══ */
function doOptin(){
  const email=document.getElementById('optin-email').value;
  if(!email||!email.includes('@')) return;
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({'form-name':'brujula-optin',email,resultado:window._resText||''})
  }).catch(()=>{});
  document.getElementById('optin-ok').style.display='block';
  document.getElementById('optin-email').value='';
}
function saveEmail(e){
  e.preventDefault();
  const email=document.getElementById('cap-email').value;
  if(!email||!email.includes('@')) return;
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({'form-name':'brujula-lista',email})
  }).catch(()=>{});
  document.getElementById('cap-ok').style.display='block';
  document.getElementById('cap-email').value='';
}

/* ═══ SERVICE FORMS ═══ */
function sendE(){
  const f=document.getElementById('e-fecha').value,a=document.getElementById('e-area').value,p=document.getElementById('e-preg').value.trim();
  const err=document.getElementById('e-err');
  if(!f||!a||!p){err.classList.add('vis');return;} err.classList.remove('vis');
  const msg=`Hola Julio, me interesa la *Consulta Express ($200 MXN)*.\n\n📅 Fecha: ${fmtD(f)}\n🎯 Área: ${a}\n❓ Mi pregunta: ${p}`;
  window.open(`https://wa.me/523314189814?text=${encodeURIComponent(msg)}`,'_blank');
}
function sendS(){
  window.open(`https://wa.me/523314189814?text=${encodeURIComponent('Hola Julio, me interesa la *Sesión Completa ($500 MXN)*. ¿Cuándo tienes disponibilidad?')}`,'_blank');
}
function sendY(){
  const f=document.getElementById('y-fecha').value,err=document.getElementById('y-err');
  if(!f){err.classList.add('vis');return;} err.classList.remove('vis');
  window.open(`https://wa.me/523314189814?text=${encodeURIComponent(`Hola Julio, me interesa la *Lectura de Año Personal ($280 MXN)*.\n\n📅 Fecha: ${fmtD(f)}`)}`,'_blank');
}
function toggleSvc(id,btn){
  const det=document.getElementById('det-'+id),open=det.classList.toggle('vis');
  btn.classList.toggle('open',open); btn.querySelector('.arr').textContent=open?'⌄':'›';
}

/* init */
window.addEventListener('DOMContentLoaded',()=>{
  const sf=loadDate(),sn=loadName();
  if(sf){document.getElementById('fecha').value=sf;document.getElementById('saved-badge').classList.add('vis');}
  if(sn) document.getElementById('nombre').value=sn;
});
