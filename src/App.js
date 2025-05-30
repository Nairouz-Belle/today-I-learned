import { useEffect, useState } from 'react';
import './style.css'
import supabase from './supabase';

// const initialFacts = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//     source:
//       "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//     category: "society",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: "Lisbon is the capital of Portugal",
//     source: "https://en.wikipedia.org/wiki/Lisbon",
//     category: "society",
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];

/*function Counter(){
  //arg1: count. arg2: function named setCount 
  const [count,setCount] = useState(8);

  return (<div>
    <span style={{fontSize: '40px'}}>{count}</span>
    <button className='btn btn-large' onClick={()=> setCount((c) => c+1)}>+1</button>
  </div>);
}*/

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts,setFacts] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [currentCategory,setCurrentCategory] = useState("all");
//Use effect only works one time when the page apload. so add currentCategoy to the array of useEffect (the second parameter) so whenever the the currentCategory state changes the useEffect will apply.
  useEffect(function () {

    async function getFact(){
      setIsLoading(true);
    //Building the query
      let query = supabase.from("facts").select("*");

      if(currentCategory !== "all")
        query = query.eq("category",currentCategory)
      
      const {data: facts,error} = await query.order("voteinteresting",{  ascending: false  })
      .limit(1000);
      //console.log(error);
      if(!error)
       setFacts(facts);
      else
       alert("There was a problem getting data");

      setIsLoading(false);
    }
    getFact();
  }, [currentCategory]);

  return (
    <>
      {/* HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* Use state variable */}
      {showForm ? (<NewFactForm setFacts={setFacts} setShowForm = {setShowForm} />) : null}

      <main className='main'>
        <CategoryFilter setCurrentCategory = {setCurrentCategory} />
        {isLoading ? <Loader/> : <FactList facts={facts} setFacts = {setFacts} />}
        
      </main>
    </>
  );
}

function Loader() {
   return <p className='message'>Loading ...</p>
}

function Header({showForm, setShowForm}){
  const appTitle = "Today I Learned";
  return <header className="header">
          <div className="logo">
            <img src="logo.png" height="68" width="68" alt="today-I-learned-logo"/>
            <h1>{appTitle}</h1>
          </div>
          <button 
          className="btn btn-large btn-open"
          onClick={()=>setShowForm((show)=> !show)}>{showForm ? "Close" : "Share a Fact"}</button>   
        </header>
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string){
  let url;
  try{
    url = new URL(string);
  }catch(_){
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts, setShowForm}){
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category,setCategory] = useState("");
  const [isUploading,setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e){
    // 1. Prevent browser reload
    e.preventDefault();
    //2. Check if the data is valid. If so create new fact
    if(text && isValidHttpUrl(source) && category && textLength <= 200) {
      //3. Create a new fact
      //  const newFact = {
      //   id: Math.round(Math.random * 100000000),
      //    text: text,
      //    source,
      //    category,
      //    votesInteresting: 0,
      //    votesMindblowing:0,
      //    votesFalse: 0,
      //    createdIn: new Date().getFullYear(),
      //  };
      //3. Upload the new fact to supabase and receive the new fact object
      setIsUploading(true);
       const { data: newFact,error } = await supabase.from("facts").insert([{text,source,category}]).select();
       setIsUploading(false);
       
     //4. Add the fact to the UI: add the fact to state 
     if(!error)
       setFacts((facts) => [newFact[0],...facts]);
     //5. Reset input fields
     setText('');
     setSource('');
     setCategory('');
     //6. Close the form
     setShowForm(false);
    }
    
    
  }

  return <form className="fact-form" onSubmit={handleSubmit}>
    <input type="text" 
      placeholder="Share a fact with world..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
        <span>{200-textLength}</span>
        <input type="text" placeholder="Trustworthy source..."
        value={source}
        onChange={(e)=> setSource(e.target.value)}
        disabled={isUploading}
        />
        <select value={category} onChange={(e)=>setCategory(e.target.value)}
        disabled={isUploading}  
        >
          <option value="">Choose Category</option>
          {
            CATEGORIES.map((cat)=> (<option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>))
          }
        </select>
        <button className="btn btn-large" disabled={isUploading}>Post</button>
  </form>;
}



function CategoryFilter({setCurrentCategory}){ // props "setCurrentCategory" is to add that function (the props) to the categories.
  return (
    <aside>
      <ul>
        <li className="category">
              <button className="btn btn-all-categories" onClick={() => {setCurrentCategory("all")}}>All</button>
        </li>

        {CATEGORIES.map((cat)=> 
           <li key={cat.name} 
           className="category">
           <button  className="btn btn-category" style={{backgroundColor:cat.color}} 
           onClick={() => {setCurrentCategory(cat.name)}}
           >{cat.name}</button>
   </li>
        )}
        
      </ul>
    </aside>
  );
}

function FactList({facts, setFacts }){
  if(facts.length === 0)
    return <p className='message'>No facts for this category yet! Create the first one ✌</p>

  return (<section>
    <ul className="facts-list">
      {
        facts.map((fact) => (
          //Passing the fact element (PROPS)
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))
      }
    </ul>
    <p>There are {facts.length} facts in the database. Add your own!</p>
  </section>);
}

function Fact({fact, setFacts }){
  
  async function handleVote(columnName){
    const {data: updatedFact,error} = await supabase.from('facts').update({[columnName]: fact[columnName] + 1}).eq("id", fact.id).select();
    
    if(!error) setFacts((facts) => facts.map((f) => f.id === fact.id? updatedFact[0] : f))
  }
  
  return <li  className="fact">
              <p>
                {fact.text}
                <a className="source" href={fact.source}>(Source)</a>
              </p> 
              <span className="tag" style={{backgroundColor:CATEGORIES.find((cat)=> cat.name === fact.category).color}}>{fact.category}</span>
              <div className="vote-buttons">
                <button onClick={()=>{handleVote("voteinteresting")}}>👍 {fact.voteinteresting}</button>
                <button onClick={()=>{handleVote("votemindblowing")}}>🤯 {fact.votemindblowing}</button>
                <button onClick={()=>{handleVote("votefalse")}}>⛔️ {fact.votefalse}</button>
              </div>
          </li>
}


export default App;