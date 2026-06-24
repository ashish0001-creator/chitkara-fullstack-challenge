
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

function buildTree(node, graph){
  const obj={};
  for(const c of (graph[node]||[])) obj[c]=buildTree(c,graph);
  return obj;
}
function depth(node, graph){
  const kids=graph[node]||[];
  if(!kids.length) return 1;
  return 1+Math.max(...kids.map(k=>depth(k,graph)));
}

app.post('/bfhl',(req,res)=>{
 const data=req.body.data||[];
 const regex=/^[A-Z]->[A-Z]$/;
 const invalid_entries=[], duplicate_edges=[];
 const seen=new Set(), parentOf={}, edges=[];
 for(let raw of data){
   let e=String(raw).trim();
   if(!regex.test(e)){invalid_entries.push(raw);continue;}
   let [p,c]=e.split('->');
   if(p===c){invalid_entries.push(raw);continue;}
   if(seen.has(e)){ if(!duplicate_edges.includes(e)) duplicate_edges.push(e); continue;}
   seen.add(e);
   if(parentOf[c]) continue;
   parentOf[c]=p;
   edges.push([p,c]);
 }
 const graph={}, nodes=new Set(), children=new Set();
 edges.forEach(([p,c])=>{
   graph[p]=graph[p]||[]; graph[p].push(c);
   nodes.add(p); nodes.add(c); children.add(c);
 });
 const roots=[...nodes].filter(n=>!children.has(n)).sort();
 const hierarchies=[];
 let total_trees=0,total_cycles=0,largest_tree_root="",bestDepth=0;

 for(const root of roots){
   const vis=new Set(), rec=new Set();
   let cyc=false;
   function dfs(n){
    if(rec.has(n)) return cyc=true;
    if(vis.has(n)) return;
    vis.add(n); rec.add(n);
    for(const k of (graph[n]||[])) dfs(k);
    rec.delete(n);
   }
   dfs(root);
   if(cyc){
      total_cycles++;
      hierarchies.push({root,tree:{},has_cycle:true});
   }else{
      const d=depth(root,graph);
      total_trees++;
      if(d>bestDepth || (d===bestDepth && root<largest_tree_root)){bestDepth=d;largest_tree_root=root;}
      hierarchies.push({root,tree:{[root]:buildTree(root,graph)},depth:d});
   }
 }
 res.json({
  user_id:"ashishmahal_08052005",
  email_id:"ashish0136.be23@chitkara.edu.in",
  college_roll_number:"2310990136",
  hierarchies, invalid_entries, duplicate_edges,
  summary:{total_trees,total_cycles,largest_tree_root}
 });
});

app.listen(process.env.PORT||3000);
