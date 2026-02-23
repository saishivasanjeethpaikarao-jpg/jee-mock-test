// ================= DAILY SEED =================
let today=new Date().toDateString();
let seed=today.length+today.charCodeAt(0);
function rand(){let x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function rInt(min,max){return Math.floor(rand()*(max-min+1))+min;}

// =============== CHAPTER MAP ==================
const chapters={
Physics:["Mechanics","Electrostatics","Current","Magnetism","Modern"],
Chemistry:["Physical","Organic","Inorganic","Coordination","Thermo"],
Maths:["Calculus","Algebra","Coordinate","Vector3D","Probability"]
};

// =============== GENERATE 90 ==================
function generate(){

for(let sub in chapters){

for(let i=0;i<30;i++){

let chapter=chapters[sub][i%5];
let difficulty=(i<10)?"Easy":(i<20)?"Moderate":"Hard";

questions.push({
subject:sub,
chapter:chapter,
difficulty:difficulty,
type:(i<20)?"mcq":"numerical",
question:`[${sub} - ${chapter} - ${difficulty}] If a=${rInt(2,9)}, b=${rInt(3,8)}, find a×b`,
options:["Correct","Trap1","Trap2","Trap3"],
answer:0
});
}
}
}

generate();

// ============== LOAD PALETTE ==================
function loadPalette(){
let p=document.getElementById("palette");
p.innerHTML="";
questions.forEach((q,i)=>{
if(q.subject===section){
let box=document.createElement("div");
box.className="qbox notvisited";
box.innerText=i+1;
box.onclick=()=>{current=i;loadQuestion();}
box.id="q"+i;
p.appendChild(box);
}
});
}

function changeSection(sec){
section=sec;
loadPalette();
loadQuestion();
}

// ============== LOAD QUESTION =================
function loadQuestion(){

let q=questions[current];
if(!q || q.subject!==section){
current=questions.findIndex(x=>x.subject===section);
}

let area=document.getElementById("questionArea");
let qObj=questions[current];

if(!status[current]) status[current]="visited";

area.innerHTML=`<h3>Q${current+1}</h3>${qObj.question}<br><br>`;

if(qObj.type==="mcq"){
qObj.options.forEach((opt,i)=>{
area.innerHTML+=`<input type="radio" name="opt" value="${i}"> Option ${i+1}<br>`;
});
}
else{
area.innerHTML+=`<input type="number" id="num">`;
}

updatePalette();
}

function saveNext(){
let q=questions[current];
if(q.type==="mcq"){
let sel=document.querySelector('input[name="opt"]:checked');
if(sel){
responses[current]=parseInt(sel.value);
status[current]="answered";
}
}
else{
let val=document.getElementById("num").value;
if(val){
responses[current]=val;
status[current]="answered";
}
}
current++;
loadQuestion();
}

function markReview(){
status[current]="review";
updatePalette();
}

function clearResponse(){
delete responses[current];
status[current]="visited";
updatePalette();
}

function updatePalette(){
questions.forEach((q,i)=>{
let box=document.getElementById("q"+i);
if(box){
box.className="qbox "+(status[i]||"notvisited");
}
});
}

// ============== TIMER =================
let total=180*60;
let timer=document.getElementById("timer");
let countdown=setInterval(()=>{
let m=Math.floor(total/60);
let s=total%60;
timer.innerText=`${m}:${s<10?"0":""}${s}`;
total--;
if(total<0){
clearInterval(countdown);
submitTest();
}
},1000);

// ============== SUBMIT =================
function submitTest(){

clearInterval(countdown);
let score=0;
let weak={};

questions.forEach((q,i)=>{
if(!weak[q.chapter]) weak[q.chapter]={c:0,t:0};
weak[q.chapter].t++;

if(responses[i]==q.answer){
score+=4;
weak[q.chapter].c++;
}
else if(responses[i]!=undefined){
score-=1;
}
});

let weakText="";
for(let ch in weak){
let acc=(weak[ch].c/weak[ch].t)*100;
if(acc<50) weakText+=ch+" ("+acc.toFixed(1)+"%)<br>";
}

document.body.innerHTML=`
<h2>Final Score: ${score}/360</h2>
<h3>Weak Chapters:</h3>
${weakText||"None 🎯"}
`;
}

// INIT
changeSection("Physics");

</script>
</body>
</html>
