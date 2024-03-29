import React, {useEffect, useState} from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import './App.css'
import './components/FeaturedMovie'
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";


export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  
  useEffect(()=>{
    const loadAll = async () => {
    //pegando a lista total
    let list = await Tmdb.getHomeList();
    setMovieList(list);
     // pegando a lista do Featured
     let originals = list.filter(i=>i.slug === 'originals');
     let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
     let chosen = originals[0].items.results[randomChosen]; 
     let chonsenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
     setFeaturedData(chonsenInfo);
    }
    loadAll();
  }, []);


  useEffect(()=>{
      const scrollListener = () => {
          if(window.scrollY >10){
            setBlackHeader (true);
          }else {
            setBlackHeader(false);
          }
      }

      window.addEventListener('scroll', scrollListener);

      return () => {
        window.removeEventListener('scroll', scrollListener);
      }

  }, []);

  return (
    <div className="page">
      
      <Header black={blackHeader}/>

      {
        featuredData && <FeaturedMovie item={featuredData}/> 
      }
      <section className="lists">
       {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
       ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤</span> pela Victoria Lucena<br/>
        Direitos de imagem para Netlix<br/>
        Dados do site Themoviedb.org
      </footer>


      {movieList.length <= 0 &&
        <div className= "loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="carregando"/>
        </div>
      } 
    </div>
  );
}