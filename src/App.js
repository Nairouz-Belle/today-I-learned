import './style.css'

function App() {
  const appTitle = "Today I Learned"

  return (
    <>
      {/* HEADER */}
      <header className="header">
          <div className="logo">
            <img src="logo.png" height="68" width="68" alt="today-I-learned-logo"/>
            <h1>{appTitle}</h1>
          </div>
          <button className="btn btn-large btn-open">Share a Fact</button>   
      </header>
      <NewFactForm />
      <main className='main'>
        <CategoryFilter/>
        <FactList/>
      </main>
    </>
  );
}

function NewFactForm(){
  return <form className="fact-form">Fact Form</form>;
}

function CategoryFilter(){
  return (
    <aside>Category filter</aside>
  );
}

function FactList(){
  return <section>facts list</section>;
}

export default App;