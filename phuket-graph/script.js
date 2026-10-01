const N={air:['สนามบิน',330,40],nai:['หาดไนยาง',250,85],sur:['หาดสุรินทร์',170,190],kam:['หาดกมลา',160,250],pat:['หาดป่าตอง',170,320],kar:['หาดกะรน',190,410],kat:['หาดกะตะ',210,455],pro:['แหลมพรหมเทพ',300,500],raw:['หาดราไวย์',390,480],cha:['วัดฉลอง',410,410],big:['พระใหญ่',330,385],old:['ย่านเมืองเก่า',400,300]};
const E=[['air','nai',8],['air','sur',12],['air','old',28],['nai','sur',18],['sur','kam',4],['kam','pat',9],['pat','kar',8],['pat','old',14],['kar','kat',4],['kar','big',9],['kat','pro',8],['kat','cha',10],['pro','raw',5],['raw','cha',8],['cha','old',9],['cha','big',6],['big','old',12]];
const ids=Object.keys(N),$=s=>document.querySelector(s),nm=k=>N[k][0],key=(a,b)=>a<b?a+'|'+b:b+'|'+a;
const adj={};ids.forEach(k=>adj[k]=[]);E.forEach(([a,b,w])=>{adj[a].push([b,w]);adj[b].push([a,w])});
ids.forEach(k=>adj[k].sort((x,y)=>ids.indexOf(x[0])-ids.indexOf(y[0])));

function mkMap(svg,onNode){
  const ns='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(ns,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};
  el('path',{class:'isl',d:'M300 20L360 40L430 200L455 300L450 420L385 512L250 528L150 480L125 380L112 260L125 170L225 60Z'},svg);
  const s=el('text',{class:'sea',x:20,y:300},svg);s.textContent='ทะเลอันดามัน';
  const eg=el('g',{},svg),ng=el('g',{},svg),ed={},nd={};
  E.forEach(([a,b,w])=>{const A=N[a],B=N[b],g=el('g',{},eg);
    ed[key(a,b)]=el('line',{x1:A[1],y1:A[2],x2:B[1],y2:B[2],class:'e'},g);
    const t=el('text',{x:(A[1]+B[1])/2,y:(A[2]+B[2])/2+3,class:'w'},g);t.textContent=w});
  ids.forEach(k=>{const g=el('g',{class:'n',tabindex:0},ng);
    el('circle',{cx:N[k][1],cy:N[k][2],r:12},g);
    const t=el('text',{x:N[k][1],y:N[k][2]+27},g);t.textContent=nm(k);
    if(onNode){g.onclick=()=>onNode(k);g.onkeydown=e=>{if(e.key==='Enter')onNode(k)}}
    nd[k]=g});
  return{reset(){for(const k in ed)ed[k].setAttribute('class','e');ids.forEach(k=>nd[k].setAttribute('class','n'))},
    e(a,b,c){ed[key(a,b)].setAttribute('class','e '+c)},n(k,c){nd[k].setAttribute('class','n '+c)}};
}

/* Navigation */
const btns=[...document.querySelectorAll('#nav button')];
btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.toggle('on',x===b));
  document.querySelectorAll('.pg').forEach(p=>p.classList.toggle('on',p.id==='p'+b.dataset.p));scrollTo(0,0)});

/* Page 1 */
const m1=mkMap($('#s1'),k=>{m1.reset();m1.n(k,'sel');
  $('#ih').textContent=nm(k);
  $('#info').innerHTML='ดีกรี = <b>'+adj[k].length+'</b><br>'+adj[k].map(([v,w])=>'<span class="tag">'+nm(v)+' '+w+' กม.</span>').join('');
  adj[k].forEach(([v])=>m1.e(k,v,'on'))});
(function(){const sd=ids.reduce((s,k)=>s+adj[k].length,0);
  $('#cv').textContent=ids.length;$('#ce').textContent=E.length;$('#sd').textContent=sd+' = 2×'+E.length;
  $('#cn').textContent=trav(ids[0],'bfs').pop().order.length===ids.length?' เป็นกราฟเชื่อมโยง (Connected) เพราะ BFS เยี่ยมได้ครบทุกจุด':' ไม่เชื่อมโยง'})();

/* Selects */
['a2s','d3a','d3b'].forEach((id,i)=>{$('#'+id).innerHTML=ids.map(k=>'<option value="'+k+'">'+nm(k)+'</option>').join('');});
$('#d3a').value='air';$('#d3b').value='raw';

/* Page 2: BFS / DFS */
function trav(s,mode){const bfs=mode==='bfs',order=[],steps=[],tree=[],seen=new Set();let fr=[{v:s,p:null}];if(bfs)seen.add(s);
  while(fr.length){const it=bfs?fr.shift():fr.pop(),u=it.v;
    if(!bfs){if(seen.has(u))continue;seen.add(u)}
    order.push(u);if(it.p)tree.push([it.p,u]);
    const nb=adj[u].map(x=>x[0]).filter(v=>!seen.has(v));
    if(bfs)nb.forEach(v=>{seen.add(v);fr.push({v,p:u})});else nb.reverse().forEach(v=>fr.push({v,p:u}));
    steps.push({cur:u,order:[...order],fr:fr.map(x=>x.v),tree:tree.map(t=>[...t])})}
  return steps}
const m2=mkMap($('#s2'));let st2=[],i2=-1,tm2;
function draw2(){m2.reset();const s=st2[i2];
  $('#fl').textContent=$('#a2m').value==='bfs'?'Queue (หน้า → หลัง)':'Stack (บนสุดอยู่ขวาสุด)';
  if(!s){$('#o2').textContent='กด "ก้าวถัดไป" เพื่อเริ่ม';$('#f2').textContent='—';return}
  s.tree.forEach(([a,b])=>m2.e(a,b,'on'));s.order.forEach(v=>m2.n(v,'vis'));
  const fr=s.fr.filter(v=>!s.order.includes(v));fr.forEach(v=>m2.n(v,'q'));m2.n(s.cur,'cur');
  $('#o2').innerHTML=s.order.map(v=>'<span class="tag">'+nm(v)+'</span>').join('→');
  $('#f2').innerHTML=fr.length?fr.map(v=>'<span class="tag">'+nm(v)+'</span>').join(''):'(ว่าง) จบการค้นหา'}
function build2(){clearInterval(tm2);st2=trav($('#a2s').value,$('#a2m').value);i2=-1;draw2()}
function next2(){if(i2<st2.length-1){i2++;draw2();return true}return false}
$('#n2').onclick=next2;$('#r2').onclick=build2;$('#a2s').onchange=build2;$('#a2m').onchange=build2;
$('#p2a').onclick=()=>{clearInterval(tm2);tm2=setInterval(()=>{if(!next2())clearInterval(tm2)},800)};
build2();

/* Page 3: Dijkstra */
function dij(s){const d={},p={},done=new Set();ids.forEach(k=>d[k]=Infinity);d[s]=0;
  for(;;){let u=null;for(const k of ids)if(!done.has(k)&&(u===null||d[k]<d[u]))u=k;
    if(u===null||d[u]===Infinity)break;done.add(u);
    adj[u].forEach(([v,w])=>{if(d[u]+w<d[v]){d[v]=d[u]+w;p[v]=u}})}
  return{d,p}}
const m3=mkMap($('#s3'),k=>{$('#d3b').value=k;draw3()});
function draw3(){const s=$('#d3a').value,t=$('#d3b').value,{d,p}=dij(s);m3.reset();
  const path=[t];for(let c=t;c!==s;c=p[c])path.unshift(p[c]);
  path.forEach((v,i)=>{m3.n(v,'path');if(i)m3.e(path[i-1],v,'on')});
  $('#k3').textContent=d[t];$('#t3').textContent=Math.round(d[t]/40*60);
  $('#r3').innerHTML=path.length>1?path.map(v=>'<span class="tag">'+nm(v)+'</span>').join('→'):'เลือกจุดปลายทางที่ต่างจากจุดเริ่มต้น';
  $('#tb3').innerHTML='<tr><th>สถานที่</th><th>กม.</th></tr>'+ids.slice().sort((a,b)=>d[a]-d[b]).map(k=>'<tr><td>'+nm(k)+'</td><td>'+d[k]+'</td></tr>').join('')}
$('#d3a').onchange=draw3;$('#d3b').onchange=draw3;draw3();

/* Page 4: Kruskal MST */
const ES=E.slice().sort((a,b)=>a[2]-b[2]),m4=mkMap($('#s4'));let par,k4,acc,tot,lg;
const fd=x=>par[x]===x?x:(par[x]=fd(par[x]));
function init4(){par={};ids.forEach(k=>par[k]=k);k4=0;acc=0;tot=0;lg=[];draw4()}
function step4(){if(acc>=ids.length-1||k4>=ES.length)return false;
  const [a,b,w]=ES[k4++],ok=fd(a)!==fd(b);if(ok){par[fd(a)]=fd(b);acc++;tot+=w}
  lg.push({a,b,w,ok});draw4();return true}
function draw4(){m4.reset();lg.forEach(x=>{m4.e(x.a,x.b,x.ok?'on':'rej')});
  ids.forEach(k=>{if(lg.some(x=>x.ok&&(x.a===k||x.b===k)))m4.n(k,'vis')});
  $('#w4').textContent=tot;$('#c4').textContent=acc;
  $('#s4t').innerHTML=acc===ids.length-1?'<p class="ok"><b>ได้ต้นไม้ค้ำจุนแล้ว:</b> เชื่อมครบ 12 จุดด้วย 11 เส้น (|V|−1) ไม่มีวงจร</p>':'';
  $('#l4').innerHTML=lg.map(x=>'<div>'+nm(x.a)+' – '+nm(x.b)+' ('+x.w+' กม.) '+(x.ok?'<b class="ok">เลือก</b>':'<b class="no">ข้าม (เกิดวงจร)</b>')+'</div>').join('')||'เส้นที่สั้นที่สุดจะถูกพิจารณาก่อน'}
$('#n4').onclick=step4;$('#a4').onclick=()=>{while(step4());};$('#r4').onclick=init4;init4();
